import { ApiProperty } from '@nestjs/swagger';

import { ResponseDto } from '../common/dto/response.dto';
import { ProjectListDto } from '../project/dto/project-list.dto';
import {
  SingleProjectResponse,
  SingleProjectWithoutExpenses,
} from '../project/dto/project.dto';
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

export class Participant {
  @ApiProperty({
    type: SingleUserResponse,
  })
  user: SingleUserResponse;
  @ApiProperty()
  share: number;
  @ApiProperty({
    type: Date,
  })
  joinedOn: Date;
}

export class ParticipantDto extends ResponseDto<Participant> {
  @ApiProperty({ type: Participant })
  data: Participant;
}

export class ParticipantInProjectDto extends ResponseDto<ParticipationInProject> {
  @ApiProperty({ type: ParticipationInProject })
  data: ParticipationInProject;
}

export class UserParticipationDto {
  @ApiProperty({
    type: SingleUserResponse,
  })
  user: SingleUserResponse;
  @ApiProperty({
    type: [ParticipantInProjectDto],
  })
  participation: ParticipantInProjectDto[];
}

export class ProjectParticipationDto {
  @ApiProperty({
    type: SingleProjectWithoutExpenses,
  })
  project: SingleProjectWithoutExpenses;
  @ApiProperty({
    type: [ParticipantDto],
  })
  participants: ParticipantDto[];
}

export class UserParticipationResponse extends ResponseDto<UserParticipationDto> {
  @ApiProperty({
    type: UserParticipationDto,
  })
  data: UserParticipationDto;
}

export class ProjectParticipantsResponse extends ResponseDto<ProjectParticipationDto> {
  @ApiProperty({
    type: ProjectParticipationDto,
  })
  data: ProjectParticipationDto;
}
