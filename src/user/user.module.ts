import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DbModule } from '../db/db.module';
import { UserResponseBuilder } from './controllers/user-response.builder';
import { UserController } from './controllers/user.controller';
import { UserTransformer } from './controllers/user.transformer';
import { UserImplRepository } from './repositories/user-impl-repository';
import { UserRepository } from './repositories/user.repository';
import { UserImplService } from './services/user-impl.service';
import { UserService } from './services/user.service';
import { EntityNotFoundExceptionFilter } from '../EntityNotFoundException.filter';
import LoggerModule from '../logger/logger.module';

@Module({
  imports: [DbModule, ConfigModule, LoggerModule],
  controllers: [UserController],
  providers: [
    EntityNotFoundExceptionFilter,
    {
      provide: UserService,
      useClass: UserImplService,
    },
    {
      provide: UserRepository,
      useClass: UserImplRepository,
    },
    UserTransformer,
    UserResponseBuilder,
  ],
  exports: [UserService, UserResponseBuilder],
})
export class UserModule {}
