import { Module } from '@nestjs/common';

import { LoggerService } from './logger.service';
import { RequestLoggerMiddleware } from './request-logger.middleware';

@Module({
  providers: [LoggerService, RequestLoggerMiddleware],
  exports: [LoggerService, RequestLoggerMiddleware],
})
export default class LoggerModule {}
