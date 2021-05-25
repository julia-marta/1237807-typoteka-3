'use strict';

module.exports = (req, res, next) => {
  const {isAdmin} = req.session;

  if (!isAdmin) {
    return res.redirect(`/`);
  }

  return next();
};
