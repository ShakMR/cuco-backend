import { ProjectListDto } from '../dto/project-list.dto';
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
import { ProjectDto } from '../dto/project.dto';
import { ResponseDto } from '../../common/dto/response.dto';
import { ExpenseDto } from '../expenses/expense.dto';
import { ExpensesService } from '../expenses/expenses.service';
import { ExpenseTransformer } from '../expenses/expense.transformer';
import { ProjectDependenciesDto } from '../dto/project-dependencies.dto';

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
  ) {}

  @Get()
  async list(): Promise<ProjectListDto> {
    const projects = await this.service.getAll();

    return {
      data: projects.map((item) => this.transformer.transform(item)),
      meta: {},
    };
  }

  @Get('/:uuid')
  async get(
    @Param('uuid') uuid: string,
    @Query('includeExpenses') includeExpenses: boolean,
    @Query('includeCalculation') includeCalculations: boolean,
  ): Promise<ResponseDto<ProjectDto>> {
    const project = await this.service.getByUuid(uuid);

    let expenses = [];
    if (includeExpenses) {
      expenses = await this.expensesService.getFromProject(project.id);
    }

    project.expenses = expenses;

    return {
      data: this.transformer.transform(project, {
        expenses: expenses.map(this.expensesTransformer.transform),
      }),
      meta: {},
    };
  }

  @Get('/:uuid/expenses')
  async getExpenses(
    @Param('uuid') uuid: string,
    @Query('offset') offset = 0,
    @Query('howMany') howMany = 10,
  ): Promise<ResponseDto<ExpenseDto[]>> {
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
        this.expensesTransformer.transform(expense),
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
