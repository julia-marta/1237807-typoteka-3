'use strict';

const {Router} = require(`express`);
const apiFactory = require(`../api`);
const mainRouter = new Router();
const {getPagerRange} = require(`../../utils`);

const ARTICLES_PER_PAGE = 8;
const PAGER_WIDTH = 2;

const api = apiFactory.getAPI();

mainRouter.get(`/`, async (req, res, next) => {

  let {page = 1} = req.query;
  page = +page;
  const limit = ARTICLES_PER_PAGE;
  const offset = (page - 1) * ARTICLES_PER_PAGE;

  try {
    const [{count, articles}, categories] = await Promise.all([
      api.getArticles({limit, offset, comments: true}),
      api.getCategories({count: true})
    ]);

    const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);
    const range = getPagerRange(page, totalPages, PAGER_WIDTH);
    const withPagination = totalPages > 1;

    res.render(`main`, {articles, categories, page, totalPages, range, withPagination});
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
