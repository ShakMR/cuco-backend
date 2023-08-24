import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import LoggerModule from '../logger/logger.module';
import { DbClient } from './db-client';
import { DbConnector } from './db-connector';
import { SupabaseSingletonConnectorService } from './supabase/supabase-connector.service';
import { SupabaseService } from './supabase/supabase.service';
import { MemoryDBService } from './memory-db/memory-db.service';
import * as process from 'process';
import { MemoryDbModule } from './memory-db/memory-db.module';

@Module({
  imports: [
    ConfigModule,
    LoggerModule,
    process.env.MEMORY_DB === 'true' ? MemoryDbModule : null,
  ],
  providers: [
    {
      provide: DbConnector,
      useClass: SupabaseSingletonConnectorService,
    },
    {
      provide: DbClient,
      useClass:
        process.env.MEMORY_DB === 'true' ? MemoryDBService : SupabaseService,
    },
  ],
  exports: [DbClient],
})
export class DbModule {}
