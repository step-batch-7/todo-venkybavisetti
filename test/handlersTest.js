'use strict';
const request = require('supertest');
const sinon = require('sinon');
const { app } = require('../lib/route');
const fs = require('fs');

const sessions = [
  {
    userName: 'bcalm',
    SID: 1
  }
];

const todoList = {
  venky: [
    {
      title: 'Test Todo',
      id: 1,
      tasks: [
        {
          title: 'Test Task',
          id: 1,
          done: true
        }
      ]
    }
  ],
  bcalm: [
    {
      title: 'Test Todo',
      id: 1,
      tasks: [
        {
          title: 'Test Task',
          id: 1,
          done: true
        }
      ]
    }
  ]
};
beforeEach(() => {
  app.locals.todoList = todoList;
  app.locals.sessions = sessions;
});

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
      .set('cookie', 'SID=1')
      .expect('Found. Redirecting to /index.html')
      .expect('location', '/index.html')
      .expect('content-type', 'text/plain; charset=utf-8')
      .expect('content-length', '33')
      .expect(302, done);
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
      .get('/user/loadHomePage')
      .set('cookie', 'SID=1')
      .set('Accept', '*/*')
      .expect(200)
      .expect(/Test Todo/)
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

  it('should delete a task from todo', done => {
    request(app)
      .post('/user/removeTask')
      .set('cookie', 'SID=1')
      .send('todoId=1&taskId=2')
      .expect(200)
      .expect('Content-Type', /application\/json/, done);
  });

  it('should add new todo in todo list', done => {
    request(app)
      .post('/user/addTodo')
      .send('title=newTodo')
      .set('cookie', 'SID=1')
      .expect(200)

      .expect('Content-Type', /application\/json/, done);
  });
  it('should delete a particular todo from todoList', done => {
    request(app)
      .post('/user/removeTodo')
      .set('cookie', 'SID=1')
      .send('id=2')
      .expect(200)
      .expect('Content-Type', /application\/json/, done);
  });
  it('should add task on a particular todo in todoList', done => {
    request(app)
      .post('/user/addTask')
      .set('cookie', 'SID=1')
      .send('id=1&task=hii')
      .expect(200)
      .expect('Content-Type', /application\/json/, done);
  });
  it('should change status of given task', done => {
    request(app)
      .post('/user/toggleDone')
      .set('cookie', 'SID=1')
      .send('todoId=1&taskId=1')
      .expect(200)
      .expect('Content-Type', /application\/json/, done);
  });

  it('should change title of given task in particular todo', done => {
    request(app)
      .post('/user/editTask')
      .set('cookie', 'SID=1')
      .send('todoId=1&taskId=1&subTitle="vikram"')
      .expect(200)
      .expect('Content-Type', /application\/json/, done);
  });
  it('should change the title of given todo', done => {
    request(app)
      .post('/user/editTodo')
      .set('cookie', 'SID=1')
      .send('todoId=1&title="vikram"')
      .expect(200)
      .expect('Content-Type', /application\/json/, done);
  });
});
