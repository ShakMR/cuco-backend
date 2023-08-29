import { Injectable } from '@nestjs/common';

import { DbClient } from '../../db/db-client';
import { Project, ProjectCreate, ProjectsTable } from '../../db/schemas';
import { ProjectNotFoundException } from '../exceptions/project-not-found.exception';
import { Project as ProjectModel } from '../model/project.model';
import { ProjectRepository } from './project.repository';
import EntityNotFoundException from '../../db/exception/entity-not-found.exception';

@Injectable()
export class ProjectImplRepository extends ProjectRepository {
  constructor(private db: DbClient<Project>) {
    super();
    this.db.init(ProjectsTable);
  }

  static map({ created_at, short_name, ...rest }: Project): ProjectModel {
    return {
      ...rest,
      shortName: short_name,
      createdAt: new Date(created_at),
      expenses: [],
    };
  }

  async getAll(): Promise<ProjectModel[]> {
    const m = await this.db.getAll();
    return m.map(ProjectImplRepository.map);
  }

  async getByUuid(uuid: string): Promise<ProjectModel> {
    try {
      return ProjectImplRepository.map(await this.db.getBy({ uuid }));
    } catch (e) {
      if (e instanceof EntityNotFoundException) {
        throw new ProjectNotFoundException({ uuid });
      }
    }
  }

  async save(project: ProjectCreate) {
    return ProjectImplRepository.map(await this.db.save(project));
  }

  async findProjectsInListById(projectIds: number[]): Promise<ProjectModel[]> {
    const projects = await this.db.findSet('id', projectIds);

    return projects.map(ProjectImplRepository.map);
  }

  async search(param: { shortName?: string; name?: string }) {
    const filters: { short_name?: string; name?: string } = {};
    if (param.shortName) {
      filters.short_name = param.shortName;
    }
    if (param.name) {
      filters.name = param.name;
    }
    const projects = await this.db.findAll(filters);

    return projects.map(ProjectImplRepository.map);
  }
}
