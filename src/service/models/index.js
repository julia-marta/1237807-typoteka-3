"use strict";

const CategoryModel = require(`./category`);
const CommentModel = require(`./comment`);
const ArticleModel = require(`./article`);
const ArticleCategoryModel = require(`./article-category`);
const UserModel = require(`./user`);

const define = (sequelize) => {
  const Category = CategoryModel.define(sequelize);
  const Comment = CommentModel.define(sequelize);
  const Article = ArticleModel.define(sequelize);
  const ArticleCategory = ArticleCategoryModel.define(sequelize);
  const User = UserModel.define(sequelize);

  [CategoryModel, CommentModel, ArticleModel, UserModel].forEach(
      (model) => model.defineRelations({Comment, Category, Article, ArticleCategory, User})
  );

  return {Category, Comment, Article, ArticleCategory, User};
};

module.exports = define;
