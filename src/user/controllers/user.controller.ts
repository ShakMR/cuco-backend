import {
  Body,
  Controller,
  Get,
  Injectable,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';

import { UserService } from '../services/user.service';
import { CreateUserDto, SingleUserResponse } from '../user.dto';
import { UserResponseBuilder } from './user-response.builder';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(
    private service: UserService,
    private responseBuilder: UserResponseBuilder,
  ) {}

  @Post()
  @ApiBody({
    type: CreateUserDto,
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  async createUser(
    @Body() userDto: CreateUserDto,
  ): Promise<SingleUserResponse> {
    const newUser = await this.service.create(userDto);

    return this.responseBuilder.buildSingleResponse(newUser);
  }

  @Get('/:uuid')
  @ApiOkResponse({
    description: 'User Data',
    type: SingleUserResponse,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUser(@Param('uuid') uuid: string): Promise<SingleUserResponse> {
    const user = await this.service.getByUuid(uuid);

    return this.responseBuilder.buildSingleResponse(user);
  }
}
