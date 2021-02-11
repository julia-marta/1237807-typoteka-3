'use strict';

const express = require(`express`);
const path = require(`path`);

const articlesRoutes = require(`./routes/articles-routes`);
const myRoutes = require(`./routes/my-routes`);
const mainRoutes = require(`./routes/main-routes`);

const {PageStyle} = require(`../const`);

const DEFAULT_PORT = 8080;
const PUBLIC_DIR = `public`;
const TEMPLATES_DIR = `templates`;

const app = express();

app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));

app.set(`views`, path.resolve(__dirname, TEMPLATES_DIR));
app.set(`view engine`, `pug`);

app.use((req, res, next) => {
  if (PageStyle[req.url] && PageStyle[req.url].type) {
    res.locals.type = PageStyle[req.url].type;
  } else {
    res.locals.type = `guest`;
  }
  next();
});

app.use((req, res, next) => {
  if (PageStyle[req.url] && PageStyle[req.url].wrapper) {
    res.locals.wrapper = PageStyle[req.url].wrapper;
  }
  next();
});

app.use(`/articles`, articlesRoutes);
app.use(`/my`, myRoutes);
app.use(`/`, mainRoutes);

app.use((req, res) => res.status(400).render(`errors/404`));
app.use((err, req, res, _next) => res.status(500).render(`errors/500`));

app.listen(DEFAULT_PORT);
