import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { NotFoundException as EntityNotFound } from '../../common/exceptions/NotFoundException';
import { LoggerService } from '../../logger/logger.service';
import {
  CreateParticipationDto,
  ProjectParticipantsResponse,
  SetUserParticipationDto,
  SingleParticipationResponse,
  UserParticipationResponse,
} from '../participation.dto';
import { ParticipationService } from '../services/participation.service';
import { ParticipationResponseBuilder } from './participation-response.builder';

@ApiTags('participation')
@Controller('participation')
export class ParticipationController {
  constructor(
    private logger: LoggerService,
    private service: ParticipationService,
    private responseBuilder: ParticipationResponseBuilder,
  ) {}

  @Post()
  @ApiOkResponse({
    type: SingleParticipationResponse,
  })
  @ApiBody({
    type: CreateParticipationDto,
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  async createParticipation(@Body() body: CreateParticipationDto) {
    try {
      const participation = await this.service.create(body);
      return this.responseBuilder.buildSingleParticipation(participation);
    } catch (e) {
      if (e instanceof EntityNotFound) {
        this.logger.error(e.message, e.context);
        throw new NotFoundException(this.responseBuilder.buildError(e));
      }

      throw e;
    }
  }

  @Get()
  @ApiOkResponse({
    type: SingleParticipationResponse,
  })
  async searchOne(
    @Query('user') userId: string,
    @Query('project') projectId: string,
  ): Promise<SingleParticipationResponse> {
    try {
      const participation =
        await this.service.getParticipationForUserAndProject(userId, projectId);
      return this.responseBuilder.buildSingleParticipation(participation);
    } catch (e) {
      if (e instanceof EntityNotFound) {
        this.logger.log(e.message, e.context);
        throw new NotFoundException(this.responseBuilder.buildError(e));
      }

      throw e;
    }
  }

  @Get('/user/:uuid')
  @ApiOkResponse({
    type: UserParticipationResponse,
  })
  async getUserParticipation(
    @Param('uuid') uuid: string,
  ): Promise<UserParticipationResponse> {
    const userParticipation = await this.service.getParticipationForUser(uuid);
    return this.responseBuilder.buildUserParticipationResponse(
      userParticipation,
    );
  }

  @Get('/project/:uuid')
  @ApiOkResponse({
    type: ProjectParticipantsResponse,
  })
  async getProjectParticipants(
    @Param('uuid') uuid: string,
  ): Promise<ProjectParticipantsResponse> {
    const projectParticipants =
      await this.service.getParticipantsForProject(uuid);
    return this.responseBuilder.buildProjectParticipantsResponse(
      projectParticipants,
    );
  }

  @Put('/project/:uuid')
  @ApiOkResponse({})
  @ApiBody({
    type: [SetUserParticipationDto],
  })
  async setProjectParticipationShare(
    @Param('uuid') uuid: string,
    @Body() projectParticipationShare: SetUserParticipationDto[],
  ): Promise<void> {
    const total = projectParticipationShare.reduce(
      (total, projectParticipationShare) =>
        total + projectParticipationShare.share,
      0,
    );

    if (total > 100 || total < 0) {
      throw new Error(
        'The sum of all users participation share is not between 100 and 0',
      );
    }

    await this.service.setParticipationShare(uuid, projectParticipationShare);
  }
}
