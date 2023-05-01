import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import {
  CreateExpenseDto,
  ExpenseResponse,
  ListExpenseResponse,
} from '../../expenses/expense.dto';
import { ExpenseTransformer } from '../../expenses/expense.transformer';
import { LoggerService } from '../../logger/logger.service';
import { ProjectService } from '../service/project.service';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('projects', 'expenses')
@Controller('/projects/:p_uuid/expenses')
export class ProjectExpensesController {
  constructor(
    private service: ProjectService,
    private transformer: ExpenseTransformer,
    private logger: LoggerService,
  ) {
    logger.setContext(ProjectExpensesController.name);
  }

  @ApiResponse({
    status: 200,
    description: 'Returns data for the expense matching uuid',
    type: ListExpenseResponse,
  })
  @ApiResponse({ status: 404, description: 'Project not found' })
  @ApiResponse({
    status: 400,
    description: 'Expense does not belong to project',
  })
  @Get(':uuid')
  async getOne(
    @Param('p_uuid') projectUuid,
    @Param('uuid') uuid: string,
  ): Promise<ExpenseResponse> {
    const expense = await this.service.getExpense(projectUuid, uuid);

    if (!expense) {
      this.logger.log(`Couldn't find entry with uuid ${uuid}`);
      throw new NotFoundException();
    }

    return {
      data: this.transformer.transform(expense, {
        project: { uuid: projectUuid },
      }),
      meta: {},
    };
  }

  @ApiResponse({
    status: 200,
    description: 'List of projects',
    type: ExpenseResponse,
  })
  @Post()
  @ApiBody({ type: CreateExpenseDto })
  async postExpense(
    @Param('p_uuid') projectUuid: string,
    @Body() toCreate: CreateExpenseDto,
  ): Promise<ExpenseResponse> {
    const expense = await this.service.addNewExpenseToProject(projectUuid, {
      amount: toCreate.amount,
      currencyName: toCreate.currency,
      paymentTypeName: toCreate.paymentType.toString(),
      date: new Date(toCreate.date),
      concept: toCreate.concept,
      payerId: 1, // TODO add user id when middleware is added,
    });

    return {
      data: this.transformer.transform(expense, {
        project: { uuid: projectUuid },
      }),
      meta: {},
    };
  }
}
