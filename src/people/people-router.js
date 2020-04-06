const express = require('express');
const xss = require('xss');

const peopleRouter = express.Router();
const PeopleService = require('./people-service');

// middleware setup
peopleRouter.use(express.json());


// sanitizing person data before it goes out
const sanitizePerson = person => {
  return {
    id: person.id,
    name: xss(person.name),
    job_title: xss(person.job_title)
  };
};


// read records
peopleRouter.get('/', (req, res, next) => {
  const { jobTitle } = req.query;
  const db = req.app.get('db');

  if (jobTitle) {
    PeopleService.getPeopleByJobTitle(db, jobTitle)
      .then(people => {
        return res.status(200).json(people.map(sanitizePerson));
      })
      .catch(next);

  } else {
    PeopleService.getAllPeople(db)
      .then(people => {
        return res.status(200).json(people.map(sanitizePerson));
      })
      .catch(next);
  }
});

peopleRouter.get('/:id', (req, res, next) => {
  const { id } = req.params;
  const db = req.app.get('db');

  PeopleService.getPersonById(db, id)
    .then(person => {
      if (person) {
        return res.status(200).json(sanitizePerson(person));
      } else {
        return res.status(404).send('Person not found');
      }
      
    })
    .catch(next);
});


module.exports = peopleRouter;