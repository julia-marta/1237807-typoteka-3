"use strict";

const {DataTypes, Model} = require(`sequelize`);
const Aliase = require(`./aliase`);

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

const defineRelations = ({Article, User}) => {

  Comment.belongsTo(Article, {foreignKey: `articleId`, as: Aliase.ARTICLES});
  Comment.belongsTo(User, {foreignKey: `userId`, as: Aliase.USERS});
};

module.exports = {define, defineRelations};
