'use strict';

const Sequelize = require(`sequelize`);
const Aliase = require(`../models/aliase`);

class CategoryService {
  constructor(sequelize) {
    this._Category = sequelize.models.Category;
    this._ArticleCategory = sequelize.models.ArticleCategory;
  }

  async findAllWithCount() {
    const result = await this._Category.findAll({
      attributes: [
        `id`,
        `name`,
        [
          Sequelize.fn(`COUNT`, Sequelize.col(`articleCategories.CategoryId`)), `count`]
      ],
      group: [Sequelize.col(`Category.id`)],
      include: [{
        model: this._ArticleCategory,
        as: Aliase.ARTICLE_CATEGORIES,
        attributes: [],
      }]
    });

    return result.map((it) => it.get());
  }

  findOne(id) {
    return this._Category.findByPk(id);
  }

  findAll() {
    return this._Category.findAll({raw: true});
  }
}

module.exports = CategoryService;
