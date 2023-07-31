import { Module } from '@nestjs/common';

import { DbClient } from '../db-client';
import { MemoryDBService } from './memory-db.service';

@Module({
  providers: [{ provide: DbClient, useClass: MemoryDBService }],
  exports: [DbClient],
})
export class MemoryDbModule {}
