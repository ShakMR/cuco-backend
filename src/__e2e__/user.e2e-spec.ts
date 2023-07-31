import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { initApp } from './e2e-utils';

describe('UserController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const config = await initApp();
    app = config.app;
  });

  it('POST - /users/ - 200', async () => {
    const userData = {
      name: 'test',
      email: 'email@test.com',
      type: 'user',
      externalId: 'externalId',
    };
    const res = await request(app.getHttpServer())
      .post('/users/')
      .send(userData);

    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({
      data: {
        ...userData,
        uuid: expect.any(String),
      },
      meta: expect.any(Object),
    });
  });

  it('GET - /users/:uuid - 404', async () => {
    const res = await request(app.getHttpServer()).get('/users/uuid-0').send();

    expect(res.statusCode).toBe(404);
  });

  it('GET - /users/:uuid - 200', async () => {
    const userData = {
      name: 'test',
      email: 'email@test.com',
      type: 'user',
      externalId: 'externalId',
    };
    const postResponse = await request(app.getHttpServer())
      .post('/users/')
      .send(userData);

    const uuid = postResponse.body.data.uuid;

    const res = await request(app.getHttpServer()).get(`/users/${uuid}`).send();

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      data: {
        ...userData,
        uuid: expect.any(String),
      },
      meta: expect.any(Object),
    });
  });
});
