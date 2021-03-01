'use strict';

module.exports.DEFAULT_COMMAND = `--help`;
module.exports.USER_ARGV_INDEX = 2;
module.exports.ExitCode = {
  error: 1,
  success: 0,
};

module.exports.HttpCode = {
  OK: 200,
  CREATED: 201,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  FORBIDDEN: 403,
  UNAUTHORIZED: 401,
  BAD_REQUEST: 400,
};

module.exports.API_PREFIX = `/api`;

module.exports.MAX_ID_LENGTH = 6;

const WrapperType = {
  COLOR: `wrapper-color`,
  NO_BACKGROUND: `wrapper wrapper--nobackground`,
};

const {COLOR, NO_BACKGROUND} = WrapperType;

module.exports.PageStyle = {
  "/search": {
    wrapper: COLOR,
  },
  "/categories": {
    wrapper: NO_BACKGROUND,
    type: `admin`
  },
  "/my": {
    wrapper: NO_BACKGROUND,
    type: `admin`
  },
  "/my/comments": {
    wrapper: NO_BACKGROUND,
    type: `admin`
  },
  "/articles/add": {
    type: `admin`
  }
};
