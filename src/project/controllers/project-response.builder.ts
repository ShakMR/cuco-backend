import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { MetaDto } from '../../common/dto/response.dto';
import { replaceInTemplate } from '../../common/utils/replaceInTemplate';
import { ListExpenseResponse } from '../../expenses/dto/expense.dto';
import { EnrichedExpenseModel } from '../../expenses/expense.model';
import { ExpenseTransformer } from '../../expenses/expense.transformer';
import { ProjectsResponse, SingleProjectResponse } from '../dto/project.dto';
import { Project } from '../model/project.model';
import { ProjectTransformer } from './project.transformer';

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
    '/:p_uuid:/expenses?offset=:offset:&quantity=:quantity:';

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
    const response: SingleProjectResponse = {
      data: this.transformer.transform(project),
      meta: this.buildSingleResponseMeta(project),
    };

    if (project.expenses) {
      const pagination = {
        offset: 0,
        total: totalExpenses,
      };
      response.expenses = this.buildExpensesResponse(
        project.expenses,
        project,
        pagination,
      );
    }

    return response;
  }

  buildExpensesResponse(
    expenseList: EnrichedExpenseModel[],
    project: Project,
    pagination: Pagination,
  ): ListExpenseResponse {
    const parent = `${this.mainPath}/${project.uuid}`;
    const projectExpensesTemplate = replaceInTemplate(
      this.expensesListPathTemplate,
      { p_uuid: project.uuid },
    );
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
        pagination:
          expenseList?.length > 0
            ? this.buildExpensesPagination(
                expenseList,
                pagination,
                projectExpensesTemplate,
              )
            : undefined,
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
    baseUrlTemplate: string,
  ) {
    const { total, offset } = pagination;
    return {
      totalItems: total,
      quantity: expenses.length,
      previous: this.buildPreviousLink(baseUrlTemplate, {
        offset,
        quantity: expenses.length,
      }),
      next: this.buildNextLink(baseUrlTemplate, {
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
    return replaceInTemplate(template, keys);
  }
}
