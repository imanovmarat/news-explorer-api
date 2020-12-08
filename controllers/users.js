const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const { jwtDevCode } = require('../helpers/config');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const ConflictErr = require('../errors/conflict-err');

const handleIdentifyError = require('../helpers/handleIdentifyError');

const createUser = async (req, res, next) => {
  const { email, password, name } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) throw new ConflictErr('Неправильные почта или пароль');
    const newUser = await User.create({ email, password, name });
    console.log('юзер создан');
    res.status(200).send({
      name: newUser.name,
      email: newUser.email,
    });
  } catch (err) {
    handleIdentifyError(err, next);
  }
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : jwtDevCode,
        { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};

const getUserInfo = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const user = await User.findById(_id);
    if (!user) throw new NotFoundError('Пользователь не найден');
    res.send({ name: user.name, email: user.email });
  } catch (err) {
    handleIdentifyError(err, next);
  }
};

module.exports = { createUser, login, getUserInfo };
