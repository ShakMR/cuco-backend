import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

import { DbConnector } from '../db-connector';
import { Database } from './database.types';

@Injectable()
export class SupabaseSingletonConnectorService extends DbConnector<
  SupabaseClient<Database>
> {
  public client: SupabaseClient;

  constructor(private configService: ConfigService) {
    super();
  }

  getClient() {
    if (!this.client) {
      this.client = createClient(
        this.configService.get('SUPABASE_HOST'),
        this.configService.get('SUPABASE_KEY'),
      );
    }

    return this.client;
  }
}
