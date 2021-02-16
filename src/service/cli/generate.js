'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const {nanoid} = require(`nanoid`);

const {ExitCode, MAX_ID_LENGTH} = require(`../../const`);
const {getRandomInt, shuffleArray} = require(`../../utils`);

const FILE_NAME = `mocks.json`;
const MAX_SENTENCES = 5;
const MONTH_PERIOD = 3;

const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_COMMENTS_PATH = `./data/comments.txt`;

const PostRestrict = {
  MIN: 1,
  MAX: 1000,
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
    console.error(chalk.red(err));
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
    id: nanoid(MAX_ID_LENGTH),
    text: shuffleArray(comments)
      .slice(0, getRandomInt(CommentLengthRestrict.MIN, CommentLengthRestrict.MAX))
      .join(` `),
  }))
);

const generatePosts = (count, titles, sentences, categories, comments) => (
  Array(count).fill({}).map(() => ({
    id: nanoid(MAX_ID_LENGTH),
    title: titles[getRandomInt(0, titles.length - 1)],
    announce: shuffleArray(sentences).slice(0, getRandomInt(1, MAX_SENTENCES)).join(` `),
    fullText: shuffleArray(sentences).slice(0, getRandomInt(1, sentences.length - 1)).join(` `),
    createdDate: generateDate(),
    category: shuffleArray(categories).slice(0, getRandomInt(1, categories.length - 1)),
    comments: generateComments(getRandomInt(CommentsRestrict.MIN, CommentsRestrict.MAX), comments),
  }))
);

module.exports = {
  name: `--generate`,

  async run(args) {
    const titles = await readContent(FILE_TITLES_PATH);
    const sentences = await readContent(FILE_SENTENCES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);
    const comments = await readContent(FILE_COMMENTS_PATH);

    const [count] = args;
    const countNumber = Number.parseInt(count, 10) || PostRestrict.MIN;

    if (countNumber > PostRestrict.MAX) {
      console.error(chalk.red(`Не больше 1000 публикаций`));
      process.exit(ExitCode.success);
    }

    const countOffer = countNumber > PostRestrict.MIN ? countNumber : PostRestrict.MIN;
    const content = JSON.stringify(generatePosts(countOffer, titles, sentences, categories, comments));

    try {
      await fs.writeFile(FILE_NAME, content);
      console.log(chalk.green(`Operation success. File created.`));
      process.exit(ExitCode.success);
    } catch (err) {
      console.error(chalk.red(`Can't write data to file...`));
      process.exit(ExitCode.error);
    }
  }
};
