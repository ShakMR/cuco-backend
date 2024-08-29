import { createMockEnrichedExpense } from '../__mocks__/expense.model';
import { ExpenseTransformer } from '../expense.transformer';

describe('ExpenseTransformer', () => {
  let transformer;
  beforeEach(() => {
    transformer = new ExpenseTransformer();
  });

  describe('transform', () => {
    it('should transform Enriched expense', () => {
      const expense = createMockEnrichedExpense({});

      const result = transformer.transform(expense);
      expect(result).toEqual({
        uuid: 'uuid',
        amount: 100,
        concept: 'Test Expense',
        project: {
          id: 1,
        },
        currency: {
          name: 'EUR',
        },
        paymentType: {
          name: 'debit',
        },
        date: new Date('2020-01-01T00:00:00.000Z'),
        createdAt: new Date('2020-01-01T00:00:00.000Z'),
        payer: {
          uuid: 'uuid',
          name: 'name',
          type: 'user',
        },
        active: true,
      });
    });

    it('should add substitutions', () => {
      const expense = createMockEnrichedExpense({});

      const result = transformer.transform(expense, {
        project: { id: '1234', name: 'test' },
      });
      expect(result).toEqual({
        uuid: 'uuid',
        amount: 100,
        concept: 'Test Expense',
        project: {
          id: '1234',
          name: 'test',
        },
        currency: {
          name: 'EUR',
        },
        paymentType: {
          name: 'debit',
        },
        date: new Date('2020-01-01T00:00:00.000Z'),
        createdAt: new Date('2020-01-01T00:00:00.000Z'),
        payer: {
          uuid: 'uuid',
          name: 'name',
          type: 'user',
        },
        active: true,
      });
    });
  });
});
