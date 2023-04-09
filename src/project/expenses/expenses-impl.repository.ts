import { ExpensesRepository } from './expenses.repository';
import { Injectable } from '@nestjs/common';
import { DbClient } from '../../db/db-client';
import { Expenses, ExpensesTable } from '../../db/schemas';
import { ExpenseModel } from './expense.model';

@Injectable()
export class ExpensesImplRepository extends ExpensesRepository {
  constructor(private db: DbClient<Expenses>) {
    super();
  }

  onModuleInit() {
    this.db.init(ExpensesTable);
  }

  static map(expense: Partial<Expenses>): ExpenseModel {
    return {
      id: expense.id,
      uuid: expense.uuid,
      amount: expense.amount,
      concept: expense.concept,
      date: new Date(expense.date),
      createdAt: expense.created_at,
      payer: { id: expense.payer_id },
      currency: { id: expense.currency },
      paymentType: { id: expense.id },
    };
  }

  async getFromProject(projectId: number) {
    const expenses = await this.db.findAll({ project_id: projectId }, [
      'User',
      'PaymentType',
    ]);

    return expenses.map(ExpensesImplRepository.map);
  }

  async getByUuid(uuid: string) {
    const expense = await this.db.find({ uuid }, ['User', 'PaymentType']);

    return ExpensesImplRepository.map(expense);
  }
}
