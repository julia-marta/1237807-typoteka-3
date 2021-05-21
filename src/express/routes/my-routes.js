'use strict';

const {Router} = require(`express`);
const apiFactory = require(`../api`);
const wrapper = require(`../middlewares/wrapper`);
const myRouter = new Router();

const api = apiFactory.getAPI();

myRouter.get(`/`, wrapper, async (req, res, next) => {
  try {
    const articles = await api.getArticles();
    res.render(`my/my`, {articles});
  } catch (err) {
    next(err);
  }
});

myRouter.get(`/comments`, wrapper, async (req, res, next) => {
  try {
    const articles = await api.getArticles({comments: true});
    res.render(`my/comments`, {articles: articles.slice(0, 3)});
  } catch (err) {
    next(err);
  }
});

module.exports = myRouter;
