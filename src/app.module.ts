import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import * as cors from 'cors';

import { ProjectModule } from './project/project.module';
import { RequestLoggerMiddleware } from './logger/request-logger.middleware';
import LoggerModule from './logger/logger.module';

@Module({
  imports: [ConfigModule.forRoot(), ProjectModule, LoggerModule],
})
export class AppModule implements NestModule {
  static port: string;

  constructor(configService: ConfigService) {
    AppModule.port = configService.get('HTTP_PORT');
  }

  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(RequestLoggerMiddleware).forRoutes('/');
    consumer.apply(cors(), helmet()).forRoutes('*');
  }
}
