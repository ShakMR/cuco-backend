export abstract class DbClient<Schema, ID = number> {
  abstract init(tableName: string);
  abstract getAll(): Promise<Schema[]>;
  abstract getById(id: ID): Schema;
}
