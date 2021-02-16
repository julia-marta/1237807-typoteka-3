'use strict';

const {nanoid} = require(`nanoid`);
const {MAX_ID_LENGTH} = require(`../../const`);

class ArticleService {
  constructor(posts) {
    this._posts = posts;
  }

  add(post) {
    const newPost = Object.assign({id: nanoid(MAX_ID_LENGTH), comments: []}, post);

    this._posts.push(newPost);
    return newPost;
  }

  delete(id) {
    const deletedPost = this._posts.find((item) => item.id === id);

    if (!deletedPost) {
      return null;
    }

    this._posts = this._posts.filter((item) => item.id !== id);
    return deletedPost;
  }

  findAll() {
    return this._posts;
  }

  findOne(id) {
    return this._posts.find((item) => item.id === id);
  }

  update(id, newPost) {
    const oldPost = this._posts.find((item) => item.id === id);

    return Object.assign(oldPost, newPost);
  }
}

module.exports = ArticleService;
