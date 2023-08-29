import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { UserPassport } from '../passport.model';
import { UserService } from '../../user/services/user.service';
import { PassportRepository } from '../repository/passport.repository';
import { PassportService } from './passport.service';
import { BaseUser } from '../../user/user.model';

@Injectable()
export class PassportImplService extends PassportService {
  static SALT_ROUNDS = 10;

  constructor(
    private userService: UserService,
    private repository: PassportRepository,
  ) {
    super();
  }

  async findOne(username: string, uuid?: string): Promise<UserPassport> {
    const user = await this.userService.findOne(username, uuid);

    const passport = await this.repository.getByUserId(user.id);

    return { ...user, password: passport.password, salt: passport.salt };
  }

  async createNewUser({
    password,
    name,
    email,
  }: {
    password: string;
    name: string;
    email: string;
  }): Promise<BaseUser> {
    const user = await this.userService.create({ name, email });

    const saltAndPass = await this.getPasswordEncryption(password);

    await this.repository.create({
      password: saltAndPass.password,
      salt: saltAndPass.salt,
      userId: user.id,
    });

    return user;
  }

  private async getPasswordEncryption(password: string) {
    const salt = await bcrypt.genSalt(PassportImplService.SALT_ROUNDS);
    const pass = await bcrypt.hash(password, salt);
    return {
      salt,
      password: pass,
    };
  }
}
