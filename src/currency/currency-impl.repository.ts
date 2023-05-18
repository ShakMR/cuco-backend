import { Injectable } from '@nestjs/common';

import { DbClient } from '../db/db-client';
import { Currency } from '../db/schemas';
import { Currency as CurrencyModel } from './currency.model';
import { CurrencyRepository } from './currency.repository';

@Injectable()
export class CurrencyImplRepository extends CurrencyRepository {
  constructor(private db: DbClient<Currency>) {
    super();
  }

  onModuleInit() {
    this.db.init('Currency');
  }

  async getById(id: number): Promise<CurrencyModel> {
    const currency = await this.db.getById(id);

    return {
      id: currency.id,
      name: currency.name,
    };
  }

  findOne(filter: { name: string }): Promise<Currency> {
    return this.db.find(filter);
  }
}
