'use strict';

const Aliase = require(`../models/aliase`);

class ArticleService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Comment = sequelize.models.Comment;
    this._Category = sequelize.models.Category;
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

  async findAll(withComments) {
    const include = [Aliase.CATEGORIES];

    if (withComments) {
      include.push(Aliase.COMMENTS);
    }

    const articles = await this._Article.findAll({include});

    return articles.map((article) => article.get());
  }

  async findOne(id, withComments) {
    const include = [Aliase.CATEGORIES];

    if (withComments) {
      include.push(Aliase.COMMENTS);
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
