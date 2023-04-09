import { Controller, Get, Param } from '@nestjs/common';
import { ResponseDto } from '../../common/dto/response.dto';
import { ExpenseDto } from './expense.dto';
import { ExpensesService } from './expenses.service';
import { ExpenseTransformer } from './expense.transformer';

@Controller('expenses')
export class ExpensesController {
  constructor(
    private service: ExpensesService,
    private transformer: ExpenseTransformer,
  ) {}

  @Get(':uuid')
  async getOne(@Param('uuid') uuid: string): Promise<ResponseDto<ExpenseDto>> {
    const expense = await this.service.getByUuid(uuid);

    return {
      data: this.transformer.transform(expense),
      meta: {},
    };
  }
}
