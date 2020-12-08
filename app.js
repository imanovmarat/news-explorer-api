const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const centralErrorHandler = require('./helpers/centralErrorHandler');
const { mongobd } = require('./helpers/config');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const router = require('./routes/index');

const { PORT = 3000 } = process.env;
const app = express();

const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');

mongoose.connect(mongobd, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(cors());
app.use(requestLogger);
app.use(helmet());
app.use(bodyParser.json());
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().min(5).email(),
    password: Joi.string().required(),
    name: Joi.string().required().min(2).max(30),
  }).unknown(true),
}), createUser);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().min(5).email(),
    password: Joi.string().required(),
  }).unknown(true),
}), login);
app.use(auth);
app.use(router);

app.use(errorLogger);
app.use(errors());
app.use(centralErrorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
