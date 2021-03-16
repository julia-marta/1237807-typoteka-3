'use strict';

const {Router} = require(`express`);
const categories = require(`../api/categories`);
const articles = require(`../api/articles`);
const comments = require(`../api/comments`);
const search = require(`../api/search`);
const serviceLocatorFactory = require(`../lib/service-locator`);
const sequelize = require(`../lib/sequelize`);
// const defineModels = require(`../models`);

const {CategoryService, ArticleService, CommentService, SearchService} = require(`../data-service`);

module.exports = async (logger) => {
  const app = new Router();
  const serviceLocator = serviceLocatorFactory();

  // defineModels(sequelize);

  serviceLocator.register(`app`, app);
  serviceLocator.register(`logger`, logger);
  serviceLocator.register(`categoryService`, new CategoryService(sequelize));
  serviceLocator.register(`articleService`, new ArticleService(sequelize));
  serviceLocator.register(`commentService`, new CommentService(sequelize));
  serviceLocator.register(`searchService`, new SearchService(sequelize));

  serviceLocator.factory(`categories`, categories);
  serviceLocator.factory(`articles`, articles);
  serviceLocator.factory(`comments`, comments);
  serviceLocator.factory(`search`, search);

  serviceLocator.get(`categories`);
  serviceLocator.get(`articles`);
  serviceLocator.get(`comments`);
  serviceLocator.get(`search`);

  return app;
};
