import { BaseUser } from '../user.model';

export abstract class UserService {
  abstract getById(id: number): Promise<BaseUser>;

  abstract create(userDto: Partial<BaseUser>): Promise<BaseUser>;

  abstract getByUuid(uuid: string): Promise<BaseUser>;

  abstract findOne(email: string, uuid?: string): Promise<BaseUser>;
}
