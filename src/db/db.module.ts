import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import LoggerModule from '../logger/logger.module';
import { DbClient } from './db-client';
import { DbConnector } from './db-connector';
import { SupabaseSingletonConnectorService } from './supabase/supabase-connector.service';
import { SupabaseService } from './supabase/supabase.service';

@Module({
  imports: [ConfigModule.forRoot(), LoggerModule],
  providers: [
    {
      provide: DbConnector,
      useClass: SupabaseSingletonConnectorService,
    },
    {
      provide: DbClient,
      useClass: SupabaseService,
    },
  ],
  exports: [DbClient],
})
export class DbModule {}
