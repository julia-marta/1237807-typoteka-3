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

  route.get(`/`, isPostExists, (req, res) => {
    const {post} = res.locals;
    const comments = commentService.findAll(post);

    return res.status(HttpCode.OK).json(comments);
  });

  route.delete(`/:commentId`, isPostExists, (req, res) => {
    const {post} = res.locals;
    const {commentId} = req.params;
    const deletedComment = commentService.delete(post, commentId);

    if (!deletedComment) {
      res.status(HttpCode.NOT_FOUND).send(`Comment with ${commentId} not found`);
      return logger.error(`Comment not found: ${commentId}`);
    }

    return res.status(HttpCode.OK).json(deletedComment);
  });

  route.post(`/`, [isPostExists, commentValidator(logger)], (req, res) => {
    const {post} = res.locals;
    const comment = commentService.create(post, req.body);

    return res.status(HttpCode.CREATED).json(comment);
  });

  return route;
};
