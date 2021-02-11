'use strict';

const {Router} = require(`express`);
const articlesRouter = new Router();

articlesRouter.get(`/category/:id`, (req, res) => res.render(`articles/articles-by-category`, {user: {type: `guest`}}));
articlesRouter.get(`/add`, (req, res) => res.render(`articles/new-post`, {user: {type: `admin`}}));
articlesRouter.get(`/edit/:id`, (req, res) => res.render(`articles/new-post`, {user: {type: `admin`}}));
articlesRouter.get(`/:id`, (req, res) => res.render(`articles/post`, {user: {type: `guest`}}));

module.exports = articlesRouter;
