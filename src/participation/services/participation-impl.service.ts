import { Injectable } from '@nestjs/common';
import { UserNotFoundException } from 'src/user/exceptions/user-not-found.exception';

import { ProjectService } from '../../project/service/project.service';
import { UserService } from '../../user/services/user.service';
import { ParticipationNotFoundException } from '../exceptions/participation-not-found.exception';
import { CreateParticipationDto } from '../participation.dto';
import {
  ParticipationWithUserAndProject,
  UserParticipation,
} from '../participation.model';
import { ParticipationRepository } from '../repositories/participation.repository';
import { ParticipationService } from './participation.service';

@Injectable()
export class ParticipationImplService extends ParticipationService {
  constructor(
    private repository: ParticipationRepository,
    private userService: UserService,
    private projectService: ProjectService,
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
      participation: participation.map(({ share }, index) => ({
        share,
        project: projects[index],
      })),
    };
  }
}
