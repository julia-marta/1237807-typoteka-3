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

module.exports.Category = {
  MIN_LENGTH: 5,
  MAX_LENGTH: 30,
};

module.exports.MAX_TEXT_LENGTH = 1000;

module.exports.MIN_CATEGORIES_LENGTH = 1;

module.exports.MIN_PASSWORD_LENGTH = 6;

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

module.exports.CategoryMessage = {
  REQUIRED: `Введите название категории`,
  MIN_TEXT_LENGTH: `Название категории должно быть не меньше 5 символов`,
  MAX_TEXT_LENGTH: `Название категории должно быть не больше 30 символов`,
};

module.exports.UserMessage = {

  REQUIRED: {
    EMAIL: `Укажите ваш e-mail`,
    FIRSTNAME: `Укажите ваше имя`,
    LASTNAME: `Укажите вашу фамилию`,
    PASSWORD: `Введите пароль`,
    REPEAT: `Введите пароль ещё раз`,
  },
  VALID: {
    EMAIL: `E-mail не валиден. Введите валидный адре электронной почты`,
    FIRSTNAME: `Имя может содержать только буквы и не должно включать пробелы`,
    LASTNAME: `Фамилия может содержать только буквы и не должна включать пробелы`,
    REPEAT: `Пароли не совпадают. Проверьте введённые данные`
  },
  MIN_PASSWORD_LENGTH: `Пароль должен быть не меньше 6 символов`,
  EMAIL_ALREADY_REGISTERED: `Пользователь с таким электронным адресом уже зарегистрирован`
};

module.exports.LoginMessage = {

  REQUIRED: {
    EMAIL: `Укажите ваш e-mail`,
    PASSWORD: `Введите пароль`,
  },
  EMAIL_NOT_VALID: `E-mail не валиден. Введите валидный адре электронной почты`,
  EMAIL_NOT_REGISTERED: `Пользователь с таким электронным адресом не зарегистрирован`,
  WRONG_PASSWORD: `Неверный пароль`
};

module.exports.ARTICLES_PER_PAGE = 8;

module.exports.PAGER_WIDTH = 2;

module.exports.API_PREFIX = `/api`;

module.exports.WrapperType = {
  "/search": `wrapper-color`,
  "/categories": `wrapper wrapper--nobackground`,
  "/my": `wrapper wrapper--nobackground`,
  "/my/comments": `wrapper wrapper--nobackground`
};
