import { createMock } from '@golevelup/ts-jest';
import { DeepMocked } from '@golevelup/ts-jest/lib/mocks';
import { Test } from '@nestjs/testing';

import { DbClient } from '../../../db/db-client';
import EntityNotFoundException from '../../../db/exception/entity-not-found.exception';
import { User } from '../../../db/schemas';
import { SBNotFound } from '../../../db/supabase/supabase.service';
import { createMockDBUser, createMockUser } from '../../__mocks__/user';
import { UserNotFoundException } from '../../exceptions/user-not-found.exception';
import { UserType } from '../../user.model';
import { UserImplRepository } from '../user-impl-repository';

describe('UserImplRepository', () => {
  let mockDbClient: DeepMocked<DbClient<User>>;
  let repository: DeepMocked<UserImplRepository>;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserImplRepository,
        { provide: DbClient, useValue: createMock(DbClient) },
      ],
    }).compile();

    mockDbClient = module.get(DbClient);
    repository = module.get(UserImplRepository);
  });

  describe('getById', () => {
    it('should return a user with the id', async () => {
      const expectedUser = createMockUser({ id: 4321 });
      mockDbClient.getById.mockResolvedValueOnce(
        createMockDBUser({ id: 4321 }),
      );
      const user = await repository.getById(4321);

      expect(user).toEqual(expectedUser);
    });

    it('should map ghost user properly', async () => {
      jest
        .spyOn(mockDbClient, 'getById')
        .mockResolvedValueOnce(createMockDBUser({ is_ghost: true }));
      const expectedUser = createMockUser({ type: UserType.ghost });
      const user = await repository.getById(1234);

      expect(user).toEqual(expectedUser);
    });

    it('throws if ID is not found', async () => {
      jest.spyOn(mockDbClient, 'getById').mockImplementationOnce(() => {
        throw new EntityNotFoundException();
      });

      await expect(repository.getById(12341231)).rejects.toBeInstanceOf(
        UserNotFoundException,
      );
    });
  });

  describe('getByUuid', () => {
    it('should return a user with the uid', async () => {
      const expectedUser = createMockUser({ uuid: 'uuid-new' });
      mockDbClient.getBy.mockResolvedValueOnce(
        createMockDBUser({ uuid: 'uuid-new' }),
      );
      const user = await repository.getByUuid('uuid-new');

      expect(user).toEqual(expectedUser);
    });

    it('throws if UUID is not found', async () => {
      jest.spyOn(mockDbClient, 'getBy').mockImplementationOnce(() => {
        throw new SBNotFound();
      });

      await expect(repository.getByUuid('non-existent')).rejects.toBeInstanceOf(
        UserNotFoundException,
      );
    });
  });
});
