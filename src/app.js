require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const app = express();
const { NODE_ENV } = require('./config');
const morganOption = (process.env.NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

// set up middleware
app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

// import routers
const employeesRouter = require('./routers/employees-router');
const protectedRouter = require('./routers/protected-router');

// set up routes
const routes = [
  {
    url: '/employees',
    router: employeesRouter,
  },
  {
    url: '/protected',
    router: protectedRouter,
  }
];

// add routes to app
routes.forEach(({url, router}) => {
  app.use(url, router);
});

// list endpoints by default
app.get('/', (req, res) => {
  return res
    .status(200)
    .json({
      endpoints: routes.map(route => route.url)
    });
});

// error handling
// eslint-disable-next-line no-unused-vars
const errorHandler = (error, req, res) => {
  let response;
  if (NODE_ENV === 'production') {
    response = { error: { message: 'Server error' } };
  } else {
    response = { message: error.message, error };
  }

  return res
    .status(500)
    .json(response);
};

app.use(errorHandler);

// the bottom line, literally
module.exports = app;