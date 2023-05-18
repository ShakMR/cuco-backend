import { Injectable } from '@nestjs/common';

import { UserDto } from '../user.dto';
import { BaseUser } from '../user.model';

@Injectable()
export class UserTransformer {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform({ id, createdAt, ...rest }: BaseUser): UserDto {
    return {
      ...rest,
    };
  }
}
