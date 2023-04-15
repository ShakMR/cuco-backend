import { Module } from '@nestjs/common';
import { ProjectController } from './controllers/project.controller';
import { ProjectService } from './service/project.service';
import { ProjectTransformer } from './project.transformer';
import { Transformer } from '../common/transformers/transformer';
import { ProjectRepository } from './repository/project.repository';
import { ProjectImplRepository } from './repository/project-impl-repository';
import { DbModule } from '../db/db.module';
import { ProjectImplService } from './service/project-impl.service';
import { ExpensesModule } from '../expenses/expenses.module';
import LoggerModule from '../logger/logger.module';
import { ProjectExpensesController } from './controllers/project-expenses.controller';

@Module({
  imports: [DbModule, ExpensesModule, LoggerModule],
  controllers: [ProjectController, ProjectExpensesController],
  providers: [
    {
      provide: ProjectService,
      useClass: ProjectImplService,
    },
    {
      provide: Transformer,
      useClass: ProjectTransformer,
    },
    {
      provide: ProjectRepository,
      useClass: ProjectImplRepository,
    },
  ],
})
export class ProjectModule {}
