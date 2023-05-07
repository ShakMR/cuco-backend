import { AppError } from './AppError';

export class NotFoundException<Context> extends AppError {
  public context: Context;

  constructor(entity, code, context: Context) {
    super(`${entity} not found`, code);
    this.context = context;
  }
}
