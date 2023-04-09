import { DbClient } from '../db-client';
import {
  SupabaseClient as SBClient,
  SupabaseClient,
} from '@supabase/supabase-js';
import { PostgrestQueryBuilder } from '@supabase/postgrest-js';
import { GenericSchema } from '@supabase/supabase-js/dist/main/lib/types';
import { Injectable } from '@nestjs/common';
import { DbConnector } from '../db-connector';
import { Database } from './database.types';

@Injectable()
export class SupabaseService<Schema extends GenericSchema> extends DbClient<
  Schema,
  number
> {
  private table: PostgrestQueryBuilder<Schema, any>;
  protected client: SBClient;

  constructor(private connector: DbConnector<SupabaseClient<Database>>) {
    super();
  }

  async init(tableName: string) {
    const client = this.connector.getClient();
    this.table = await client.from(tableName);
  }

  async getAll(): Promise<Schema[]> {
    const response = await this.table.select();
    if (response.error) {
      throw response.error;
    }
    return response.data;
  }

  getById(id: number): any {
    return this.table.select();
  }
}
