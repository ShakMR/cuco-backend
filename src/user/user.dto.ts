import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

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
  @ApiProperty({ required: true })
  name: string;
  @ApiProperty({ required: true })
  @IsEmail()
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
