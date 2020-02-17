const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const { loadTodoContent, loadUserList } = require('./dataFileOperation.js');
const sessions = require('./sessionManager');

const {
  logOut,
  checkUserExists,
  checkAuthentication,
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
  serveUserTodo,
  hasFields
} = require('./handlers');

const app = express();
app.locals.todoList = loadTodoContent();
app.locals.sessions = sessions;
app.locals.userList = loadUserList();

const userRoutes = express.Router();
userRoutes.use(checkAuthentication);
userRoutes.get('/loadHomePage', loadHomePage);
userRoutes.get('/logOut', logOut);
userRoutes.use(hasFields('userName', 'userData'));
userRoutes.post('/addTodo', hasFields('title'), addTodo);
userRoutes.post('/removeTodo', hasFields('id'), removeTodo);
userRoutes.post('/addTask', hasFields('id', 'task'), addTask);
userRoutes.post('/removeTask', hasFields('todoId', 'taskId'), removeTask);
userRoutes.post('/editTodo', hasFields('todoId', 'title'), editTodo);
userRoutes.post(
  '/editTask',
  hasFields('todoId', 'taskId', 'subTitle'),
  editTask
);
userRoutes.post('/toggleDone', hasFields('todoId', 'taskId'), toggleTaskStatus);

app.use(morgan('tiny'));
app.use(cookieParser());
app.use(methodNotAllowed);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/user', userRoutes);
app.post('/logIn', serveUserTodo);
app.post('/checkUserExists', hasFields('userName'), checkUserExists);
app.post('/signUp', hasFields('name', 'userName', 'password', 'DOB'), saveUser);
app.get('/', (req, res) => res.redirect('/index.html'));
app.use(express.static('public'));

module.exports = { app };
