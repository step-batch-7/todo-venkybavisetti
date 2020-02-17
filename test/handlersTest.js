'use strict';
const request = require('supertest');
const sinon = require('sinon');
const { app } = require('../lib/route');
const fs = require('fs');
const todoList = require('./testTodoList.json');
const sessions = [
  {
    userName: 'bcalm',
    SID: 1
  },
  { userName: 'venkatesh', SID: 2 }
];

const userList = [
  { userName: 'bcalm', password: '1234' },
  { userName: 'venkatesh', password: '1234' }
];

afterEach(() => {
  sinon.restore();
});

beforeEach(() => {
  sinon.replace(fs, 'writeFileSync', () => {});
  app.locals.todoList = todoList;
  app.locals.sessions = sessions;
  app.locals.userList = userList;
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
  it('should also get loadHomePage if userTodo is not present in userList', done => {
    request(app)
      .get('/user/loadHomePage')
      .set('cookie', 'SID=2')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', /application\/json/, done);
  });
});

describe('POST', () => {
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

describe('NOT AUTHORIZED', () => {
  it('should give not authorized if user have not cookie', done => {
    request(app)
      .get('/user/loadHomePage')
      .set('Accept', '*/*')
      .expect(401)
      .expect('Content-Type', /text\/html/, done);
  });

  it('should give not authorized if user has invalid cookie', done => {
    request(app)
      .get('/user/loadHomePage')
      .set('Accept', '*/*')
      .set('cookie', 'SID=12')
      .expect(401)
      .expect('Content-Type', /text\/html/, done);
  });
});

describe('Bad Request', () => {
  it('should give bad request if user have not all fields which is needed for particular handler', done => {
    request(app)
      .post('/user/removeTask')
      .set('cookie', 'SID=1')
      .send('todoId=1&taskI=2')
      .expect(400)
      .expect('Content-Type', /text\/html/, done);
  });
});

describe('Invalid user', () => {
  it('should not log in the user if has invalid username or password', done => {
    request(app)
      .post('/logIn')
      .send('userName=bcalm&password=1222')
      .expect(302)
      .expect('Found. Redirecting to /login.html')
      .expect('Content-type', /text\/plain/, done);
  });
});

describe('logIn', () => {
  it('should set cookie and redirect to index.html if user is valid', done => {
    request(app)
      .post('/logIn')
      .send('userName=bcalm&password=1234')
      .expect(302)
      .expect('Found. Redirecting to /index.html')
      .expect('set-cookie', /SID/)
      .expect('Content-type', /text\/plain/, done);
  });
});

describe('signUp', () => {
  it('should store the user details', done => {
    request(app)
      .post('/signUp')
      .send('name="venky"&userName="venky"&password="1234"&DOB=01-01-2000')
      .expect(302)
      .expect('Found. Redirecting to /login.html')
      .expect('Content-type', /text\/plain/, done);
  });
});

describe('checkUserExist', () => {
  it('should give true if userName is exist', done => {
    request(app)
      .post('/checkUserExists')
      .send('userName=bcalm')
      .expect(200)
      .expect(/true/)
      .expect('Content-type', /application\/json/, done);
  });

  it('should give false if userName is not exist', done => {
    request(app)
      .post('/checkUserExists')
      .send('userName=venky')
      .expect(200)
      .expect(/false/)
      .expect('Content-type', /application\/json/, done);
  });
});

describe('logOut', () => {
  it('should clear user cookie and redirect to login page', done => {
    request(app)
      .get('/user/logOut')
      .set('cookie', 'SID=1')
      .expect(302, done);
  });
});
