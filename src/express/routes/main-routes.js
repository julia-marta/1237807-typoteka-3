'use strict';

const {Router} = require(`express`);
const apiFactory = require(`../api`);
const {upload} = require(`../middlewares/multer`);
const wrapper = require(`../middlewares/wrapper`);
const {getPagerRange} = require(`../../utils`);
const mainRouter = new Router();

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

mainRouter.get(`/register`, async (req, res) => {

  const {user = null, errorMessages = null} = req.session;

  req.session.user = null;
  req.session.errorMessages = null;
  res.render(`sign-up`, {user, errorMessages});

});

mainRouter.post(`/register`, upload.single(`upload`), async (req, res) => {

  const {body, file} = req;

  const userData = {
    email: body.email,
    firstname: body.name,
    lastname: body.surname,
    password: body.password,
    repeat: body[`repeat-password`],
    avatar: file ? file.filename : ``
  };

  try {
    await api.createUser(userData);
    return res.redirect(`/login`);
  } catch (error) {
    req.session.user = userData;
    req.session.errorMessages = error.response.data.errorMessages;

    return res.redirect(`/register`);
  }
});

mainRouter.get(`/login`, async (req, res) => {

  const {userEmail = null, errorMessages = null} = req.session;

  req.session.userEmail = null;
  req.session.errorMessages = null;
  res.render(`login`, {userEmail, errorMessages});

});

mainRouter.post(`/login`, upload.single(`upload`), async (req, res) => {

  const {body} = req;

  const loginData = {
    email: body.email,
    password: body.password,
  };

  try {
    const loggedUser = await api.loginUser(loginData);
    req.session.isLogged = true;
    req.session.loggedUser = loggedUser;
    return res.redirect(`/`);
  } catch (error) {
    req.session.userEmail = loginData.email;
    req.session.errorMessages = error.response.data.errorMessages;

    return res.redirect(`/login`);
  }
});

mainRouter.get(`/search`, wrapper, async (req, res) => {

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

mainRouter.get(`/categories`, wrapper, async (req, res, next) => {
  try {
    const categories = await api.getCategories();

    res.render(`all-categories`, {categories});
  } catch (err) {
    next(err);
  }
});

module.exports = mainRouter;
