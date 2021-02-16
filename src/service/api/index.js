'use strict';

const {Router} = require(`express`);
const categories = require(`../api/categories`);
const articles = require(`../api/articles`);
const comments = require(`../api/comments`);
const search = require(`../api/search`);
const getMockData = require(`../lib/get-mock-data`);

const {CategoryService, ArticleService, CommentService, SearchService} = require(`../data-service`);

module.exports = async () => {
  const app = new Router();

  const mockData = await getMockData();
  const commentsRouter = comments(new CommentService());

  categories(app, new CategoryService(mockData));
  articles(app, new ArticleService(mockData), commentsRouter);
  search(app, new SearchService(mockData));

  return app;
};
