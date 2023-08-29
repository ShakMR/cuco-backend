import { initApp } from '../__e2e__/e2e-utils';
import user from '../__e2e__/__mocks__/user.mock';
import project from '../__e2e__/__mocks__/project.mock';
import expenses from '../__e2e__/__mocks__/expenses.mock';
import currency from '../__e2e__/__mocks__/currency.mock';
import paymentType from '../__e2e__/__mocks__/payment-type.mock';
import participation from '../__e2e__/__mocks__/participation.mock';
import passport from '../__e2e__/__mocks__/passport.mock';

import {
  CurrencyTable,
  ExpensesTable,
  ParticipantTable,
  PaymentTypeTable,
  ProjectsTable,
  UserTable,
  PassportTable,
} from '../db/schemas';

const mocks = {
  [UserTable]: user,
  [ProjectsTable]: project,
  [ExpensesTable]: expenses,
  [CurrencyTable]: currency,
  [PaymentTypeTable]: paymentType,
  [ParticipantTable]: participation,
  [PassportTable]: passport,
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
