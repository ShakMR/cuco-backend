import { BaseUser } from '../user/user.model';

export type Passport = {
  password: string;
  salt: string;
  id: number;
};

export type UserPassport = BaseUser & Passport;
