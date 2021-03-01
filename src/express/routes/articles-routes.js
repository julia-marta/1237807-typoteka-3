'use strict';

const {Router} = require(`express`);
const apiFactory = require(`../api`);
const {upload} = require(`../middlewares/multer`);
const articlesRouter = new Router();

const api = apiFactory.getAPI();

articlesRouter.get(`/category/:id`, (req, res) => res.render(`articles/articles-by-category`));

articlesRouter.get(`/add`, async (req, res) => {
  const categories = await api.getCategories();
  res.render(`articles/new-post`, {categories});
});

articlesRouter.post(`/add`, upload.single(`upload`), async (req, res) => {

  const {body, file} = req;

  const articleData = {
    title: body.title,
    announce: body.announcement,
    fullText: body[`full-text`],
    createdDate: body.date,
    category: body.category,
    image: file.filename,
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
    ]).catch((error) => {
      throw error;
    });

    res.render(`articles/new-post`, {article, categories});
  } catch (err) {
    next(err);
  }
});

articlesRouter.get(`/:id`, async (req, res, next) => {
  const {id} = req.params;

  try {
    const [article, articles] = await Promise.all([
      api.getArticle(id),
      api.getArticles()
    ]).catch((error) => {
      throw error;
    });

    res.render(`articles/post`, {article, articles});
  } catch (err) {
    next(err);
  }
});

module.exports = articlesRouter;
