import { BaseUser, User } from './user.model';

export abstract class UserService {
  abstract getById(id: number);

  abstract create(userDto: Partial<BaseUser>): Promise<BaseUser>;

  abstract getByUuid(uuid: string);
}
