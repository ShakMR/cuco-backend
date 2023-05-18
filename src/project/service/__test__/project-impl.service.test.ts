import { createMock } from '@golevelup/ts-jest';
import { DeepMocked } from '@golevelup/ts-jest/lib/mocks';
import { Test } from '@nestjs/testing';

import { expectedUuidString } from '../../../common/utils/test.utils';
import {
  createArrayOfMockedEnrichedExpenses,
  createMockEnrichedExpense,
} from '../../../expenses/__mocks__/expense.model';
import { ExpensesService } from '../../../expenses/service/expenses.service';
import { LoggerService } from '../../../logger/logger.service';
import {
  createArrayOfMockProject,
  createMockProject,
} from '../../__mocks__/project.model';
import { ProjectRepository } from '../../repository/project.repository';
import { ProjectImplService } from '../project-impl.service';
import { ProjectService } from '../project.service';

describe('ProjectImplService', () => {
  let service: ProjectService;
  let repository: DeepMocked<ProjectRepository>;
  let expensesService: DeepMocked<ExpensesService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ProjectImplService,
        {
          provide: ProjectRepository,
          useValue: createMock<ProjectRepository>(),
        },
        { provide: ExpensesService, useValue: createMock<ExpensesService>() },
        { provide: LoggerService, useValue: createMock<LoggerService>() },
      ],
    }).compile();

    service = await module.get<ProjectImplService>(ProjectImplService);
    repository = await module.get<DeepMocked<ProjectRepository>>(
      ProjectRepository,
    );
    expensesService = await module.get<DeepMocked<ExpensesService>>(
      ExpensesService,
    );
  });

  describe('getAll', () => {
    it('returns a list of projects', async () => {
      const ids = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
      const expectedProjects = createArrayOfMockProject(ids);
      repository.getAll.mockResolvedValueOnce(createArrayOfMockProject(ids));

      await expect(service.getAll()).resolves.toEqual(expectedProjects);
    });
  });

  describe('getByUuid', () => {
    it('should return a single project', async () => {
      const expectedProject = createMockProject({ uuid: 'uuid' });
      repository.getByUuid.mockResolvedValueOnce(
        createMockProject({ uuid: 'uuid' }),
      );

      await expect(service.getByUuid('uuid')).resolves.toEqual(expectedProject);
    });

    it('should enrich project with expenses', async () => {
      const { expenses: _, ...expectedProject } = createMockProject({
        uuid: 'uuid',
      });
      repository.getByUuid.mockResolvedValueOnce(
        createMockProject({ uuid: 'uuid' }),
      );
      const expensesIds = [{ id: 1 }, { id: 2 }, { id: 3 }];

      expensesService.getFromProject.mockResolvedValueOnce(
        createArrayOfMockedEnrichedExpenses(expensesIds),
      );

      const { expenses, ...project } = await service.getByUuid('uuid', {
        includeExpenses: true,
      });

      expect(project).toEqual(expectedProject);
      expect(expenses).toHaveLength(3);
      expect(expenses.map(({ id }) => ({ id }))).toEqual(expensesIds);
      expect(expensesService.getFromProject).toHaveBeenCalledWith(
        expectedProject.id,
      );
    });
  });

  describe('addNewExpenseToProject', () => {
    it('should add a new expense to a project', async () => {
      repository.getByUuid.mockResolvedValueOnce(
        createMockProject({ id: 1234, uuid: 'uuid' }),
      );

      const expectedExpense = createMockEnrichedExpense({
        amount: 100,
        date: new Date(),
        concept: 'test',
        project: { id: 1234 },
      });

      expensesService.addNew.mockResolvedValueOnce(
        createMockEnrichedExpense({
          amount: 100,
          date: new Date(),
          concept: 'test',
          project: { id: 1234 },
        }),
      );

      await expect(
        service.addNewExpenseToProject('uuid', {
          amount: 100,
          date: new Date(),
          concept: 'test',
          payerId: 1,
          currencyName: 'euro',
          paymentTypeName: 'debit',
        }),
      ).resolves.toEqual({
        ...expectedExpense,
      });
    });
  });

  describe('getExpense', () => {
    beforeEach(async () => {
      repository.getByUuid.mockResolvedValueOnce(
        createMockProject({ id: 1234, uuid: 'uuid' }),
      );
    });

    it('should return expense from a project', async () => {
      const expense = createMockEnrichedExpense({
        id: 1111,
        uuid: 'e-uuid',
        project: { id: 1234 },
      });

      expensesService.getByUuid.mockResolvedValueOnce(expense);

      await expect(service.getExpense('uuid', 'e-uuid')).resolves.toEqual(
        expense,
      );
    });

    it('should throw if expense does not belong to project', async () => {
      const expense = createMockEnrichedExpense({
        id: 1111,
        uuid: 'e-uuid',
        project: { id: 1111 },
      });

      expensesService.getByUuid.mockResolvedValueOnce(expense);

      await expect(service.getExpense('uuid', 'e-uuid')).rejects.toThrow(
        new Error('TODO: add proper error handling'),
      );
    });
  });

  describe('create', () => {
    it('should return a new project with uuid', async () => {
      repository.save.mockImplementation((input) => input);

      const newProject = await service.create({
        name: 'test project',
      });

      expect(newProject.uuid).toEqual(expectedUuidString());
      expect(newProject.name).toEqual('test project');
      expect(newProject.isOpen).toBeTruthy();
    });
  });

  describe('getAllById', () => {
    it('should return all projects matching ids', async () => {
      repository.findProjectsInListById.mockImplementation(async (ids) =>
        ids.map((id) => createMockProject({ id })),
      );

      const projects = await service.getAllById([1, 2]);
      expect(projects).toHaveLength(2);
      expect(projects.map(({ id }) => id)).toEqual([1, 2]);
    });
  });

  describe('searchByShortName', () => {
    it('should return all projects matching short name', async () => {
      repository.search.mockResolvedValueOnce([
        createMockProject({ shortName: 'short' }),
      ]);

      const projects = await service.searchByShortName('short', {
        includeExpenses: false,
      });

      expect(projects).toHaveLength(1);
      expect(projects[0].shortName).toEqual('short');
    });

    it('should include expenses', async () => {
      repository.search.mockResolvedValueOnce([
        createMockProject({ shortName: 'short' }),
      ]);

      expensesService.getFromProject.mockResolvedValueOnce([
        createMockEnrichedExpense({}),
      ]);

      const projects = await service.searchByShortName('short', {
        includeExpenses: true,
      });

      expect(projects).toHaveLength(1);
      expect(projects[0].shortName).toEqual('short');
      expect(projects[0].expenses).toHaveLength(1);
    });
  });
});
