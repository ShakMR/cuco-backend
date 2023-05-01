import { ApiProperty, OmitType } from '@nestjs/swagger';
import { ExpenseDto } from '../../expenses/expense.dto';
import { MetaDto, ResponseDto } from '../../common/dto/response.dto';

export class ProjectDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  uuid: string;
  @ApiProperty({
    type: [ExpenseDto],
  })
  expenses?: ExpenseDto[];
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

export class CreateProjectResponse extends ResponseDto<ProjectDto> {
  @ApiProperty({
    type: OmitType(ProjectDto, ['expenses'] as const),
  })
  data: Omit<ProjectDto, 'expenses'>;
}

export class ProjectsResponse extends ResponseDto<ProjectDto[]> {
  @ApiProperty({
    type: [OmitType(ProjectDto, ['expenses' as const])],
  })
  data: Omit<ProjectDto, 'expenses'>[];
  meta: MetaDto;
}
