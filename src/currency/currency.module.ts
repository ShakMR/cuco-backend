import { Module } from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { CurrencyImplService } from './currency-impl.service';
import { CurrencyRepository } from './currency.repository';
import { CurrencyImplRepository } from './currency-impl.repository';
import { DbModule } from '../db/db.module';

@Module({
  imports: [DbModule],
  providers: [
    {
      provide: CurrencyService,
      useClass: CurrencyImplService,
    },
    {
      provide: CurrencyRepository,
      useClass: CurrencyImplRepository,
    },
  ],
  exports: [CurrencyService],
})
export class CurrencyModule {}
