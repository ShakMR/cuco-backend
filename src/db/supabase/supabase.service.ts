import { DbClient, Filter } from '../db-client';
import {
  SupabaseClient as SBClient,
  SupabaseClient,
} from '@supabase/supabase-js';
import { PostgrestQueryBuilder } from '@supabase/postgrest-js';
import { GenericSchema } from '@supabase/supabase-js/dist/main/lib/types';
import { Injectable, Scope } from '@nestjs/common';
import { DbConnector } from '../db-connector';
import { Database } from './database.types';
import { LoggerService } from '../../logger/logger.service';

function buildSelectExtra(selectExtra: string[]) {
  return ['*', ...selectExtra.map((extra) => `${extra}(*)`)].join(', ');
}

@Injectable({
  scope: Scope.TRANSIENT,
})
export class SupabaseService<Schema extends GenericSchema> extends DbClient<
  Schema,
  number
> {
  private table: PostgrestQueryBuilder<Schema, any>;
  private tableName: string;

  constructor(
    private connector: DbConnector<SupabaseClient<Database>>,
    private logger: LoggerService,
  ) {
    super();
    logger.setContext(SupabaseService.name);
  }

  async init(tableName: string) {
    const client = this.connector.getClient();
    this.table = await client.from(tableName);
    this.tableName = tableName;
  }

  async getAll(): Promise<Schema[]> {
    return await this.findAll({});
  }

  async getById(id: number): Promise<Schema> {
    const response = await this.find({ id } as unknown as Schema);

    return response;
  }

  async find(
    filters: Filter<Schema>,
    extraSelect: string[] = [],
  ): Promise<any> {
    const response = await this.findAll(filters, extraSelect);

    return response[0];
  }

  async findAll(
    filters: Filter<Schema>,
    extraSelect: string[] = [],
  ): Promise<any[]> {
    const queryBuilder = this.table.select(buildSelectExtra(extraSelect));
    for (const filter in filters) {
      queryBuilder.eq(filter, filters[filter]);
    }

    const response = await queryBuilder;
    if (response.error) {
      throw response.error;
    }

    this.logger.debug(
      `${this.tableName} getAll ${JSON.stringify(filters)}: amount ${
        response.data.length
      }`,
    );
    return response.data;
  }

  async save(newDate: any): Promise<Schema> {
    const response = await this.table.insert(newDate).select();

    if (response.error) {
      throw response.error;
    }

    return response.data[0];
  }
}
