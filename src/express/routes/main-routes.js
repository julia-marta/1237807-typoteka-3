'use strict';

const {Router} = require(`express`);
const apiFactory = require(`../api`);
const mainRouter = new Router();

const api = apiFactory.getAPI();

mainRouter.get(`/`, async (req, res, next) => {
  try {
    const [articles, categories] = await Promise.all([
      api.getArticles(),
      api.getCategories({count: true})
    ]);

    res.render(`main`, {articles, categories});
  } catch (err) {
    next(err);
  }
});

mainRouter.get(`/register`, (req, res) => res.render(`sign-up`));
mainRouter.get(`/login`, (req, res) => res.render(`login`));

mainRouter.get(`/search`, async (req, res) => {

  if (!req.query.search) {
    res.render(`search`);
    return;
  }

  let results;
  const {search} = req.query;

  try {
    results = await api.search(search);
  } catch (error) {
    results = [];
  }

  res.render(`search`, {
    results, search
  });
});

mainRouter.get(`/categories`, async (req, res, next) => {
  try {
    const categories = await api.getCategories();

    res.render(`all-categories`, {categories});
  } catch (err) {
    next(err);
  }
});

module.exports = mainRouter;
