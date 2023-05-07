import { Injectable } from '@nestjs/common';
import { ParticipationWithUserAndProject, UserParticipation } from '../participation.model';
import { CreateParticipationDto } from '../participation.dto';

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
