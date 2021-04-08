'use strict';

const Joi = require(`joi`);
const {ArticleMessage, Title, Announce, MAX_TEXT_LENGTH, MIN_CATEGORIES_LENGTH} = require(`../../const`);

module.exports = (categories) => {
  return Joi.object({

    title: Joi.string()
    .min(Title.MIN_LENGTH)
    .max(Title.MAX_LENGTH)
    .empty(``)
    .required()
    .messages({
      'string.min': ArticleMessage.MIN_TITLE_LENGTH,
      'string.max': ArticleMessage.MAX_TITLE_LENGTH,
      'any.required': ArticleMessage.REQUIRED.TITLE,
    }),

    date: Joi.string()
    .isoDate()
    .empty(``)
    .required()
    .messages({
      'string.isoDate': ArticleMessage.VALID.DATE,
      'any.required': ArticleMessage.REQUIRED.DATE,
    }),

    announce: Joi.string()
    .min(Announce.MIN_LENGTH)
    .max(Announce.MAX_LENGTH)
    .empty(``)
    .required()
    .messages({
      'string.min': ArticleMessage.MIN_ANNOUNCE_LENGTH,
      'string.max': ArticleMessage.MAX_ANNOUNCE_LENGTH,
      'any.required': ArticleMessage.REQUIRED.ANNOUNCE,
    }),

    fullText: Joi.string()
    .max(MAX_TEXT_LENGTH)
    .empty(``)
    .messages({
      'string.max': ArticleMessage.MAX_FULL_TEXT_LENGTH,
    }),

    categories: Joi.array()
    .items(Joi.number()
    .valid(...categories))
    .min(MIN_CATEGORIES_LENGTH)
    .required()
    .messages({
      'any.required': ArticleMessage.REQUIRED.CATEGORIES,
      'array.min': ArticleMessage.REQUIRED.CATEGORIES,
      'array.base': ArticleMessage.VALID.CATEGORIES,
      'any.only': ArticleMessage.VALID.CATEGORIES
    }),

    image: Joi.string()
    .empty(``),

  });
};
