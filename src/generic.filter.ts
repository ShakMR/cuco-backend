import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

import { LoggerService } from './logger/logger.service';
import { AppError } from './common/exceptions/AppError';

@Catch(AppError)
export class EntityNotFoundFilter implements ExceptionFilter {
  // TODO: make this work only on entity not found
  constructor(private logger: LoggerService) {}

  catch(exception: AppError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.statusCode;

    this.logger.error({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.message,
      errorCode: exception.errorCode,
    });

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.message,
      errorCode: exception.errorCode,
    });
  }
}
