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

module.exports.Title = {
  MIN_LENGTH: 30,
  MAX_LENGTH: 250,
};

module.exports.Announce = {
  MIN_LENGTH: 30,
  MAX_LENGTH: 250,
};


module.exports.Comment = {
  MIN_LENGTH: 20,
  MAX_LENGTH: 1000,
};

module.exports.MAX_TEXT_LENGTH = 1000;

module.exports.MIN_CATEGORIES_LENGTH = 1;

module.exports.ArticleMessage = {

  REQUIRED: {
    TITLE: `Укажите название статьи`,
    ANNOUNCE: `Заполните описание статьи`,
    CATEGORIES: `Выберите хотя бы одну категорию`,
    DATE: `Выберите дату`,
  },
  VALID: {
    CATEGORIES: `Выбрана несуществующая категория`,
    DATE: `Неверный формат даты`
  },
  MIN_TITLE_LENGTH: `Заголовок должен быть не меньше 30 символов`,
  MAX_TITLE_LENGTH: `Заголовок должен быть не больше 250 символов`,
  MIN_ANNOUNCE_LENGTH: `Описание должно быть не меньше 30 символов`,
  MAX_ANNOUNCE_LENGTH: `Описание должно быть не больше 250 символов`,
  MAX_FULL_TEXT_LENGTH: `Текст статьи не можеты быть больше 1000 символов`,
};

module.exports.CommentMessage = {
  REQUIRED: `Сообщение не может быть пустым, напишите что-нибудь!`,
  MIN_TEXT_LENGTH: `Текст комментария должен быть не меньше 20 символов`,
  MAX_TEXT_LENGTH: `Текст объявления должен быть не больше 1000 символов`,
};

module.exports.API_PREFIX = `/api`;

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
