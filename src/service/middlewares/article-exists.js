'use strict';

const {HttpCode} = require(`../../const`);

module.exports = (service, logger) => (req, res, next) => {
  const {articleId} = req.params;
  const post = service.findOne(articleId);

  if (!post) {
    res.status(HttpCode.NOT_FOUND).send(`Post with ${articleId} not found`);
    return logger.error(`Post not found: ${articleId}`);
  }

  res.locals.post = post;
  return next();
};
