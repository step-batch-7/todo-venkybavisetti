const express = require('express');
const cookieParser = require('cookie-parser');
const {
  methodNotAllowed,
  loadHomePage,
  addTask,
  addTodo,
  removeTask,
  removeTodo,
  editTask,
  editTodo,
  toggleTaskStatus
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

const app = express();
app.use(methodNotAllowed);
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

app.get('/loadHomePage', loadHomePage);
app.post('/addTodo', hasFields('title'), addTodo);
app.post('/removeTodo', hasFields('id'), removeTodo);
app.post('/addTask', hasFields('id', 'task'), addTask);
app.post('/removeTask', hasFields('todoId', 'taskId'), removeTask);
app.post('/editTodo', hasFields('todoId', 'title'), editTodo);
app.post('/editTask', hasFields('todoId', 'taskId', 'subTitle'), editTask);
app.post('/toggleDone', hasFields('todoId', 'taskId'), toggleTaskStatus);
module.exports = { app };
