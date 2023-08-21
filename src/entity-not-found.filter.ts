import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';

import { LoggerService } from './logger/logger.service';
import { NotFoundException } from './common/exceptions/NotFoundException';

@Catch(NotFoundException)
export class EntityNotFoundFilter implements ExceptionFilter {
  // TODO: make this work only on entity not found
  constructor(private logger: LoggerService) {}

  catch(exception: NotFoundException<any>, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = 404;

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
