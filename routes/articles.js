const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { isURL } = require('validator');
const { getArticles, createArticle, removeArticle } = require('../controllers/articles');

router.get('/articles', getArticles);
router.post('/articles', celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string().required().custom((value, helpers) => {
      if (isURL(value)) {
        return value;
      }
      return helpers.message('Некорректная ссылка на статью');
    }),
    image: Joi.string().required().custom((value, helpers) => {
      if (isURL(value)) {
        return value;
      }
      return helpers.message('Некорректная ссылка на изображение');
    }),
    user: Joi.object().keys({
      _id: Joi.string().alphanum().required().length(24),
    }),
  }),
}), createArticle);
router.delete('/articles/:articleId', celebrate({
  params: Joi.object().keys({
    articleId: Joi.string().alphanum().required().length(24),
  }),
  body: Joi.object().keys({
    user: Joi.object().keys({
      _id: Joi.string().alphanum().required().length(24),
    }),
  }),
}), removeArticle);

module.exports = router;
