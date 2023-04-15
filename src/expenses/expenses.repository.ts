import { ExpenseCreate, Expenses } from '../db/schemas';

export abstract class ExpensesRepository {
  abstract getFromProject(projectId: number);

  abstract getByUuid(uuid: string);

  abstract save(expense: ExpenseCreate);
}
