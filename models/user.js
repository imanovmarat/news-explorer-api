const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const { isEmail } = require('validator');
const UnauthorizedErr = require('../errors/unauthorized-err');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(v) {
        return isEmail(v);
      },
      message: 'Некорректный email',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next();
  return bcrypt.hash(this.password, 10)
    .then((hash) => {
      this.password = hash;
    })
    .catch(next);
});

userSchema.statics.findUserByCredentials = async function (email, password) {
  const user = await this.findOne({ email }).select('+password');
  if (!user) return Promise.reject(new UnauthorizedErr('Неправильные почта или пароль'));
  const matched = await bcrypt.compare(password, user.password);
  if (!matched) return Promise.reject(new UnauthorizedErr('Неправильные почта или пароль'));
  return user;
};

module.exports = mongoose.model('user', userSchema);
