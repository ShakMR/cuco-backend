import { ApiProperty } from '@nestjs/swagger';



import { ResponseDto } from '../../common/dto/response.dto';
import { CurrencyDto } from '../../currency/currency.dto';
import { PaymentTypeDto } from '../../payment-type/payment-type.dto';
import { PaymentTypeName } from '../../payment-type/payment-type.model';
import { UserDto } from '../../user/user.dto';


export class ExpenseDto {
  @ApiProperty()
  uuid: string;
  @ApiProperty()
  amount: number;
  @ApiProperty()
  concept: string;
  @ApiProperty()
  createdAt: Date;
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

export class ExpenseResponse extends ResponseDto<ExpenseDto> {
  @ApiProperty({
    type: ExpenseDto,
  })
  data: ExpenseDto;
}

export class ListExpenseResponse extends ResponseDto<ExpenseResponse[]> {
  @ApiProperty({
    type: [ExpenseResponse],
  })
  data: ExpenseResponse[];
}
