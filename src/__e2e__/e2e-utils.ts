import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { DbModule } from '../db/db.module';
import { MemoryDbModule } from '../db/memory-db/memory-db.module';
import { DbClient } from '../db/db-client';
import { MemoryDBService } from '../db/memory-db/memory-db.service';

export const initApp = async function <T = any>() {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideModule(DbModule)
    .useModule(MemoryDbModule)
    .compile();

  const app = moduleFixture.createNestApplication();
  await app.init();
  const db = (await moduleFixture.resolve(DbClient)) as MemoryDBService<T>;

  return { app, db };
};
