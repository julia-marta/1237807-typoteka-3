'use strict';

const express = require(`express`);
const request = require(`supertest`);

const comments = require(`./comments`);
const ArticleService = require(`../data-service/article`);
const CommentService = require(`../data-service/comment`);
const serviceLocatorFactory = require(`../lib/service-locator`);
const {getLogger} = require(`../lib/test-logger`);

const {mockData} = require(`./articles.test-data`);
const {HttpCode} = require(`../../const`);

const createAPI = () => {
  const serviceLocator = serviceLocatorFactory();
  const app = express();
  const cloneData = JSON.parse(JSON.stringify(mockData));
  const logger = getLogger();
  app.use(express.json());

  serviceLocator.register(`app`, app);
  serviceLocator.register(`logger`, logger);
  serviceLocator.register(`articleService`, new ArticleService(cloneData));
  serviceLocator.register(`commentService`, new CommentService());

  serviceLocator.factory(`comments`, comments);
  serviceLocator.get(`comments`);

  return app;
};

describe(`API returns a list of comments to given post`, () => {

  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app).get(`/articles/O6b4MY/comments`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns list of 3 comments`, () => expect(response.body.length).toBe(3));
  test(`First comment's id equals "J3INqD"`, () => expect(response.body[0].id).toBe(`J3INqD`));

});

describe(`API refuses to return list of comments to non-existent post`, () => {

  const app = createAPI();

  test(`When trying to get comments to non-existent post response code is 404`, () => {

    return request(app).get(`/articles/NOEXIST/comments/J3INqD`)
      .expect(HttpCode.NOT_FOUND);
  });
});

describe(`API creates a comment if data is valid`, () => {

  const newComment = {
    text: `Новый комментарий`
  };

  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app).post(`/articles/O6b4MY/comments`).send(newComment);
  });


  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));
  test(`Returns comment created`, () => expect(response.body).toEqual(expect.objectContaining(newComment)));

  test(`Comments count is changed`, () => request(app).get(`/articles/O6b4MY/comments`)
    .expect((res) => expect(res.body.length).toBe(4))
  );
});

describe(`API refuses to create a comment`, () => {

  const newComment = {
    text: `Новый комментарий`
  };

  const app = createAPI();

  test(`When trying to create a comment to non-existent post response code is 404`, () => {

    return request(app).post(`/articles/NOEXIST/comments`).send(newComment)
      .expect(HttpCode.NOT_FOUND);

  });

  test(`When trying to create a comment without required property response code is 400`, () => {

    return request(app).post(`/articles/O6b4MY/comments`).send({})
      .expect(HttpCode.BAD_REQUEST);

  });

  test(`When trying to create a comment with additional excess property response code is 400`, () => {

    const invalidComment = {...newComment};
    invalidComment.excess = `excess value`;

    return request(app).post(`/articles/O6b4MY/comments`).send(invalidComment)
      .expect(HttpCode.BAD_REQUEST);

  });
});

describe(`API correctly deletes a comment`, () => {

  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app).delete(`/articles/O6b4MY/comments/IuMBOc`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns comment deleted`, () => expect(response.body.id).toBe(`IuMBOc`));

  test(`Comments count is 2 now`, () => request(app).get(`/articles/O6b4MY/comments`)
    .expect((res) => expect(res.body.length).toBe(2))
  );
});

describe(`API refuses to delete a comment`, () => {

  const app = createAPI();

  test(`When trying to delete non-existent comment response code is 404`, () => {

    return request(app).delete(`/articles/O6b4MY/comments/NOEXIST`)
      .expect(HttpCode.NOT_FOUND);
  });

  test(`When trying to delete a comment to non-existent post response code is 404`, () => {

    return request(app).delete(`/articles/NOEXIST/comments/IuMBOc`)
      .expect(HttpCode.NOT_FOUND);
  });
});
