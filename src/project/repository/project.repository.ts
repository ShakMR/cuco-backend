import { ProjectCreate } from '../../db/schemas';
import { Project as ProjectModel } from '../model/project.model';

export abstract class ProjectRepository {
  abstract getAll();

  abstract getByUuid(uuid: string);

  abstract save(project: ProjectCreate);

  abstract findProjectsInListById(
    projectIds: number[],
  ): Promise<ProjectModel[]>;

  abstract search(param: { shortName?: string; name?: string });
}
