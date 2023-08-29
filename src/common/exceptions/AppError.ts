import { HttpStatus } from '@nestjs/common';

export class AppError extends Error {
  public errorCode: string;
  public context: any;
  public statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR;

  constructor(message, errorCode) {
    super(message);
    this.errorCode = errorCode;
  }
}
