import { Injectable } from '@nestjs/common';
import { ParticipationRepository } from './participation.repository';
import { DbClient } from '../../db/db-client';
import { Participation, ParticipationCreate } from '../../db/schemas';
import { Participation as ParticipationModel } from '../participation.model';

@Injectable()
export class ParticipationImplRepository extends ParticipationRepository {
  constructor(private db: DbClient<Participation>) {
    super();
  }

  onModuleInit() {
    this.db.init('Participation');
  }

  static map(participation: Participation) {
    return {
      id: participation.id,
      createdAt: new Date(participation.created_at),
      share: participation.share,
      user: {
        id: participation.user_id,
      },
      project: {
        id: participation.project_id,
      },
    };
  }

  async save(participation: ParticipationCreate): Promise<ParticipationModel> {
    const newParticipation: Participation = await this.db.save(participation);

    return ParticipationImplRepository.map(newParticipation);
  }

  async findByUserAndProject(
    userId: number,
    projectId: number,
  ): Promise<ParticipationModel> {
    const participation = await this.db.find({
      user_id: userId,
      project_id: projectId,
    });

    return ParticipationImplRepository.map(participation);
  }

  async findByUser(id): Promise<ParticipationModel[]> {
    const res = await this.db.findAll({ user_id: id });
    return res.map(ParticipationImplRepository.map);
  }
}
