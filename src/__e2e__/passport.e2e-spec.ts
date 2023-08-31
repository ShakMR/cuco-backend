import * as request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { initApp } from './e2e-utils';

describe('ParticipationController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const config = await initApp();
    app = config.app;
  });

  it('POST - /signup', async () => {
    const signUpResponse = await request(app.getHttpServer())
      .post('/signup')
      .send({
        email: 'test-email@example.com',
        password: 'supersecurepassword',
        name: 'Name',
      });

    expect(signUpResponse.status).toBe(HttpStatus.CREATED);
  });
});
