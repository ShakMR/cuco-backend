import { Currency } from './currency.model';

export abstract class CurrencyRepository {
  abstract getById(id: number): Promise<Currency>;
}
