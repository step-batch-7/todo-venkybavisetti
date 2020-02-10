'use strict';
const request = require('supertest');
const sinon = require('sinon');
const { app } = require('../lib/handlers');
const App = app.serve.bind(app);
const fs = require('fs');

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

describe('GET', () => {
  it('should get the home page / path', done => {
    request(App)
      .get('/')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', 'text/html', done);
  });
  it('should get the path /css/homeStyles.css', done => {
    request(App)
      .get('/css/homeStyle.css')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', 'text/css', done);
  });
  it('should get the path /css/animations.css', done => {
    request(App)
      .get('/css/animations.css')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', 'text/css', done);
  });
});

describe('POST', () => {
  beforeEach(() => {
    sinon.replace(fs, 'writeFileSync', () => {});
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should post the title to add', done => {
    request(App)
      .post('/addTask')
      .send('title=newTodo')
      .expect(200)
      .expect('Content-Type', 'application/json', done);
  });
  it('should post the id to delete', done => {
    request(App)
      .post('/removeTask')
      .send('id=1')
      .expect(200)
      .expect('Content-Type', 'application/json', done);
  });
  it('should post the todo id and task to add new task to a todo', done => {
    sinon.replace(fs, 'readFileSync', () => {
      return '[{"title": "venkatesh","id": 1,"tasks": [{ "text": "tiger", "done": true, "id": 1 }]}]';
    });
    request(App)
      .post('/addSubTask')
      .send('subTask=1&id=1')
      .expect(200)
      .expect('Content-Type', 'application/json', done);
  });
  it('should post todo id and task id to delete a task from a todo', done => {
    sinon.replace(fs, 'readFileSync', () => {
      return '[{"title": "venkatesh","id": 1,"tasks": [{ "text": "tiger", "done": true, "id": 1 }]}]';
    });
    request(App)
      .post('/removeSubTask')
      .send('taskId=1&subTaskId=1')
      .expect(200)
      .expect('Content-Type', 'application/json', done);
  });

  it('should post todo id and task id to change a task status', done => {
    sinon.replace(fs, 'readFileSync', () => {
      return '[{"title": "venkatesh","id": 1,"tasks": [{ "text": "tiger", "done": true, "id": 1 }]}]';
    });
    request(App)
      .post('/toggleDone')
      .send('taskId=1&subTaskId=1')
      .expect(200)
      .expect('Content-Type', 'application/json', done);
  });
  it('should post todo id and task id to change a task status', done => {
    sinon.replace(fs, 'readFileSync', () => {
      return '[{"title": "venkatesh","id": 1,"tasks": [{ "text": "tiger", "done": true, "id": 1 }]}]';
    });
    request(App)
      .post('/editTask')
      .send('taskId=1&subTaskId=1')
      .expect(200)
      .expect('Content-Type', 'application/json', done);
  });
});
