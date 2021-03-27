'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);
const initDB = require(`../lib/init-db`);
const comments = require(`./comments`);
const ArticleService = require(`../data-service/article`);
const CommentService = require(`../data-service/comment`);
const serviceLocatorFactory = require(`../lib/service-locator`);
const {getLogger} = require(`../lib/test-logger`);
const {mockArticles, mockCategories} = require(`./articles.test-data`);
const {HttpCode} = require(`../../const`);

const createAPI = async () => {
  const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
  await initDB(mockDB, {categories: mockCategories, articles: mockArticles});
  const serviceLocator = serviceLocatorFactory();
  const app = express();
  const logger = getLogger();
  app.use(express.json());

  serviceLocator.register(`app`, app);
  serviceLocator.register(`logger`, logger);
  serviceLocator.register(`articleService`, new ArticleService(mockDB));
  serviceLocator.register(`commentService`, new CommentService(mockDB));
  serviceLocator.factory(`comments`, comments);
  serviceLocator.get(`comments`);

  return app;
};

describe(`API returns a list of comments to given post`, () => {

  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app).get(`/articles/1/comments`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns list of 3 comments`, () => expect(response.body.length).toBe(4));
  test(`First comment's text is "Мне кажется или я уже читал это где-то?"`, () => expect(response.body[2].text).toBe(`Мне кажется или я уже читал это где-то?`));

});

describe(`API refuses to return list of comments to non-existent post`, () => {

  test(`When trying to get comments to non-existent post response code is 404`, async () => {

    const app = await createAPI();
    return request(app).get(`/articles/NOEXIST/comments/1`)
      .expect(HttpCode.NOT_FOUND);
  });
});

describe(`API creates a comment if data is valid`, () => {

  const newComment = {
    text: `Новый комментарий`
  };

  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).post(`/articles/1/comments`).send(newComment);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));
  test(`Returns comment with valid text`, () => expect(response.body.text).toBe(`Новый комментарий`));
  test(`Comments count is changed`, () => request(app).get(`/articles/1/comments`)
    .expect((res) => expect(res.body.length).toBe(5))
  );
});

describe(`API refuses to create a comment`, () => {

  const newComment = {
    text: `Новый комментарий`
  };

  let app;

  beforeAll(async () => {
    app = await createAPI();
  });

  test(`When trying to create a comment to non-existent post response code is 404`, () => {

    return request(app).post(`/articles/NOEXIST/comments`).send(newComment)
      .expect(HttpCode.NOT_FOUND);

  });

  test(`When trying to create a comment without required property response code is 400`, () => {

    return request(app).post(`/articles/1/comments`).send({})
      .expect(HttpCode.BAD_REQUEST);

  });

  test(`When trying to create a comment with additional excess property response code is 400`, () => {

    const invalidComment = {...newComment};
    invalidComment.excess = `excess value`;

    return request(app).post(`/articles/1/comments`).send(invalidComment)
      .expect(HttpCode.BAD_REQUEST);
  });
});

describe(`API correctly deletes a comment`, () => {

  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).delete(`/articles/1/comments/2`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns message of success deleting`, () => expect(response.text).toBe(`Comment was deleted`));
  test(`Comments count is 3 now`, () => request(app).get(`/articles/1/comments`)
    .expect((res) => expect(res.body.length).toBe(3))
  );
});

describe(`API refuses to delete a comment`, () => {

  let app;

  beforeAll(async () => {
    app = await createAPI();
  });

  test(`When trying to delete non-existent comment response code is 404`, () => {

    return request(app).delete(`/articles/1/comments/30`)
      .expect(HttpCode.NOT_FOUND);
  });

  test(`When trying to delete a comment to non-existent post response code is 404`, () => {

    return request(app).delete(`/articles/NOEXIST/comments/1`)
      .expect(HttpCode.NOT_FOUND);
  });
});
