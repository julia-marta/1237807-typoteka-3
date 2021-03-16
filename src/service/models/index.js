"use strict";

const {defineCategory, defineCategoryRelations} = require(`./category`);
const {defineComment, defineCommentRelations} = require(`./comment`);
const {defineArticle, defineArticleRelations} = require(`./article`);
const defineArticleCategory = require(`./article-category`);

const define = (sequelize) => {
  const Category = defineCategory(sequelize);
  const Comment = defineComment(sequelize);
  const Article = defineArticle(sequelize);
  const ArticleCategory = defineArticleCategory(sequelize);

  defineArticleRelations(Comment, Category, ArticleCategory);
  defineCommentRelations(Article);
  defineCategoryRelations(Article, ArticleCategory);

  return {Category, Comment, Article, ArticleCategory};
};

module.exports = define;
