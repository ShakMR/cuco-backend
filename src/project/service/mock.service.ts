import { ProjectService } from './project.service';
import { Project } from '../model/project.model';
import { Injectable } from '@nestjs/common';

const projects = [
  {
    id: 1,
    name: 'Project1',
    uuid: '00000000-0000-0000-0000-000000000000',
    expenses: [],
    isOpen: true,
    createdAt: new Date('2023-01-01'),
  },
  {
    id: 2,
    name: 'Project2',
    uuid: '00000000-0000-0000-0000-000000000001',
    expenses: [],
    isOpen: true,
    createdAt: new Date('2023-01-03'),
  },
];

@Injectable()
export class MockService extends ProjectService {
  async getAll(): Promise<Project[]> {
    return Promise.resolve(projects);
  }

  getByUuid(uuid: string): Promise<Project> {
    return Promise.resolve(undefined);
  }
}
