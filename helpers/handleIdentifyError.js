const BadRequestErr = require('../errors/bad-request-err');

const defineValidationError = (err) => {
  const errorList = Object.keys(err);
  const messageList = errorList.map((item) => err[item].properties.message);
  return messageList.join(', ');
};

const handleIdentifyError = (err, next) => {
  if (err.kind === 'ObjectId') next(new BadRequestErr('Невалидный id'));
  if (err.name === 'ValidationError') next(new BadRequestErr(`Ошибка валидации: ${defineValidationError(err.errors)}`));
  next(err);
};
module.exports = handleIdentifyError;
