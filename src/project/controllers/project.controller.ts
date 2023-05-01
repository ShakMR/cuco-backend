import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { ProjectService } from '../service/project.service';
import { Transformer } from '../../common/transformers/transformer';
import { Project } from '../model/project.model';
import {
  ProjectDto,
  ProjectsResponse,
  SingleProjectResponse,
} from '../dto/project.dto';
import { ListExpenseResponse } from '../../expenses/expense.dto';
import { ExpensesService } from '../../expenses/expenses.service';
import { ExpenseTransformer } from '../../expenses/expense.transformer';
import { ProjectDependenciesDto } from '../dto/project-dependencies.dto';
import { LoggerService } from '../../logger/logger.service';
import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('projects')
@Controller('projects')
export class ProjectController {
  constructor(
    private service: ProjectService,
    private expensesService: ExpensesService,
    private transformer: Transformer<
      Project,
      ProjectDto,
      ProjectDependenciesDto
    >,
    private expensesTransformer: ExpenseTransformer,
    private logger: LoggerService,
  ) {
    logger.setContext(ProjectController.name);
  }

  @ApiOkResponse({
    description: 'All the projects available',
    type: ProjectsResponse,
  })
  @Get()
  async list() {
    this.logger.log('Getting projects');
    const projects = await this.service.getAll();

    return {
      data: projects.map((item) => this.transformer.transform(item)),
      meta: {},
    };
  }

  @ApiOkResponse({
    description: 'Project data',
    type: SingleProjectResponse,
  })
  @ApiResponse({ status: 404, description: 'Project not found' })
  @Get('/:uuid')
  async get(
    @Param('uuid') uuid: string,
    @Query('includeExpenses') includeExpenses: boolean,
    @Query('includeCalculation') includeCalculations: boolean,
  ) {
    const project = await this.service.getByUuid(uuid, { includeExpenses });

    return {
      data: this.transformer.transform(project, {
        expenses: project.expenses.map((expense) =>
          this.expensesTransformer.transform(expense, {
            project: { uuid },
          }),
        ),
      }),
      meta: {},
    };
  }

  @ApiTags('expenses')
  @ApiOkResponse({
    description: 'List of expenses of a project',
    type: ListExpenseResponse,
  })
  @Get('/:uuid/expenses')
  async getExpenses(
    @Param('uuid') uuid: string,
    @Query('offset') offset = 0,
    @Query('howMany') howMany = 10,
  ): Promise<ListExpenseResponse> {
    const project = await this.service.getByUuid(uuid);
    if (!project) {
      throw new HttpException(
        `Project with uuid ${uuid} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    const expenses = await this.expensesService.getFromProject(project.id, {
      howMany,
      offset,
    });

    return {
      data: expenses.map((expense) =>
        this.expensesTransformer.transform(expense, {
          project: { uuid },
        }),
      ),
      meta: {
        pagination: {
          totalItems: expenses.length,
          quantity: expenses.length, // TODO do proper pagination
          next: `/projects/${uuid}/expenses?howMany${howMany}&offset=${Math.min(
            howMany + offset,
            expenses.length,
          )}`,
          previous: `/projects/${uuid}/expenses?howMany${howMany}&offset=${Math.max(
            offset - howMany,
            0,
          )}`,
        },
        links: {
          next: `/projects/${uuid}/expenses?howMany${howMany}&offset=${Math.min(
            howMany + offset,
            expenses.length,
          )}`,
          parent: `/projects/${uuid}/`,
          self: `/projects/${uuid}/expenses`,
        },
      },
    };
  }
}
