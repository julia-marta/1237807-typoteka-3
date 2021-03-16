"use strict";

const {DataTypes, Model} = require(`sequelize`);
const Aliase = require(`./aliase`);

class Article extends Model {}

const defineArticle = (sequelize) => Article.init({
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  announce: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fullText: {
    // eslint-disable-next-line new-cap
    type: DataTypes.STRING(1000),
    field: `full_text`
  },
  image: DataTypes.STRING
}, {
  sequelize,
  modelName: `Article`,
  tableName: `articles`
});

const defineArticleRelations = (Comment, Category, ArticleCategory) => {

  Article.hasMany(Comment, {as: Aliase.COMMENTS, foreignKey: `articleId`});
  Article.belongsToMany(Category, {through: ArticleCategory, as: Aliase.CATEGORIES});
};

module.exports = {defineArticle, defineArticleRelations};