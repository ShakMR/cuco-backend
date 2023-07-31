import { Injectable, Scope } from '@nestjs/common';

import { DbClient, Filter } from '../db-client';
import EntityNotFoundException from '../exception/entity-not-found.exception';

export class MemoryNotFound extends EntityNotFoundException {}

@Injectable({
  scope: Scope.TRANSIENT,
})
export class MemoryDBService<Schema> extends DbClient<Schema, number> {
  private data: Schema[] = [];
  private tableName: string;

  constructor() {
    super();
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

  async save(newData: Partial<Schema>): Promise<Schema> {
    const index = this.data.length;

    const newElement = { id: index + 1, ...newData } as Schema;

    this.data.push(newElement);

    return newElement;
  }
}
