import { NotFoundException } from '../../common/exceptions/NotFoundException';

export class ExpenseNotFoundException extends NotFoundException<{
  uuid?: string;
  id?: number;
}> {
  constructor(context: { uuid?: string; id?: number }) {
    super('Expenses', 'ERR-EXPE-001', context);
  }
}
