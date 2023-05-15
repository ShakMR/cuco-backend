import { BaseUser, UserType } from '../../user.model';
import { UserTransformer } from '../user.transformer';

describe('UserTransformer', () => {
  it('should remove id and creation date from user', () => {
    const user: BaseUser = {
      type: UserType.user,
      id: 1234,
      uuid: 'uuid',
      createdAt: new Date(),
      externalId: 'externalId',
      email: 'email@example.com',
      name: 'name',
    };

    const transformer = new UserTransformer();

    const transUser = transformer.transform(user);

    expect(transUser).toEqual({
      type: UserType.user,
      uuid: 'uuid',
      externalId: 'externalId',
      email: 'email@example.com',
      name: 'name',
    });
  });
});
