"use strict";

const CategoryModel = require(`./category`);
const CommentModel = require(`./comment`);
const ArticleModel = require(`./article`);
const ArticleCategoryModel = require(`./article-category`);

const define = (sequelize) => {
  const Category = CategoryModel.define(sequelize);
  const Comment = CommentModel.define(sequelize);
  const Article = ArticleModel.define(sequelize);
  const ArticleCategory = ArticleCategoryModel.define(sequelize);

  [CategoryModel, CommentModel, ArticleModel].forEach(
      (model) => model.defineRelations({Comment, Category, Article, ArticleCategory})
  );

  return {Category, Comment, Article, ArticleCategory};
};

module.exports = define;
