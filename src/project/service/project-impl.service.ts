import { ProjectService } from './project.service';
import { Project } from '../model/project.model';
import { Injectable } from '@nestjs/common';
import { ProjectRepository } from '../repository/project.repository';

@Injectable()
export class ProjectImplService extends ProjectService {
  constructor(private repository: ProjectRepository) {
    super();
  }

  getAll(): Promise<Project[]> {
    return this.repository.getAll();
  }

  getByUuid(uuid: string) {
    return this.repository.getByUuid(uuid);
  }
}
