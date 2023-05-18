import { Injectable } from '@nestjs/common';

import { Currency } from '../currency/currency.model';
import { DbClient } from '../db/db-client';
import { PaymentType } from '../db/schemas';
import { LoggerService } from '../logger/logger.service';
import {
  PaymentType as PaymentTypeModel,
  PaymentTypeName,
} from './payment-type.model';
import { PaymentTypeRepository } from './payment-type.repository';

@Injectable()
export class PaymentTypeImplRepository extends PaymentTypeRepository {
  constructor(
    private db: DbClient<PaymentType>,
    private logger: LoggerService,
  ) {
    super();
  }

  onModuleInit() {
    this.db.init('PaymentType');
  }

  async getById(id: number): Promise<PaymentTypeModel> {
    const paymentType = await this.db.getById(id);

    if (!paymentType) {
      this.logger.warn(`Could find Entity with id ${id}`);
      return { id };
    }

    return {
      id: paymentType.id,
      name: PaymentTypeName[paymentType.name],
    };
  }

  async findOne(filter: { name: string }): Promise<PaymentTypeModel> {
    return this.db.find(filter);
  }
}
