export type Filter<T> = Partial<T>;

export abstract class DbClient<Schema, ID = number> {
  abstract init(tableName: string);

  abstract getAll(): Promise<Schema[]>;

  abstract getById(id: ID): Promise<Schema>;

  abstract find(filters: Filter<Schema>, extraSelect?: string[]);

  abstract findAll(filters: Filter<Schema>, extraSelect?: string[]);
}
