const querystring = require('querystring');
const { Todo } = require('./todoList');
const { App } = require('./app');
const CONTENT_TYPES = require('./mimeTypes');
const {
  readFile,
  writeToDataStore,
  isFileNotPresent,
  loadTodoContent
} = require('./fs');

const sendResponse = function(res, statusCode, content, contentExtension) {
  res.statusCode = statusCode;
  res.setHeader('content-type', CONTENT_TYPES[contentExtension]);
  res.end(content);
};

const notFound = function(req, res) {
  const content = 'Not Found';
  sendResponse(res, 404, content, 'txt');
};

const methodNotAllowed = function(req, res) {
  const content = 'Method Not Allowed';
  sendResponse(res, 400, content, 'txt');
};

const readBody = function(req, res, next) {
  let data = '';
  req.on('data', chunk => {
    data += chunk;
  });
  req.on('end', () => {
    req.body = data;
    next();
  });
};

const getPath = function(url, extension) {
  const STATIC_FOLDER = `${__dirname}/../public`;
  const htmlFile = extension === 'html' ? '/html' : '';
  return `${STATIC_FOLDER}${htmlFile}${url}`;
};

const getUrl = function(url) {
  return url === '/' ? '/index.html' : url;
};

const serveStaticFile = (req, res, next) => {
  const url = getUrl(req.url);
  const [, extension] = url.match(/.*\.(.*)$/) || [];
  const path = getPath(url, extension);
  if (isFileNotPresent(path)) {
    return next();
  }
  const content = readFile(path);
  sendResponse(res, 200, content, extension);
};

const addTodo = function(req, res) {
  const todo = new Todo(loadTodoContent());
  const { title } = querystring.parse(req.body);
  todo.addTodo(title);
  const content = todo.toJSON();
  writeToDataStore(content);
  sendResponse(res, 200, content, 'json');
};

const addTask = function(req, res) {
  const { id, task } = querystring.parse(req.body);
  const todo = new Todo(loadTodoContent());
  const content = JSON.stringify(todo.addTask(task, id));
  writeToDataStore(todo.toJSON());
  sendResponse(res, 200, content, 'json');
};

const removeTodo = function(req, res) {
  const { id } = querystring.parse(req.body);
  const todo = new Todo(loadTodoContent());
  todo.removeTodo(id);
  const content = todo.toJSON();
  writeToDataStore(content);
  sendResponse(res, 200, content, 'json');
};

const editTodo = function(req, res) {
  const { todoId, title } = querystring.parse(req.body);
  const todo = new Todo(loadTodoContent());
  const content = JSON.stringify(todo.editTodo(todoId, title));
  writeToDataStore(todo.toJSON());
  sendResponse(res, 200, content, 'json');
};

const editTask = function(req, res) {
  const { todoId, taskId, subTitle } = querystring.parse(req.body);
  const todo = new Todo(loadTodoContent());
  const content = JSON.stringify(todo.editTask(todoId, taskId, subTitle));
  writeToDataStore(todo.toJSON());
  sendResponse(res, 200, content, 'json');
};

const removeTask = function(req, res) {
  const { todoId, taskId } = querystring.parse(req.body);
  const todo = new Todo(loadTodoContent());
  const content = JSON.stringify(todo.removeTask(todoId, taskId));
  writeToDataStore(todo.toJSON());
  sendResponse(res, 200, content, 'json');
};

const toggleTaskStatus = function(req, res) {
  const { todoId, taskId } = querystring.parse(req.body);
  const todo = new Todo(loadTodoContent());
  const content = JSON.stringify(todo.toggleStatus(todoId, taskId));
  writeToDataStore(todo.toJSON());
  sendResponse(res, 200, content, 'json');
};

const loadHomePage = function(req, res) {
  const content = JSON.stringify(loadTodoContent());
  sendResponse(res, 200, content, 'json');
};

const app = new App();

app.use(readBody);
app.get('/loadHomePage', loadHomePage);
app.get('', serveStaticFile);
app.get('', notFound);
app.post('/addTodo', addTodo);
app.post('/removeTodo', removeTodo);
app.post('/addTask', addTask);
app.post('/removeTask', removeTask);
app.post('/editTodo', editTodo);
app.post('/editTask', editTask);
app.post('/toggleDone', toggleTaskStatus);
app.post('', notFound);
app.use(methodNotAllowed);

module.exports = { app };
