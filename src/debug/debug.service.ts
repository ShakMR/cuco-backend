import { Injectable } from '@nestjs/common';
import {
  AnyRepository,
  DebugExpensesRepository,
  DebugParticipationRepository,
  DebugProjectRepository,
  DebugRepository,
  DebugUserRepository,
} from './repositories/debug.repository';

export enum Entities {
  'user',
  'project',
  'expenses',
  'participation',
}

class EntityNotFound extends Error {
  errorCode = 1;
}

@Injectable()
export class DebugService {
  private repositories: Record<Entities, DebugRepository<any>>;

  constructor(
    private userRepo: DebugUserRepository,
    private projectRepo: DebugProjectRepository,
    private expensesRepo: DebugExpensesRepository,
    private participationRepo: DebugParticipationRepository,
    private anyRepository: AnyRepository,
  ) {
    this.repositories = {
      [Entities.user]: userRepo,
      [Entities.project]: projectRepo,
      [Entities.expenses]: expensesRepo,
      [Entities.participation]: participationRepo,
    };
  }

  public dump(entity: Entities): any {
    if (Object.values(Entities).includes(entity)) {
      return this.repositories[Entities[entity]].dump();
    } else {
      return this.anyRepository.dump(entity as unknown as string);
    }
  }
}
