import * as request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { initApp } from './e2e-utils';

describe('Auth (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const config = await initApp();
    app = config.app;
  });

  it('POST - /signup', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/login')
      .send({
        email: 'e2e@test.com',
        password: 'testpassword',
      });

    expect(loginResponse.status).toBe(HttpStatus.OK);
    expect(loginResponse.body.data).toEqual({
      token: expect.any(String),
    });
  });
  it('POST - /signup - 401', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/login')
      .send({
        email: 'e2e@test.com',
        password: 'not-correct',
      });

    expect(loginResponse.status).toBe(HttpStatus.UNAUTHORIZED);
  });
});
