import { createMock } from '@golevelup/ts-jest';
import { DeepMocked } from '@golevelup/ts-jest/lib/mocks';
import { Test, TestingModule } from '@nestjs/testing';

import { DbClient } from '../../../db/db-client';
import { Expenses } from '../../../db/schemas';
import {
  createArrayOfMockedDBExpenses,
  createArrayOfMockedExpenses,
  createMockDBExpense,
  createMockExpense,
} from '../../__mocks__/expense.model';
import { ExpensesImplRepository } from '../expenses-impl.repository';

describe('ExpensesImplRepository', () => {
  let repository: ExpensesImplRepository;
  let db: DeepMocked<DbClient<Expenses>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExpensesImplRepository,
        {
          provide: DbClient<Expenses>,
          useValue: createMock(DbClient<Expenses>),
        },
      ],
    }).compile();

    repository = module.get<ExpensesImplRepository>(ExpensesImplRepository);
    db = await module.get(DbClient);
  });

  describe('getFromProject', () => {
    it('should return expenses', async () => {
      const expenses = createArrayOfMockedDBExpenses([{ id: 1 }, { id: 2 }]);
      const expectedExpenses = createArrayOfMockedExpenses([
        { id: 1 },
        { id: 2 },
      ]);
      db.findAll.mockResolvedValueOnce(expenses);

      const result = await repository.getFromProject(1);

      expect(result).toEqual(expectedExpenses);
    });
  });

  describe('getByUuid', () => {
    it('should return expenses by uuid', async () => {
      const expense = createMockDBExpense({});
      const expectedExpense = createMockExpense({});

      db.getBy.mockResolvedValueOnce(expense);

      const result = await repository.getByUuid(expense.uuid);
      expect(result).toEqual(expectedExpense);
      expect(db.getBy).toHaveBeenCalledWith({ uuid: expense.uuid });
    });
  });

  describe('save', () => {
    it('should save expense', async () => {
      const id = 1;
      const date = new Date('2020-01-01T00:00:00.000Z');
      db.save.mockImplementationOnce((data) =>
        Promise.resolve(
          createMockDBExpense({
            ...data,
            id,
            created_at: date,
          }),
        ),
      );

      const expectedExpense = createMockExpense({
        concept: 'test concept',
        uuid: 'test',
      });

      const params = {
        amount: 100,
        concept: 'test concept',
        currency: 1,
        date: date.toISOString(),
        payer_id: 1,
        payment_type: 1,
        project_id: 1,
        uuid: 'test',
      };

      const expense = await repository.save(params);

      expect(db.save).toHaveBeenCalledWith(params);
      expect(expense).toEqual(expectedExpense);
    });
  });
});
