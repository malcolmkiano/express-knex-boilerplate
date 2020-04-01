const app = require('../src/app');

describe('App', () => {

  // default endpoint
  describe('GET /', () => {

    // happy test
    it('responds with 200 containing "Hello, world!"', () => {
      return supertest(app)
        .get('/')
        .expect(200, 'Hello, world!');
    });

  });

  // messages endpoint
  describe('GET /people', () => {

    // happy test
    it('responds with 200 with an array of people', () => {
      return supertest(app)
        .get('/people')
        .expect(200)
        .then(response => {
          expect(response.body).to.be.an('array');
        });
    });

  });
  
});