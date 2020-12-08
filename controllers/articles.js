const Article = require('../models/article');
const NotFoundError = require('../errors/not-found-err');
const ConflictErr = require('../errors/conflict-err');

const handleIdentifyError = require('../helpers/handleIdentifyError');

const getArticles = async (req, res, next) => {
  const userId = req.user._id;
  try {
    const articles = await Article.find({ owner: userId });
    if (!articles) throw new NotFoundError('Нет сохраненных статей');
    res.send(articles);
  } catch (err) {
    handleIdentifyError(err, next);
  }
};

const createArticle = (req, res, next) => {
  const userId = req.user._id;

  const {
    keyword,
    title,
    text,
    date,
    source,
    link,
    image,
  } = req.body;

  Article.create({
    keyword,
    title,
    text,
    date,
    source,
    link,
    image,
    owner: userId,
  })
    .then((article) => res.send(article))
    .catch((err) => handleIdentifyError(err, next));
};

const removeArticle = async (req, res, next) => {
  const { articleId } = req.params;
  const userId = req.user._id;

  try {
    const article = await Article.findById(articleId)
      .populate('owner');
    if (!article) throw new NotFoundError('Статья с таким id не найдена');
    const articleOwnerId = article.owner._id.toString();
    if (articleOwnerId !== userId) throw new ConflictErr('Вы не можете удалить чужую карточку');
    const cardRemoval = await Article.findByIdAndRemove(articleId);
    res.send(cardRemoval);
  } catch (err) {
    handleIdentifyError(err, next);
  }
};

module.exports = { getArticles, createArticle, removeArticle };
