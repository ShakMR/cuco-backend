import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { DbModule } from '../db/db.module';
import { MemoryDbModule } from '../db/memory-db/memory-db.module';
import { DbClient } from '../db/db-client';
import { MemoryDBService } from '../db/memory-db/memory-db.service';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';

export const initApp = async function <T extends { id }>() {
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

type RequestOptions = {
  path: string;
  body?: any;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
};

type RequestCreationOptions = {
  login: boolean;
};

export type CustomRequest = Awaited<ReturnType<typeof createRequestSender>>;

export const createRequestSender = async (
  app: INestApplication,
  { login }: RequestCreationOptions,
) => {
  let token: string;

  if (login) {
    const loginResponse = await request(app.getHttpServer())
      .post('/login')
      .send({
        email: 'e2e@test.com',
        password: 'testpassword',
      });

    token = loginResponse.body.token;
  }

  return ({ path, body, method }: RequestOptions) => {
    const req = request(app.getHttpServer());

    let requestWithMethod;
    switch (method) {
      case 'GET':
        requestWithMethod = req.get(path);
        break;
      case 'DELETE':
        requestWithMethod = req.delete(path);
        break;
      case 'POST':
        requestWithMethod = req.post(path).send(body);
        break;
      case 'PUT':
        requestWithMethod = req.put(path).send(body);
        break;
      default:
        requestWithMethod = req.get(path);
    }

    return requestWithMethod.set('Authorization', 'Bearer ' + token);
  };
};
