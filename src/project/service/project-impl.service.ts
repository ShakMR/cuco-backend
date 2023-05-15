import { ProjectService, ProjectServiceOptions } from './project.service';
import { Project } from '../model/project.model';
import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { ProjectRepository } from '../repository/project.repository';
import { ExpensesService } from '../../expenses/expenses.service';
import {
  CreateExpenseModel,
  EnrichedExpenseModel,
} from '../../expenses/expense.model';
import { LoggerService } from '../../logger/logger.service';
import { CreateProjectDto } from '../dto/project.dto';

@Injectable()
export class ProjectImplService extends ProjectService {
  constructor(
    private repository: ProjectRepository,
    private expensesService: ExpensesService,
    private logger: LoggerService,
  ) {
    super();
    logger.setContext(ProjectService.name);
  }

  getAll(): Promise<Project[]> {
    return this.repository.getAll();
  }

  async getByUuid(
    uuid: string,
    options?: ProjectServiceOptions,
  ): Promise<Project> {
    const project = await this.repository.getByUuid(uuid);

    let expenses = [];
    if (options?.includeExpenses) {
      expenses = await this.expensesService.getFromProject(project.id);
    }

    return {
      ...project,
      expenses,
    };
  }

  async addNewExpenseToProject(
    projectUuid: string,
    expense: Omit<CreateExpenseModel, 'projectId'>,
  ): Promise<EnrichedExpenseModel> {
    const project = await this.getByUuid(projectUuid);
    return this.expensesService.addNew({
      ...expense,
      projectId: project.id,
    });
  }

  async getExpense(
    projectUuid: string,
    uuid: string,
  ): Promise<EnrichedExpenseModel> {
    const project = await this.getByUuid(projectUuid);
    const expense = await this.expensesService.getByUuid(uuid);
    if (!expense || project.id !== expense.project.id) {
      this.logger.error(
        `Expense with uuid ${uuid} does not belong to project with uuid ${projectUuid}`,
      );
      throw new Error("TODO: add proper error handling");
    }

    return expense;
  }

  create(data: CreateProjectDto): Promise<Project> {
    const uuid = uuidv4();
    const newProject = this.repository.save({
      name: data.name,
      uuid,
      isOpen: true,
    });

    return newProject;
  }

  getAllById(projectsIds: number[]): Promise<Project[]> {
    return this.repository.findProjectsInListById(projectsIds);
  }

  async searchByShortName(
    shortName: string,
    options: ProjectServiceOptions,
  ): Promise<Project[]> {
    const projects = await this.repository.search({ shortName });

    let expenses = [];
    if (options?.includeExpenses) {
      const promises = projects.map((project) =>
        this.expensesService.getFromProject(project.id),
      );
      expenses = await Promise.all(promises);
    }

    return projects.map((project, index) => ({
      ...project,
      expenses: expenses[index],
    }));
  }
}
