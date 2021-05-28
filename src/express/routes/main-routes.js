'use strict';

const {Router} = require(`express`);
const csrf = require(`csurf`);
const apiFactory = require(`../api`);
const {upload} = require(`../middlewares/multer`);
const wrapper = require(`../middlewares/wrapper`);
const privateRoute = require(`../middlewares/private-route`);
const {getPagerRange} = require(`../../utils`);
const {ARTICLES_PER_PAGE, PAGER_WIDTH} = require(`../../const`);

const TOP_PER_PAGE = 4;

const mainRouter = new Router();
const api = apiFactory.getAPI();

const csrfProtection = csrf({
  value: (req) => {
    return req.body.csrf;
  }
});

mainRouter.get(`/`, async (req, res, next) => {

  let {page = 1} = req.query;
  page = +page;
  const limit = ARTICLES_PER_PAGE;
  const topLimit = TOP_PER_PAGE;
  const offset = (page - 1) * ARTICLES_PER_PAGE;

  try {
    const [{count, articles}, popularArticles, categories, lastComments] = await Promise.all([
      api.getArticles({limit, offset, comments: true}),
      api.getPopularArticles({limit: topLimit}),
      api.getCategories({count: true}),
      api.getLastComments({limit: topLimit})
    ]);

    const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);
    const range = getPagerRange(page, totalPages, PAGER_WIDTH);
    const withPagination = totalPages > 1;

    res.render(`main`, {articles, popularArticles, categories, lastComments, page, totalPages, range, withPagination});
  } catch (err) {
    next(err);
  }
});

mainRouter.get(`/register`, csrfProtection, async (req, res) => {

  const {user = null, errorMessages = null} = req.session;

  const csrfToken = req.csrfToken();

  req.session.user = null;
  req.session.errorMessages = null;
  res.render(`sign-up`, {user, errorMessages, csrfToken});

});

mainRouter.post(`/register`, upload.single(`upload`), csrfProtection, async (req, res) => {

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

mainRouter.get(`/login`, csrfProtection, async (req, res) => {

  const {userEmail = null, errorMessages = null} = req.session;

  const csrfToken = req.csrfToken();

  req.session.userEmail = null;
  req.session.errorMessages = null;
  res.render(`login`, {userEmail, errorMessages, csrfToken});

});

mainRouter.post(`/login`, upload.single(`upload`), csrfProtection, async (req, res) => {

  const {body} = req;

  const loginData = {
    email: body.email,
    password: body.password,
  };

  try {
    const loggedUser = await api.loginUser(loginData);
    req.session.isLogged = true;
    req.session.isAdmin = loggedUser.admin;
    req.session.loggedUser = loggedUser;
    return res.redirect(`/`);
  } catch (error) {
    req.session.userEmail = loginData.email;
    req.session.errorMessages = error.response.data.errorMessages;

    return res.redirect(`/login`);
  }
});

mainRouter.get(`/logout`, async (req, res) => {
  req.session.destroy(() => {
    res.redirect(`/login`);
  });
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

mainRouter.get(`/categories`, [wrapper, privateRoute], async (req, res, next) => {

  const {newCategory = null, errorMessages = null, currentCategory = null, updateErrorMessages = null} = req.session;

  try {
    const categories = await api.getCategories();
    req.session.category = null;
    req.session.errorMessages = null;
    req.session.currentCategory = null;
    req.session.updateErrorMessages = null;
    res.render(`all-categories`, {categories, newCategory, errorMessages, currentCategory, updateErrorMessages});
  } catch (err) {
    next(err);
  }
});

mainRouter.post(`/categories`, [privateRoute, upload.single(`upload`)], async (req, res) => {

  const {body} = req;

  const newCategory = {
    name: body[`add-category`],
  };

  try {
    await api.createCategory(newCategory);
    return res.redirect(`/categories`);
  } catch (error) {
    req.session.newCategory = newCategory;
    req.session.errorMessages = error.response.data.errorMessages;

    return res.redirect(`/categories`);
  }
});

mainRouter.post(`/categories/:id`, [privateRoute, upload.single(`upload`)], async (req, res) => {
  const {id} = req.params;
  const {body} = req;

  const updatedCategory = {
    name: body[`category-${id}`],
  };

  try {
    await api.updateCategory(id, updatedCategory);
    return res.redirect(`/categories`);
  } catch (error) {
    req.session.currentCategory = {...updatedCategory, id: Number(id)};
    req.session.updateErrorMessages = error.response.data.errorMessages;

    return res.redirect(`/categories`);
  }
});

module.exports = mainRouter;
