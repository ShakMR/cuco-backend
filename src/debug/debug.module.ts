import { Module } from '@nestjs/common';
import { MemoryDbModule } from '../db/memory-db/memory-db.module';
import { DebugController } from './debug.controller';
import { DebugService } from './debug.service';
import { ProdDebugService } from './prod-debug.service';
import * as process from 'process';
import {
  DebugExpensesRepository,
  DebugParticipationRepository,
  DebugProjectRepository,
  DebugUserRepository,
} from './repositories/debug.repository';

@Module({
  imports: [MemoryDbModule],
  controllers: [DebugController],
  providers: [
    {
      provide: DebugService,
      useClass:
        process.env.NODE_ENV !== 'production' ? DebugService : ProdDebugService,
    },
    DebugUserRepository,
    DebugProjectRepository,
    DebugExpensesRepository,
    DebugParticipationRepository,
  ],
})
export class DebugModule {}
