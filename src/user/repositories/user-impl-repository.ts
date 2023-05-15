import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { DbClient } from '../../db/db-client';
import { User } from '../../db/schemas';
import { BaseUser, UserType } from '../user.model';
import { UserNotFoundException } from '../exceptions/user-not-found.exception';
import EntityNotFoundException from '../../db/exception/entity-not-found.exception';

@Injectable()
export class UserImplRepository extends UserRepository {
  constructor(private db: DbClient<User>) {
    super();
    db.init('User');
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
    try {
      const baseUser = await this.db.getById(id);

      return UserImplRepository.map(baseUser);
    } catch (e) {
      if (e instanceof EntityNotFoundException) {
        throw new UserNotFoundException({ id });
      }
    }
  }

  async getByUuid(uuid: string) {
    try {
      const baseUser = await this.db.getBy({ uuid });

      return UserImplRepository.map(baseUser);
    } catch (e) {
      if (e instanceof EntityNotFoundException) {
        throw new UserNotFoundException({ uuid });
      }
    }
  }

  async save({ type, externalId, ...rest }: BaseUser): Promise<BaseUser> {
    const user = await this.db.save({
      is_ghost: type === UserType.ghost,
      external_id: externalId,
      ...rest,
    });

    return UserImplRepository.map(user);
  }
}
