'use strict';

const express = require(`express`);
const expressSession = require(`express-session`);
const path = require(`path`);

const articlesRoutes = require(`./routes/articles-routes`);
const myRoutes = require(`./routes/my-routes`);
const mainRoutes = require(`./routes/main-routes`);
const {HttpCode, WrapperType} = require(`../const`);

const DEFAULT_PORT = 8080;
const PUBLIC_DIR = `public`;
const UPLOAD_DIR = `upload`;
const TEMPLATES_DIR = `templates`;

const app = express();


app.use(expressSession({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  name: `session_id`
}));

app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));
app.use(express.static(path.resolve(__dirname, UPLOAD_DIR)));

app.set(`views`, path.resolve(__dirname, TEMPLATES_DIR));
app.set(`view engine`, `pug`);

app.use((req, res, next) => {
  res.locals.type = `guest`;
  next();
});

app.use((req, res, next) => {
  if (WrapperType[req.url]) {
    res.locals.wrapper = WrapperType[req.url];
  }
  next();
});

app.use(`/articles`, articlesRoutes);
app.use(`/my`, myRoutes);
app.use(`/`, mainRoutes);

app.use((req, res) => res.status(HttpCode.BAD_REQUEST).render(`errors/404`));
app.use((err, _req, res, _next) => {
  res.status(HttpCode.INTERNAL_SERVER_ERROR).render(`errors/500`);
});

app.listen(process.env.PORT || DEFAULT_PORT);
