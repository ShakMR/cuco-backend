import { ApiProperty, OmitType } from '@nestjs/swagger';
import { ListExpenseResponse } from '../../expenses/expense.dto';
import { ResponseDto } from '../../common/dto/response.dto';

export class ProjectDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  uuid: string;
  @ApiProperty({
    type: ListExpenseResponse,
  })
  expenses?: ListExpenseResponse;
  @ApiProperty()
  isOpen: boolean;
  @ApiProperty()
  createdAt: Date;
}

export class CreateProjectDto {
  @ApiProperty()
  name: string;
}

export class SingleProjectResponse extends ResponseDto<ProjectDto> {
  @ApiProperty({
    type: ProjectDto,
  })
  data: ProjectDto;
}

export class SingleProjectWithoutExpenses extends ResponseDto<
  Omit<ProjectDto, 'expenses'>
> {
  @ApiProperty({
    type: OmitType(ProjectDto, ['expenses' as const]),
  })
  data: Omit<ProjectDto, 'expenses'>;
}

export class CreateProjectResponse extends ResponseDto<ProjectDto> {
  @ApiProperty({
    type: OmitType(ProjectDto, ['expenses'] as const),
  })
  data: Omit<ProjectDto, 'expenses'>;
}

export class ProjectsResponse extends ResponseDto<
  SingleProjectWithoutExpenses[]
> {
  @ApiProperty({
    type: [SingleProjectWithoutExpenses],
  })
  data: SingleProjectWithoutExpenses[];
}
