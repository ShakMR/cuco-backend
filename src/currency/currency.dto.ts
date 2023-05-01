import { ApiProperty } from '@nestjs/swagger';

export class CurrencyDto {
  @ApiProperty()
  name: string;
}
