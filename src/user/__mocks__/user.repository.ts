import { UserRepository } from '../repositories/user.repository';
import { BaseUser } from '../user.model';
import mockUser from './user';

export default class MockRepository extends UserRepository {
  constructor() {
    super();
  }

  getById(id: number): Promise<BaseUser> {
    return Promise.resolve({ ...mockUser, id });
  }

  save(user: Omit<BaseUser, 'id' | 'createdAt'>): Promise<BaseUser> {
    return Promise.resolve({ ...mockUser, ...user });
  }

  getByUuid(uuid: string) {
    return Promise.resolve({ ...mockUser, uuid });
  }

  findOne({ email }: { email: string }): Promise<BaseUser> {
    return Promise.resolve({ ...mockUser, email });
  }
}
