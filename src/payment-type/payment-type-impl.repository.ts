import { Injectable } from '@nestjs/common';
import { PaymentTypeRepository } from './payment-type.repository';
import { DbClient } from '../db/db-client';
import { PaymentType } from '../db/schemas';
import { PaymentType as PaymentTypeModel } from './payment-type.model';
import { Currency } from '../currency/currency.model';
import { LoggerService } from '../logger/logger.service';

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
      name: paymentType.name,
    };
  }

  async findOne(filter: { name: string }): Promise<Currency> {
    return this.db.find(filter);
  }
}
