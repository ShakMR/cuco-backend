import { ProjectDto } from './project.dto';
import { ResponseDto } from '../../common/dto/response.dto';

export type ProjectListDto = ResponseDto<ProjectList>;

type ProjectList = ProjectDto[];
