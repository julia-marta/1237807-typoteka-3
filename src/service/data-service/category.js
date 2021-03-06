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
    return this._Category.findAll({
      raw: true,
      order: [[`createdAt`, `DESC`]]
    });
  }

  findAllWithArticles(categoryId) {

    return this._ArticleCategory.findAll({
      raw: true,
      where: {CategoryId: categoryId}
    });
  }

  async add(newCategory) {
    const category = await this._Category.create(newCategory);

    return category.get();
  }

  async update(id, newCategory) {
    const [affectedRows] = await this._Category.update(newCategory, {
      where: {id}
    });

    return !!affectedRows;
  }

  async delete(id) {
    const deletedRows = await this._Category.destroy({
      where: {id}
    });
    return !!deletedRows;
  }
}

module.exports = CategoryService;
