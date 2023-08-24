import { Injectable, Scope } from '@nestjs/common';

import { DbClient, Filter } from '../db-client';
import EntityNotFoundException from '../exception/entity-not-found.exception';
import { MemoryDbRepository } from './memory-db.repository';
import { ConfigService } from '@nestjs/config';

export class MemoryNotFound extends EntityNotFoundException {}

@Injectable({
  scope: Scope.TRANSIENT,
})
export class MemoryDBService<Schema> extends DbClient<Schema, number> {
  private tableName: string;

  constructor(
    private repository: MemoryDbRepository,
    private config: ConfigService,
  ) {
    super();
  }

  get data(): Schema[] {
    return this.repository.getData(this.tableName);
  }

  set data(data: Schema[]) {
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
    const keys = Object.keys(filters);
    let matches = true;
    for (let i = 0; i < keys.length && matches; i++) {
      const key = keys[i];
      matches = item[key] === filters[key];
    }
    return matches;
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

    const newElement = { ...newData, id: index + 1 } as Schema;

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
