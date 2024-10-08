import { Injectable } from '@nestjs/common';

import { DbClient } from '../../db/db-client';
import { ExpenseCreate, Expenses, ExpensesTable } from '../../db/schemas';
import { ExpenseModel } from '../expense.model';
import { ExpensesRepository } from './expenses.repository';
import EntityNotFoundException from '../../db/exception/entity-not-found.exception';
import { ExpenseNotFoundException } from '../exceptions/expense-not-found.exception';

@Injectable()
export class ExpensesImplRepository extends ExpensesRepository {
  constructor(private db: DbClient<Expenses, number, ExpenseCreate>) {
    super();
    this.db.init(ExpensesTable);
  }

  static map(expense: Partial<Expenses>): ExpenseModel {
    return {
      id: expense.id,
      uuid: expense.uuid,
      amount: expense.amount,
      concept: expense.concept,
      date: new Date(expense.date),
      createdAt: new Date(expense.created_at),
      payer: { id: expense.payer_id },
      currency: { id: expense.currency },
      paymentType: { id: expense.payment_type },
      project: { id: expense.project_id },
      active: expense.active,
    };
  }

  async getFromProject(projectId: number): Promise<ExpenseModel> {
    const expenses = await this.db.findAll({ project_id: projectId });

    return expenses.map(ExpensesImplRepository.map);
  }

  async getByUuid(uuid: string) {
    try {
      const expense = await this.db.getBy({ uuid });

      return ExpensesImplRepository.map(expense);
    } catch (err) {
      if (err instanceof EntityNotFoundException) {
        throw new ExpenseNotFoundException({ uuid });
      }
    }
  }

  async save(expense: ExpenseCreate) {
    const newExpense = await this.db.save(expense);

    return ExpensesImplRepository.map(newExpense);
  }
}
