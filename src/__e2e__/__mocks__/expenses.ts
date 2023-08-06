import { Expenses } from '../../db/schemas';

export const expense1: Expenses = {
  amount: 100,
  concept: 'mock',
  created_at: new Date().toISOString(),
  currency: 1,
  date: new Date().toISOString(),
  id: 1,
  payer_id: 1,
  payment_type: 1,
  project_id: 1,
  uuid: 'mock-1',
};

export const expense2: Expenses = {
  amount: 200,
  concept: 'mock',
  created_at: new Date().toISOString(),
  currency: 1,
  date: new Date().toISOString(),
  id: 1,
  payer_id: 1,
  payment_type: 1,
  project_id: 1,
  uuid: 'mock-2',
};

export default [expense1, expense2];
