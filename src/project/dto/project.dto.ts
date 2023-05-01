import { ApiProperty } from '@nestjs/swagger';
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
  createdAt: Date;
}

export class SingleProjectResponse extends ResponseDto<ProjectDto> {
  @ApiProperty({
    type: ProjectDto,
  })
  data: ProjectDto;
}

export class ProjectsResponse extends ResponseDto<ProjectDto[]> {
  @ApiProperty({
    type: [ProjectDto],
  })
  data: ProjectDto[];
  meta: MetaDto;
}
