import { BaseUser } from './user.model';

export abstract class UserRepository {
  abstract getById(id: number): Promise<BaseUser>;
}
