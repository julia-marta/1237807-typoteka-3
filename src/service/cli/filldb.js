'use strict';

const fs = require(`fs`).promises;
const sequelize = require(`../lib/sequelize`);
const initDatabase = require(`../lib/init-db`);
const {getLogger} = require(`../lib/logger`);
const {ExitCode} = require(`../../const`);
const {getRandomInt, shuffleArray} = require(`../../utils`);

const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_IMAGES_PATH = `./data/images.txt`;
const FILE_COMMENTS_PATH = `./data/comments.txt`;

const logger = getLogger({});

const MONTH_PERIOD = 3;

const ArticleRestrict = {
  MIN: 3,
  MAX: 1000,
};

const AnnounceRestrict = {
  MIN: 1,
  MAX: 3,
};

const FullTextRestrict = {
  MIN: 1,
  MAX: 5,
};

const CategoriesRestrict = {
  MIN: 1,
  MAX: 3,
};

const CommentsRestrict = {
  MIN: 1,
  MAX: 4,
};

const CommentLengthRestrict = {
  MIN: 1,
  MAX: 3,
};

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.split(`\n`);
  } catch (err) {
    logger.error(`Error when reading file: ${err.message}`);
    return [];
  }
};

const generateDate = () => {
  const earliestDate = new Date();
  earliestDate.setMonth(earliestDate.getMonth() - MONTH_PERIOD);
  const minTimestamp = earliestDate - new Date(0);
  const maxTimestamp = new Date() - new Date(0);
  const randomTimestamp = getRandomInt(minTimestamp, maxTimestamp);
  const createdDate = new Date(randomTimestamp);
  return createdDate;
};

const generateComments = (count, comments) => (
  Array(count).fill({}).map(() => ({
    text: shuffleArray(comments)
      .slice(0, getRandomInt(CommentLengthRestrict.MIN, CommentLengthRestrict.MAX))
      .join(` `),
  }))
);

const generateArticles = (count, titles, sentences, images, categories, comments) => (
  Array(count).fill({}).map(() => ({
    title: titles[getRandomInt(0, titles.length - 1)],
    date: generateDate(),
    announce: shuffleArray(sentences).slice(0, getRandomInt(AnnounceRestrict.MIN, AnnounceRestrict.MAX)).join(` `),
    fullText: shuffleArray(sentences).slice(0, getRandomInt(FullTextRestrict.MIN, FullTextRestrict.MAX)).join(` `),
    image: images[getRandomInt(0, images.length - 1)],
    categories: shuffleArray(categories).slice(0, getRandomInt(CategoriesRestrict.MIN, CategoriesRestrict.MAX)),
    comments: generateComments(getRandomInt(CommentsRestrict.MIN, CommentsRestrict.MAX), comments),
  }))
);

module.exports = {
  name: `--filldb`,

  async run(args) {

    try {
      logger.info(`Trying to connect to database...`);
      await sequelize.authenticate();
    } catch (err) {
      logger.error(`An error occured: ${err.message}`);
      process.exit(ExitCode.error);
    }
    logger.info(`Connection to database established`);

    const titles = await readContent(FILE_TITLES_PATH);
    const sentences = await readContent(FILE_SENTENCES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);
    const images = await readContent(FILE_IMAGES_PATH);
    const comments = await readContent(FILE_COMMENTS_PATH);

    const [count] = args;
    const countNumber = Number.parseInt(count, 10) || ArticleRestrict.MIN;

    if (countNumber > ArticleRestrict.MAX) {
      logger.error(`Не больше 1000 публикаций`);
      process.exit(ExitCode.success);
    }

    const countArticle = countNumber > ArticleRestrict.MIN ? countNumber : ArticleRestrict.MIN;

    const articles = generateArticles(countArticle, titles, sentences, images, categories, comments);

    return initDatabase(sequelize, {articles, categories});
  }
};
