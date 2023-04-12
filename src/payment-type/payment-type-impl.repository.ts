import { Injectable } from '@nestjs/common';
import { PaymentTypeRepository } from './payment-type.repository';
import { DbClient } from '../db/db-client';
import { PaymentType } from '../db/schemas';
import { PaymentType as PaymentTypeModel } from './payment-type.model';

@Injectable()
export class PaymentTypeImplRepository extends PaymentTypeRepository {
  constructor(private db: DbClient<PaymentType>) {
    super();
  }

  onModuleInit() {
    this.db.init('PaymentType');
  }

  async getById(id: number): Promise<PaymentTypeModel> {
    const paymentType = await this.db.getById(id);

    return {
      id: paymentType.id,
      name: paymentType.name,
    };
  }
}
