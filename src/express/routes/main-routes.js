'use strict';

const {Router} = require(`express`);
const apiFactory = require(`../api`);
const mainRouter = new Router();

const api = apiFactory.getAPI();

mainRouter.get(`/`, async (req, res, next) => {
  try {
    const [articles, categories] = await Promise.all([
      api.getArticles(),
      api.getCategories()
    ]).catch((error) => {
      throw error;
    });

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
  }

  try {
    const {search} = req.query;
    const results = await api.search(search);

    res.render(`search`, {
      results, search
    });
  } catch (error) {
    res.render(`search`, {
      results: []
    });
  }
});

mainRouter.get(`/categories`, async (req, res) => {
  const categories = await api.getCategories();
  res.render(`all-categories`, {categories});
});

module.exports = mainRouter;
