import { Currency } from '../../currency/currency.model';
import { PaymentType } from '../../payment-type/payment-type.model';
import { GhostUser, User } from '../../user/user.model';

export interface ExpenseModel {
  id: number;
  uuid: string;
  amount: number;
  concept: string;
  createdAt: string | null;
  currency?: Pick<Currency, 'id'>;
  date: Date;
  payer?: Pick<User | GhostUser, 'id'>;
  paymentType?: Pick<PaymentType, 'id'>;
}

export interface EnrichedExpenseModel extends ExpenseModel {
  currency: Currency;
  payer: User | GhostUser;
  paymentType: PaymentType;
}
