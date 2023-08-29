import * as cors from 'cors';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import helmet from 'helmet';

import { EntityNotFoundFilter } from './entity-not-found.filter';
import LoggerModule from './logger/logger.module';
import { RequestLoggerMiddleware } from './logger/request-logger.middleware';
import { ParticipationModule } from './participation/participation.module';
import { ProjectModule } from './project/project.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from './passport/passport.module';
import { AuthTokenRefresh } from './auth/interceptor/refresh-token.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ProjectModule,
    LoggerModule,
    ParticipationModule,
    UserModule,
    AuthModule,
    PassportModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: EntityNotFoundFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: AuthTokenRefresh,
    },
  ],
})
export class AppModule implements NestModule {
  static port: string;
  static apiPrefix: string;
  static exceptionFilter: EntityNotFoundFilter;

  constructor(configService: ConfigService) {
    AppModule.port = configService.get('PORT');
    AppModule.apiPrefix = configService.get('API_PREFIX');
  }

  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(RequestLoggerMiddleware).forRoutes('/');
    consumer.apply(cors(), helmet()).forRoutes('*');
  }
}
