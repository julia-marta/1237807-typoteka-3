'use strict';

const {Router} = require(`express`);
const mainRouter = new Router();

mainRouter.get(`/`, (req, res) => res.render(`main`, {user: {type: `guest`}}));
mainRouter.get(`/register`, (req, res) => res.render(`sign-up`, {user: {type: `guest`}}));
mainRouter.get(`/login`, (req, res) => res.render(`login`, {user: {type: `guest`}}));
mainRouter.get(`/search`, (req, res) => res.render(`search`, {user: {type: `guest`}, wrapper: `wrapper-color`}));
mainRouter.get(`/categories`, (req, res) => res.render(`all-categories`, {user: {type: `admin`}, wrapper: `wrapper wrapper--nobackground`}));

module.exports = mainRouter;
