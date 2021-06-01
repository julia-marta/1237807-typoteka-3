'use strict';

const SERVER_URL = `http://localhost:3000`;
const MAX_TEXT_LENGTH = 100;

const socket = io(SERVER_URL);

const popularArticlesList = document.querySelector(`.hot__list`);
const lastCommentsList = document.querySelector(`.last__list`);

const createArticle = (article) => {
  const newArticle = document.createElement(`div`);

  newArticle.innerHTML = `
    <li class="hot__list-item">
      <a class="hot__list-link" href="/articles/${article.id}">
      ${article.announce.length > MAX_TEXT_LENGTH ? `${article.announce.substr(0, MAX_TEXT_LENGTH)}...` : article.announce}
        <sup class="hot__link-sup">${article.count}</sup>
      </a>
    </li>`

  return newArticle.firstElementChild;
}

const createComment = (comment) => {
  const newComment = document.createElement(`div`);

  newComment.innerHTML = `
    <li class="last__list-item">
      <img class="last__list-image" src="/img/${comment.users.avatar}" width="20" height="20" alt="Аватар пользователя">
      <b class="last__list-name">${comment.users.firstname} ${comment.users.lastname}</b>
      <a class="last__list-link" href="/articles/${comment.articleId}">
        ${comment.text.length > MAX_TEXT_LENGTH ? `${comment.text.substr(0, MAX_TEXT_LENGTH)}...` : comment.text}
      </a>
    </li>`

  return newComment.firstElementChild;
}

socket.addEventListener(`articles`, (articles) => {
  popularArticlesList.innerHTML = ``;

  articles.forEach((article) => {
    popularArticlesList.appendChild(createArticle(article));
  })
});

socket.addEventListener(`comments`, (comments) => {
  lastCommentsList.innerHTML = ``;

  comments.forEach((comment) => {
    lastCommentsList.appendChild(createComment(comment));
  })
});

socket.addEventListener(`connect`, () => {
  console.log(`Подключено`);
});

socket.addEventListener(`disconnect`, () => {
  console.log(`Отключён`);
});
