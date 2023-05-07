import { NotFoundException } from '../../common/exceptions/NotFoundException';

export class UserNotFoundException extends NotFoundException<{
  uuid?: string;
  id?: number;
}> {
  constructor(context: { uuid?: string; id?: number }) {
    super('User', 'ERR-USER-001', context);
  }
}
