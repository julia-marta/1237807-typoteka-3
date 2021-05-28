'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../const`);
const categoryExists = require(`../middlewares/category-exists`);
const schemaValidator = require(`../middlewares/schema-validator`);
const categorySchema = require(`../schemas/category`);

module.exports = (serviceLocator) => {
  const route = new Router();

  const app = serviceLocator.get(`app`);
  const service = serviceLocator.get(`categoryService`);
  const logger = serviceLocator.get(`logger`);

  const isCategoryExists = categoryExists(service, logger);
  const isCategoryValid = schemaValidator(categorySchema, logger);

  app.use(`/categories`, route);

  route.get(`/`, async (req, res) => {
    const {count = false} = req.query;
    let categories;

    if (count) {
      categories = await service.findAllWithCount();
    } else {
      categories = await service.findAll();
    }

    return res.status(HttpCode.OK).json(categories);
  });

  route.get(`/:id`, async (req, res) => {
    const {id} = req.params;

    const category = await service.findOne(id);

    return res.status(HttpCode.OK).json(category);
  });

  route.post(`/`, isCategoryValid, async (req, res) => {
    const category = await service.add(req.body);

    return res.status(HttpCode.CREATED).json(category);
  });

  route.put(`/:categoryId`, [isCategoryExists, isCategoryValid], async (req, res) => {
    const {categoryId} = req.params;

    await service.update(categoryId, req.body);

    return res.status(HttpCode.OK).send(`Category was updated`);
  });

  return route;
};
