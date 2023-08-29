import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import EntityNotFoundException from '../../db/exception/entity-not-found.exception';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(username: string, password: string): Promise<any> {
    try {
      return await this.authService.validateUser(username, password);
    } catch (err) {
      if (err instanceof EntityNotFoundException) {
        throw new UnauthorizedException();
      }
    }
  }
}
