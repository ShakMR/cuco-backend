import { Injectable } from '@nestjs/common';

import { Currency } from './currency.model';

@Injectable()
export abstract class CurrencyService {
  abstract getById(id: number): Promise<Currency>;
  abstract findByName(filter): Promise<Currency>;
}
