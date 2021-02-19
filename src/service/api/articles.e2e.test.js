'use strict';

const express = require(`express`);
const request = require(`supertest`);

const articles = require(`./articles`);
const DataService = require(`../data-service/article`);
const serviceLocatorFactory = require(`../lib/service-locator`);
const {getLogger} = require(`../lib/test-logger`);

const {mockData, mockPost} = require(`./articles.test-data`);
const {HttpCode} = require(`../../const`);

const createAPI = () => {
  const serviceLocator = serviceLocatorFactory();
  const app = express();
  const cloneData = JSON.parse(JSON.stringify(mockData));
  const logger = getLogger();
  app.use(express.json());

  serviceLocator.register(`app`, app);
  serviceLocator.register(`logger`, logger);
  serviceLocator.register(`articleService`, new DataService(cloneData));
  serviceLocator.factory(`articles`, articles);
  serviceLocator.get(`articles`);

  return app;
};

describe(`API returns a list of all articles`, () => {

  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app).get(`/articles`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns a list of 4 posts`, () => expect(response.body.length).toBe(4));
  test(`First post's id equals "uqL8xl"`, () => expect(response.body[0].id).toBe(`uqL8xl`));
});

describe(`API returns a post with given id`, () => {

  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app).get(`/articles/uqL8xl`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Post's title is "Как достигнуть успеха не вставая с кресла"`, () => expect(response.body.title).toBe(`Как достигнуть успеха не вставая с кресла`));
});

describe(`API refuses to return non-existent post`, () => {

  const app = createAPI();

  test(`When trying to get non-existent post response code is 404`, () => {

    return request(app).get(`/articles/NOEXIST`)
    .expect(HttpCode.NOT_FOUND);
  });
});

describe(`API creates a post if data is valid`, () => {

  const newPost = JSON.parse(JSON.stringify(mockPost));

  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app).post(`/articles`).send(newPost);
  });


  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));
  test(`Returns post created`, () => expect(response.body).toEqual(expect.objectContaining(newPost)));

  test(`Articles count is changed`, () => request(app).get(`/articles`)
    .expect((res) => expect(res.body.length).toBe(5))
  );
});

describe(`API refuses to create a post if data is invalid`, () => {

  const newPost = JSON.parse(JSON.stringify(mockPost));

  const app = createAPI();

  test(`Without any required property response code is 400`, async () => {
    for (const key of Object.keys(newPost)) {
      const badPost = {...newPost};
      delete badPost[key];

      await request(app).post(`/articles`).send(badPost)
        .expect(HttpCode.BAD_REQUEST);
    }
  });

  test(`With any additional excess property response code is 400`, async () => {

    const badPost = {...newPost};
    badPost.excess = `excess value`;

    await request(app).post(`/articles`).send(badPost)
      .expect(HttpCode.BAD_REQUEST);
  });
});

describe(`API changes existent post`, () => {

  const newPost = JSON.parse(JSON.stringify(mockPost));

  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app).put(`/articles/H6WMzs`).send(newPost);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns changed post`, () => expect(response.body).toEqual(expect.objectContaining(newPost)));

  test(`Post is really changed`, () => request(app).get(`/articles/H6WMzs`)
    .expect((res) => expect(res.body.title).toBe(`Статья про котиков`))
  );
});

describe(`API refuses to change post`, () => {

  const newPost = JSON.parse(JSON.stringify(mockPost));

  const app = createAPI();

  test(`When trying to change non-existent post response code is 404`, () => {

    const validPost = {...newPost};

    return request(app).put(`/articles/NOEXIST`).send(validPost)
      .expect(HttpCode.NOT_FOUND);
  });

  test(`When trying to change a post with invalid data response code is 400`, () => {

    const invalidPost = {...newPost};
    delete invalidPost.announce;

    return request(app).put(`/articles/H6WMzs`).send(invalidPost)
      .expect(HttpCode.BAD_REQUEST);
  });
});

describe(`API correctly deletes a post`, () => {

  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app).delete(`/articles/O6b4MY`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns deleted post`, () => expect(response.body.id).toBe(`O6b4MY`));

  test(`Articles count is 3 now`, () => request(app).get(`/articles`)
    .expect((res) => expect(res.body.length).toBe(3))
  );
});

describe(`API refuses to delete non-existent post`, () => {

  const app = createAPI();

  test(`When trying to delete non-existent post response code is 404`, () => {

    return request(app).delete(`/articles/NOEXIST`)
    .expect(HttpCode.NOT_FOUND);
  });
});
