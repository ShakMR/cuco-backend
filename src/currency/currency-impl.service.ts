import { CurrencyService } from './currency.service';
import { CurrencyRepository } from './currency.repository';
import { Currency } from './currency.model';
import { Injectable } from '@nestjs/common';

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
