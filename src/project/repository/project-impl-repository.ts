import { ProjectRepository } from './project.repository';
import { DbClient } from '../../db/db-client';
import { Project, ProjectCreate } from '../../db/schemas';
import { Project as ProjectModel } from '../model/project.model';
import { Injectable } from '@nestjs/common';
import { ProjectNotFoundException } from '../exceptions/project-not-found.exception';
import { SBNotFound } from '../../db/supabase/supabase.service';

@Injectable()
export class ProjectImplRepository extends ProjectRepository {
  constructor(private db: DbClient<Project, ProjectNotFoundException>) {
    super();
  }

  onModuleInit() {
    this.db.init('Project');
  }

  static map({ created_at, ...rest }: Project): ProjectModel {
    return {
      ...rest,
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
      return ProjectImplRepository.map(await this.db.find({ uuid }));
    } catch (e) {
      if (e instanceof SBNotFound) {
        throw new ProjectNotFoundException({ uuid });
      }
    }
  }

  async save(project: ProjectCreate) {
    return ProjectImplRepository.map(await this.db.save(project));
  }
}
