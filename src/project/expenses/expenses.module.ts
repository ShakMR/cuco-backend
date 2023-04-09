import { Module } from '@nestjs/common';
import { ExpensesRepository } from './expenses.repository';
import { ExpensesImplRepository } from './expenses-impl.repository';
import { ExpensesService } from './expenses.service';
import { ExpensesImplService } from './expenses-impl.service';
import { ExpenseTransformer } from './expense.transformer';
import { DbModule } from '../../db/db.module';
import { ExpensesController } from './expenses.controller';
import { CurrencyModule } from '../../currency/currency.module';
import { PaymentTypeModule } from '../../payment-type/payment-type.module';

@Module({
  imports: [DbModule, CurrencyModule, PaymentTypeModule],
  controllers: [ExpensesController],
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
