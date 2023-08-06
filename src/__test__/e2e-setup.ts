import { initApp } from '../__e2e__/e2e-utils';
import user from '../__e2e__/__mocks__/user';
import project from '../__e2e__/__mocks__/project';
import expenses from '../__e2e__/__mocks__/expenses';
import currency from '../__e2e__/__mocks__/currency';
import paymentType from '../__e2e__/__mocks__/payment-type';
import participation from '../__e2e__/__mocks__/participation';
import {
  CurrencyTable,
  ExpensesTable,
  ParticipantTable,
  PaymentTypeTable,
  ProjectsTable,
  UserTable,
} from '../db/schemas';

const mocks = {
  [UserTable]: user,
  [ProjectsTable]: project,
  [ExpensesTable]: expenses,
  [CurrencyTable]: currency,
  [PaymentTypeTable]: paymentType,
  [ParticipantTable]: participation,
};

beforeAll(async () => {
  jest.useFakeTimers();
  const { db } = await initApp();
  Object.entries(mocks).forEach(([table, entries]) => {
    const entriesArray = Array.isArray(entries) ? entries : [entries];

    entriesArray.forEach((entry) => {
      db.init(table);
      db.save({ ...entry, created_at: new Date() }, true);
    });
  });
});
