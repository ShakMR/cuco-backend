import { createMock } from '@golevelup/ts-jest';
import { DeepMocked } from '@golevelup/ts-jest/lib/mocks';
import { Test } from '@nestjs/testing';

import {
  createArrayOfMockProject,
  createMockProject,
} from '../../../project/__mocks__/project.model';
import { ProjectService } from '../../../project/service/project.service';
import { createMockUser } from '../../../user/__mocks__/user';
import { UserNotFoundException } from '../../../user/exceptions/user-not-found.exception';
import { UserService } from '../../../user/services/user.service';
import {
  createArrayOfMockParticipation,
  createMockParticipation,
} from '../../__mocks__/participation.model';
import { ParticipationNotFoundException } from '../../exceptions/participation-not-found.exception';
import { ParticipationRepository } from '../../repositories/participation.repository';
import { ParticipationImplService } from '../participation-impl.service';

describe('ParticipationImplService', () => {
  let service: ParticipationImplService;
  let repository: DeepMocked<ParticipationRepository>;
  let userService: DeepMocked<UserService>;
  let projectService: DeepMocked<ProjectService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ParticipationImplService,
        {
          provide: ParticipationRepository,
          useValue: createMock<ParticipationRepository>(),
        },
        { provide: ProjectService, useValue: createMock<ProjectService>() },
        { provide: UserService, useValue: createMock<UserService>() },
      ],
    }).compile();

    service = module.get<ParticipationImplService>(ParticipationImplService);
    repository = module.get<DeepMocked<ParticipationRepository>>(
      ParticipationRepository,
    );
    userService = module.get<DeepMocked<UserService>>(UserService);
    projectService = module.get<DeepMocked<ProjectService>>(ProjectService);
  });

  describe('create', () => {
    it('should throw error when adding user to closed project', () => {
      userService.getByUuid.mockResolvedValueOnce(createMockUser({}));
      projectService.getByUuid.mockResolvedValueOnce(
        createMockProject({ isOpen: false }),
      );

      expect(
        service.create({
          userUuid: 'uuid',
          projectUuid: 'uuid',
        }),
      ).rejects.toThrow('Project is closed, cannot add new users');
    });

    it('should not create a new participation if it already exists', async () => {
      userService.getByUuid.mockResolvedValueOnce(createMockUser({}));
      projectService.getByUuid.mockResolvedValueOnce(createMockProject({}));
      repository.findByUserAndProject.mockResolvedValueOnce(
        createMockParticipation({}),
      );

      await service.create({ userUuid: 'uuid', projectUuid: 'uuid' });

      expect(repository.save).not.toHaveBeenCalled();
    });

    it('should create a new participation if it does not exist', async () => {
      userService.getByUuid.mockResolvedValueOnce(createMockUser({ id: 1 }));
      projectService.getByUuid.mockResolvedValueOnce(
        createMockProject({ id: 2 }),
      );
      repository.findByUserAndProject.mockResolvedValueOnce(null);

      await service.create({ userUuid: 'uuid', projectUuid: 'uuid' });

      expect(repository.save).toHaveBeenCalledWith({
        user_id: 1,
        project_id: 2,
        share: 50,
      });
    });
  });

  describe('getParticipationForUserAndProject', () => {
    it('should return participation with user and project data', async () => {
      const mockUser = createMockUser({ id: 1 });
      const mockProject = createMockProject({ id: 2 });
      userService.getByUuid.mockResolvedValueOnce(mockUser);
      projectService.getByUuid.mockResolvedValueOnce(mockProject);
      repository.findByUserAndProject.mockResolvedValueOnce(
        createMockParticipation({ user: { id: 1 }, project: { id: 2 } }),
      );

      const participation = await service.getParticipationForUserAndProject(
        'uuid',
        'uuid',
      );

      expect(participation).toEqual({
        id: 1234,
        share: 50,
        joinedOn: new Date('2020-01-01'),
        user: mockUser,
        project: mockProject,
      });
    });

    it('should throw if call to a dependency fails', () => {
      userService.getByUuid.mockRejectedValueOnce(new Error('whatever'));

      expect(
        service.getParticipationForUserAndProject('uuid', 'uuid'),
      ).rejects.toThrow(ParticipationNotFoundException);

      userService.getByUuid.mockResolvedValueOnce(createMockUser({}));
      projectService.getByUuid.mockRejectedValueOnce(new Error('whatever'));

      expect(
        service.getParticipationForUserAndProject('uuid', 'uuid'),
      ).rejects.toThrow(ParticipationNotFoundException);

      userService.getByUuid.mockResolvedValueOnce(createMockUser({}));
      projectService.getByUuid.mockResolvedValueOnce(createMockProject({}));
      repository.findByUserAndProject.mockRejectedValueOnce(
        new Error('whatever'),
      );

      expect(
        service.getParticipationForUserAndProject('uuid', 'uuid'),
      ).rejects.toThrow(ParticipationNotFoundException);
    });
  });

  describe('getParticipationForUser', () => {
    it('should throw if user not found', () => {
      userService.getByUuid.mockResolvedValueOnce(null);

      expect(service.getParticipationForUser('uuid')).rejects.toThrow(
        UserNotFoundException,
      );
    });

    it('should return empty participation array if user has no participations yet', async () => {
      const mockUser = createMockUser({});
      userService.getByUuid.mockResolvedValue(mockUser);
      repository.findByUser.mockResolvedValue([]);

      const userParticipation = await service.getParticipationForUser('uuid');

      expect(userParticipation).toEqual({
        user: mockUser,
        participation: [],
      });
    });

    it('should return all projects in which the user is participating', async () => {
      const mockUser = createMockUser({});
      userService.getByUuid.mockResolvedValue(mockUser);
      const mockParticipation = createArrayOfMockParticipation([
        { id: 1234, project: { id: 1 }, user: { id: mockUser.id } },
        { id: 1234, project: { id: 2 }, user: { id: mockUser.id } },
      ]);
      repository.findByUser.mockResolvedValue(mockParticipation);

      const mockProjects = createArrayOfMockProject([{ id: 1 }, { id: 2 }]);
      projectService.getAllById.mockResolvedValueOnce(mockProjects);

      const participation = await service.getParticipationForUser('uuid');

      expect(projectService.getAllById).toHaveBeenCalledTimes(1);
      expect(participation).toEqual({
        user: mockUser,
        participation: [
          {
            share: 50,
            project: mockProjects[0],
            joinedOn: new Date('2020-01-01'),
          },
          {
            share: 50,
            project: mockProjects[1],
            joinedOn: new Date('2020-01-01'),
          },
        ],
      });
    });
  });
});
