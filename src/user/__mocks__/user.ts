import { User } from '../../db/schemas';
import { BaseUser, UserType } from '../user.model';

export const mockDBUser: User = {
  id: 1234,
  uuid: 'uuid',
  created_at: new Date().toISOString(),
  external_id: 'externalId',
  email: 'email@example.com',
  name: 'name',
  is_ghost: false,
  active: true,
};

const mockUser: BaseUser = {
  type: UserType.user,
  id: 1234,
  uuid: 'uuid',
  createdAt: new Date(),
  externalId: 'externalId',
  email: 'email@example.com',
  name: 'name',
  active: true,
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { uuid, ..._userWithoutUuid } = mockUser;

export default mockUser;
export const userWithoutUuid = _userWithoutUuid;

export const createMockUser = (data: Partial<BaseUser>): BaseUser => ({
  ...mockUser,
  ...data,
});

export const createMockDBUser = (data: Partial<User>): User => ({
  ...mockDBUser,
  ...data,
});
