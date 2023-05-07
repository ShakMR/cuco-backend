export type Filter<T> = Partial<T>;

export abstract class DbClient<Schema, ID = number, CreateSchema = any> {
  abstract init(tableName: string);

  abstract getAll(): Promise<Schema[]>;

  abstract getById(id: ID): Promise<Schema>;

  abstract find(filters: Filter<Schema>, extraSelect?: string[]);

  abstract findAll(filters: Filter<Schema>, extraSelect?: string[]);

  abstract save(newData: CreateSchema): Promise<Schema>;

  abstract findSet(column: keyof Schema, values: any[]): Promise<Schema[]>;
}
