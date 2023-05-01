import { ApiProperty } from '@nestjs/swagger';
import { UserType } from './user.model';

export class UserDto {
  @ApiProperty()
  uuid: string;
  @ApiProperty()
  name: string;
  @ApiProperty({
    enum: UserType,
  })
  type: UserType;
}
