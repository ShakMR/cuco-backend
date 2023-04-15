import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { DbClient } from '../db/db-client';
import { User } from '../db/schemas';
import { GhostUser, User as UserModel } from './user.model';

@Injectable()
export class UserImplRespository extends UserRepository {
  constructor(private db: DbClient<User>) {
    super();
  }

  onModuleInit() {
    this.db.init('User');
  }

  async getById(id: number): Promise<UserModel | GhostUser> {
    const baseUser = await this.db.getById(id);

    return {
      type: baseUser.is_ghost ? 'ghost' : 'user',
      id: baseUser.id,
      uuid: baseUser.uuid,
      name: baseUser.name,
      createdAt: new Date(baseUser.created_at),
      email: baseUser.email,
      externalId: baseUser.external_id,
    };
  }
}
