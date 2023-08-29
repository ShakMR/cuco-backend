import { Database } from './supabase/database.types';

type PublicTables = Database['public']['Tables'];
export const ExpensesTable = 'Spending';
export const ProjectsTable = 'Project';
export const UserTable = 'User';
export const PaymentTypeTable = 'PaymentType';
export const CurrencyTable = 'Currency';
export const ParticipantTable = 'Participation';

export const PassportTable = 'Passport';

export type Project = PublicTables['Project']['Row'];
export type ProjectCreate = PublicTables['Project']['Insert'];
export type Statistics = PublicTables['Statics']['Row'];
export type PassportSchema = PublicTables['Passport']['Row'];

export type Expenses = PublicTables['Spending']['Row'];
export type ExpenseCreate = PublicTables['Spending']['Insert'];

export type User = PublicTables['User']['Row'];
export type PaymentType = PublicTables['PaymentType']['Row'];
export type Currency = PublicTables['Currency']['Row'];

export type Participation = PublicTables['Participation']['Row'];
export type ParticipationCreate = PublicTables['Participation']['Insert'];

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
