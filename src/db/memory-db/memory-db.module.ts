import { Module } from '@nestjs/common';

import { DbClient } from '../db-client';
import { MemoryDBService } from './memory-db.service';
import { MemoryDbRepository } from './memory-db.repository';

@Module({
  providers: [
    { provide: DbClient, useClass: MemoryDBService },
    MemoryDbRepository,
  ],
  exports: [DbClient],
})
export class MemoryDbModule {}
