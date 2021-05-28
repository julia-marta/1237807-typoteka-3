'use strict';

const axios = require(`axios`);

const TIMEOUT = 1000;
const DEFAULT_PORT = 3000;
const DEFAULT_HOST = `http://localhost`;

const port = process.env.API_PORT || DEFAULT_PORT;
const host = process.env.HOST || DEFAULT_HOST;
const defaultURL = `${host}:${port}/api/`;

class API {

  constructor(baseURL, timeout) {
    this._http = axios.create({
      baseURL,
      timeout
    });
  }

  async _load(url, options) {
    const response = await this._http.request({url, ...options});
    return response.data;
  }

  getArticles({offset, limit, comments} = {}) {
    return this._load(`/articles`, {params: {offset, limit, comments}});
  }

  getPopularArticles({limit} = {}) {
    return this._load(`/articles/popular`, {params: {limit}});
  }

  getArticlesByCategory(id, {offset, limit} = {}) {
    return this._load(`/articles/category/${id}`, {params: {offset, limit}});
  }

  getArticle(id, {comments} = {}) {
    return this._load(`/articles/${id}`, {params: {comments}});
  }

  getCategories({count} = {}) {
    return this._load(`/categories`, {params: {count}});
  }

  getCategory(id) {
    return this._load(`/categories/${id}`);
  }

  getAllComments() {
    return this._load(`/allcomments`);
  }

  getLastComments({limit} = {}) {
    return this._load(`/lastcomments`, {params: {limit}});
  }

  search(query) {
    return this._load(`/search`, {params: {query}});
  }

  createArticle(data) {
    return this._load(`/articles`, {
      method: `POST`,
      data
    });
  }

  updateArticle(id, data) {
    return this._load(`/articles/${id}`, {
      method: `PUT`,
      data
    });
  }

  deleteArticle(articleId) {
    return this._load(`/articles/${articleId}`, {
      method: `DELETE`,
    });
  }

  createComment(id, userId, data) {
    return this._load(`/articles/${id}/comments`, {
      method: `POST`,
      params: {userId},
      data
    });
  }

  deleteComment(id, articleId) {
    return this._load(`/articles/${articleId}/comments/${id}`, {
      method: `DELETE`
    });
  }

  createUser(data) {
    return this._load(`/user`, {
      method: `POST`,
      data
    });
  }

  createCategory(data) {
    return this._load(`/categories`, {
      method: `POST`,
      data
    });
  }

  loginUser(data) {
    return this._load(`/user/login`, {
      method: `POST`,
      data
    });
  }
}

const defaultAPI = new API(defaultURL, TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI
};
