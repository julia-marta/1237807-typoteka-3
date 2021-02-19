'use strict';

const express = require(`express`);
const request = require(`supertest`);

const search = require(`./search`);
const DataService = require(`../data-service/search`);
const serviceLocatorFactory = require(`../lib/service-locator`);
const {getLogger} = require(`../lib/test-logger`);

const {mockData} = require(`./search.test-data`);
const {HttpCode} = require(`../../const`);

const serviceLocator = serviceLocatorFactory();
const app = express();
const logger = getLogger();
app.use(express.json());

serviceLocator.register(`app`, app);
serviceLocator.register(`logger`, logger);
serviceLocator.register(`searchService`, new DataService(mockData));
serviceLocator.factory(`search`, search);
serviceLocator.get(`search`);

describe(`API returns post based on search query`, () => {

  let response;

  beforeAll(async () => {
    response = await request(app).get(`/search`)
      .query({
        query: `Борьба с прокрастинацией`
      });
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`1 post found`, () => expect(response.body.length).toBe(1));
  test(`Post has correct id`, () => expect(response.body[0].id).toBe(`f7b9Bv`));

});

test(`API returns empty array if nothing is found`, async () => {
  const res = await request(app).get(`/search`)
     .query({
       query: `Котики`
     });

  expect(res.body.length).toBe(0);
});

test(`API returns 400 when query string is absent`,
    () => request(app)
      .get(`/search`)
      .expect(HttpCode.BAD_REQUEST)
);
