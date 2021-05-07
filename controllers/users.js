const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ValidationError = require('../errors/validationError');
const ConflictError = require('../errors/conflictError');
const AuthError = require('../errors/authError');

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.send(user))
    .catch((err) => {
      next(err);
    });
};

const updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.kind === 'ObjectId') {
        next(new ValidationError('Invalid data transferred when editing a user'));
      }
      if (err.code === 11000) {
        next(new ConflictError('User with this email already exists'));
      }
      next(err);
    });
};

const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  if (!name || !email || !password) {
    next(new ValidationError('Name, email and password are required'));
  }
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => {
      res.status(201).send({ data: user.toJSON() });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new ValidationError('Invalid data transferred when creating a user'));
      }
      if (err.code === 11000) {
        next(new ConflictError('User with this email already exists'));
      }
      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(() => {
      next(new AuthError('Incorrect email or password'));
    });
};

module.exports = {
  getCurrentUser,
  createUser,
  updateUser,
  login,
};
