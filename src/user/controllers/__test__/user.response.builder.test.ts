import { ConfigService } from '@nestjs/config';

import { BaseUser, UserType } from '../../user.model';
import { UserResponseBuilder } from '../user-response.builder';
import { UserTransformer } from '../user.transformer';

class MockConfigService extends ConfigService {
  get(varName: string): string {
    return varName;
  }
}

class MockUserTransformer extends UserTransformer {
  transform(user: BaseUser): any {
    return jest.fn().mockImplementation(() => ({ id: user.id }))();
  }
}

describe('UserResponseBuilder', () => {
  it('should be created', () => {
    const responseBuilder = new UserResponseBuilder(
      new MockConfigService(),
      new MockUserTransformer(),
    );

    expect(responseBuilder).not.toBe(null);
  });

  describe('buildSingleResponse', () => {
    let transformer;
    let response;

    beforeEach(() => {
      transformer = new MockUserTransformer();
      const responseBuilder = new UserResponseBuilder(
        new MockConfigService(),
        transformer,
      );

      response = responseBuilder.buildSingleResponse({
        type: UserType.user,
        id: 1234,
        uuid: 'uuid',
        createdAt: new Date(),
        externalId: 'externalId',
        email: 'email@example.com',
        name: 'name',
        active: true,
      });
    });

    it('response should contain transformed user data', () => {
      expect(response.data).toEqual({
        id: 1234,
      });
    });

    it('response should contain metadata links', () => {
      expect(response.meta).toEqual({
        links: {
          self: '/API_PREFIX/users/uuid',
          list: '/API_PREFIX/users',
        },
      });
    });
  });
});
