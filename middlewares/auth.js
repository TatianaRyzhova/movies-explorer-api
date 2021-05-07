const { JWT_SECRET, NODE_ENV } = process.env;
const jwt = require('jsonwebtoken');
const AuthError = require('../errors/authError');

const handleAuthError = (next) => {
  next(new AuthError('Authorization required'));
};

const extractBearerToken = (header) => header.replace('Bearer ', '');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    handleAuthError(next);
  }
  const token = extractBearerToken(authorization);
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key');
  } catch (error) {
    handleAuthError(next);
  }
  req.user = payload;

  next();
};
