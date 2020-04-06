const knex = require('knex');
const app = require('../src/app');
const { TEST_DB_URL } = require('../src/config');

const { makePeopleArray } = require('./people.fixtures');

describe('People endpoints', () => {
  let db;

  before('set up db instance', () => {
    db = knex({
      client: 'pg',
      connection: TEST_DB_URL
    });

    app.set('db', db);
  });

  const cleanPeople = () => db.from('sample_table').truncate();
  before('clean the table', cleanPeople);
  afterEach('clean the table', cleanPeople);

  after('disconnect from db', () => db.destroy());

  // GET requests (READ)
  context('Given there are people in the database', () => {
    const testPeople = makePeopleArray();

    beforeEach(() => {
      return db
        .into('sample_table')
        .insert(testPeople);
    });

    it('GET /people responds with 200 with an array of people', () => {
      return supertest(app)
        .get('/people')
        .expect(200, testPeople);
    });

    it('GET /people/:id responds with 200 with the specified person', () => {
      const id = 2;
      const expectedPerson = testPeople[id - 1];
      return supertest(app)
        .get(`/people/${id}`)
        .expect(200, expectedPerson);
    });

  });

  context('Given no people in the database', () => {
    it('GET /people responds with 200 with an empty array', () => {
      return supertest(app)
        .get('/people')
        .expect(200, []);
    });

    it('GET /people/:id responds with 404', () => {
      const id = 2;
      return supertest(app)
        .get(`/people/${id}`)
        .expect(404, 'Person not found');
    });
  });
  
});