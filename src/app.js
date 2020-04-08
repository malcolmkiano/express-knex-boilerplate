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


// set up routes
const routes = [
  {
    url: '/employees',
    router: employeesRouter
  }
];


// add routes to app
routes.forEach(route => {
  app.use(route.url, route.router);
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
const errorHandler = (error, req, res, next) => {
  let response;
  if (NODE_ENV === 'production') {
    response = { error: { message: 'Server error' } };
  } else {
    response = { message: error.message, error };
  }

  res.status(500).json(response);
};

app.use(errorHandler);


// the bottom line, literally
module.exports = app;