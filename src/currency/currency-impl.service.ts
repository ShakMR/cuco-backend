import { Injectable } from '@nestjs/common';

import { Currency } from './currency.model';
import { CurrencyRepository } from './currency.repository';
import { CurrencyService } from './currency.service';

@Injectable()
export class CurrencyImplService implements CurrencyService {
  constructor(private repository: CurrencyRepository) {}

  async getById(id: number): Promise<Currency> {
    return this.repository.getById(id);
  }

  findByName(name): Promise<Currency> {
    return this.repository.findOne({ name: name });
  }
}
