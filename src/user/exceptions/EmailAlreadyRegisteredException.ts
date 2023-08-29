import { AppError } from '../../common/exceptions/AppError';
import { HttpStatus } from '@nestjs/common';

export class EmailAlreadyRegisteredException extends AppError {
  constructor(public context: { email: string }) {
    super(
      `User with email ${context.email} already registered`,
      'ERR-USER-002',
    );
    this.statusCode = HttpStatus.CONFLICT;
  }
}
