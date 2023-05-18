import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { Currency } from '../../currency/currency.model';
import { CurrencyService } from '../../currency/currency.service';
import { PaymentType } from '../../payment-type/payment-type.model';
import { PaymentTypeService } from '../../payment-type/payment-type.service';
import { UserService } from '../../user/services/user.service';
import { BaseUser } from '../../user/user.model';
import {
  CreateExpenseModel,
  EnrichedExpenseModel,
  ExpenseModel,
} from '../expense.model';
import { ExpensesRepository } from '../repository/expenses.repository';
import { ExpensesService } from './expenses.service';

type Relations = {
  payer: BaseUser;
  currency: Currency;
  paymentType: PaymentType;
};

@Injectable()
export class ExpensesImplService extends ExpensesService {
  constructor(
    private repository: ExpensesRepository,
    private currencyService: CurrencyService,
    private paymentTypeService: PaymentTypeService,
    private userService: UserService,
  ) {
    super();
  }

  async getFromProject(id: number): Promise<EnrichedExpenseModel[]> {
    const expenses = await this.repository.getFromProject(id);

    return this.enrichExpenses(expenses);
  }

  async getByUuid(uuid: string): Promise<EnrichedExpenseModel> {
    const expense: ExpenseModel = await this.repository.getByUuid(uuid);

    return (await this.enrichExpenses([expense]))[0];
  }

  private async enrichExpenses(
    expenses: ExpenseModel[],
  ): Promise<EnrichedExpenseModel[]> {
    const enrichedExpenses: EnrichedExpenseModel[] = [];

    for (const expense of expenses) {
      const related = await this.getRelated(expense);
      enrichedExpenses.push({
        ...expense,
        ...related,
      });
    }

    return enrichedExpenses;
  }

  private async getRelated(expense: ExpenseModel): Promise<Relations> {
    const [payer, currency, paymentType] = await Promise.all([
      this.userService.getById(expense.payer.id),
      this.currencyService.getById(expense.currency.id),
      this.paymentTypeService.getById(expense.paymentType.id),
    ]);

    return { payer, currency, paymentType };
  }

  public async addNew({
    amount,
    paymentTypeName,
    currencyName,
    payerId,
    projectId,
    date,
    concept,
  }: CreateExpenseModel): Promise<EnrichedExpenseModel> {
    const uuid = uuidv4();

    const expense = await this.repository.save({
      uuid,
      amount,
      concept,
      project_id: projectId,
      date: date.toISOString(),
      payer_id: payerId,
      currency: (await this.currencyService.findByName(currencyName)).id,
      payment_type: (
        await this.paymentTypeService.findByName(paymentTypeName)
      ).id,
    });

    return (await this.enrichExpenses([expense]))[0];
  }
}
