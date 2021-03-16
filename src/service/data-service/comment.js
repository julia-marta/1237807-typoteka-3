'use strict';

class CommentService {

  constructor(sequelize) {
    this._Comment = sequelize.models.Comment;
  }

  async create(articleId, comment) {
    const newComment = await this._Comment.create({
      articleId,
      ...comment
    });
    return newComment.get();
  }

  async delete(id) {
    const deletedRows = await this._Comment.destroy({
      where: {id}
    });
    return !!deletedRows;
  }

  async findAll(articleId) {
    return this._Comment.findAll({
      where: {articleId},
      raw: true
    });
  }
}

module.exports = CommentService;
