import { Module } from '@nestjs/common';
import { DbModule } from '../db/db.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import { ProjectModule } from '../project/project.module';
import { ParticipationResponseBuilder } from './controllers/participation-response.builder';
import { ParticipationTransformer } from './controllers/participation.transformer';
import { ParticipationService } from './services/participation.service';
import { ParticipationImplService } from './services/participation-impl.service';
import { ParticipationRepository } from './repositories/participation.repository';
import { ParticipationImplRepository } from './repositories/participation-impl.repository';
import { ParticipationController } from './controllers/participation.controller';
import LoggerModule from '../logger/logger.module';

@Module({
  imports: [UserModule, ProjectModule, LoggerModule, DbModule, ConfigModule],
  controllers: [ParticipationController],
  providers: [
    ParticipationResponseBuilder,
    ParticipationTransformer,
    { provide: ParticipationService, useClass: ParticipationImplService },
    { provide: ParticipationRepository, useClass: ParticipationImplRepository },
  ],
})
export class ParticipationModule {}
