const {
  saveUserList,
  writeToDataStore,
  loadUserList,
  loadSession,
  saveSession
} = require('./fs');
const userList = loadUserList();

const addTodo = function(req, res) {
  const { title, userData, userName } = req.body;
  userData.addTodo(title);
  req.app.locals.todoList[userName] = userData.list;
  writeToDataStore(JSON.stringify(req.app.locals.todoList));
  res.json(userData.list);
};

const addTask = function(req, res) {
  const { id, task, userData, userName } = req.body;
  const content = userData.addTask(task, id);
  req.app.locals.todoList[userName] = userData.list;
  writeToDataStore(JSON.stringify(req.app.locals.todoList));
  res.json(content);
};

const removeTodo = function(req, res) {
  const { id, userData, userName } = req.body;
  userData.removeTodo(id);
  req.app.locals.todoList[userName] = userData.list;
  const content = userData.list;
  writeToDataStore(JSON.stringify(req.app.locals.todoList));
  res.json(content);
};

const editTodo = function(req, res) {
  const { todoId, title, userData, userName } = req.body;
  const content = userData.editTodo(todoId, title);
  req.app.locals.todoList[userName] = userData.list;
  writeToDataStore(JSON.stringify(req.app.locals.todoList));
  res.json(content);
};

const editTask = function(req, res) {
  const { todoId, taskId, subTitle, userData, userName } = req.body;
  const content = userData.editTask(todoId, taskId, subTitle);
  req.app.locals.todoList[userName] = userData.list;
  writeToDataStore(JSON.stringify(req.app.locals.todoList));
  res.json(content);
};

const removeTask = function(req, res) {
  const { todoId, taskId, userData, userName } = req.body;
  const content = userData.removeTask(todoId, taskId);
  req.app.locals.todoList[userName] = userData.list;
  writeToDataStore(JSON.stringify(req.app.locals.todoList));
  res.json(content);
};

const toggleTaskStatus = function(req, res) {
  const { todoId, taskId, userData, userName } = req.body;
  const content = userData.toggleStatus(todoId, taskId);
  req.app.locals.todoList[userName] = userData.list;
  writeToDataStore(JSON.stringify(req.app.locals.todoList));
  res.json(content);
};

const loadHomePage = function(req, res) {
  const { userData } = req.body;
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
  const { userName } = req.body;
  const isUser = userList.some(user => user.userName === userName);
  res.json(isUser);
};

const saveUser = function(req, res) {
  const { name, userName, password, DOB } = req.body;
  const registrationTime = new Date().toLocaleString();
  const user = { name, userName, password, DOB, registrationTime };
  userList.push(user);
  writeToDataStore(JSON.stringify(req.app.locals.todoList));
  saveUserList(JSON.stringify(userList));
  res.redirect('/login.html');
};

const checkPassword = function(userList, userName, password) {
  return userList.some(
    user => user.userName === userName && user.password && password
  );
};

const serveUserTodo = function(req, res) {
  const { userName, password } = req.body;
  if (checkPassword(userList, userName, password)) {
    const cookie = Math.random() * Math.random() * +new Date();
    const session = { SID: cookie, userName };
    const sessionList = loadSession();
    sessionList.push(session);
    saveSession(JSON.stringify(sessionList));
    res.cookie('SID', cookie);
    res.redirect('/index.html');
  } else {
    res.redirect('/login.html');
  }
};

module.exports = {
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
  serveUserTodo
};
