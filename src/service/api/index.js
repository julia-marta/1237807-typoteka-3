'use strict';

const {Router} = require(`express`);
const categories = require(`../api/categories`);
const articles = require(`../api/articles`);
const comments = require(`../api/comments`);
const search = require(`../api/search`);
const user = require(`../api/user`);
const serviceLocatorFactory = require(`../lib/service-locator`);
const sequelize = require(`../lib/sequelize`);
const SocketService = require(`../lib/socket-service`);
const defineModels = require(`../models`);

const {CategoryService, ArticleService, CommentService, SearchService, UserService} = require(`../data-service`);

module.exports = async (logger, server) => {
  const app = new Router();
  const serviceLocator = serviceLocatorFactory();

  defineModels(sequelize);

  serviceLocator.register(`app`, app);
  serviceLocator.register(`logger`, logger);
  serviceLocator.register(`socketService`, new SocketService(server));
  serviceLocator.register(`categoryService`, new CategoryService(sequelize));
  serviceLocator.register(`articleService`, new ArticleService(sequelize));
  serviceLocator.register(`commentService`, new CommentService(sequelize));
  serviceLocator.register(`searchService`, new SearchService(sequelize));
  serviceLocator.register(`userService`, new UserService(sequelize));

  serviceLocator.factory(`categories`, categories);
  serviceLocator.factory(`articles`, articles);
  serviceLocator.factory(`comments`, comments);
  serviceLocator.factory(`search`, search);
  serviceLocator.factory(`user`, user);

  serviceLocator.get(`categories`);
  serviceLocator.get(`articles`);
  serviceLocator.get(`comments`);
  serviceLocator.get(`search`);
  serviceLocator.get(`user`);

  return app;
};
