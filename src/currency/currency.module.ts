import { Module } from '@nestjs/common';

import { DbModule } from '../db/db.module';
import { CurrencyImplRepository } from './currency-impl.repository';
import { CurrencyImplService } from './currency-impl.service';
import { CurrencyRepository } from './currency.repository';
import { CurrencyService } from './currency.service';

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
