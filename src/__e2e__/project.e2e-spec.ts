import { HttpStatus, INestApplication } from '@nestjs/common';
import { initApp } from './e2e-utils';
import * as request from 'supertest';

describe('Project Controller (e2e)', () => {
  let app: INestApplication;
  const projectUuid: string = 'mock';

  beforeAll(async () => {
    const config = await initApp();
    app = config.app;
  });

  it('POST /projects - 200', async () => {
    const postProjectResponse = await request(app.getHttpServer())
      .post('/projects')
      .send({
        name: 'test-project-2',
      });

    expect(postProjectResponse.statusCode).toEqual(HttpStatus.CREATED);
    expect(postProjectResponse.body).toEqual({
      data: {
        name: 'test-project-2',
        uuid: expect.any(String),
        createdAt: new Date().toISOString(),
        isOpen: true,
      },
      expenses: {
        data: [],
        meta: expect.any(Object),
      },
      meta: expect.any(Object),
    });
  });

  it('POST /projects - 400', async () => {
    const postProjectResponse = await request(app.getHttpServer())
      .post('/projects')
      .send({});

    expect(postProjectResponse.statusCode).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('POST /projects - 409 if project name already exists', async () => {
    const postProjectResponse = await request(app.getHttpServer())
      .post('/projects')
      .send({ name: 'test-project-1' });

    expect(postProjectResponse.statusCode).toEqual(HttpStatus.CONFLICT);
  });

  it('GET /projects - 200', async () => {
    const getProjectResponse = await request(app.getHttpServer())
      .get('/projects')
      .send();

    expect(getProjectResponse.statusCode).toEqual(HttpStatus.OK);
    expect(getProjectResponse.body.data).toHaveLength(1);
    expect(getProjectResponse.body).toEqual({
      data: [
        {
          data: {
            name: 'test-project-1',
            uuid: expect.any(String),
            createdAt: new Date().toISOString(),
            isOpen: true,
            shortName: 'tp1',
          },
          expenses: {
            data: [],
            meta: expect.any(Object),
          },
          meta: expect.any(Object),
        },
      ],
      meta: expect.any(Object),
    });
  });

  it('GET /projects/:uuid - 200', async () => {
    const getProjectResponse = await request(app.getHttpServer())
      .get(`/projects/${projectUuid}`)
      .send();

    expect(getProjectResponse.statusCode).toBe(HttpStatus.OK);
    expect(getProjectResponse.body).toEqual({
      data: {
        name: 'test-project-1',
        uuid: expect.any(String),
        createdAt: new Date().toISOString(),
        shortName: 'tp1',
        isOpen: true,
      },
      expenses: {
        data: [],
        meta: expect.any(Object),
      },
      meta: expect.any(Object),
    });
  });

  it('GET /projects/:uuid - 400', async () => {
    const getProjectResponse = await request(app.getHttpServer())
      .get('/projects/whateverID')
      .send();

    expect(getProjectResponse.statusCode).toBe(HttpStatus.NOT_FOUND);
  });

  it('GET /projects/:uuid?includeExpenses=true', async () => {
    const getProjectResponse = await request(app.getHttpServer())
      .get(`/projects/${projectUuid}?includeExpenses=true`)
      .send();

    expect(getProjectResponse.statusCode).toBe(HttpStatus.OK);
    expect(getProjectResponse.body).toEqual({
      data: {
        name: 'test-project-1',
        uuid: expect.any(String),
        createdAt: new Date().toISOString(),
        shortName: 'tp1',
        isOpen: true,
      },
      expenses: {
        data: [
          {
            data: expect.objectContaining({
              amount: 100,
              concept: 'mock',
            }),
            meta: expect.any(Object),
          },
          {
            data: expect.objectContaining({
              amount: 200,
              concept: 'mock',
            }),
            meta: expect.any(Object),
          },
        ],
        meta: expect.any(Object),
      },
      meta: expect.any(Object),
    });
  });

  it('GET /projects/search - 200', async () => {
    const getSearchProject = await request(app.getHttpServer())
      .get(`/projects/search?shortName=tp1`)
      .send();

    expect(getSearchProject.statusCode).toBe(HttpStatus.OK);
    expect(getSearchProject.body).toEqual({
      data: [
        {
          data: {
            name: 'test-project-1',
            uuid: expect.any(String),
            createdAt: new Date().toISOString(),
            shortName: 'tp1',
            isOpen: true,
          },
          meta: expect.any(Object),
        },
      ],
      meta: expect.any(Object),
    });
  });

  it('GET /projects/search?includeExpenses', async () => {
    const getSearchProject = await request(app.getHttpServer())
      .get(`/projects/search?shortName=tp1&includeExpenses=true`)
      .send();

    expect(getSearchProject.statusCode).toBe(HttpStatus.OK);
    expect(getSearchProject.body).toEqual({
      data: [
        {
          data: {
            name: 'test-project-1',
            uuid: expect.any(String),
            createdAt: new Date().toISOString(),
            shortName: 'tp1',
            isOpen: true,
          },
          expenses: {
            data: [
              {
                data: expect.objectContaining({
                  amount: 100,
                  concept: 'mock',
                }),
                meta: expect.any(Object),
              },
              {
                data: expect.objectContaining({
                  amount: 200,
                  concept: 'mock',
                }),
                meta: expect.any(Object),
              },
            ],
            meta: expect.any(Object),
          },
          meta: expect.any(Object),
        },
      ],
      meta: expect.any(Object),
    });
  });

  describe('Expenses', () => {
    it('POST /projects/:uuid/expenses - 200', async () => {
      const postExpensesResponse = await request(app.getHttpServer())
        .post(`/projects/${projectUuid}/expenses`)
        .send({
          amount: 10,
          concept: 'test-expense',
          currency: 'euro',
          date: new Date().toISOString(),
          paymentType: 'debit',
        });

      expect(postExpensesResponse.statusCode).toBe(HttpStatus.CREATED);
    });

    it('GET /projects/:uuid/expenses - 200', async () => {
      const getExpensesResponse = await request(app.getHttpServer())
        .get(`/projects/${projectUuid}/expenses`)
        .send();

      expect(getExpensesResponse.statusCode).toBe(HttpStatus.OK);
      expect(getExpensesResponse.body.data).toHaveLength(2);
      expect(getExpensesResponse.body).toEqual({
        data: [
          {
            data: expect.objectContaining({
              amount: 100,
              concept: 'mock',
            }),
            meta: expect.any(Object),
          },
          {
            data: expect.objectContaining({
              amount: 200,
              concept: 'mock',
            }),
            meta: expect.any(Object),
          },
        ],
        meta: expect.any(Object),
      });
    });

    it('GET /projects/:uuid/expenses/:uuid - 200', async () => {
      const getExpensesResponse = await request(app.getHttpServer())
        .get(`/projects/${projectUuid}/expenses/mock-1`)
        .send();

      expect(getExpensesResponse.statusCode).toBe(HttpStatus.OK);
      expect(getExpensesResponse.body).toEqual({
        data: expect.objectContaining({
          amount: 100,
          concept: 'mock',
        }),
        meta: expect.any(Object),
      });
    });

    it('GET /projects/:uuid/expenses/:uuid - 404 - Entity not found', async () => {
      const getExpensesResponse = await request(app.getHttpServer())
        .get(`/projects/${projectUuid}/expenses/mock-100`)
        .send();

      expect(getExpensesResponse.statusCode).toBe(HttpStatus.NOT_FOUND);
      expect(getExpensesResponse.body).toEqual(
        expect.objectContaining({
          errorCode: 'ERR-EXPE-001',
        }),
      );
    });

    it('GET /projects/:uuid/expenses/:uuid - 404 - Project Not Found', async () => {
      const getExpensesResponse = await request(app.getHttpServer())
        .get(`/projects/${projectUuid}3/expenses/mock-1`)
        .send();

      expect(getExpensesResponse.statusCode).toBe(HttpStatus.NOT_FOUND);
      expect(getExpensesResponse.body).toEqual(
        expect.objectContaining({
          errorCode: 'ERR-PROJ-001',
        }),
      );
    });

    it("GET /projects/:uuid/expenses/:uuid - 404 - Expense doesn't belong", async () => {
      const getExpensesResponse = await request(app.getHttpServer())
        .get(`/projects/${projectUuid}/expenses/mock-3`)
        .send();

      expect(getExpensesResponse.statusCode).toBe(HttpStatus.NOT_FOUND);
      expect(getExpensesResponse.body).toEqual(
        expect.objectContaining({
          errorCode: 'ERR-EXPE-001',
        }),
      );
    });
  });
});
