import { createMock } from '@golevelup/ts-jest';
import { DeepMocked } from '@golevelup/ts-jest/lib/mocks';
import { Test } from '@nestjs/testing';

import { DbClient } from '../../../db/db-client';
import EntityNotFoundException from '../../../db/exception/entity-not-found.exception';
import { Project } from '../../../db/schemas';
import {
  createArrayOfMockDBProject,
  createArrayOfMockProject,
  createMockDBProject,
  createMockProject,
} from '../../__mocks__/project.model';
import { ProjectNotFoundException } from '../../exceptions/project-not-found.exception';
import { ProjectImplRepository } from '../project-impl.repository';

describe('ProjectImplRepository', () => {
  let repository: ProjectImplRepository;
  let db: DeepMocked<DbClient<Project>>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ProjectImplRepository,
        { provide: DbClient, useValue: createMock(DbClient) },
      ],
    }).compile();

    repository = module.get<ProjectImplRepository>(ProjectImplRepository);
    db = module.get(DbClient);
  });

  describe('getAll', () => {
    it('should return all projects', async () => {
      const ids = [1, 2, 3].map((i) => ({ id: i }));
      const expectedProjects = createArrayOfMockProject(ids);
      db.getAll.mockResolvedValue(createArrayOfMockDBProject(ids));

      const projects = await repository.getAll();
      expect(projects).toHaveLength(3);
      expect(projects).toEqual(expectedProjects);
    });
  });

  describe('getByUuid', () => {
    it('should return project by uuid', async () => {
      const uuid = 'uuid';
      db.getBy.mockResolvedValueOnce(createMockDBProject({ uuid }));

      const project = await repository.getByUuid(uuid);
      expect(project.uuid).toEqual(uuid);
    });

    it('should throw if db throws', async () => {
      db.getBy.mockImplementationOnce(() => {
        throw new EntityNotFoundException();
      });

      await expect(repository.getByUuid('nothing')).rejects.toThrow(
        ProjectNotFoundException,
      );
    });
  });

  describe('save', () => {
    it('should save project', async () => {
      db.save.mockImplementationOnce((input) =>
        Promise.resolve(createMockDBProject({ ...input, id: 1 })),
      );

      await expect(
        repository.save({
          uuid: 'uuid',
          short_name: 'name',
          isOpen: true,
        }),
      ).resolves.toEqual(
        createMockProject({
          id: 1,
          uuid: 'uuid',
          shortName: 'name',
          isOpen: true,
        }),
      );
    });
  });

  describe('findProjectsByIds', () => {
    it('should return projects by ids', async () => {
      const projectIds = [{ id: 1 }, { id: 2 }];
      const expectedProjects = createArrayOfMockProject(projectIds);
      db.findSet.mockResolvedValueOnce(createArrayOfMockDBProject(projectIds));

      await expect(repository.findProjectsInListById([1, 2])).resolves.toEqual(
        expectedProjects,
      );
    });
  });

  describe('search', () => {
    it('should return project matching search', async () => {
      const expectedProject = createMockProject({ shortName: 'short' });
      db.findAll.mockResolvedValueOnce([
        createMockDBProject({ short_name: 'short' }),
      ]);

      await expect(repository.search({ shortName: 'short' })).resolves.toEqual([
        expectedProject,
      ]);
    });
  });
});
