import { Currency } from '../currency/currency.model';
import { PaymentType } from '../payment-type/payment-type.model';
import { BaseUser } from '../user/user.model';

export interface ExpenseModel {
  id: number;
  uuid: string;
  amount: number;
  concept: string;
  createdAt: Date;
  currency?: Pick<Currency, 'id'>;
  date: Date;
  payer?: Pick<BaseUser, 'id'>;
  paymentType?: Pick<PaymentType, 'id'>;
  project: {
    id?: number;
    uuid?: string;
  };
  active: boolean;
}

export interface EnrichedExpenseModel extends ExpenseModel {
  currency: Currency;
  payer: BaseUser;
  paymentType: PaymentType;
}

export interface CreateExpenseModel {
  amount: number;
  concept: string;
  currencyName: string;
  date: Date;
  payerId: number;
  paymentTypeName: string;
  projectId: number;
}
