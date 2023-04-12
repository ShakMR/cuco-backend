import { ExpensesService } from './expenses.service';
import { Injectable } from '@nestjs/common';
import { ExpensesRepository } from './expenses.repository';
import { EnrichedExpenseModel, ExpenseModel } from './expense.model';
import { CurrencyService } from '../../currency/currency.service';
import { PaymentTypeService } from '../../payment-type/payment-type.service';
import { UserService } from '../../user/user.service';
import { GhostUser, User } from '../../user/user.model';
import { Currency } from '../../currency/currency.model';
import { PaymentType } from '../../payment-type/payment-type.model';

type Relations = {
  payer: User | GhostUser;
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

    return this.enrichExpenses([expense])[0];
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
}
