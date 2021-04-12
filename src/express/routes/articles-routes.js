'use strict';

const {Router} = require(`express`);
const apiFactory = require(`../api`);
const {upload} = require(`../middlewares/multer`);
const articlesRouter = new Router();

const api = apiFactory.getAPI();

articlesRouter.get(`/category/:id`, (req, res) => res.render(`articles/articles-by-category`));

articlesRouter.get(`/add`, async (req, res, next) => {

  const {article = null, errorMessages = null} = req.session;

  try {
    const categories = await api.getCategories();
    req.session.destroy();
    res.render(`articles/new-post`, {categories, article, errorMessages});
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
    return res.redirect(`/my`);
  } catch (error) {
    req.session.article = articleData;
    req.session.errorMessages = error.response.data.errorMessages;

    return res.redirect(`/articles/add`);
  }
});

articlesRouter.get(`/edit/:id`, async (req, res, next) => {
  const {id} = req.params;
  const {newData = null, errorMessages = null} = req.session;

  try {
    const categories = await api.getCategories();
    let article;

    if (newData) {
      article = {...newData, id};
    } else {
      article = await api.getArticle(id);
      const articleCategories = article.categories.reduce((acc, item) => ([
        item.id.toString(),
        ...acc
      ]), []);
      article = {...article, categories: articleCategories};
    }
    req.session.destroy();
    res.render(`articles/new-post`, {article, categories, errorMessages});
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
    return res.redirect(`/my`);
  } catch (error) {
    req.session.newData = newData;
    req.session.errorMessages = error.response.data.errorMessages;

    return res.redirect(`/articles/edit/${id}`);
  }
});

articlesRouter.get(`/:id`, async (req, res, next) => {
  const {id} = req.params;
  const {errorMessages = null} = req.session;

  try {
    const [article, allCategories] = await Promise.all([
      api.getArticle(id, {comments: true}),
      api.getCategories({count: true})
    ]);

    const categories = allCategories.filter((category) => {
      return article.categories.some((item) => item.id === category.id);
    });

    req.session.destroy();
    res.render(`articles/post`, {article, categories, errorMessages});
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
    return res.redirect(`back`);
  } catch (error) {
    req.session.errorMessages = error.response.data.errorMessages;
    return res.redirect(`back`);
  }
});

module.exports = articlesRouter;
