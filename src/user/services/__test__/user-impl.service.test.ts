import { expectedUuidString } from '../../../common/utils/test.utils';
import { userWithoutUuid } from '../../__mocks__/user';
import MockRepository from '../../__mocks__/user.repository';
import { UserImplService } from '../user-impl.service';
import { UserService } from '../user.service';
import { UserRepository } from '../../repositories/user.repository';
import { EmailAlreadyRegisteredException } from '../../exceptions/EmailAlreadyRegisteredException';

describe('UserServiceImpl', () => {
  let service: UserService;
  let mockRepository: UserRepository;
  let findOneSpy: jest.SpyInstance;

  beforeEach(() => {
    mockRepository = new MockRepository();
    jest.spyOn(mockRepository, 'getById');
    jest.spyOn(mockRepository, 'getByUuid');
    jest.spyOn(mockRepository, 'save');
    findOneSpy = jest.spyOn(mockRepository, 'findOne');
    service = new UserImplService(mockRepository);
  });

  describe('getById', () => {
    it('should return user by with that id', async () => {
      const user = await service.getById(9999);

      expect(user.id).toBe(9999);
      expect(mockRepository.getById).toHaveBeenCalled();
    });
  });

  describe('getByUuid', () => {
    it('should return user by with that id', async () => {
      const user = await service.getByUuid('string uuid');

      expect(user.uuid).toBe('string uuid');
      expect(mockRepository.getByUuid).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should save user with a unique uuid', async () => {
      findOneSpy.mockResolvedValueOnce(null);
      const newUser = await service.create(userWithoutUuid);

      expect(newUser.uuid).toEqual(expectedUuidString());
      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ uuid: expectedUuidString() }),
      );
    });

    it('should throw error on duplicated email', async () => {
      findOneSpy.mockResolvedValueOnce({});
      await expect(service.create(userWithoutUuid)).rejects.toEqual(
        new EmailAlreadyRegisteredException({ email: userWithoutUuid.email }),
      );
    });
  });
});
