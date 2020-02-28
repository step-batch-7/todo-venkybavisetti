const {saveUserList, writeToDataStore, fillTemplate} = require('./dataFileOperation.js');
const {Todo} = require('./todoList');

const addTodo = function(req, res) {
  const {title, userData, userName} = req.body;
  userData.addTodo(title);
  req.app.locals.todoList[userName] = userData.list;
  writeToDataStore(req.app.locals.todoList);
  res.json(userData.list);
};

const addTask = function(req, res) {
  const {id, task, userData, userName} = req.body;
  const content = userData.addTask(task, id);
  req.app.locals.todoList[userName] = userData.list;
  writeToDataStore(req.app.locals.todoList);
  res.json(content);
};

const removeTodo = function(req, res) {
  const {id, userData, userName} = req.body;
  userData.removeTodo(id);
  req.app.locals.todoList[userName] = userData.list;
  const content = userData.list;
  writeToDataStore(req.app.locals.todoList);
  res.json(content);
};

const editTodo = function(req, res) {
  const {todoId, title, userData, userName} = req.body;
  const content = userData.editTodo(todoId, title);
  req.app.locals.todoList[userName] = userData.list;
  writeToDataStore(req.app.locals.todoList);
  res.json(content);
};

const editTask = function(req, res) {
  const {todoId, taskId, subTitle, userData, userName} = req.body;
  const content = userData.editTask(todoId, taskId, subTitle);
  req.app.locals.todoList[userName] = userData.list;
  writeToDataStore(req.app.locals.todoList);
  res.json(content);
};

const removeTask = function(req, res) {
  const {todoId, taskId, userData, userName} = req.body;
  const content = userData.removeTask(todoId, taskId);
  req.app.locals.todoList[userName] = userData.list;
  writeToDataStore(req.app.locals.todoList);
  res.json(content);
};

const toggleTaskStatus = function(req, res) {
  const {todoId, taskId, userData, userName} = req.body;
  const content = userData.toggleStatus(todoId, taskId);
  req.app.locals.todoList[userName] = userData.list;
  writeToDataStore(req.app.locals.todoList);
  res.json(content);
};

const loadHomePage = function(req, res) {
  const {userData} = req.body;
  res.json(userData.list);
};

const methodNotAllowed = function(req, res, next) {
  const allowedMethod = ['GET', 'POST'];
  if (allowedMethod.includes(req.method)) {
    return next();
  }

  res.status(400).send('MethodNotAllowed');
};

const checkUserExists = function(req, res) {
  const userList = req.app.locals.userList;
  const {userName} = req.body;
  const isUser = userList.some(user => user.userName === userName);
  res.json(isUser);
};

const saveUser = function(req, res) {
  const {name, userName, password, mailId} = req.body;
  const registrationTime = new Date().toLocaleString();
  const user = {name, userName, password, mailId, registrationTime};
  const userList = req.app.locals.userList;
  userList.push(user);
  writeToDataStore(req.app.locals.todoList);
  saveUserList(userList);
  res.redirect('/login.html');
};

const checkPassword = function(userList, userName, password) {
  return userList.some(user => {
    return user.userName === userName && user.password === password;
  });
};

const serveUserTodo = function(req, res) {
  const {userList, sessions} = req.app.locals;
  const {userName, password} = req.body;
  if (checkPassword(userList, userName, password)) {
    const cookie = sessions.createSession(userName);
    res.cookie('SID', cookie);
    res.redirect('/index.html');
  } else {
    const logIn = fillTemplate('login.html', '* Incorrect UserName/Password');
    res.send(logIn);
  }
};

const hasFields = (...fields) => {
  return (req, res, next) => {
    if (fields.every(field => field in req.body)) {
      return next();
    }
    res.statusCode = 400;
    res.send('bad Request');
  };
};

const checkAuthentication = function(req, res, next) {
  const sessions = req.app.locals.sessions;
  const session = sessions.isValidSession(+req.cookies.SID);
  if (session) {
    const user = session.userName;
    const userData = req.app.locals.todoList[user] || [];
    req.body.userName = user;
    req.body.userData = new Todo(userData);
    next();
  } else {
    res.status(401).send('User is not authenticated');
  }
};

const logOut = function(req, res) {
  const sessions = req.app.locals.sessions;
  sessions.removeSession(+req.cookies.SID);
  res.clearCookie('SID');
  res.redirect('login.html');
};

module.exports = {
  hasFields,
  checkAuthentication,
  checkUserExists,
  saveUser,
  methodNotAllowed,
  addTodo,
  removeTodo,
  addTask,
  removeTask,
  editTodo,
  editTask,
  toggleTaskStatus,
  loadHomePage,
  serveUserTodo,
  logOut
};
