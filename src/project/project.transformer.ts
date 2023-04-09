import { Transformer } from '../common/transformers/transformer';
import { Project } from './model/project.model';
import { ProjectDto } from './dto/project.dto';

export class ProjectTransformer implements Transformer<Project, ProjectDto> {
  transform(item: Project): ProjectDto {
    return {
      name: item.name,
      uuid: item.uuid,
      expenses: item.expenses,
      createdAt: item.createdAt,
    };
  }
}
