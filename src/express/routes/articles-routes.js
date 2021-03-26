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
    announce: body.announcement,
    fullText: body[`full-text`],
    categories: body.category,
    image: file ? file.filename : body.photo || ``
  };

  try {
    await api.createArticle(articleData);
    res.redirect(`/my`);
  } catch (error) {
    res.redirect(`back`);
  }
});

articlesRouter.get(`/edit/:id`, async (req, res, next) => {
  const {id} = req.params;

  try {
    const [article, categories] = await Promise.all([
      api.getArticle(id),
      api.getCategories()
    ]);

    res.render(`articles/new-post`, {article, categories});
  } catch (err) {
    next(err);
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

module.exports = articlesRouter;
