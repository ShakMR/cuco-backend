import { Module } from '@nestjs/common';
import { PassportService } from './service/passport.service';
import { UserModule } from '../user/user.module';
import { PassportImplService } from './service/passport-impl.service';
import { PassportRepository } from './repository/passport.repository';
import { PassportImplRepository } from './repository/passport-impl.repository';
import { DbModule } from '../db/db.module';
import { PassportController } from './controllers/passport.controller';

@Module({
  imports: [DbModule, UserModule],
  controllers: [PassportController],
  providers: [
    {
      provide: PassportRepository,
      useClass: PassportImplRepository,
    },
    {
      provide: PassportService,
      useClass: PassportImplService,
    },
  ],
  exports: [PassportService],
})
export class PassportModule {}
