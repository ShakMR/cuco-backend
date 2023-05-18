import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DbModule } from '../db/db.module';
import { ExpensesModule } from '../expenses/expenses.module';
import LoggerModule from '../logger/logger.module';
import { ProjectExpensesController } from './controllers/project-expenses.controller';
import { ProjectResponseBuilder } from './controllers/project-response.builder';
import { ProjectController } from './controllers/project.controller';
import { ProjectTransformer } from './controllers/project.transformer';
import { ProjectImplRepository } from './repository/project-impl.repository';
import { ProjectRepository } from './repository/project.repository';
import { ProjectImplService } from './service/project-impl.service';
import { ProjectService } from './service/project.service';

@Module({
  imports: [ConfigModule.forRoot(), DbModule, ExpensesModule, LoggerModule],
  controllers: [ProjectController, ProjectExpensesController],
  providers: [
    {
      provide: ProjectService,
      useClass: ProjectImplService,
    },
    {
      provide: ProjectRepository,
      useClass: ProjectImplRepository,
    },
    ProjectResponseBuilder,
    ProjectTransformer,
  ],
  exports: [ProjectService, ProjectResponseBuilder],
})
export class ProjectModule {}
