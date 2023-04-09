import { Currency } from '../../currency/currency.model';
import { PaymentType } from '../../payment-type/payment-type.model';

export interface ExpenseDto {

  uuid: string;
  amount: number;
  concept: string;
  createdAt: string | null;
  currency?: Partial<Currency>;
  date: Date;
  payer?: {
    id: number; // TODO add users
  };
  paymentType?: Partial<PaymentType>;
}
