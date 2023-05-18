import { ApiProperty } from '@nestjs/swagger';

import { ResponseDto } from '../common/dto/response.dto';
import { ProjectListDto } from '../project/dto/project-list.dto';
import { SingleProjectResponse } from '../project/dto/project.dto';
import { SingleUserResponse } from '../user/user.dto';

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

export class ParticipationInProject {
  @ApiProperty({
    type: ProjectListDto,
  })
  project: SingleProjectResponse;
  share: number;
}

export class UserParticipationDto {
  @ApiProperty({
    type: SingleProjectResponse,
  })
  user: SingleUserResponse;
  @ApiProperty({
    type: [ResponseDto<ParticipationInProject>],
  })
  participation: ResponseDto<ParticipationInProject>[];
}

export class UserParticipationResponse extends ResponseDto<UserParticipationDto> {
  @ApiProperty({
    type: UserParticipationDto,
  })
  data: UserParticipationDto;
}
