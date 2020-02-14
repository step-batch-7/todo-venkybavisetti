'use strict';
const request = require('supertest');
const sinon = require('sinon');
const { app } = require('../lib/route');
const fs = require('fs');

describe('FILE NOT FOUND', () => {
  it('Should give file not found if file not exist', done => {
    request(app)
      .get('/badFile')
      .set('Accept', '*/*')
      .expect(404)
      .expect('Content-Type', /html/)
      .expect('Content-Length', '146')
      .expect(/badFile/, done);
  });
});

describe('METHOD NOT ALLOWED', () => {
  it('Should should give method not allowed for put method ', done => {
    request(app)
      .put('/')
      .set('Accept', '*/*')
      .expect(400)
      .expect('Content-Type', /html/)
      .expect('Content-Length', '16')
      .expect(/MethodNotAllowed/, done);
  });
});

describe('GET', () => {
  it('should get the home page / path', done => {
    request(app)
      .get('/')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', /html/, done);
  });
  it('should get the path /css/homeStyles.css', done => {
    request(app)
      .get('/css/homePage.css')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', /css/, done);
  });
  it('should get the path /css/animations.css', done => {
    request(app)
      .get('/css/animations.css')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', /css/, done);
  });
  it('should get loadHomePage', done => {
    request(app)
      .get('/loadHomePage')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', /application\/json/, done);
  });
});

describe('POST', () => {
  before(() => {
    sinon.replace(fs, 'writeFileSync', () => {});
  });

  after(() => {
    sinon.restore();
  });

  it('should post the title to add', done => {
    request(app)
      .post('/addTodo')
      .send('title=newTodo')
      .expect(200)
      .expect('Content-Type', /application\/json/, done);
  });
  it('should post the id to delete', done => {
    request(app)
      .post('/removeTodo')
      .send('id=2')
      .expect(200)
      .expect('Content-Type', /application\/json/, done);
  });
  it('should post the todo id and task to add new task to a todo', done => {
    request(app)
      .post('/addTask')
      .send('id=1&task=hii')
      .expect(200)
      .expect('Content-Type', /application\/json/, done);
  });
  it('should post todo id and task id to change a task status', done => {
    request(app)
      .post('/toggleDone')
      .send('todoId=1&taskId=1')
      .expect(200)
      .expect('Content-Type', /application\/json/, done);
  });
  it('should post todo id and task id to delete a task from a todo', done => {
    request(app)
      .post('/removeTask')
      .send('todoId=1&taskId=2')
      .expect(200)
      .expect('Content-Type', /application\/json/, done);
  });

  it('should post todo id and task id to change a task status', done => {
    request(app)
      .post('/editTodo')
      .send('todoId=1')
      .expect(200)
      .expect('Content-Type', /application\/json/, done);
  });
  it('should post todo id and task id to change a task status', done => {
    request(app)
      .post('/editTask')
      .send('todoId=1&taskId=1')
      .expect(200)
      .expect('Content-Type', /application\/json/, done);
  });
});
