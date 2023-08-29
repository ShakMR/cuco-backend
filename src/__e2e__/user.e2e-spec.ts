import { createRequestSender, CustomRequest, initApp } from './e2e-utils';

describe('UserController (e2e)', () => {
  let request: CustomRequest;

  beforeAll(async () => {
    const config = await initApp();
    const app = config.app;

    request = await createRequestSender(app, { login: true });
  });

  it('POST - /users/ - 200', async () => {
    const userData = {
      name: 'test',
      email: 'email@test.com',
      type: 'user',
      externalId: 'externalId',
    };
    const res = await request({
      path: '/users/',
      body: userData,
      method: 'POST',
    });

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
    const res = await request({ path: '/users/uuid-0' });

    expect(res.statusCode).toBe(404);
  });

  it('GET - /users/:uuid - 200', async () => {
    const res = await request({ path: `/users/mock` });

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      data: expect.objectContaining({
        name: 'test',
        type: 'user',
        email: 'example@example.com',
        uuid: expect.any(String),
      }),
      meta: expect.any(Object),
    });
  });
});
