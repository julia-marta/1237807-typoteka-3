'use strict';

const {nanoid} = require(`nanoid`);
const {MAX_ID_LENGTH} = require(`../../const`);

class CommentService {

  create(post, comment) {
    const newComment = Object.assign({
      id: nanoid(MAX_ID_LENGTH),
    }, comment);

    post.comments.push(newComment);
    return newComment;
  }

  delete(post, commentId) {
    const deletedComment = post.comments.find((item) => item.id === commentId);

    if (!deletedComment) {
      return null;
    }

    post.comments = post.comments.filter((item) => item.id !== commentId);

    return deletedComment;
  }

  findAll(post) {
    return post.comments;
  }
}

module.exports = CommentService;
