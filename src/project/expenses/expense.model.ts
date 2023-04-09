import { Currency } from '../../currency/currency.model';
import { PaymentType } from '../../payment-type/payment-type.model';

export interface ExpenseModel {
  id: number;
  uuid: string;
  amount: number;
  concept: string;
  createdAt: string | null;
  currency?: Partial<Currency>;
  date: Date;
  payer?: {
    id: number;
  }; // TODO to be created with module User
  paymentType?: PaymentType;
}
