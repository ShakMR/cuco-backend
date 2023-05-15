import { DbClient, Filter } from '../db-client';

interface Entity {
  id: number;
}

export type EntityFactory<Schema extends Entity> = (
  data: Partial<Schema>,
) => Schema;

export default class MockDBClient<
  Schema extends Entity,
> extends DbClient<Schema> {
  constructor(private factory: EntityFactory<Schema>) {
    super();
  }

  init(tableName: string) {
    // NOOP
  }

  getById(id: number): Promise<Schema> {
    return Promise.resolve(this.factory({ id } as Schema));
  }

  getBy(filters: Filter<Schema>): Promise<Schema> {
    return Promise.resolve(this.factory(filters as Schema));
  }

  save(newData: any): Promise<Schema> {
    return Promise.resolve(newData);
  }

  find(filters: Filter<Schema>, extraSelect: string[] | undefined) {}

  findAll(filters: Filter<Schema>, extraSelect: string[] | undefined) {}

  findSet(column: keyof Schema, values: any[]): Promise<Schema[]> {
    return Promise.resolve([]);
  }

  getAll(): Promise<Schema[]> {
    return Promise.resolve([]);
  }
}
