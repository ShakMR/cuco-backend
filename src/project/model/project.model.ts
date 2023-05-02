import { EnrichedExpenseModel } from '../../expenses/expense.model';

export type Project = {
  id: number;
  name: string;
  uuid: string;
  expenses: EnrichedExpenseModel[];
  isOpen: boolean;
  createdAt: Date;
};
