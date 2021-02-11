'use strict';

const {Router} = require(`express`);
const myRouter = new Router();

myRouter.get(`/`, (req, res) => res.render(`my/my`, {user: {type: `admin`}, wrapper: `wrapper wrapper--nobackground`}));
myRouter.get(`/comments`, (req, res) => res.render(`my/comments`, {user: {type: `admin`}, wrapper: `wrapper wrapper--nobackground`}));

module.exports = myRouter;
