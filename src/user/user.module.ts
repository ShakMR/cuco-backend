import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserImplService } from './user-impl.service';
import { UserRepository } from './user.repository';
import { UserImplRespository } from './user-impl.respository';
import { DbModule } from '../db/db.module';

@Module({
  imports: [DbModule],
  providers: [
    {
      provide: UserService,
      useClass: UserImplService,
    },
    {
      provide: UserRepository,
      useClass: UserImplRespository,
    },
  ],
  exports: [UserService],
})
export class UserModule {}
