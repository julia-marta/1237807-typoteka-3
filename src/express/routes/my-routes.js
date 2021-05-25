'use strict';

const {Router} = require(`express`);
const apiFactory = require(`../api`);
const wrapper = require(`../middlewares/wrapper`);
const privateRoute = require(`../middlewares/private-route`);
const myRouter = new Router();

const api = apiFactory.getAPI();

myRouter.get(`/`, [wrapper, privateRoute], async (req, res, next) => {
  try {
    const articles = await api.getArticles();

    res.render(`my/my`, {articles});
  } catch (err) {
    next(err);
  }
});

myRouter.get(`/comments`, [wrapper, privateRoute], async (req, res, next) => {
  try {
    const comments = await api.getAllComments();

    res.render(`my/comments`, {comments});
  } catch (err) {
    next(err);
  }
});

myRouter.get(`/:articleId`, privateRoute, async (req, res, next) => {

  const {articleId} = req.params;

  try {
    await api.deleteArticle(articleId);
    res.redirect(`back`);
  } catch (err) {
    next(err);
  }
});

myRouter.get(`/comments/:articleId/:id`, privateRoute, async (req, res, next) => {

  const {articleId, id} = req.params;

  try {
    await api.deleteComment(id, articleId);
    res.redirect(`back`);
  } catch (err) {
    next(err);
  }
});

module.exports = myRouter;
