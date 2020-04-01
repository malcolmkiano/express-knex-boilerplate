const PeopleService = require('../src/PeopleService');
const knex = require('knex');
const { DB_URL } = require('../src/config');

describe('People service object', () => {
  let db;
  let testPeople = [
    {
      id: 1,
      name: 'Ariana Grande',
      job_title: 'God'
    },
    {
      id: 2,
      name: 'Dua Lipa',
      job_title: 'Sataness'
    },
    {
      id: 3,
      name: 'Mark Zuckerberg',
      job_title: 'Friendly Neighborhood Robot'
    }
  ];

  // connect to db
  before(() => {
    db = knex({
      client: 'pg',
      connection: DB_URL
    });
  });

  // clear table data
  before(() => db('sample_table').truncate());

  // get rid of db after testing
  after(() => {
    db.destroy();
  });

  context('Given \'sample_table\' has data', () => {

    // insert test data
    before(() => {
      return db
        .into('sample_table')
        .insert(testPeople);
    });

    // clear test data after
    after(() => db('sample_table').truncate());

    describe('getAllPeople', () => {
      it('returns an array of all people in the table', () => {
        return PeopleService.getAllPeople(db)
          .then(people => {
            expect(people).to.eql(testPeople);
          });
      });
    });

    describe('getPeopleByJobTitle', () => {
      it('returns an array of people with a matching job title', () => {
        const jobTitle = 'God';
        return PeopleService.getPeopleByJobTitle(db, jobTitle)
          .then(people => {
            const filteredTestPeople = testPeople.filter(person => {
              return person.job_title.toLowerCase().includes(jobTitle.toLowerCase());
            });
            expect(people).to.eql(filteredTestPeople);
          });
      });
    });

    describe('addPerson', () => {
      const testPerson = { id: 4, name: 'Iggy Azalea', job_title: 'Boss Lady' };
      it('adds a new person to the table', () => {
        return PeopleService.addPerson(db, testPerson)
          .then(person => {
            expect(person).to.eql(testPerson);
          });
      });
    });

    describe('updatePerson', () => {
      const testId = 4;
      const testData = { name: 'Lady Iggy Azalea' };
      it('updates a person\'s row in the table', () => {
        return PeopleService.updatePerson(db, testId, testData)
          .then(() => {
            PeopleService.getPerson(db, testId)
              .then(person => {
                expect(person.name).to.equal(testData.name);
              });
          });
      });
    });

    describe('deletePerson', () => {
      const testId = 4;
      it('deletes a person\'s row in the table', () => {
        return PeopleService.deletePerson(db, testId)
          .then(() => {
            PeopleService.getAllPeople(db)
              .then(people => {
                expect(people).to.eql(testPeople);
              });
          });
      });
    });

  });

  // if it's empty
  context('Given \'sample_table\' is empty', () => {

    describe('getAllPeople', () => {
      it('returns an empty array', () => {
        return PeopleService.getAllPeople(db)
          .then(people => {
            expect(people).to.be.an('array');
            expect(people).to.have.length(0);
          });
      });
    });

  });

  
});