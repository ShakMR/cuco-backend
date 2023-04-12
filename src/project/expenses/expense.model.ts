import { Currency } from '../../currency/currency.model';
import { PaymentType } from '../../payment-type/payment-type.model';
import { GhostUser, User } from '../../user/user.model';

export interface ExpenseModel {
  id: number;
  uuid: string;
  amount: number;
  concept: string;
  createdAt: string | null;
  currency?: Partial<Currency>;
  date: Date;
  payer?: Partial<User | GhostUser>;
  paymentType?: PaymentType;
}
