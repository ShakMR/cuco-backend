import { HttpStatus } from '@nestjs/common';

export class AppError extends Error {
  public errorCode: string;
  context: any;
  statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR;

  constructor(message, errorCode) {
    super(message);
    this.errorCode = errorCode;
  }
}
