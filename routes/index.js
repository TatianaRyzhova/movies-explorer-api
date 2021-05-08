const router = require('express').Router();
const usersRouter = require('./users');
const moviesRouter = require('./movies');
const { createUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { userCreateValidation, loginValidation } = require('../middlewares/validations');
const NotFoundError = require('../errors/notFoundError');

router.post('/signin', loginValidation, login);
router.post('/signup', userCreateValidation, createUser);

router.use(auth);
router.use('/users', usersRouter);
router.use('/movies', moviesRouter);

router.use((req, res, next) => {
  next(new NotFoundError(`Ресурс по адресу ${req.path} не найден`));
});

module.exports = router;
