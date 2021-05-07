require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const router = require('./routes');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { limiter } = require('./middlewares/rateLimiter');
const { serverErrorHandler } = require('./middlewares/serverErrorHandler');

const { PORT = 3000 } = process.env;
const { MONGO_DB_PROD, NODE_ENV } = process.env;

mongoose.connect(NODE_ENV === 'production' ? MONGO_DB_PROD : 'mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  autoIndex: true,
});

const app = express();

app.use(cors());

app.use(bodyParser.json());

app.use(requestLogger);

app.use(limiter);
app.use(helmet());

app.use(router);

app.use(errorLogger);

app.use(errors());

app.use(serverErrorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
