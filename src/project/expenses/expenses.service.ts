import { ExpenseModel } from './expense.model';

type PaginationOptions = {
  howMany: number;
  offset: number;
};

export abstract class ExpensesService {
  abstract getFromProject(
    projectId: number,
    options?: PaginationOptions,
  ): Promise<ExpenseModel[]>;

  abstract getByUuid(uuid: string): Promise<ExpenseModel>;
}
