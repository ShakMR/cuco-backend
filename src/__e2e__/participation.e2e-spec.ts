import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { initApp } from './e2e-utils';
import { UserType } from '../user/user.model';

describe('ParticipationController (e2e)', () => {
  let app: INestApplication;
  let userUuid: string;
  let projectUuid: string;

  beforeAll(async () => {
    jest.useFakeTimers();
    const config = await initApp();
    app = config.app;

    const newUserResponse = await request(app.getHttpServer())
      .post('/users')
      .send({
        name: 'test user',
        email: 'test@example.com',
        type: UserType.user,
      });
    userUuid = newUserResponse.body.data.uuid;

    const newProjectResponse = await request(app.getHttpServer())
      .post('/projects')
      .send({ name: 'test-project' });
    projectUuid = newProjectResponse.body.data.uuid;
  });

  it('POST /participation/ - 200', async () => {
    const participationResponse = await request(app.getHttpServer())
      .post('/participation')
      .send({ userUuid, projectUuid });

    expect(participationResponse.statusCode).toBe(201);
    expect(participationResponse.body).toEqual({
      data: {
        user: {
          data: expect.objectContaining({
            name: 'test user',
            email: 'test@example.com',
            uuid: userUuid,
          }),
          meta: expect.any(Object),
        },
        project: {
          data: expect.objectContaining({
            name: 'test-project',
            uuid: projectUuid,
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
      .send({ userUuid: 'whateverID', projectUuid });

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
      .send({ userUuid, projectUuid: 'whateverID' });

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
      .query({ user: userUuid, project: projectUuid })
      .send();

    expect(participationResponse.statusCode).toBe(200);
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

  it('GET - /participation/user/:uuid', async () => {
    const participationResponse = await request(app.getHttpServer())
      .get(`/participation/user/${userUuid}`)
      .send();

    expect(participationResponse.statusCode).toBe(200);
    expect(participationResponse.body).toEqual({
      data: {
        user: {
          data: expect.objectContaining({
            name: 'test user',
            email: 'test@example.com',
            uuid: userUuid,
          }),
          meta: expect.any(Object),
        },
        participation: [
          {
            data: {
              project: {
                data: expect.objectContaining({
                  name: 'test-project',
                  uuid: projectUuid,
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
