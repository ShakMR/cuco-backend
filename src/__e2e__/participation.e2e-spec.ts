import * as request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { initApp } from './e2e-utils';

describe('ParticipationController (e2e)', () => {
  let app: INestApplication;
  let userUuid: string;
  let projectUuid: string;

  beforeAll(async () => {
    const config = await initApp();
    app = config.app;
  });

  it('POST /participation/ - 200', async () => {
    const participationResponse = await request(app.getHttpServer())
      .post('/participation')
      .send({ userUuid: 'mock', projectUuid: 'mock' });

    expect(participationResponse.statusCode).toBe(201);
    expect(participationResponse.body).toEqual({
      data: {
        user: {
          data: expect.objectContaining({
            name: 'test',
            email: 'example@example.com',
            uuid: 'mock',
          }),
          meta: expect.any(Object),
        },
        project: {
          data: expect.objectContaining({
            name: 'test-project-1',
            uuid: 'mock',
          }),
          expenses: {
            data: [],
            meta: expect.any(Object),
          },
          meta: expect.any(Object),
        },
        share: 50,
        joinedOn: new Date().toISOString(),
      },
      meta: expect.any(Object),
    });
  });

  it("POST /participation/ - 404 if user or project don't exist", async () => {
    const participationResponse = await request(app.getHttpServer())
      .post('/participation')
      .send({ userUuid: 'whateverID', projectUuid: 'mock' });

    expect(participationResponse.statusCode).toBe(404);
    expect(participationResponse.body).toEqual({
      errors: {
        context: {
          uuid: 'whateverID',
        },
        details: expect.stringMatching(/User with context .* not found/),
        errorCode: 'ERR-USER-001',
        title: 'Error',
      },
    });

    const response404Project = await request(app.getHttpServer())
      .post('/participation')
      .send({ userUuid: 'mock', projectUuid: 'whateverID' });

    expect(response404Project.statusCode).toBe(404);
    expect(response404Project.body).toEqual({
      errors: {
        context: {
          uuid: 'whateverID',
        },
        details: expect.stringMatching(/Project with context .* not found/),
        errorCode: 'ERR-PROJ-001',
        title: 'Error',
      },
    });
  });

  it('GET - /participation - 200', async () => {
    const participationResponse = await request(app.getHttpServer())
      .get('/participation')
      .query({ user: 'mock', project: 'mock' })
      .send();

    expect(participationResponse.statusCode).toBe(HttpStatus.OK);
  });

  it('GET - /participation - 404 if either user or project does not exist', async () => {
    const participationResponse = await request(app.getHttpServer())
      .get('/participation')
      .query({ user: 'whateverID', project: projectUuid })
      .send();

    expect(participationResponse.statusCode).toBe(404);
    expect(participationResponse.body).toEqual({
      errors: {
        context: {
          projectUuid,
          userUuid: 'whateverID',
        },
        details: expect.stringMatching(
          /Participation with context .* not found/,
        ),
        errorCode: 'ERR-PART-001',
        title: 'Error',
      },
    });

    const response404Project = await request(app.getHttpServer())
      .get('/participation')
      .query({ user: userUuid, project: 'whateverID' })
      .send();

    expect(response404Project.statusCode).toBe(404);
    expect(response404Project.body).toEqual({
      errors: {
        context: {
          projectUuid: 'whateverID',
          userUuid,
        },
        details: expect.stringMatching(
          /Participation with context .* not found/,
        ),
        errorCode: 'ERR-PART-001',
        title: 'Error',
      },
    });
  });

  it.only('GET - /participation/user/:uuid', async () => {
    const participationResponse = await request(app.getHttpServer())
      .get(`/participation/user/mock`)
      .send();

    expect(participationResponse.statusCode).toBe(HttpStatus.OK);
    expect(participationResponse.body).toEqual({
      data: {
        user: {
          data: expect.objectContaining({
            name: 'test',
            email: 'example@example.com',
            uuid: 'mock',
          }),
          meta: expect.any(Object),
        },
        participation: [
          {
            data: {
              project: {
                data: expect.objectContaining({
                  name: 'test-project-1',
                  uuid: 'mock',
                }),
                expenses: {
                  data: [],
                  meta: expect.any(Object),
                },
                meta: expect.any(Object),
              },
              share: 50,
              joinedOn: new Date().toISOString(),
            },
            meta: expect.any(Object),
          },
        ],
      },
      meta: expect.any(Object),
    });
  });
});
