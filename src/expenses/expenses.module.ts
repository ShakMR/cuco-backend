import { Module } from '@nestjs/common';

import { CurrencyModule } from '../currency/currency.module';
import { DbModule } from '../db/db.module';
import LoggerModule from '../logger/logger.module';
import { PaymentTypeModule } from '../payment-type/payment-type.module';
import { UserModule } from '../user/user.module';
import { ExpenseTransformer } from './expense.transformer';
import { ExpensesImplRepository } from './repository/expenses-impl.repository';
import { ExpensesImplService } from './service/expenses-impl.service';
import { ExpensesRepository } from './repository/expenses.repository';
import { ExpensesService } from './service/expenses.service';

@Module({
  imports: [
    DbModule,
    CurrencyModule,
    PaymentTypeModule,
    UserModule,
    LoggerModule,
  ],
  providers: [
    {
      provide: ExpensesRepository,
      useClass: ExpensesImplRepository,
    },
    {
      provide: ExpensesService,
      useClass: ExpensesImplService,
    },
    ExpenseTransformer,
  ],
  exports: [ExpensesService, ExpenseTransformer],
})
export class ExpensesModule {}
