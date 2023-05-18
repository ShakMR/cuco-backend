import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { ResponseDto } from '../common/dto/response.dto';
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

export class CreateUserDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  email: string;
  @ApiProperty({
    enum: UserType,
  })
  type: UserType;
  @ApiProperty()
  externalId: string;
}

export class SingleUserResponse extends ResponseDto<UserDto> {
  @ApiProperty({
    type: UserDto,
  })
  data: UserDto;
}
