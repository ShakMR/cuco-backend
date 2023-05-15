import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserImplService } from './services/user-impl.service';
import { UserRepository } from './repositories/user.repository';
import { UserImplRepository } from './repositories/user-impl-repository.service';
import { DbModule } from '../db/db.module';
import { UserController } from './controllers/user.controller';
import { UserTransformer } from './controllers/user.transformer';
import { UserResponseBuilder } from './controllers/user-response.builder';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [DbModule, ConfigModule],
  controllers: [UserController],
  providers: [
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
