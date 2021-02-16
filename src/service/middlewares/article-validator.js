'use strict';

const {HttpCode} = require(`../../const`);

const articleKeys = [`title`, `announce`, `fullText`, `createdDate`, `category`];

module.exports = (req, res, next) => {
  const newPost = req.body;
  const keys = Object.keys(newPost);
  const keysExists = articleKeys.every((key) => keys.includes(key));
  const keysValid = keys.every((key) => articleKeys.includes(key));

  if (!keysExists || !keysValid) {
    return res.status(HttpCode.BAD_REQUEST).send(`Bad request`);
  }

  return next();
};
