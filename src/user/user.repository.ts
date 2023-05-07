import { BaseUser } from './user.model';

export abstract class UserRepository {
  abstract getById(id: number): Promise<BaseUser>;

  abstract save(user: Omit<BaseUser, 'id' | 'createdAt'>): Promise<BaseUser>;

  abstract getByUuid(uuid: string);
}
