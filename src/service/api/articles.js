'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../const`);
const articleExists = require(`../middlewares/article-exists`);
const articleValidator = require(`../middlewares/article-validator`);

const route = new Router();

module.exports = (app, articleService, commentsRouter) => {
  app.use(`/articles`, route);

  route.get(`/`, (req, res) => {
    const posts = articleService.findAll();

    return res.status(HttpCode.OK).json(posts);
  });

  route.get(`/:articleId`, articleExists(articleService), (req, res) => {
    const {post} = res.locals;

    return res.status(HttpCode.OK).json(post);
  });

  route.post(`/`, articleValidator, (req, res) => {
    const post = articleService.add(req.body);

    return res.status(HttpCode.CREATED).json(post);
  });

  route.put(`/:articleId`, [articleExists(articleService), articleValidator], (req, res) => {
    const {articleId} = req.params;

    const updatedPost = articleService.update(articleId, req.body);

    return res.status(HttpCode.OK).json(updatedPost);
  });

  route.delete(`/:articleId`, (req, res) => {
    const {articleId} = req.params;
    const deletedPost = articleService.delete(articleId);

    if (!deletedPost) {
      return res.status(HttpCode.NOT_FOUND).send(`Post with ${articleId} not found`);
    }

    return res.status(HttpCode.OK).json(deletedPost);
  });

  route.use(`/:articleId/comments`, articleExists(articleService), commentsRouter);
};
