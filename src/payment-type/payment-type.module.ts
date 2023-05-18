import { Module } from '@nestjs/common';

import { DbModule } from '../db/db.module';
import LoggerModule from '../logger/logger.module';
import { PaymentTypeImplRepository } from './payment-type-impl.repository';
import { PaymentTypeImplService } from './payment-type-impl.service';
import { PaymentTypeRepository } from './payment-type.repository';
import { PaymentTypeService } from './payment-type.service';

@Module({
  imports: [DbModule, LoggerModule],
  providers: [
    {
      provide: PaymentTypeService,
      useClass: PaymentTypeImplService,
    },
    {
      provide: PaymentTypeRepository,
      useClass: PaymentTypeImplRepository,
    },
  ],
  exports: [PaymentTypeService],
})
export class PaymentTypeModule {}
