import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';

import { createMockEnrichedExpense } from '../../../expenses/__mocks__/expense.model';
import { EnrichedExpenseModel } from '../../../expenses/expense.model';
import { ExpenseTransformer } from '../../../expenses/expense.transformer';
import { createMockProject } from '../../__mocks__/project.model';
import { Project } from '../../model/project.model';
import { ProjectResponseBuilder } from '../project-response.builder';
import { ProjectTransformer } from '../project.transformer';

const listExpensesLinks = {
  self: '/prefix/projects/uuid/expenses',
  parent: '/prefix/projects/uuid',
};

const linksExpense = {
  self: '/prefix/projects/uuid/expenses/uuid',
  list: '/prefix/projects/uuid/expenses',
  parent: '/prefix/projects/uuid',
};

const metaProject = {
  links: {
    self: '/prefix/projects/uuid',
    list: '/prefix/projects',
  },
};

const pagination01 = {
  totalItems: 1,
  quantity: 1,
  previous: '/prefix/projects/uuid/expenses?offset=0&quantity=1',
  next: null,
};

describe('ProjectResponseBuilder', () => {
  let responseBuilder: ProjectResponseBuilder;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ProjectResponseBuilder,
        {
          provide: ProjectTransformer,
          useValue: {
            transform: (project: Project) => project,
          },
        },
        {
          provide: ExpenseTransformer,
          useValue: {
            transform: (expense: EnrichedExpenseModel) => expense,
          },
        },
        {
          provide: ConfigService,
          useValue: { get: () => 'prefix' },
        },
      ],
    }).compile();

    responseBuilder = module.get(ProjectResponseBuilder);
  });

  describe('buildSingleResponse', () => {
    it('should return a single project response without expenses', () => {
      const project = createMockProject({ id: 4321 });

      const response = responseBuilder.buildSingleResponse(project);

      expect(response).toEqual({
        data: project,
        expenses: {
          data: [],
          meta: {
            links: listExpensesLinks,
          },
        },
        meta: metaProject,
      });
    });

    it('should return project response with expenses', () => {
      const project = createMockProject({ id: 4321 });
      const expense = createMockEnrichedExpense({ id: 4322 });
      project.expenses = [expense];

      const response = responseBuilder.buildSingleResponse(project, {
        totalExpenses: 1,
      });

      expect(response).toEqual({
        data: project,
        expenses: {
          data: [
            {
              data: expense,
              meta: {
                links: linksExpense,
              },
            },
          ],
          meta: {
            pagination: pagination01,
            links: listExpensesLinks,
          },
        },
        meta: metaProject,
      });
    });
  });

  describe('buildExpensesResponse', () => {
    it('should return a response for a list of expenses', () => {
      const project = createMockProject({ id: 4321 });
      const expense = createMockEnrichedExpense({ id: 4322 });

      const response = responseBuilder.buildExpensesResponse(
        [expense],
        project,
        {
          offset: 0,
          total: 1,
          quantity: 1,
        },
      );

      expect(response).toEqual({
        data: [
          {
            data: expense,
            meta: {
              links: linksExpense,
            },
          },
        ],
        meta: {
          pagination: pagination01,
          links: listExpensesLinks,
        },
      });
    });
  });

  describe('buildListResponse', () => {
    it('should return a response of a list of projects', () => {
      const project = createMockProject({ id: 4321 });

      const response = responseBuilder.buildListResponse([project], {
        offset: 0,
        total: 1,
        quantity: 1,
      });

      expect(response).toEqual({
        data: [
          {
            data: project,
            expenses: {
              data: [],
              pagination: undefined,
              meta: {
                links: listExpensesLinks,
              },
            },
            meta: metaProject,
          },
        ],
        meta: {
          links: {
            self: '/prefix/projects',
          },
          pagination: {
            next: null,
            previous: '/prefix/projects?offset=0&quantity=1',
            totalItems: 1,
            quantity: 1,
          },
        },
      });
    });

    it('should return next link if there are move projects', () => {
      const project = createMockProject({ id: 4321 });

      const response = responseBuilder.buildListResponse([project], {
        offset: 0,
        total: 10,
        quantity: 1,
      });

      expect(response.meta.pagination.next).toEqual(
        '/prefix/projects?offset=1&quantity=1',
      );
    });
  });
});
