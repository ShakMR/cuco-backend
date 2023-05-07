import { SingleUserResponse, UserDto } from '../user/user.dto';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { ProjectDto, SingleProjectResponse } from '../project/dto/project.dto';
import { ResponseDto } from '../common/dto/response.dto';

export class ParticipationDto {
  @ApiProperty({
    type: SingleUserResponse,
  })
  user: SingleUserResponse;
  @ApiProperty({
    type: SingleProjectResponse,
  })
  project: SingleProjectResponse;
  @ApiProperty({
    type: Date,
  })
  joinedOn: Date;
}

export class SingleParticipationResponse extends ResponseDto<ParticipationDto> {
  @ApiProperty({
    type: ParticipationDto,
  })
  data: ParticipationDto;
}

export class CreateParticipationDto {
  @ApiProperty()
  userUuid: string;
  @ApiProperty()
  projectUuid: string;
}