import { Injectable } from '@nestjs/common';

import { ProjectService } from '../../project/service/project.service';
import { UserNotFoundException } from '../../user/exceptions/user-not-found.exception';
import { UserService } from '../../user/services/user.service';
import { ParticipationNotFoundException } from '../exceptions/participation-not-found.exception';
import {
  CreateParticipationDto,
  Participant,
  SetUserParticipationDto,
} from '../participation.dto';
import {
  Participation,
  ParticipationWithUserAndProject,
  ProjectParticipants,
  ProjectParticipationSummary,
  UserParticipation,
} from '../participation.model';
import { ParticipationRepository } from '../repositories/participation.repository';
import { ParticipationService } from './participation.service';
import { ProjectNotFoundException } from '../../project/exceptions/project-not-found.exception';
import { ExpensesService } from '../../expenses/service/expenses.service';
import { EnrichedExpenseModel } from '../../expenses/expense.model';
import { createMapWithIndex } from '../../common/utils/object';
import { BaseUser } from '../../user/user.model';
import { DebtService } from './debt.service';

@Injectable()
export class ParticipationImplService extends ParticipationService {
  constructor(
    private repository: ParticipationRepository,
    private userService: UserService,
    private projectService: ProjectService,
    private expensesService: ExpensesService,
  ) {
    super();
  }

  async create(
    data: CreateParticipationDto,
  ): Promise<ParticipationWithUserAndProject> {
    const user = await this.userService.getByUuid(data.userUuid);

    const project = await this.projectService.getByUuid(data.projectUuid);

    if (!project.isOpen) {
      throw new Error('Project is closed, cannot add new users');
    }

    const existingParticipation = await this.repository.findByUserAndProject(
      user.id,
      project.id,
    );
    let newParticipation = existingParticipation;
    if (!existingParticipation) {
      newParticipation = await this.repository.save({
        user_id: user.id,
        project_id: project.id,
        share: 50,
      });
    }

    return {
      ...newParticipation,
      user,
      project,
    };
  }

  async getParticipationForUserAndProject(
    userUuid: string,
    projectUuid: string,
  ): Promise<ParticipationWithUserAndProject> {
    try {
      const user = await this.userService.getByUuid(userUuid);

      const project = await this.projectService.getByUuid(projectUuid);

      return {
        ...(await this.repository.findByUserAndProject(user.id, project.id)),
        user,
        project,
      };
    } catch (e) {
      throw new ParticipationNotFoundException({ userUuid, projectUuid });
    }
  }

  async getParticipationForUser(uuid: string): Promise<UserParticipation> {
    const user = await this.userService.getByUuid(uuid);

    if (!user) {
      throw new UserNotFoundException({ uuid });
    }

    const participation = await this.repository.findByUser(user.id);

    const projectsIds = participation.map(({ project }) => project.id);

    const projects =
      projectsIds.length > 0
        ? await this.projectService.getAllById(projectsIds)
        : [];

    return {
      user,
      participation: participation.map(({ share, joinedOn }, index) => ({
        share,
        joinedOn,
        project: projects[index],
      })),
    };
  }

  async getParticipantsForProject(uuid: string): Promise<ProjectParticipants> {
    const project = await this.projectService.getByUuid(uuid);

    if (!project) {
      throw new ProjectNotFoundException({ uuid });
    }

    const participation = await this.repository.findByProject(project.id);

    const userIds = participation.map(({ user }) => user.id);

    const users =
      userIds.length > 0 ? await this.userService.getAllById(userIds) : [];

    return {
      project,
      participants: participation.map(({ share, joinedOn }, index) => ({
        share,
        joinedOn,
        user: users[index],
      })),
    };
  }

  async setParticipationShare(
    uuid: string,
    newParticipation: SetUserParticipationDto[],
  ): Promise<void> {
    const project = await this.projectService.getByUuid(uuid);

    if (!project) {
      throw new ProjectNotFoundException({ uuid });
    }

    const participation = await this.repository.findByProject(project.id);

    const newUserIds = newParticipation.map(({ userUuid }) => userUuid);
    const userIds = participation.map(({ user }) => user.id);

    const currentUsers =
      userIds.length > 0 ? await this.userService.getAllById(userIds) : [];
    currentUsers.forEach((user) => {
      if (!newUserIds.includes(user.uuid)) {
        throw new UserNotFoundException({ uuid: user.uuid });
      }
    });

    const promises = newParticipation.map(this.repository.save);

    await Promise.all(promises);
  }

  async getParticipationSummary(
    uuid: string,
    includeDetail: boolean = false,
  ): Promise<ProjectParticipationSummary> {
    const project = await this.projectService.getByUuid(uuid);

    if (!project) {
      throw new ProjectNotFoundException({ uuid });
    }

    const participation = await this.repository.findByProject(project.id);
    const activeExpenses = await this.expensesService.getFromProject(
      project.id,
    ); // .filter(({ active }) => active); // TODO get only active ones

    const userIds = participation.map(({ user }) => user.id);

    const users = await this.userService.getAllById(userIds);

    const indexedUsers = createMapWithIndex(users, 'uuid');

    const participationMap = createMapWithIndex(participation, 'user', 'id');

    console.log(participationMap);
    console.log(activeExpenses);

    return {
      project,
      participants: indexedUsers,
      debt: DebtService.calculateDebt(
        indexedUsers,
        activeExpenses,
        participationMap,
        { includeDetail },
      ),
    };
  }
}
