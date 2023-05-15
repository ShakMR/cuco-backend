import entityFactory from '../../common/__mocks__/entity.factory';
import { Project } from '../../db/schemas';
import { Project as ProjectModel } from '../model/project.model';

const mockProject: ProjectModel = {
  id: 1234,
  isOpen: true,
  name: 'Project Name',
  createdAt: new Date('2020-01-01T00:00:00.000Z'),
  uuid: 'uuid',
  expenses: [],
  shortName: 'project-name',
};

export default mockProject;

export const createMockProject = entityFactory(mockProject);
export const createArrayOfMockProject = (entities: Partial<ProjectModel>[]) =>
  entities.map(createMockProject);

const mockDBProject: Project = {
  id: 1234,
  isOpen: true,
  name: 'Project Name',
  created_at: '2020-01-01T00:00:00.000Z',
  uuid: 'uuid',
  short_name: 'project-name',
};

export const createMockDBProject = entityFactory(mockDBProject);
export const createArrayOfMockDBProject = (entities: Partial<Project>[]) =>
  entities.map(createMockDBProject);
