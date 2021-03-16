"use strict";

const {DataTypes, Model} = require(`sequelize`);

class Comment extends Model {}

const defineComment = (sequelize) => Comment.init({
  text: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: `Comment`,
  tableName: `comments`
});

const defineCommentRelations = (Article) => {

  Comment.belongsTo(Article, {foreignKey: `articleId`});
};

module.exports = {defineComment, defineCommentRelations};
