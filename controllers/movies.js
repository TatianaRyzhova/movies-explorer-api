const Movie = require('../models/movie');
const NotFoundError = require('../errors/notFoundError');
const ValidationError = require('../errors/validationError');
const ForbiddenError = require('../errors/forbiddenError');

const getSavedMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send(movies))
    .catch((err) => next(err));
};

const createMovie = (req, res, next) => {
  const {
    country, director, duration, year, description, image,
    trailer, nameRU, nameEN, thumbnail, movieId,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Incorrect data was sent when creating a movie'));
      }
      next(err);
    });
};

const deleteMovie = (req, res, next) => {
  const owner = req.user._id;
  Movie.findById({ _id: req.params.movieId })
    .orFail(() => new NotFoundError('Movie with specified _id not found'))
    .then((card) => {
      if (!card.owner.equals(owner)) {
        next(new ForbiddenError('You cannot delete someone else\'s movie'));
      } else {
        Movie.deleteOne(card)
          .then(() => res.status(200).send({ message: 'Movie successfully deleted' }));
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.kind === 'ObjectId' || err.name === 'CastError') {
        next(new ValidationError('The _id of the movie has an incorrect format'));
      }
      next(err);
    });
};
module.exports = {
  getSavedMovies,
  createMovie,
  deleteMovie,
};
