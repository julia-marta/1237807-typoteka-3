"use strict";

const {DataTypes, Model} = require(`sequelize`);

class Comment extends Model {}

const define = (sequelize) => Comment.init({
  text: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: `Comment`,
  tableName: `comments`
});

const defineRelations = ({Article}) => {

  Comment.belongsTo(Article, {foreignKey: `articleId`});
};

module.exports = {define, defineRelations};
