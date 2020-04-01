require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const knex = require('knex');
const { NODE_ENV, DB_URL } = require('./config');

const app = express();
const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';


// set up database
const PeopleService = require('./PeopleService');
const db = knex({
  client: 'pg',
  connection: DB_URL
});


// set up middleware
app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());
app.use(express.json());


// request handling
app.get('/', (req, res) => {
  res.status(200).send('Hello, world!');
});


// create records
app.post('/people', (req, res) => {
  const { name, job_title } = req.body;

  const requiredFields = ['name', 'job_title'];
  for (let field of requiredFields) {
    if (!req.body[field]) {
      return res.status(400).send(`'${field}' is required.`);
    }
  }

  const person = { name, job_title };
  PeopleService.addPerson(db, person)
    .then(person => {
      return res.status(200).json(person);
    });

});

app.post('/people/:id', (req, res) => {

  const validFields = ['name', 'job_title'];
  for (let field of Object.keys(req.body)) {
    if (!validFields.includes(field)) {
      return res.status(400).send(`'${field}' is not a valid field.`);
    }
  }

  const { id } = req.params;
  const data = { ...req.body };
  PeopleService.updatePerson(db, id, data)
    .then(person => {
      return res.status(200).json(person);
    });

});


// read records
app.get('/people', (req, res) => {
  const { jobTitle } = req.query;

  if (jobTitle) {
    PeopleService.getPeopleByJobTitle(db, jobTitle)
      .then(people => {
        return res.status(200).json(people);
      });

  } else {
    PeopleService.getAllPeople(db)
      .then(people => {
        return res.status(200).json(people);
      });
  }
});

app.get('/people/:id', (req, res) => {
  const { id } = req.params;

  PeopleService.getPerson(db, id)
    .then(people => {
      return res.status(200).json(people);
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