import { rm } from 'node:fs/promises';
import { join } from 'node:path';

const basePath = join('/', 'tmp', 'e2e.db');
afterAll(async () => {
  jest.getRealSystemTime();
  await rm(basePath, { force: true, recursive: true })
    .then(() => console.log('deleted'))
    .catch((e) => console.error(e));
});
