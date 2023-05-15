import entityFactory from '../../common/__mocks__/entity.factory';
import { PaymentTypeName } from '../../payment-type/payment-type.model';
import { createMockUser } from '../../user/__mocks__/user';
import { EnrichedExpenseModel, ExpenseModel } from '../expense.model';

const mockExpense: ExpenseModel = {
  id: 1,
  uuid: 'uuid',
  concept: 'Test Expense',
  amount: 100,
  createdAt: new Date(),
  project: { id: 1 },
  date: new Date(),
};

const mockEnrichedExpense: EnrichedExpenseModel = {
  ...mockExpense,
  payer: createMockUser({}),
  currency: { id: 1, name: 'euro' },
  paymentType: { id: 1, name: PaymentTypeName.debit },
};

export default mockExpense;

export const createMockEnrichedExpense =
  entityFactory<EnrichedExpenseModel>(mockEnrichedExpense);

export const createArrayOfMockedEnrichedExpenses = (
  entities: Partial<EnrichedExpenseModel>[],
) => entities.map(createMockEnrichedExpense);
