import { EnrichedExpenseModel } from './expense.model';

type PaginationOptions = {
  howMany: number;
  offset: number;
};

export abstract class ExpensesService {
  abstract getFromProject(
    projectId: number,
    options?: PaginationOptions,
  ): Promise<EnrichedExpenseModel[]>;

  abstract getByUuid(uuid: string): Promise<EnrichedExpenseModel>;
}
