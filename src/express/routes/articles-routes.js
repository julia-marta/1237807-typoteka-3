'use strict';

const {Router} = require(`express`);
const apiFactory = require(`../api`);
const {upload} = require(`../middlewares/multer`);
const articlesRouter = new Router();

const api = apiFactory.getAPI();

articlesRouter.get(`/category/:id`, (req, res) => res.render(`articles/articles-by-category`));

articlesRouter.get(`/add`, async (req, res, next) => {
  try {
    const categories = await api.getCategories();
    res.render(`articles/new-post`, {categories});
  } catch (err) {
    next(err);
  }
});

articlesRouter.post(`/add`, upload.single(`upload`), async (req, res) => {

  const {body, file} = req;

  const articleData = {
    title: body.title,
    date: body.date,
    announce: body.announcement,
    fullText: body[`full-text`],
    categories: typeof body.category === `string` ? [body.category] : body.category || [],
    image: file ? file.filename : body.photo || ``
  };

  try {
    await api.createArticle(articleData);
    res.redirect(`/my`);
  } catch (error) {
    const categories = await api.getCategories();
    const errorMessages = error.response.data.errorMessages;

    res.render(`articles/new-post`, {article: articleData, categories, errorMessages});
  }
});

articlesRouter.get(`/edit/:id`, async (req, res, next) => {
  const {id} = req.params;

  try {
    const [article, categories] = await Promise.all([
      api.getArticle(id),
      api.getCategories()
    ]);

    const articleCategories = article.categories.reduce((acc, item) => ([
      item.id.toString(),
      ...acc
    ]), []);

    res.render(`articles/new-post`, {article: {...article, categories: articleCategories}, categories});
  } catch (err) {
    next(err);
  }
});

articlesRouter.post(`/edit/:id`, upload.single(`upload`), async (req, res) => {
  const {id} = req.params;
  const {body, file} = req;

  const newData = {
    title: body.title,
    date: body.date,
    announce: body.announcement,
    fullText: body[`full-text`],
    categories: typeof body.category === `string` ? [body.category] : body.category || [],
    image: file ? file.filename : body.photo || ``
  };

  try {
    await api.updateArticle(id, newData);
    res.redirect(`/my`);
  } catch (error) {
    const categories = await api.getCategories();
    const errorMessages = error.response.data.errorMessages;

    res.render(`articles/new-post`, {article: {...newData, id}, categories, errorMessages});
  }
});

articlesRouter.get(`/:id`, async (req, res, next) => {
  const {id} = req.params;

  try {
    const [article, allCategories] = await Promise.all([
      api.getArticle(id, {comments: true}),
      api.getCategories({count: true})
    ]);

    const categories = allCategories.filter((category) => {
      return article.categories.some((item) => item.id === category.id);
    });

    res.render(`articles/post`, {article, categories});
  } catch (err) {
    next(err);
  }
});

articlesRouter.post(`/:id`, upload.single(`upload`), async (req, res) => {

  const {id} = req.params;
  const {body} = req;

  const commentData = {
    text: body.message
  };

  try {
    await api.createComment(id, commentData);
    res.redirect(`back`);
  } catch (error) {
    const [article, allCategories] = await Promise.all([
      api.getArticle(id, {comments: true}),
      api.getCategories({count: true})
    ]);

    const categories = allCategories.filter((category) => {
      return article.categories.some((item) => item.id === category.id);
    });
    const errorMessages = error.response.data.errorMessages;

    res.render(`articles/post`, {article, categories, errorMessages});
  }
});

module.exports = articlesRouter;
