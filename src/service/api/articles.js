'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../const`);
const articleExists = require(`../middlewares/article-exists`);
const userAdmin = require(`../middlewares/user-admin`);
const schemaValidator = require(`../middlewares/schema-validator`);
const articleSchema = require(`../schemas/article`);

module.exports = (serviceLocator) => {
  const route = new Router();

  const app = serviceLocator.get(`app`);
  const service = serviceLocator.get(`articleService`);
  const categoryService = serviceLocator.get(`categoryService`);
  const commentService = serviceLocator.get(`commentService`);
  const logger = serviceLocator.get(`logger`);

  const isPostExists = articleExists(service, logger);
  const isPostValid = schemaValidator(articleSchema, logger, categoryService);
  const isUserAdmin = userAdmin(logger);

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

  route.get(`/popular`, async (req, res) => {
    const {limit} = req.query;

    const popularArticles = await service.findPopular(limit);

    return res.status(HttpCode.OK).json(popularArticles);
  });

  route.get(`/category/:categoryId`, async (req, res) => {
    const {categoryId} = req.params;
    const {offset, limit} = req.query;
    let result;

    if (limit || offset) {
      result = await service.findPageByCategory({limit, offset, categoryId});
    } else {
      result = await service.findAllByCategory(categoryId);
    }

    return res.status(HttpCode.OK).json(result);
  });

  route.get(`/:articleId`, isPostExists, (req, res) => {
    const {post} = res.locals;

    return res.status(HttpCode.OK).json(post);
  });

  route.post(`/`, [isUserAdmin, isPostValid], async (req, res) => {
    const post = await service.add(req.body);

    return res.status(HttpCode.CREATED).json(post);
  });

  route.put(`/:articleId`, [isUserAdmin, isPostExists, isPostValid], async (req, res) => {
    const {articleId} = req.params;

    await service.update(articleId, req.body);

    return res.status(HttpCode.OK).send(`Post was updated`);
  });

  route.delete(`/:articleId`, [isUserAdmin, isPostExists], async (req, res) => {
    const {articleId} = req.params;

    await commentService.deleteAllByArticle(articleId);
    await service.delete(articleId);

    return res.status(HttpCode.OK).send(`Post was deleted`);
  });

  return route;
};
