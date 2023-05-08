import { DbClient, Filter } from '../db-client';
import { SupabaseClient } from '@supabase/supabase-js';
import { PostgrestQueryBuilder } from '@supabase/postgrest-js';
import { GenericSchema } from '@supabase/supabase-js/dist/main/lib/types';
import { Injectable, Scope } from '@nestjs/common';
import { DbConnector } from '../db-connector';
import { Database } from './database.types';
import { LoggerService } from '../../logger/logger.service';

function buildSelectExtra(selectExtra: string[]) {
  return ['*', ...selectExtra.map((extra) => `${extra}(*)`)].join(', ');
}

export class SBNotFound extends Error {}

@Injectable({
  scope: Scope.TRANSIENT,
})
export class SupabaseService<Schema extends GenericSchema> extends DbClient<
  Schema,
  number
> {
  private table: PostgrestQueryBuilder<Schema, any>;
  private tableName: string;
  private client: SupabaseClient;

  constructor(
    private connector: DbConnector<SupabaseClient<Database>>,
    private logger: LoggerService,
  ) {
    super();
    logger.setContext(SupabaseService.name);
    this.client = this.connector.getClient();
  }

  async init(tableName: string) {
    this.tableName = tableName;
  }

  private async getClient() {
    return this.client.from(this.tableName);
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
  ): Promise<Schema> {
    const response = await this.findAll(filters, extraSelect);

    if (!response[0]) {
      throw new SBNotFound();
    }

    return response[0];
  }

  async findAll(
    filters: Filter<Schema>,
    extraSelect: string[] = [],
  ): Promise<Schema[]> {
    const tableClient = await this.getClient();
    const queryBuilder = tableClient.select(buildSelectExtra(extraSelect));
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
    return response.data as unknown as Schema[];
  }

  async save(newData: any): Promise<Schema> {
    const tableClient = await this.getClient();
    const response = await tableClient.insert(newData).select();

    if (response.error) {
      throw response.error;
    }

    return response.data[0];
  }
}
