import { ApiProperty } from '@nestjs/swagger';

import { ResponseDto } from '../../common/dto/response.dto';
import { ListExpenseResponse } from '../../expenses/dto/expense.dto';
import { IsNotEmpty } from 'class-validator';

export class ProjectDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  uuid: string;
  @ApiProperty()
  isOpen: boolean;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  shortName: string;
}

export class CreateProjectDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;
}

export class SingleProjectResponse extends ResponseDto<ProjectDto> {
  @ApiProperty({
    type: ProjectDto,
  })
  data: ProjectDto;
  @ApiProperty({
    type: ListExpenseResponse,
  })
  expenses?: ListExpenseResponse;
}

export class SingleProjectWithoutExpenses extends ResponseDto<ProjectDto> {
  @ApiProperty({
    type: ProjectDto,
  })
  data: ProjectDto;
}

export class CreateProjectResponse extends ResponseDto<ProjectDto> {
  @ApiProperty({
    type: ProjectDto,
  })
  data: ProjectDto;
}

export class ProjectsResponse extends ResponseDto<
  SingleProjectWithoutExpenses[]
> {
  @ApiProperty({
    type: [SingleProjectWithoutExpenses],
  })
  data: SingleProjectWithoutExpenses[];
  @ApiProperty({
    type: ListExpenseResponse,
  })
  expenses?: ListExpenseResponse;
}
