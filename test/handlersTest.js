'use strict';
const request = require('supertest');
const { app } = require('../lib/handlers');
const App = app.serve.bind(app);

describe('FILE NOT FOUND', () => {
  it('Should give file not found if file not exist', done => {
    request(App)
      .get('/badFile')
      .set('Accept', '*/*')
      .expect(404)
      .expect('Content-Type', 'text/plain')
      .expect('Content-Length', '9')
      .expect('Not Found', done);
  });
});

describe('METHOD NOT ALLOWED', () => {
  it('Should should give method not allowed for put method ', done => {
    request(App)
      .put('/')
      .set('Accept', '*/*')
      .expect(400)
      .expect('Content-Type', 'text/plain')
      .expect('Content-Length', '18')
      .expect('Method Not Allowed', done);
  });
});
