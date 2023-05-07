import { Participation as ParticipationModel } from '../participation.model';
import { ParticipationCreate } from '../../db/schemas';

export abstract class ParticipationRepository {
  abstract save(
    participation: ParticipationCreate,
  ): Promise<ParticipationModel>;

  abstract findByUserAndProject(
    userId: number,
    projectId: number,
  ): Promise<ParticipationModel>;

  abstract findByUser(id): Promise<ParticipationModel[]>;
}
