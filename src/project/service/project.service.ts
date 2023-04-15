import { Project } from '../model/project.model';
import {
  CreateExpenseModel,
  EnrichedExpenseModel,
} from '../../expenses/expense.model';

export type ProjectServiceOptions = { includeExpenses };

export abstract class ProjectService {
  abstract getAll(): Promise<Project[]>;

  abstract getByUuid(
    uuid: string,
    options?: ProjectServiceOptions,
  ): Promise<Project>;

  abstract getExpense(
    projectUuid: string,
    uuid: string,
  ): Promise<EnrichedExpenseModel>;

  abstract addNewExpenseToProject(
    projectUuid: string,
    expense: Omit<CreateExpenseModel, 'projectId'>,
  ): Promise<EnrichedExpenseModel>;
}
