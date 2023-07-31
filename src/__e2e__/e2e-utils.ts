import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { DbModule } from '../db/db.module';
import { MemoryDbModule } from '../db/memory-db/memory-db.module';

export const initApp = async function () {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideModule(DbModule)
    .useModule(MemoryDbModule)
    .compile();

  const app = moduleFixture.createNestApplication();
  await app.init();

  return { app };
};
