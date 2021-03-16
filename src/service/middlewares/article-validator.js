'use strict';

const {HttpCode} = require(`../../const`);

const articleKeys = [`title`, `announce`, `fullText`, `createdDate`, `categories`, `image`];

module.exports = (logger) => (req, res, next) => {
  const newPost = req.body;
  const keys = Object.keys(newPost);
  const keysExists = articleKeys.every((key) => keys.includes(key));
  const keysValid = keys.every((key) => articleKeys.includes(key));

  if (!keysExists || !keysValid) {
    res.status(HttpCode.BAD_REQUEST).send(`Bad request`);

    if (!keysExists) {
      const missedKeys = articleKeys.filter((key) => !keys.includes(key));
      return logger.error(`Post not valid. Required properties: ${missedKeys}.`);
    } else {
      const excessKeys = keys.filter((key) => !articleKeys.includes(key));
      return logger.error(`Post not valid. Invalid properties: ${excessKeys}.`);
    }
  }

  return next();
};
