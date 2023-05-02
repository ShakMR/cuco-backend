import { ApiProperty } from '@nestjs/swagger';

class LinkDto {
  @ApiProperty()
  self: string;
  @ApiProperty()
  next?: string;
  @ApiProperty()
  parent?: string;
  @ApiProperty()
  list?: string;
}

class PaginationDto {
  totalItems: number;
  next: string;
  previous: string;
  quantity: number;
}

export class  MetaDto {
  @ApiProperty()
  pagination?: PaginationDto;
  @ApiProperty()
  links?: LinkDto;
}

export class ResponseDto<T> {
  @ApiProperty()
  data: T;
  @ApiProperty()
  meta: MetaDto;
}
