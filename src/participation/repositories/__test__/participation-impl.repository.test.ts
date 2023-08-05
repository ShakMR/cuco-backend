import { createMock } from '@golevelup/ts-jest';
import { DeepMocked } from '@golevelup/ts-jest/lib/mocks';
import { Test } from '@nestjs/testing';

import { DbClient } from '../../../db/db-client';
import { Participation } from '../../../db/schemas';
import {
  createArrayOfMockDBParticipation,
  createMockDBParticipation,
  createMockParticipation,
} from '../../__mocks__/participation.model';
import { ParticipationImplRepository } from '../participation-impl.repository';

describe('ParticipationImplRepository', () => {
  let repository: ParticipationImplRepository;
  let db: DeepMocked<DbClient<Participation>>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ParticipationImplRepository,
        { provide: DbClient, useValue: createMock(DbClient) },
      ],
    }).compile();

    repository = module.get<ParticipationImplRepository>(
      ParticipationImplRepository,
    );
    db = module.get(DbClient);
  });

  describe('findByUser', () => {
    it('should return all user participation', async () => {
      const expectedParticipation = createMockParticipation({
        id: 1,
        user: { id: 1 },
      });

      db.findAll.mockResolvedValueOnce(
        createArrayOfMockDBParticipation([{ id: 1, user_id: 1 }]),
      );

      const actualParticipation = await repository.findByUser(1);

      expect(actualParticipation).toHaveLength(1);
      expect(actualParticipation).toEqual([expectedParticipation]);
      expect(db.findAll).toHaveBeenCalledWith({ user_id: 1 });
    });
  });

  describe('findByUserAndProject', () => {
    it('should return participation matching user and project', async () => {
      const expectedParticipation = createMockParticipation({
        id: 1,
        user: { id: 1 },
        project: { id: 1 },
      });

      db.find.mockResolvedValueOnce(
        createMockDBParticipation({ id: 1, user_id: 1, project_id: 1 }),
      );

      const actualParticipation = await repository.findByUserAndProject(1, 1);

      expect(actualParticipation).toEqual(expectedParticipation);
      expect(db.find).toHaveBeenCalledWith({ user_id: 1, project_id: 1 });
    });
  });

  describe('save', () => {
    it('should save and return participation ', async () => {
      const expectedParticipation = createMockParticipation({
        id: 1,
        user: { id: 1 },
        project: { id: 1 },
      });

      db.save.mockImplementationOnce((input) =>
        Promise.resolve(createMockDBParticipation({ ...input, id: 1 })),
      );

      const actualParticipation = await repository.save({
        user_id: 1,
        share: 50,
      });

      expect(actualParticipation).toMatchObject(expectedParticipation);
      expect(db.save).toHaveBeenCalled();
    });
  });
});
