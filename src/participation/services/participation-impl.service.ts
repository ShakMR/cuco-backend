import { Injectable } from '@nestjs/common';
import { ParticipationService } from './participation.service';
import { CreateParticipationDto } from '../participation.dto';
import { ParticipationWithUserAndProject } from '../participation.model';
import { UserService } from '../../user/user.service';
import { ParticipationRepository } from '../repositories/participation.repository';
import { ProjectService } from '../../project/service/project.service';
import { ParticipationNotFoundException } from '../exceptions/participation-not-found.exception';

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

    const newParticipation = await this.repository.save({
      user_id: user.id,
      project_id: project.id,
      share: 50,
    });

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
}
