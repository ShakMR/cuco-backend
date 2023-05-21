import entityFactory from '../../common/__mocks__/entity.factory';
import { Expenses } from '../../db/schemas';
import { PaymentTypeName } from '../../payment-type/payment-type.model';
import { createMockUser } from '../../user/__mocks__/user';
import { EnrichedExpenseModel, ExpenseModel } from '../expense.model';

const date = new Date('2020-01-01T00:00:00.000Z');

const mockExpense: ExpenseModel = {
  id: 1,
  uuid: 'uuid',
  concept: 'Test Expense',
  amount: 100,
  createdAt: date,
  project: { id: 1 },
  date: date,
  payer: { id: 1 },
  currency: { id: 1 },
  paymentType: { id: 1 },
};

const mockEnrichedExpense: EnrichedExpenseModel = {
  ...mockExpense,
  payer: createMockUser({}),
  currency: { id: 1, name: 'EUR' },
  paymentType: { id: 1, name: PaymentTypeName.debit },
};

const mockDBExpense: Expenses = {
  id: 1,
  uuid: 'uuid',
  concept: 'Test Expense',
  amount: 100,
  created_at: date.toISOString(),
  project_id: 1,
  date: date.toISOString(),
  payer_id: 1,
  currency: 1,
  payment_type: 1,
};

export default mockExpense;

export const createMockEnrichedExpense =
  entityFactory<EnrichedExpenseModel>(mockEnrichedExpense);

export const createMockExpense = entityFactory<ExpenseModel>(mockExpense);

export const createMockDBExpense = entityFactory<Expenses>(mockDBExpense);

export const createArrayOfMockedEnrichedExpenses = (
  entities: Partial<EnrichedExpenseModel>[],
) => entities.map(createMockEnrichedExpense);

export const createArrayOfMockedExpenses = (
  entities: Partial<ExpenseModel>[],
) => entities.map(createMockExpense);

export const createArrayOfMockedDBExpenses = (entities: Partial<Expenses>[]) =>
  entities.map(createMockDBExpense);
