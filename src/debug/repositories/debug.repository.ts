import { Injectable } from '@nestjs/common';
import {
  Expenses,
  ExpensesTable,
  ParticipantTable,
  Project,
  ProjectsTable,
  User,
  UserTable,
} from '../../db/schemas';
import { DbClient } from '../../db/db-client';
import { Participant } from '../../participation/participation.dto';

export class DebugRepository<T> {
  private _db: DbClient<T>;

  constructor(db: DbClient<T>, table: string) {
    db.init(table);
    this._db = db;
  }

  public dump(): Promise<any> {
    return this._db.getAll();
  }
}

@Injectable()
export class DebugUserRepository extends DebugRepository<User> {
  constructor(db: DbClient<User>) {
    super(db, UserTable);
  }
}

@Injectable()
export class DebugProjectRepository extends DebugRepository<Project> {
  constructor(db: DbClient<Project>) {
    super(db, ProjectsTable);
  }
}

@Injectable()
export class DebugExpensesRepository extends DebugRepository<Expenses> {
  constructor(db: DbClient<Expenses>) {
    super(db, ExpensesTable);
  }
}

@Injectable()
export class DebugParticipationRepository extends DebugRepository<Participant> {
  constructor(db: DbClient<Participant>) {
    super(db, ParticipantTable);
  }
}

@Injectable()
export class AnyRepository {
  constructor(private db: DbClient<any>) {}

  dump(entity: string) {
    this.db.init(entity);
    return this.db.getAll();
  }
}
