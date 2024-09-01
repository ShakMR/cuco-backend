import { BaseUser } from '../../user/user.model';
import { EnrichedExpenseModel } from '../../expenses/expense.model';
import { Participation } from '../participation.model';

export type DebtSummary = {
  userUUID: string;
  ows: Record<string, number>;
  totalOwned: number;
  receives: number;
};

export class DebtService {
  static calculateDebt(
    userIndex: Record<string, BaseUser>,
    expenses: EnrichedExpenseModel[],
    participation: Record<number, Participation>,
  ): {
    userUUID: string;
    ows: Record<string, number>;
    totalOwned: number;
    receives: number;
  }[] {
    const userUUIDs = Object.keys(userIndex);
    const debts = userUUIDs.reduce<Record<number, DebtSummary>>(
      (acc, userUUID) => {
        acc[userUUID] = {
          userUUID,
          ows: userUUIDs
            .filter((uuid) => uuid !== userUUID)
            .reduce((acc, uuid) => {
              acc[uuid] = 0;
              return acc;
            }, {}),
          totalOwned: 0,
          receives: 0,
        };
        return acc;
      },
      {},
    );

    for (const { payer, amount } of expenses) {
      const { id, uuid } = payer;
      const payerShare = participation[id].share;

      const { rest } = this.calculateCostPerShare(amount, payerShare);

      debts[uuid].receives += rest;

      userUUIDs
        .filter((debtorUUID) => debtorUUID !== uuid)
        .forEach((debtorUUID) => {
          const debtorId = userIndex[debtorUUID].id;
          const share = participation[debtorId].share;

          const { cost } = this.calculateCostPerShare(amount, share);

          debts[debtorUUID].ows[uuid] += cost;
          debts[debtorUUID].totalOwned += cost;
        });
    }

    return Object.values(debts);
  }

  static calculateCostPerShare(amount: number, share: number) {
    const percentage = share / 100;
    const cost = percentage * amount;
    return {
      cost,
      rest: amount - cost,
      total: amount,
    };
  }
}
