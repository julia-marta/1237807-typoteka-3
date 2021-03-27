'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../const`);
const commentValidator = require(`../middlewares/comment-validator`);
const articleExists = require(`../middlewares/article-exists`);

module.exports = (serviceLocator) => {
  const route = new Router({mergeParams: true});

  const app = serviceLocator.get(`app`);
  const articleService = serviceLocator.get(`articleService`);
  const commentService = serviceLocator.get(`commentService`);
  const logger = serviceLocator.get(`logger`);

  const isPostExists = articleExists(articleService, logger);

  app.use(`/articles/:articleId/comments`, route);

  route.get(`/`, isPostExists, async (req, res) => {
    const {post} = res.locals;

    const comments = await commentService.findAll(post.id);

    return res.status(HttpCode.OK).json(comments);
  });

  route.delete(`/:commentId`, isPostExists, async (req, res) => {
    const {commentId} = req.params;

    const deleted = await commentService.delete(commentId);

    if (!deleted) {
      res.status(HttpCode.NOT_FOUND).send(`Comment with ${commentId} not found`);
      return logger.error(`Comment not found: ${commentId}`);
    }

    return res.status(HttpCode.OK).send(`Comment was deleted`);
  });

  route.post(`/`, [isPostExists, commentValidator(logger)], async (req, res) => {
    const {post} = res.locals;

    const comment = await commentService.create(post.id, req.body);

    return res.status(HttpCode.CREATED).json(comment);
  });

  return route;
};
