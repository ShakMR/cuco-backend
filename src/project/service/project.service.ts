import { Project } from '../model/project.model';

export abstract class ProjectService {
  abstract getAll(): Promise<Project[]>;

  abstract getByUuid(uuid: string): Promise<Project>;
}
