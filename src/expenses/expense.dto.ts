import { Currency } from '../currency/currency.model';
import { PaymentType, PaymentTypeName } from '../payment-type/payment-type.model';
import { GhostUser, User } from '../user/user.model';

export interface ExpenseDto {
  uuid: string;
  amount: number;
  concept: string;
  createdAt: string | null;
  currency?: Partial<Currency>;
  date: Date;
  payer?: Partial<User | GhostUser>;
  paymentType?: Partial<PaymentType>;
}

export interface CreateExpenseDto {
  amount: number;
  concept: string;
  currency?: string;
  date: Date;
  projectUuid: string;
  paymentType?: PaymentTypeName;
}
