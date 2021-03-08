-- Список всех категорий
SELECT * FROM comments

-- Список непустых категорий
SELECT id, name FROM categories
  JOIN article_categories
  ON id = category_id
  GROUP BY id

-- Категории с количеством публикаций
SELECT id, name, count(article_id) FROM categories
  LEFT JOIN article_categories
  ON id = category_id
  GROUP BY id

-- Список публикаций, сначала свежие
SELECT articles.id, title, announce, articles.created_at,
  users.first_name,
  users.last_name,
  users.email,
  count(DISTINCT comments.id) AS comments_count,
  STRING_AGG(DISTINCT categories.name, ', ') AS category_list
FROM articles
  JOIN article_categories ON articles.id = article_categories.article_id
  JOIN categories ON article_categories.category_id = categories.id
  LEFT JOIN comments ON comments.article_id = articles.id
  JOIN users ON users.id = articles.user_id
  GROUP BY articles.id, users.id
  ORDER BY articles.created_at DESC

-- Полная информация по определённой публикации
SELECT articles.id, title, announce, full_text, articles.created_at, image,
  users.first_name,
  users.last_name,
  users.email,
  count(DISTINCT comments.id) AS comments_count,
  STRING_AGG(DISTINCT categories.name, ', ') AS category_list
FROM articles
  JOIN article_categories ON articles.id = article_categories.article_id
  JOIN categories ON article_categories.category_id = categories.id
  LEFT JOIN comments ON comments.article_id = articles.id
  JOIN users ON users.id = articles.user_id
WHERE articles.id = 1
  GROUP BY articles.id, users.id

-- Пять свежих комментариев
SELECT
  comments.id,
  comments.article_id,
  users.first_name,
  users.last_name,
  comments.text
FROM comments
  JOIN users ON comments.user_id = users.id
  ORDER BY comments.created_at DESC
  LIMIT 5

-- Комментарии к определённой публикации
SELECT
  comments.id,
  comments.article_id,
  users.first_name,
  users.last_name,
  comments.text
FROM comments
  JOIN users ON comments.user_id = users.id
WHERE comments.article_id = 2
  ORDER BY comments.created_at DESC

-- Обновить заголовок публикации
UPDATE articles
SET title = 'Как я встретил Новый год'
WHERE id = 3