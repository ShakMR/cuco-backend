import { Injectable } from '@nestjs/common';
import {
  DebugExpensesRepository,
  DebugProjectRepository,
  DebugRepository,
  DebugUserRepository,
} from './repositories/debug.repository';

type Entities = 'user' | 'project' | 'expenses';

@Injectable()
export class DebugService {
  private repositories: Record<Entities, DebugRepository>;

  constructor(
    private userRepo: DebugUserRepository,
    private projectRepo: DebugProjectRepository,
    private expensesRepo: DebugExpensesRepository,
  ) {
    this.repositories = {
      user: userRepo,
      project: projectRepo,
      expenses: expensesRepo,
    };
  }

  public dump(entity: Entities): any {
    return this.repositories[entity].dump();
  }
}
