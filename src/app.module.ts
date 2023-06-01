import * as cors from 'cors';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import helmet from 'helmet';

import { EntityNotFoundExceptionFilter } from './EntityNotFoundException.filter';
import LoggerModule from './logger/logger.module';
import { RequestLoggerMiddleware } from './logger/request-logger.middleware';
import { ParticipationModule } from './participation/participation.module';
import { ProjectModule } from './project/project.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ProjectModule,
    LoggerModule,
    ParticipationModule,
    UserModule,
  ],
  providers: [EntityNotFoundExceptionFilter],
})
export class AppModule implements NestModule {
  static port: string;
  static apiPrefix: string;
  static exceptionFilter: EntityNotFoundExceptionFilter;

  constructor(
    configService: ConfigService,
    filter: EntityNotFoundExceptionFilter,
  ) {
    AppModule.port = configService.get('PORT');
    AppModule.apiPrefix = configService.get('API_PREFIX');
    AppModule.exceptionFilter = filter;
  }

  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(RequestLoggerMiddleware).forRoutes('/');
    consumer.apply(cors(), helmet()).forRoutes('*');
  }
}
