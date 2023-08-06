import { AppError } from '../../common/exceptions/AppError';
import { HttpStatus } from '@nestjs/common';

export class ProjectNameAlreadyExistsException extends AppError {
  constructor(name) {
    super(`Project with name ${name}} already exists`, 'ERR-PROJ-002');
    this.context = { name };
    this.statusCode = HttpStatus.CONFLICT;
  }
}
