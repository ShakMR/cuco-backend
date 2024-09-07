import { Injectable } from '@nestjs/common';

import {
  CreateParticipationDto,
  SetUserParticipationDto,
} from '../participation.dto';
import {
  ParticipationWithUserAndProject,
  ProjectParticipants,
  ProjectParticipationSummary,
  UserParticipation,
} from '../participation.model';

@Injectable()
export abstract class ParticipationService {
  abstract create(
    data: CreateParticipationDto,
  ): Promise<ParticipationWithUserAndProject>;

  abstract getParticipationForUserAndProject(
    userUuid: string,
    projectUuid: string,
  ): Promise<ParticipationWithUserAndProject>;

  abstract getParticipationForUser(uuid: string): Promise<UserParticipation>;
  abstract getParticipantsForProject(
    uuid: string,
  ): Promise<ProjectParticipants>;

  abstract setParticipationShare(
    uuid: string,
    newParticipation: SetUserParticipationDto[],
  ): Promise<void>;

  abstract getParticipationSummary(
    uuid: string,
    includeDetail?: boolean,
  ): Promise<ProjectParticipationSummary>;
}
