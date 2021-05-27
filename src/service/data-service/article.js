'use strict';
const Sequelize = require(`sequelize`);
const Aliase = require(`../models/aliase`);

class ArticleService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Comment = sequelize.models.Comment;
    this._Category = sequelize.models.Category;
    this._ArticleCategory = sequelize.models.ArticleCategory;
  }

  async findAll(withComments) {
    const include = [Aliase.CATEGORIES];

    if (withComments) {
      include.push(Aliase.COMMENTS);
    }

    const articles = await this._Article.findAll({
      include,
      order: [[`date`, `DESC`]]
    });

    return articles.map((article) => article.get());
  }

  async findOne(id, withComments) {
    const include = [Aliase.CATEGORIES];

    if (withComments) {
      include.push({
        model: this._Comment,
        as: Aliase.COMMENTS,
        include: [Aliase.USERS],
      });
    }

    return this._Article.findByPk(id, {include});
  }

  async findPage({limit, offset, comments}) {
    const tables = [Aliase.CATEGORIES];

    if (comments) {
      tables.push(Aliase.COMMENTS);
    }

    const {count, rows} = await this._Article.findAndCountAll({
      limit,
      offset,
      include: tables,
      distinct: true
    });

    return {count, articles: rows};
  }

  async findPageByCategory({limit, offset, categoryId}) {
    const {count, rows} = await this._Article.findAndCountAll({
      limit,
      offset,
      include: [Aliase.CATEGORIES, Aliase.COMMENTS, {
        model: this._ArticleCategory,
        as: Aliase.ARTICLE_CATEGORIES,
        attributes: [],
        require: true,
        where: {CategoryId: categoryId}
      }],
      distinct: true,
      order: [[`createdAt`, `DESC`]]
    });

    return {count, articles: rows.map((item) => item.get())};
  }

  async findAllByCategory(categoryId) {

    const articles = await this._Article.findAll({
      include: [Aliase.CATEGORIES, Aliase.COMMENTS, {
        model: this._ArticleCategory,
        as: Aliase.ARTICLE_CATEGORIES,
        attributes: [],
        require: true,
        where: {CategoryId: categoryId}
      }],
      order: [[`createdAt`, `DESC`]]
    });

    return articles.map((offer) => offer.get());
  }

  async findPopular(limit) {
    const articles = await this._Article.findAll({
      limit,
      attributes: {
        include: [Sequelize.fn(`COUNT`, Sequelize.col(`comments.id`)), `count`]
      },
      include: [
        {
          model: this._Comment,
          as: Aliase.COMMENTS,
          attributes: [],
          duplicating: false,
        }
      ],
      group: [`Article.id`],
      order: [[`count`, `DESC`]],
    });

    return articles.map((offer) => offer.get());
  }

  async add(articleData) {
    const article = await this._Article.create(articleData);
    await article.addCategories(articleData.categories);
    return article.get();
  }

  async delete(id) {
    const deletedRows = await this._Article.destroy({
      where: {id}
    });
    return !!deletedRows;
  }

  async update(id, articleData) {
    const [affectedRows] = await this._Article.update(articleData, {
      where: {id}
    });

    const updatedArticle = await this._Article.findByPk(id);
    await updatedArticle.setCategories(articleData.categories);

    return !!affectedRows;
  }
}

module.exports = ArticleService;
