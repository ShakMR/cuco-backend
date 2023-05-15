import { ParticipationCreate } from '../../db/schemas';
import { Participation as ParticipationModel } from '../participation.model';

export abstract class ParticipationRepository {
  abstract save(
    participation: ParticipationCreate,
  ): Promise<ParticipationModel>;

  abstract findByUserAndProject(
    userId: number,
    projectId: number,
  ): Promise<ParticipationModel | undefined>;

  abstract findByUser(id): Promise<ParticipationModel[]>;
}
