import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserType } from './user.model';
import { ResponseDto } from '../common/dto/response.dto';

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
