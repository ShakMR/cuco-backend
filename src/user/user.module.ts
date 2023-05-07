import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserImplService } from './user-impl.service';
import { UserRepository } from './user.repository';
import { UserImplRespository } from './user-impl.respository';
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
      useClass: UserImplRespository,
    },
    UserTransformer,
    UserResponseBuilder,
  ],
  exports: [UserService],
})
export class UserModule {}
