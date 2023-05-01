import { PaymentTypeName } from '../payment-type/payment-type.model';
import { ResponseDto } from '../common/dto/response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { CurrencyDto } from '../currency/currency.dto';
import { PaymentTypeDto } from '../payment-type/payment-type.dto';
import { UserDto } from '../user/user.dto';

export class ExpenseDto {
  @ApiProperty()
  uuid: string;
  @ApiProperty()
  amount: number;
  @ApiProperty()
  concept: string;
  @ApiProperty()
  createdAt: string | null;
  @ApiProperty({
    type: CurrencyDto,
  })
  currency?: CurrencyDto;
  @ApiProperty()
  date: Date;
  @ApiProperty({
    type: UserDto,
  })
  payer?: UserDto;
  @ApiProperty({
    type: PaymentTypeDto,
  })
  paymentType?: PaymentTypeDto;
}

export class CreateExpenseDto {
  @ApiProperty()
  amount: number;
  @ApiProperty()
  concept: string;
  @ApiProperty()
  currency?: string;
  @ApiProperty()
  date: Date;
  @ApiProperty({
    enum: PaymentTypeName,
  })
  paymentType?: PaymentTypeName;
}

export class ListExpenseResponse extends ResponseDto<ExpenseDto[]> {
  @ApiProperty({
    type: [ExpenseDto],
  })
  data: ExpenseDto[];
}

export class ExpenseResponse extends ResponseDto<ExpenseDto> {
  @ApiProperty({
    type: ExpenseDto,
  })
  data: ExpenseDto;
}
