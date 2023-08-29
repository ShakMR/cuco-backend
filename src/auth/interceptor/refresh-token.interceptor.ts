import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Response } from 'express';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthTokenRefresh implements NestInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const [req] = context.getArgs();
    const shouldRefresh = !!req.user;

    if (shouldRefresh) {
      const response: Response = context.switchToHttp().getResponse();
      const login = this.authService.login(req.user);
      response.setHeader('x-auth-token', login.token);
    }

    return next.handle();
  }
}
