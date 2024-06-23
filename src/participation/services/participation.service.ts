import { Injectable } from '@nestjs/common';

import { CreateParticipationDto } from '../participation.dto';
import {
  ParticipationWithUserAndProject,
  ProjectParticipants,
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
}
