const express = require('express');
const cookieParser = require('cookie-parser');
const { loadSession } = require('./fs');
const { Todo } = require('./todoList');
const { loadTodoContent } = require('./fs');

const {
  checkUserExists,
  saveUser,
  methodNotAllowed,
  loadHomePage,
  addTask,
  addTodo,
  removeTask,
  removeTodo,
  editTask,
  editTodo,
  toggleTaskStatus,
  serveUserTodo
} = require('./handlers');

const hasFields = (...fields) => {
  return (req, res, next) => {
    if (fields.every(field => field in req.body)) {
      return next();
    }
    res.statusCode = 400;
    res.end('bad Request');
  };
};

const checkAuthentication = function(req, res, next) {
  const sessions = loadSession();
  const cookieDetail = sessions.find(
    session => session.SID === +req.cookies.SID
  );
  if (cookieDetail) {
    const user = cookieDetail.userName;
    const userData = req.app.locals.todoList[user] || [];
    req.body.userName = user;
    req.body.userData = new Todo(userData);
    next();
  } else {
    res.status(401).send('User is not authenticated');
  }
};

const app = express();
app.locals.todoList = loadTodoContent();

app.use(cookieParser());
app.use(methodNotAllowed);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.post('/logIn', serveUserTodo);
app.post('/checkUserExists', hasFields('userName'), checkUserExists);
app.post('/signUp', hasFields('name', 'userName', 'password', 'DOB'), saveUser);
app.get('/', (req, res) => res.redirect('/index.html'));
app.use(express.static('public'));

app.use(checkAuthentication);
app.get('/loadHomePage', loadHomePage);
app.use(hasFields('userData', 'userName'));
app.post('/addTodo', hasFields('title'), addTodo);
app.post('/removeTodo', hasFields('id'), removeTodo);
app.post('/addTask', hasFields('id', 'task'), addTask);
app.post('/removeTask', hasFields('todoId', 'taskId'), removeTask);
app.post('/editTodo', hasFields('todoId', 'title'), editTodo);
app.post('/editTask', hasFields('todoId', 'taskId', 'subTitle'), editTask);
app.post('/toggleDone', hasFields('todoId', 'taskId'), toggleTaskStatus);
module.exports = { app };
