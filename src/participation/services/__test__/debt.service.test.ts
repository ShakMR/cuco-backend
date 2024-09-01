import { DebtService } from '../debt.service';
import { BaseUser } from '../../../user/user.model';
import { EnrichedExpenseModel } from '../../../expenses/expense.model';
import { createMockUser } from '../../../user/__mocks__/user';
import { createMockEnrichedExpense } from '../../../expenses/__mocks__/expense.model';
import { createMockParticipation } from '../../__mocks__/participation.model';
import { Participation } from '../../participation.model';

describe('DebtService', () => {
  describe('calculateDebt', () => {
    const userIndex: Record<string, BaseUser> = {
      'user1-uuid': createMockUser({ id: 1, uuid: 'user1-uuid' }),
      'user2-uuid': createMockUser({ id: 2, uuid: 'user2-uuid' }),
      'user3-uuid': createMockUser({ id: 3, uuid: 'user3-uuid' }),
    };

    const participation: Record<number, Participation> = {
      1: createMockParticipation({ share: 40 }),
      2: createMockParticipation({ share: 50 }),
      3: createMockParticipation({ share: 10 }),
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return empty debts array if no users are provided', () => {
      const result = DebtService.calculateDebt({}, [], {});
      expect(result).toEqual([]);
    });

    it('should return no debts if there are no expenses', () => {
      const result = DebtService.calculateDebt(userIndex, [], participation);
      expect(result).toEqual([
        {
          userUUID: 'user1-uuid',
          ows: {
            'user2-uuid': 0,
            'user3-uuid': 0,
          },
          totalOwned: 0,
          receives: 0,
        },
        {
          userUUID: 'user2-uuid',
          ows: {
            'user1-uuid': 0,
            'user3-uuid': 0,
          },
          totalOwned: 0,
          receives: 0,
        },
        {
          userUUID: 'user3-uuid',
          ows: {
            'user1-uuid': 0,
            'user2-uuid': 0,
          },
          totalOwned: 0,
          receives: 0,
        },
      ]);
    });

    it('should calculate debts correctly for provided data', () => {
      const expenses: EnrichedExpenseModel[] = [
        createMockEnrichedExpense({
          amount: 100,
          payer: userIndex['user1-uuid'],
        }),
      ];

      const result = DebtService.calculateDebt(
        userIndex,
        expenses,
        participation,
      );

      // Expected result
      const expected = [
        {
          userUUID: 'user1-uuid',
          ows: {
            'user2-uuid': 0,
            'user3-uuid': 0,
          },
          totalOwned: 0,
          receives: 60,
        },
        {
          userUUID: 'user2-uuid',
          ows: {
            'user1-uuid': 50,
            'user3-uuid': 0,
          },
          totalOwned: 50,
          receives: 0,
        },
        {
          userUUID: 'user3-uuid',
          ows: {
            'user1-uuid': 10,
            'user2-uuid': 0,
          },
          totalOwned: 10,
          receives: 0,
        },
      ];

      expect(result).toEqual(expected);
    });

    it('should calculate debts correctly for multiple payers', () => {
      const expenses: EnrichedExpenseModel[] = [
        createMockEnrichedExpense({
          amount: 100,
          payer: userIndex['user1-uuid'],
        }),
        createMockEnrichedExpense({
          amount: 300,
          payer: userIndex['user2-uuid'],
        }),
      ];

      const result = DebtService.calculateDebt(
        userIndex,
        expenses,
        participation,
      );

      // Expected result
      const expected = [
        {
          userUUID: 'user1-uuid',
          ows: {
            'user2-uuid': 120,
            'user3-uuid': 0,
          },
          totalOwned: 120,
          receives: 60,
        },
        {
          userUUID: 'user2-uuid',
          ows: {
            'user1-uuid': 50,
            'user3-uuid': 0,
          },
          totalOwned: 50,
          receives: 150,
        },
        {
          userUUID: 'user3-uuid',
          ows: {
            'user1-uuid': 10,
            'user2-uuid': 30,
          },
          totalOwned: 40,
          receives: 0,
        },
      ];

      expect(result).toEqual(expected);
    });
  });

  describe('calculateCostPerShare', () => {
    it('should return cost, rest and total accordingly', () => {
      const { cost, total, rest } = DebtService.calculateCostPerShare(100, 50);
      expect(cost).toEqual(50);
      expect(rest).toEqual(50);
      expect(total).toEqual(100);
    });
  });
});
