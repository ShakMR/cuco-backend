import { Database } from './supabase/database.types';

type PublicTables = Database['public']['Tables'];

export type Project = PublicTables['Project']['Row'];

export const ExpensesTable = 'Spending';
export type Expenses = PublicTables['Spending']['Row'];
export type User = PublicTables['User']['Row'];
export type PaymentType = PublicTables['PaymentType']['Row'];
export type Currency = PublicTables['Currency']['Row'];

type withUser = {
  User: User;
};

type withPaymentType = {
  PaymentType: PaymentType;
};

type withCurrency = {
  Currency: Currency;
};

export type ExpensesWithUser = Expenses & withUser;

export type ExpensesWithPaymentType = Expenses & withPaymentType;

export type ExpensesWithCurrency = Expenses & withCurrency;

export type ExpensesWithUserAndPaymentTypeAndCurrency = Expenses &
  withUser &
  withCurrency &
  withPaymentType;
