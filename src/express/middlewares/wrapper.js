'use strict';

const {WrapperType} = require(`../../const`);

module.exports = (req, res, next) => {

  if (WrapperType[req.route.path]) {
    res.locals.wrapper = WrapperType[req.route.path];
  }

  return next();
};
