import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AppError } from '../../common/exceptions/AppError';
import { replaceInTemplate } from '../../common/utils/replaceInTemplate';
import { ProjectResponseBuilder } from '../../project/controllers/project-response.builder';
import { UserResponseBuilder } from '../../user/controllers/user-response.builder';
import {
  ParticipantInProjectDto,
  ProjectParticipantsResponse,
  SingleParticipationResponse,
  UserParticipationResponse,
} from '../participation.dto';
import {
  ParticipationWithUserAndProject,
  ProjectParticipants,
  UserParticipation,
} from '../participation.model';
import { ParticipationTransformer } from './participation.transformer';

@Injectable()
export class ParticipationResponseBuilder {
  private readonly mainPath: string;
  private readonly participationTemplate: string =
    '?user=:user_uuid:&project=:project_uuid:';
  private readonly userParticipationTemplate: string = '/user/:uuid:';
  private readonly projectParticipantsTemplate: string = '/project/:uuid:';

  constructor(
    private configService: ConfigService,
    private transformer: ParticipationTransformer,
    private userResponseBuilder: UserResponseBuilder,
    private projectResponseBuilder: ProjectResponseBuilder,
  ) {
    const prefix = configService.get('API_PREFIX');
    this.mainPath = `/${prefix}/participations`;
    this.participationTemplate = this.mainPath + this.participationTemplate;
    this.userParticipationTemplate =
      this.mainPath + this.userParticipationTemplate;
  }

  buildSingleParticipation(
    participation: ParticipationWithUserAndProject,
  ): SingleParticipationResponse {
    return {
      data: this.transformer.transform(participation, {
        user: this.userResponseBuilder.buildSingleResponse.bind(
          this.userResponseBuilder,
        ),
        project: this.projectResponseBuilder.buildSingleResponse.bind(
          this.projectResponseBuilder,
        ),
      }),
      meta: this.buildSingleResponseMeta(participation),
    };
  }

  private buildSingleResponseMeta(
    participation: ParticipationWithUserAndProject,
  ) {
    return {
      links: {
        self: replaceInTemplate(this.participationTemplate, {
          user_uuid: participation.user.uuid,
          project_uuid: participation.project.uuid,
        }),
      },
    };
  }

  buildError(e: AppError) {
    return {
      errors: {
        title: 'Error',
        errorCode: e.errorCode,
        details: e.message,
        context: e.context,
      },
    };
  }

  buildUserParticipationResponse(
    userParticipation: UserParticipation,
  ): UserParticipationResponse {
    return {
      data: {
        user: this.userResponseBuilder.buildSingleResponse(
          userParticipation.user,
        ),
        participation: this.buildParticipationPartial(userParticipation),
      },
      meta: {
        links: {
          self: replaceInTemplate(this.userParticipationTemplate, {
            uuid: userParticipation.user.uuid,
          }),
        },
      },
    };
  }

  private buildParticipationPartial({
    user,
    participation,
  }: UserParticipation): ParticipantInProjectDto[] {
    return participation.map(({ project, share, joinedOn }) => ({
      data: {
        project: this.projectResponseBuilder.buildSingleResponse(project),
        share,
        joinedOn,
      },
      meta: {
        links: {
          self: replaceInTemplate(this.participationTemplate, {
            user_uuid: user.uuid,
            project_uuid: project.uuid,
          }),
        },
      },
    }));
  }

  public buildProjectParticipantsResponse(
    projectParticipants: ProjectParticipants,
  ): ProjectParticipantsResponse {
    return {
      data: {
        project: this.projectResponseBuilder.buildSingleResponse(
          projectParticipants.project,
        ),
        participants: projectParticipants.participants.map(
          ({ user, share, joinedOn }) => ({
            data: {
              user: this.userResponseBuilder.buildSingleResponse(user),
              share,
              joinedOn,
            },
            meta: {
              links: {
                self: replaceInTemplate(this.participationTemplate, {
                  user_uuid: user.uuid,
                  project_uuid: projectParticipants.project.uuid,
                }),
              },
            },
          }),
        ),
      },
      meta: {
        links: {
          self: replaceInTemplate(this.projectParticipantsTemplate, {
            uuid: projectParticipants.project.uuid,
          }),
        },
      },
    };
  }
}
