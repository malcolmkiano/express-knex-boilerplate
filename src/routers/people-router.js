const express = require('express');
const peopleRouter = express.Router();
const PeopleService = require('../services/people-service');

// create records
peopleRouter.post('/', (req, res, next) => {
  const { name, job_title } = req.body;
  const db = req.app.get('db');

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
    })
    .catch(next);

});


// read records
peopleRouter.get('/', (req, res, next) => {
  const { jobTitle } = req.query;
  const db = req.app.get('db');

  if (jobTitle) {
    PeopleService.getPeopleByJobTitle(db, jobTitle)
      .then(people => {
        return res.status(200).json(people);
      })
      .catch(next);

  } else {
    PeopleService.getAllPeople(db)
      .then(people => {
        return res.status(200).json(people);
      })
      .catch(next);
  }
});

peopleRouter.get('/:id', (req, res, next) => {
  const { id } = req.params;
  const db = req.app.get('db');

  PeopleService.getPerson(db, id)
    .then(person => {
      if (person) {
        return res.status(200).json(person);
      } else {
        return res.status(404).send({ error: 'Person not found' });
      }
      
    })
    .catch(next);
});


// update records
peopleRouter.post('/:id', (req, res, next) => {
  const db = req.app.get('db');

  const validFields = ['name', 'job_title'];
  for (let field of Object.keys(req.body)) {
    if (!validFields.includes(field)) {
      return res.status(400).send(`'${field}' is not a valid field.`);
    }
  }

  const { id } = req.params;
  const data = { ...req.body };
  PeopleService.getPerson(db, id)
    .then(person => {
      if (person) {
        
        PeopleService.updatePerson(db, id, data)
          .then(person => {
            return res.status(200).json(person);
          })
          .catch(next);

      } else {
        return res.status(404).send({ error: 'Update failed: Person not found.' });
      }
      
    })
    .catch(next);
  

});

module.exports = peopleRouter;