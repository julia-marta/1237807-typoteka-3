'use strict';

const {HttpCode} = require(`../../const`);

module.exports = (service) => (req, res, next) => {
  const {articleId} = req.params;
  const post = service.findOne(articleId);

  if (!post) {
    return res.status(HttpCode.NOT_FOUND).send(`Post with ${articleId} not found`);
  }

  res.locals.post = post;
  return next();
};
