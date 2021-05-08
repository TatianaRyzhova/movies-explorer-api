const { celebrate, Joi } = require('celebrate');

const linkPattern = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;

const userCreateValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30)
      .messages({
        'string.min': 'The minimum length of the "name" field - 2',
        'string.max': 'The maximum length of the "name" field - 30',
      }),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8)
      .messages({
        'string.min': 'The minimum length of the "password" field - 8',
      }),
  }),
});

const updateUserValidation = celebrate({
  headers: Joi.object().keys({
    authorization: Joi.required(),
  }).unknown(),
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30)
      .messages({
        'string.min': 'The minimum length of the "name" field - 2',
        'string.max': 'The maximum length of the "name" field - 30',
      }),
    email: Joi.string().required().email(),
  }),
});

const loginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const createMovieValidation = celebrate({
  headers: Joi.object().keys({
    authorization: Joi.required(),
  }).unknown(),
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required()
      .pattern(
        linkPattern,
      ),
    trailer: Joi.string().required()
      .pattern(
        linkPattern,
      ),
    thumbnail: Joi.string().required()
      .pattern(
        linkPattern,
      ),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

const movieIdValidation = celebrate({
  headers: Joi.object().keys({
    authorization: Joi.required(),
  }).unknown(),
  params: Joi.object().keys({
    movieId: Joi.string().required().length(24).hex(),
  }),
});

module.exports = {
  userCreateValidation,
  updateUserValidation,
  loginValidation,
  createMovieValidation,
  movieIdValidation,
};
