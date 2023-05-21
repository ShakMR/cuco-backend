import { createMock } from '@golevelup/ts-jest';
import { DeepMocked } from '@golevelup/ts-jest/lib/mocks';
import { Test } from '@nestjs/testing';
import e from 'express';

import { expectedUuidString } from '../../../common/utils/test.utils';
import { CurrencyService } from '../../../currency/currency.service';
import { ExpenseCreate } from '../../../db/schemas';
import { PaymentTypeName } from '../../../payment-type/payment-type.model';
import { PaymentTypeService } from '../../../payment-type/payment-type.service';
import { createMockUser } from '../../../user/__mocks__/user';
import { UserService } from '../../../user/services/user.service';
import {
  createArrayOfMockedEnrichedExpenses,
  createArrayOfMockedExpenses,
  createMockEnrichedExpense,
  createMockExpense,
} from '../../__mocks__/expense.model';
import { CreateExpenseModel } from '../../expense.model';
import { ExpensesRepository } from '../../repository/expenses.repository';
import { ExpensesImplService } from '../expenses-impl.service';

describe('ExpensesImplService', () => {
  let service: ExpensesImplService;
  let repository: DeepMocked<ExpensesRepository>;
  let userService: DeepMocked<UserService>;
  let currencyService: DeepMocked<CurrencyService>;
  let paymentTypeService: DeepMocked<PaymentTypeService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ExpensesImplService,
        {
          provide: ExpensesRepository,
          useValue: createMock(ExpensesRepository),
        },
        { provide: CurrencyService, useValue: createMock(CurrencyService) },
        {
          provide: PaymentTypeService,
          useValue: createMock(PaymentTypeService),
        },
        { provide: UserService, useValue: createMock(UserService) },
      ],
    }).compile();

    service = await module.get(ExpensesImplService);
    repository = await module.get(ExpensesRepository);

    userService = await module.get(UserService);
    userService.getById.mockResolvedValue(createMockUser({}));

    currencyService = await module.get(CurrencyService);
    currencyService.getById.mockResolvedValue({ id: 1, name: 'EUR' });

    paymentTypeService = await module.get(PaymentTypeService);
    paymentTypeService.getById.mockResolvedValue({
      id: 1,
      name: PaymentTypeName.debit,
    });
  });

  describe('getFromProject', () => {
    it('should return expenses for a project', async () => {
      const mockedRawExpenses = createArrayOfMockedExpenses([
        { id: 1 },
        { id: 2 },
      ]);

      const expectedResponses = createArrayOfMockedEnrichedExpenses([
        { id: 1 },
        { id: 2 },
      ]);

      repository.getFromProject.mockResolvedValueOnce(mockedRawExpenses);

      const response = await service.getFromProject(1);

      expect(response).toEqual(expectedResponses);
    });
  });

  describe('getByUuid', () => {
    it('should return a expense for a uuid', async () => {
      const expectedResponse = createMockEnrichedExpense({ uuid: 'new-uuid' });

      repository.getByUuid.mockResolvedValueOnce(
        createMockExpense({ uuid: 'new-uuid' }),
      );

      const response = await service.getByUuid('new-uuid');

      expect(response).toEqual(expectedResponse);
    });
  });

  describe('addNew', () => {
    it('should save expense with all the realtions', async () => {
      const input: CreateExpenseModel = {
        amount: 100,
        date: new Date(),
        concept: 'testconcept',
        paymentTypeName: PaymentTypeName.debit,
        currencyName: 'EUR',
        payerId: 1,
        projectId: 1,
      };

      repository.save.mockImplementationOnce(
        ({
          currency,
          payer_id,
          payment_type,
          date,
          project_id,
          ...data
        }: ExpenseCreate) =>
          createMockExpense({ ...data, date: new Date(date), id: 2 }),
      );

      const response = await service.addNew(input);

      const expectedResponse = createMockEnrichedExpense({
        id: 2,
        date: input.date,
        concept: 'testconcept',
      });

      expect(response).toEqual({
        ...expectedResponse,
        uuid: expectedUuidString(),
      });
      expect(currencyService.findByName).toHaveBeenCalledWith('EUR');
      expect(paymentTypeService.findByName).toHaveBeenCalledWith(
        PaymentTypeName.debit,
      );
    });
  });
});
