'use strict';

const mockCategories = [
  `Деревья`,
  `IT`,
  `Кино`,
  `Путешествия`,
  `За жизнь`,
  `Без рамки`,
  `Велоспорт`,
  `Железо`,
  `Разное`,
  `Музыка`,
];

const mockArticles = [
  {
    title: `Как достигнуть успеха не вставая с кресла`,
    date: `2021-03-15T17:14:35.012Z`,
    announce: `Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?`,
    fullText: `Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Это один из лучших рок-музыкантов. Из под его пера вышло 8 платиновых альбомов. Простые ежедневные упражнения помогут достичь успеха. Он написал больше 30 хитов. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Достичь успеха помогут ежедневные повторения.`,
    categories: [
      `Деревья`,
      `IT`,
      `Кино`,
      `Путешествия`,
      `За жизнь`,
      `Без рамки`,
      `Велоспорт`
    ],
  },
  {
    title: `Как достигнуть успеха не вставая с кресла`,
    date: `2021-02-05T05:50:44.884Z`,
    announce: `Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Он написал больше 30 хитов.`,
    fullText: `Как начать действовать? Для начала просто соберитесь. Достичь успеха помогут ежедневные повторения. Это один из лучших рок-музыкантов. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Он написал больше 30 хитов. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Собрать камни бесконечности легко, если вы прирожденный герой. Простые ежедневные упражнения помогут достичь успеха. Золотое сечение — соотношение двух величин, гармоническая пропорция. Программировать не настолько сложно, как об этом говорят. Ёлки — это не просто красивое дерево. Это прочная древесина. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем.`,
    categories: [
      `За жизнь`
    ],
    image: `sea@1x.jpg`,
  },
  {
    title: `Лучшие рок-музыканты 20-века`,
    date: `2021-01-29T09:07:28.699Z`,
    announce: `Собрать камни бесконечности легко, если вы прирожденный герой. Простые ежедневные упражнения помогут достичь успеха.`,
    fullText: `Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Программировать не настолько сложно, как об этом говорят. Из под его пера вышло 8 платиновых альбомов. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Достичь успеха помогут ежедневные повторения.`,
    categories: [
      `Железо`,
      `Разное`,
      `Музыка`,
      `IT`,
      `Деревья`,
      `Кино`,
      `Велоспорт`,
      `За жизнь`
    ],
    image: `sea@1x.jpg`,
  },
  {
    title: `Что такое золотое сечение`,
    date: `2021-01-18T22:19:00.064Z`,
    announce: `Это один из лучших рок-музыкантов. Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
    fullText: `Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Программировать не настолько сложно, как об этом говорят. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Первая большая ёлка была установлена только в 1938 году. Золотое сечение — соотношение двух величин, гармоническая пропорция. Простые ежедневные упражнения помогут достичь успеха. Как начать действовать? Для начала просто соберитесь. Ёлки — это не просто красивое дерево. Это прочная древесина. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.`,
    categories: [
      `Музыка`,
      `Кино`,
      `Без рамки`,
      `Деревья`,
      `Разное`,
      `За жизнь`,
      `IT`,
      `Путешествия`,
      `Велоспорт`,
      `Железо`
    ],
    image: `sea@1x.jpg`,
  }
];

const mockPost = {
  title: `Хорошая валидная статья про котиков`,
  date: `2021-01-31T20:15:52.417Z`,
  announce: `Это интересная статья про котиков.`,
  fullText: `Очень подробная и интересная статья про котиков.`,
  categories: [1, 2],
  image: `cat.jpg`
};

const mockUsers = [
  {
    firstname: `Иван`,
    lastname: `Иванов`,
    email: `ivan@ya.ru`,
    password: `0403942d9d1bd8c2f93ea2f08abd7ba7`,
    avatar: `avatar.jpg`,
    admin: true
  },
  {
    firstname: `Петр`,
    lastname: `Петров`,
    email: `petr@ya.ru`,
    password: `0403942d9d1bd8c2f93ea2f08abd7ba7`,
    avatar: `avatar.jpg`,
    admin: false
  },
];

const mockComments = [
  {
    text: `Это где ж такие красоты? Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Совсем немного...`,
    articleId: 1,
    userId: 2,
  },
  {
    text: `Согласен с автором! Планируете записать видосик на эту тему? Плюсую, но слишком много буквы!`,
    articleId: 1,
    userId: 1,
  },
  {
    text: `Мне кажется или я уже читал это где-то?`,
    articleId: 1,
    userId: 2,
  },
  {
    text: `Хочу такую же футболку :-) Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`,
    articleId: 1,
    userId: 1,
  },
  {
    text: `Плюсую, но слишком много буквы! Совсем немного...`,
    articleId: 2,
    userId: 2,
  },
  {
    text: `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Согласен с автором! Это где ж такие красоты?`,
    articleId: 3,
    userId: 1,
  },
  {
    text: `Это где ж такие красоты? Плюсую, но слишком много буквы!`,
    articleId: 3,
    userId: 2,
  },
  {
    text: `Планируете записать видосик на эту тему?`,
    articleId: 3,
    userId: 2,
  },
  {
    text: `Плюсую, но слишком много буквы!`,
    articleId: 4,
    userId: 1,
  },
  {
    text: `Это где ж такие красоты?`,
    articleId: 4,
    userId: 2,
  },
  {
    text: `Плюсую, но слишком много буквы!`,
    articleId: 4,
    userId: 1,
  }
];

module.exports = {mockCategories, mockArticles, mockPost, mockUsers, mockComments};

