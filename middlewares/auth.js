const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const { jwtDevCode } = require('../helpers/config');
const UnauthorizedErr = require('../errors/unauthorized-err');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) next(new UnauthorizedErr('Необходима авторизация'));
  const token = authorization.replace('Bearer ', '');

  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : jwtDevCode);
  } catch (error) {
    return next(new UnauthorizedErr('Необходима авторизация'));
  }
  req.user = payload;
  return next();
};
