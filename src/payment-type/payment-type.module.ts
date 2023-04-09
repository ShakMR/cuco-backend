import { Module } from '@nestjs/common';
import { PaymentTypeService } from './payment-type.service';
import { PaymentTypeImplService } from './payment-type-impl.service';
import { PaymentTypeRepository } from './payment-type.repository';
import { PaymentTypeImplRepository } from './payment-type-impl.repository';
import { DbModule } from '../db/db.module';

@Module({
  imports: [DbModule],
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
