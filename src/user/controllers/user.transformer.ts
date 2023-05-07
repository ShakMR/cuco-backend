import { Injectable } from '@nestjs/common';
import { BaseUser, User } from '../user.model';
import { UserDto } from '../user.dto';

@Injectable()
export class UserTransformer {
  transform({ id, createdAt, ...rest }: BaseUser): UserDto {
    return {
      ...rest,
    };
  }
}