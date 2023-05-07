import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { DbClient } from '../db/db-client';
import { User } from '../db/schemas';
import { BaseUser, UserType } from './user.model';

@Injectable()
export class UserImplRespository extends UserRepository {
  constructor(private db: DbClient<User>) {
    super();
  }

  onModuleInit() {
    this.db.init('User');
  }

  static map(user: User): BaseUser {
    return {
      type: user.is_ghost ? UserType.ghost : UserType.user,
      id: user.id,
      uuid: user.uuid,
      name: user.name,
      createdAt: new Date(user.created_at),
      email: user.email,
      externalId: user.external_id,
    };
  }

  async getById(id: number): Promise<BaseUser> {
    const baseUser = await this.db.getById(id);

    return UserImplRespository.map(baseUser);
  }

  async getByUuid(uuid: string) {
    const baseUser = await this.db.find({ uuid });

    return UserImplRespository.map(baseUser);
  }

  async save({ type, externalId, ...rest }: BaseUser): Promise<BaseUser> {
    const user = await this.db.save({
      is_ghost: type === UserType.ghost,
      external_id: externalId,
      ...rest,
    });

    return UserImplRespository.map(user);
  }
}
