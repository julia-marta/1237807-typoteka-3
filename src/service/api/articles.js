'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../const`);
const articleExists = require(`../middlewares/article-exists`);
const articleValidator = require(`../middlewares/article-validator`);

module.exports = (serviceLocator) => {
  const route = new Router();

  const app = serviceLocator.get(`app`);
  const service = serviceLocator.get(`articleService`);
  const logger = serviceLocator.get(`logger`);

  const isPostExists = articleExists(service, logger);
  const isPostValid = articleValidator(logger);

  app.use(`/articles`, route);

  route.get(`/`, (req, res) => {
    const posts = service.findAll();

    return res.status(HttpCode.OK).json(posts);
  });

  route.get(`/:articleId`, isPostExists, (req, res) => {
    const {post} = res.locals;

    return res.status(HttpCode.OK).json(post);
  });

  route.post(`/`, isPostValid, (req, res) => {
    const post = service.add(req.body);

    return res.status(HttpCode.CREATED).json(post);
  });

  route.put(`/:articleId`, [isPostExists, isPostValid], (req, res) => {
    const {articleId} = req.params;

    const updatedPost = service.update(articleId, req.body);

    return res.status(HttpCode.OK).json(updatedPost);
  });

  route.delete(`/:articleId`, (req, res) => {
    const {articleId} = req.params;
    const deletedPost = service.delete(articleId);

    if (!deletedPost) {
      res.status(HttpCode.NOT_FOUND).send(`Post with ${articleId} not found`);
      return logger.error(`Post not found: ${articleId}`);
    }

    return res.status(HttpCode.OK).json(deletedPost);
  });

  return route;
};
