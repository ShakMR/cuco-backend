import { ExpensesService } from './expenses.service';
import { Injectable } from '@nestjs/common';
import { ExpensesRepository } from './expenses.repository';
import { ExpenseModel } from './expense.model';
import { CurrencyService } from '../../currency/currency.service';
import { PaymentTypeService } from '../../payment-type/payment-type.service';
import { UserService } from '../../user/user.service';

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

  async getFromProject(id: number): Promise<ExpenseModel[]> {
    return this.repository.getFromProject(id);
  }

  async getByUuid(uuid: string): Promise<ExpenseModel> {
    const expense: ExpenseModel = await this.repository.getByUuid(uuid);

    expense.payer = await this.userService.getById(expense.payer.id);
    expense.currency = await this.currencyService.getById(expense.currency.id);
    expense.paymentType = await this.paymentTypeService.getById(
      expense.paymentType.id,
    );

    return expense;
  }
}
