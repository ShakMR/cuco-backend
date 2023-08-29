import { UserPassport } from '../passport.model';
import { BaseUser } from '../../user/user.model';

export abstract class PassportService {
  abstract findOne(username: string, uuid?: string): Promise<UserPassport>;

  abstract createNewUser(params: {
    password: string;
    name: string;
    email: string;
  }): Promise<BaseUser>;
}
