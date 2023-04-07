export interface ResponseDto<T, MetaT extends MetaDto = MetaDto> {
  data: T;
  meta: MetaT;
}

export interface MetaDto {
  pagination?: PaginationDto;
  links?: LinkDto;
}

interface LinkDto {
  self: string;
  next: string;
  parent: string;
}

interface PaginationDto {
  totalItems: number;
  next: string;
  previous: string;
  quantity: number;
}