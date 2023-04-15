import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DbConnector } from './db-connector';
import { SupabaseSingletonConnectorService } from './supabase/supabase-connector.service';
import { DbClient } from './db-client';
import { SupabaseService } from './supabase/supabase.service';
import LoggerModule from '../logger/logger.module';

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
