const router = require('express').Router();
const users = require('./users');
const articles = require('./articles');
const NotFoundError = require('../errors/not-found-err');

router.use('/api', users);
router.use('/api', articles);
router.use('*', ((req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
}));

module.exports = router;
