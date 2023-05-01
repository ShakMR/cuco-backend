import { Transformer } from '../common/transformers/transformer';
import { Project } from './model/project.model';
import { ProjectDto } from './dto/project.dto';
import { ProjectDependenciesDto } from './dto/project-dependencies.dto';

export class ProjectTransformer
  implements Transformer<Project, ProjectDto, ProjectDependenciesDto>
{
  transform(item: Project, deps = { expenses: [] }): ProjectDto {
    return {
      name: item.name,
      uuid: item.uuid,
      expenses: deps.expenses,
      createdAt: item.createdAt,
      isOpen: item.isOpen,
    };
  }
}
