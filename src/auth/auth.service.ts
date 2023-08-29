import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { PassportService } from '../passport/service/passport.service';
import EntityNotFoundException from '../db/exception/entity-not-found.exception';
import { UserPassport } from '../passport/passport.model';
import { BaseUser } from '../user/user.model';

@Injectable()
export class AuthService {
  constructor(
    private passportService: PassportService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<BaseUser> {
    const user = await this.passportService.findOne(username);
    const match = await bcrypt.compare(pass, user.password);
    if (user && match) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, salt, ...result } = user;
      return result;
    }

    throw new EntityNotFoundException();
  }

  async validateUserFromJWT(jwtPayload: any): Promise<BaseUser> {
    const userInfo = this.userFromJWT(jwtPayload);
    if (!userInfo.email || !userInfo.userId) {
      throw new EntityNotFoundException();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, salt, ...result } = await this.passportService.findOne(
      userInfo.email,
    );
    return result;
  }

  login(user: UserPassport) {
    const payload = this.jwtFromUser(user);
    return {
      token: this.jwtService.sign(payload),
    };
  }

  userFromJWT(payload: any) {
    return { userId: payload.sub, email: payload.email };
  }

  jwtFromUser(user: UserPassport) {
    return { email: user.email, sub: user.uuid };
  }
}
