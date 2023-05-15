import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ParticipationResponseBuilder } from './participation-response.builder';
import {
  CreateParticipationDto,
  SingleParticipationResponse,
  UserParticipationResponse,
} from '../participation.dto';
import { ParticipationService } from '../services/participation.service';
import { LoggerService } from '../../logger/logger.service';
import { NotFoundException as EntityNotFound } from '../../common/exceptions/NotFoundException';

@ApiTags('participations')
@Controller('participations')
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
  async createParticipation(@Body() body: CreateParticipationDto) {
    try {
      const participation = await this.service.create(body);
      return this.responseBuilder.buildSingleParticipation(participation);
    } catch (e) {
      if (e instanceof EntityNotFound) {
        this.logger.error(e.message, e.context);
        throw new NotFoundException(this.responseBuilder.buildError(e));
      }

      throw new Error(e);
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
}
