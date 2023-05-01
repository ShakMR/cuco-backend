import { ProjectCreate } from '../../db/schemas';

export abstract class ProjectRepository {
  abstract getAll();

  abstract getByUuid(uuid: string);

  abstract save(project: ProjectCreate);
}
