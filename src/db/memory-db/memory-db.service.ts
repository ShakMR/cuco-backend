import { Injectable, Scope } from '@nestjs/common';

import { DbClient, Filter } from '../db-client';
import EntityNotFoundException from '../exception/entity-not-found.exception';
import { MemoryDbRepository } from './memory-db.repository';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from '../../logger/logger.service';

export class MemoryNotFound extends EntityNotFoundException {}

@Injectable({
  scope: Scope.TRANSIENT,
})
export class MemoryDBService<Schema extends { id }> extends DbClient<
  Schema,
  number
> {
  private tableName: string;

  constructor(
    private repository: MemoryDbRepository,
    private config: ConfigService,
    private logger: LoggerService,
  ) {
    super();
    logger.debug('Starting with in memory DB');
  }

  get data(): Schema[] {
    this.logger.debug(`Getting data from ${this.tableName}`);
    const data = this.repository.getData(this.tableName);
    this.logger.debug(`Current data: ${JSON.stringify(data)}`);
    return data;
  }

  set data(data: Schema[]) {
    this.logger.debug(
      `Inserting data into ${this.tableName} - ${JSON.stringify(data)}`,
    );
    this.repository.setData(this.tableName, data);
  }

  initData(data: Schema[]) {
    this.data = data;
  }

  getTableName() {
    return this.tableName;
  }

  async find(filters: Filter<Schema>) {
    const all = await this.findAll(filters);

    return all[0];
  }

  private matchesAllProps(item: Schema, filters: Filter<Schema>): boolean {
    const filterKeys = Object.keys(filters);
    let matches = true;
    for (let i = 0; i < filterKeys.length && matches; i++) {
      const key = filterKeys[i];
      const filterValue = filters[key];
      matches =
        this.isNullOrUndefined(filterValue) || item[key] === filterValue;
    }
    return matches;
  }

  private isNullOrUndefined(value: null | undefined | any): boolean {
    return value === null || value === undefined;
  }

  async findAll(filters: Filter<Schema>): Promise<Schema[]> {
    return this.data.filter((item) => this.matchesAllProps(item, filters));
  }

  async findSet(column: keyof Schema, values: any[]): Promise<Schema[]> {
    return this.data.filter((item) => values.includes(item[column]));
  }

  async getAll(): Promise<Schema[]> {
    return this.data;
  }

  async getBy(filters: Filter<Schema>): Promise<Schema> {
    const response = await this.findAll(filters);

    if (!response || !response[0]) {
      throw new MemoryNotFound();
    }

    return response[0];
  }

  async getById(id: number): Promise<Schema> {
    const record = this.data[id - 1];

    if (!record) throw new MemoryNotFound();

    return record;
  }

  init(tableName: string) {
    this.tableName = tableName;
  }

  async save(newData: Partial<Schema>, persist = false): Promise<Schema> {
    const index = this.data.length;

    const newElement = { ...newData, id: newData.id || index + 1 } as Schema;

    if (persist || this.config.get('WRITE_IN_MEMORY_DATA')) {
      this.data = [
        ...this.data,
        {
          ...newElement,
          created_at: new Date(),
        },
      ];
    }

    return {
      ...newElement,
      created_at: new Date(),
    };
  }
}
