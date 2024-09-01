import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DbModule } from '../db/db.module';
import LoggerModule from '../logger/logger.module';
import { ProjectModule } from '../project/project.module';
import { UserModule } from '../user/user.module';
import { ParticipationResponseBuilder } from './controllers/participation-response.builder';
import { ParticipationController } from './controllers/participation.controller';
import { ParticipationTransformer } from './controllers/participation.transformer';
import { ParticipationImplRepository } from './repositories/participation-impl.repository';
import { ParticipationRepository } from './repositories/participation.repository';
import { ParticipationImplService } from './services/participation-impl.service';
import { ParticipationService } from './services/participation.service';
import { ExpensesModule } from '../expenses/expenses.module';

@Module({
  imports: [
    UserModule,
    ProjectModule,
    ExpensesModule,
    LoggerModule,
    DbModule,
    ConfigModule,
  ],
  controllers: [ParticipationController],
  providers: [
    ParticipationResponseBuilder,
    ParticipationTransformer,
    { provide: ParticipationService, useClass: ParticipationImplService },
    { provide: ParticipationRepository, useClass: ParticipationImplRepository },
  ],
})
export class ParticipationModule {}
