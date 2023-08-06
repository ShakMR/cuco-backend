import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ListExpenseResponse } from '../../expenses/dto/expense.dto';
import { ExpenseTransformer } from '../../expenses/expense.transformer';
import { ExpensesService } from '../../expenses/service/expenses.service';
import { LoggerService } from '../../logger/logger.service';
import {
  CreateProjectDto,
  CreateProjectResponse,
  ProjectsResponse,
  SingleProjectResponse,
} from '../dto/project.dto';
import { ProjectService } from '../service/project.service';
import { ProjectResponseBuilder } from './project-response.builder';
import { ProjectTransformer } from './project.transformer';

@ApiTags('projects')
@Controller('projects')
export class ProjectController {
  constructor(
    private service: ProjectService,
    private expensesService: ExpensesService,
    private transformer: ProjectTransformer,
    private expensesTransformer: ExpenseTransformer,
    private responseBuilder: ProjectResponseBuilder,
    private logger: LoggerService,
  ) {
    logger.setContext(ProjectController.name);
  }

  @ApiOkResponse({
    description: 'All the projects available without expenses list',
    type: ProjectsResponse,
  })
  @Get()
  async list(): Promise<ProjectsResponse> {
    const projects = await this.service.getAll();

    return this.responseBuilder.buildListResponse(projects, {
      offset: 0,
      total: projects.length,
    });
  }

  @Get('search')
  @ApiOkResponse({
    type: ProjectsResponse,
  })
  async searchProject(
    @Query('shortName') shortName: string,
    @Query('includeExpenses') includeExpenses: boolean,
  ): Promise<ProjectsResponse> {
    const projects = await this.service.searchByShortName(shortName, {
      includeExpenses,
    });

    return this.responseBuilder.buildListResponse(projects, {
      offset: 0,
      total: projects.length,
    });
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
    // @Query('includeExpenseSummary') includeExpenseSummary: boolean,
  ) {
    const project = await this.service.getByUuid(uuid, { includeExpenses });

    return this.responseBuilder.buildSingleResponse(project);
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

    return this.responseBuilder.buildExpensesResponse(expenses, project, {
      offset,
      quantity: howMany,
      total: expenses.length,
    });
  }

  @Post()
  @ApiBody({ type: CreateProjectDto })
  @ApiOkResponse({
    description: 'Create a project',
    type: CreateProjectResponse,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'A project with that name already exists',
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  async createProject(
    @Body() projectData: CreateProjectDto,
  ): Promise<CreateProjectResponse> {
    const project = await this.service.create({
      name: projectData.name,
    });

    return this.responseBuilder.buildSingleResponse(project);
  }
}
