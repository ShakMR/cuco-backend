import { Injectable } from '@nestjs/common';
import { ProjectTransformer } from './project.transformer';
import { ExpenseTransformer } from '../../expenses/expense.transformer';
import { Project } from '../model/project.model';
import { ConfigService } from '@nestjs/config';
import { MetaDto } from '../../common/dto/response.dto';
import { EnrichedExpenseModel } from '../../expenses/expense.model';
import { ProjectsResponse, SingleProjectResponse } from '../dto/project.dto';
import { ListExpenseResponse } from '../../expenses/expense.dto';

type Pagination = {
  offset: number;
  total: number;
  quantity?: number;
};

@Injectable()
export class ProjectResponseBuilder {
  private readonly mainPath: string;
  private readonly projectListPathTemplate: string =
    '?offset=:offset:&quantity=:quantity:';
  private readonly expensesListPathTemplate: string =
    '/expenses?offset=:offset:&quantity=:quantity:';

  constructor(
    private transformer: ProjectTransformer,
    private expensesTransformer: ExpenseTransformer,
    private config: ConfigService,
  ) {
    const prefix = config.get('API_PREFIX');
    this.mainPath = `/${prefix}/projects`;
    this.expensesListPathTemplate =
      this.mainPath + this.expensesListPathTemplate;
    this.projectListPathTemplate = this.mainPath + this.projectListPathTemplate;
  }

  buildSingleResponse(
    project: Project,
    { totalExpenses }: { totalExpenses?: number } = {},
  ): SingleProjectResponse {
    return {
      data: this.transformer.transform(project, {
        expenses: (expense, project) =>
          this.buildExpensesResponse(expense, project, {
            offset: 0,
            total: totalExpenses,
          }),
      }),
      meta: this.buildSingleResponseMeta(project),
    };
  }

  buildExpensesResponse(
    expenseList: EnrichedExpenseModel[],
    project: Project,
    pagination: Pagination,
  ): ListExpenseResponse {
    const parent = `${this.mainPath}/${project.uuid}`;
    return {
      data: expenseList.map((expense) => {
        return {
          data: this.expensesTransformer.transform(expense, {
            project: { uuid: project.uuid },
          }),
          meta: {
            links: {
              self: `${parent}/expenses/${expense.uuid}`,
              list: `${parent}/expenses`,
              parent: `${parent}`,
            },
          },
        };
      }),
      meta: {
        pagination: this.buildExpensesPagination(expenseList, pagination),
        links: {
          self: `${parent}/expenses`,
          parent: parent,
        },
      },
    };
  }

  buildListResponse(
    projects: Project[],
    pagination: Pagination,
  ): ProjectsResponse {
    return {
      data: projects.map(this.buildSingleResponse.bind(this)),
      meta: this.buildListResponseMeta(projects, pagination),
    };
  }

  private buildSingleResponseMeta(project: Project): MetaDto {
    return {
      links: {
        self: `${this.mainPath}/${project.uuid}`,
        list: this.mainPath,
      },
    };
  }

  private buildListResponseMeta(
    projects: Project[],
    pagination: Pagination,
  ): MetaDto {
    return {
      links: {
        self: this.mainPath,
      },
      pagination: this.buildPagination(projects, pagination),
    };
  }

  private buildPagination(projects: Project[], pagination: Pagination) {
    const { total, offset } = pagination;
    return {
      totalItems: total,
      quantity: projects.length,
      previous: this.buildPreviousLink(this.projectListPathTemplate, {
        offset,
        quantity: projects.length,
      }),
      next: this.buildNextLink(this.projectListPathTemplate, {
        offset,
        quantity: projects.length,
        total,
      }),
    };
  }

  private buildExpensesPagination(
    expenses: EnrichedExpenseModel[],
    pagination: Pagination,
  ) {
    const { total, offset } = pagination;
    return {
      totalItems: total,
      quantity: expenses.length,
      previous: this.buildPreviousLink(this.expensesListPathTemplate, {
        offset,
        quantity: expenses.length,
      }),
      next: this.buildNextLink(this.expensesListPathTemplate, {
        offset,
        quantity: expenses.length,
        total,
      }),
    };
  }

  private buildPreviousLink(
    template: string,
    { offset, quantity }: { offset: number; quantity: number },
  ) {
    const previousOffset = Math.max(offset - quantity, 0);

    return this.buildLink(template, { offset: previousOffset, quantity });
  }

  private buildNextLink(
    template: string,
    {
      offset,
      quantity,
      total,
    }: { offset: number; quantity: number; total: number },
  ) {
    const previousOffset = offset + quantity;
    return previousOffset >= total
      ? null
      : this.buildLink(template, { offset: previousOffset, quantity });
  }

  private buildLink(template: string, keys: Record<string, string | number>) {
    let resultLink = template;
    for (const [key, value] of Object.entries(keys)) {
      resultLink = resultLink.replace(`:${key}:`, `${value}`);
    }
    return resultLink;
  }
}
