import { Module } from '@nestjs/common';

import { DbClient } from '../db-client';
import { MemoryDBService } from './memory-db.service';
import { MemoryDbRepository } from './memory-db.repository';
import { ConfigModule } from '@nestjs/config';
import LoggerModule from '../../logger/logger.module';

@Module({
  imports: [ConfigModule.forRoot(), LoggerModule],
  providers: [
    { provide: DbClient, useClass: MemoryDBService },
    MemoryDbRepository,
  ],
  exports: [DbClient, MemoryDbRepository],
})
export class MemoryDbModule {}
