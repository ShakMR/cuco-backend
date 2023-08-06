import { existsSync, writeFileSync, readFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

export class MemoryDbRepository {
  private data: Record<string, any>;
  private readonly basePath: string;

  constructor() {
    this.data = {};
    this.basePath = join('/', 'tmp', 'e2e.db');

    existsSync(this.basePath) || mkdirSync(this.basePath);
  }

  setData(tableName, data: any) {
    writeFileSync(join(this.basePath, tableName), JSON.stringify(data));
  }

  getData(tableName) {
    const fileName = join(this.basePath, tableName);
    if (existsSync(fileName)) {
      const content = readFileSync(fileName, {
        encoding: 'utf8',
      });
      return JSON.parse(content || '[]').map(({ created_at, ...rest }) => ({
        created_at: new Date(created_at),
        ...rest,
      }));
    }

    return [];
  }
}
