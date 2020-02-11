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

const addNewTask = function(req, res) {
  const todo = new Todo(loadTodoContent());
  const { title } = querystring.parse(req.body);
  todo.addNewTask(title);
  const content = todo.toJSON();
  writeToDataStore(content);
  sendResponse(res, 200, content, 'json');
};

const addSubTasks = function(req, res) {
  const { id, subTask } = querystring.parse(req.body);
  const todo = new Todo(loadTodoContent());
  const content = JSON.stringify(todo.addSubTask(subTask, id));
  writeToDataStore(todo.toJSON());
  sendResponse(res, 200, content, 'json');
};

const removeTask = function(req, res) {
  const { id } = querystring.parse(req.body);
  const todo = new Todo(loadTodoContent());
  todo.removeTask(id);
  const content = todo.toJSON();
  writeToDataStore(content);
  sendResponse(res, 200, content, 'json');
};

const editTask = function(req, res) {
  const { taskId, title } = querystring.parse(req.body);
  const todo = new Todo(loadTodoContent());
  const content = JSON.stringify(todo.editTask(taskId, title));
  writeToDataStore(todo.toJSON());
  sendResponse(res, 200, content, 'json');
};

const editSubTask = function(req, res) {
  const { taskId, subTaskId, subTitle } = querystring.parse(req.body);
  const todo = new Todo(loadTodoContent());
  const content = JSON.stringify(todo.editSubTask(taskId, subTaskId, subTitle));
  writeToDataStore(todo.toJSON());
  sendResponse(res, 200, content, 'json');
};

const removeSubTask = function(req, res) {
  const { taskId, subTaskId } = querystring.parse(req.body);
  const todo = new Todo(loadTodoContent());
  const content = JSON.stringify(todo.removeSubTask(taskId, subTaskId));
  writeToDataStore(todo.toJSON());
  sendResponse(res, 200, content, 'json');
};

const toggleSubTaskDone = function(req, res) {
  const { taskId, subTaskId } = querystring.parse(req.body);
  const todo = new Todo(loadTodoContent());
  const content = JSON.stringify(todo.toggleStatus(taskId, subTaskId));
  writeToDataStore(todo.toJSON());
  sendResponse(res, 200, content, 'json');
};

const loadHomePage = function(req, res) {
  const content = JSON.stringify(loadTodoContent());
  sendResponse(res, 200, content, 'json');
};

const getParticularTask = function(req, res) {
  const { id } = querystring.parse(req.body);
  const todo = new Todo(loadTodoContent());
  const content = JSON.stringify(todo.getSubTask(id));
  sendResponse(res, 200, content, 'json');
};

const app = new App();

app.use(readBody);
app.get('/loadHomePage', loadHomePage);
app.get('', serveStaticFile);
app.get('', notFound);
app.post('/addTask', addNewTask);
app.post('/removeTask', removeTask);
app.post('/addSubTask', addSubTasks);
app.post('/removeSubTask', removeSubTask);
app.post('/editTask', editTask);
app.post('/editSubTask', editSubTask);
app.post('/toggleDone', toggleSubTaskDone);
app.post('/viewParticularTask', getParticularTask);
app.post('', notFound);
app.use(methodNotAllowed);

module.exports = { app };
