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

  route.get(`/`, async (req, res) => {
    const {offset, limit, comments = false} = req.query;
    let result;

    if (limit || offset) {
      result = await service.findPage({limit, offset, comments});
    } else {
      result = await service.findAll(comments);
    }

    return res.status(HttpCode.OK).json(result);
  });

  route.get(`/:articleId`, isPostExists, (req, res) => {
    const {post} = res.locals;

    return res.status(HttpCode.OK).json(post);
  });

  route.post(`/`, isPostValid, async (req, res) => {
    const post = await service.add(req.body);

    return res.status(HttpCode.CREATED).json(post);
  });

  route.put(`/:articleId`, [isPostExists, isPostValid], async (req, res) => {
    const {articleId} = req.params;

    await service.update(articleId, req.body);

    return res.status(HttpCode.OK).send(`Post was updated`);
  });

  route.delete(`/:articleId`, async (req, res) => {
    const {articleId} = req.params;

    const deleted = await service.delete(articleId);

    if (!deleted) {
      res.status(HttpCode.NOT_FOUND).send(`Post with ${articleId} not found`);
      return logger.error(`Post not found: ${articleId}`);
    }

    return res.status(HttpCode.OK).send(`Post was deleted`);
  });

  return route;
};
