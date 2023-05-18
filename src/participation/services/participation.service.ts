import { Injectable } from '@nestjs/common';

import { CreateParticipationDto } from '../participation.dto';
import {
  ParticipationWithUserAndProject,
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
}
