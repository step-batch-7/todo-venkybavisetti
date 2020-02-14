const express = require('express');
const cookieParser = require('cookie-parser');
const {
  loadHomePage,
  addTask,
  addTodo,
  removeTask,
  removeTodo,
  editTask,
  editTodo,
  toggleTaskStatus
} = require('./handlers');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

app.get('/loadHomePage', loadHomePage);
app.post('/addTodo', addTodo);
app.post('/removeTodo', removeTodo);
app.post('/addTask', addTask);
app.post('/removeTask', removeTask);
app.post('/editTodo', editTodo);
app.post('/editTask', editTask);
app.post('/toggleDone', toggleTaskStatus);
module.exports = { app };
