import MockDBClient from '../../../db/__mocks__/db-client';
import { User } from '../../../db/schemas';
import { SBNotFound } from '../../../db/supabase/supabase.service';
import {
  createMockDBUser,
  createMockUser,
  mockDBUser,
} from '../../__mocks__/user';
import { UserNotFoundException } from '../../exceptions/user-not-found.exception';
import { UserType } from '../../user.model';
import { UserImplRepository } from '../user-impl-repository.service';

const factory = (data: User) => {
  return { ...mockDBUser, ...data };
};

describe('UserImplRepository', () => {
  let mockDbClient;
  let repository;
  beforeEach(() => {
    mockDbClient = new MockDBClient<User>(factory);
    repository = new UserImplRepository(mockDbClient);
  });

  describe('getById', () => {
    it('should return a user with the id', async () => {
      const expectedUser = createMockUser({ id: 4321 });
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
        throw new SBNotFound();
      });

      await expect(repository.getById(12341231)).rejects.toBeInstanceOf(
        UserNotFoundException,
      );
    });
  });

  describe('getByUuid', () => {
    it('should return a user with the uid', async () => {
      const expectedUser = createMockUser({ uuid: 'uuid-new' });
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
