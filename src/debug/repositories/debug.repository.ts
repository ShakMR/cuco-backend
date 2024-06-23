import { Injectable } from '@nestjs/common';
import {
  Expenses,
  ExpensesTable,
  Project,
  ProjectsTable,
  User,
  UserTable,
} from '../../db/schemas';
import { DbClient } from '../../db/db-client';

export abstract class DebugRepository {
  public abstract dump(): Promise<any>;
}

@Injectable()
export class DebugUserRepository implements DebugRepository {
  constructor(private db: DbClient<User>) {
    db.init(UserTable);
  }
  async dump() {
    return this.db.getAll();
  }
}

@Injectable()
export class DebugProjectRepository implements DebugRepository {
  constructor(private db: DbClient<Project>) {
    db.init(ProjectsTable);
  }
  dump() {
    return this.db.getAll();
  }
}

@Injectable()
export class DebugExpensesRepository implements DebugRepository {
  constructor(private db: DbClient<Expenses>) {
    db.init(ExpensesTable);
  }
  dump() {
    return this.db.getAll();
  }
}
