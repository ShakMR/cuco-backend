import { Injectable } from '@nestjs/common';
import { BaseUser } from '../user.model';
import { UserDto } from '../user.dto';

@Injectable()
export class UserTransformer {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform({ id, createdAt, ...rest }: BaseUser): UserDto {
    return {
      ...rest,
    };
  }
}