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

let generateTaskId = 1;
let generateSubTaskId = 1;

const notFound = function(req, res) {
  res.statusCode = 404;
  res.setHeader('Content-Type', CONTENT_TYPES.txt);
  res.end('Not Found');
};

const methodNotAllowed = function(req, res) {
  res.statusCode = 400;
  res.setHeader('Content-Type', CONTENT_TYPES.txt);
  res.end('Method Not Allowed');
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

const storeData = function(todoList) {
  const string = JSON.stringify(todoList);
  writeToDataStore(string);
};

const serveStaticFile = (req, res, next) => {
  const url = getUrl(req.url);
  const [, extension] = url.match(/.*\.(.*)$/) || [];
  const path = getPath(url, extension);
  if (isFileNotPresent(path)) {
    return next();
  }
  const content = readFile(path);
  res.setHeader('Content-Type', CONTENT_TYPES[extension]);
  res.end(content);
};

const addNewTask = function(req, res) {
  const todo = new Todo(loadTodoContent());
  const { title } = querystring.parse(req.body);
  todo.addNewTask(title);
  const content = todo.toJSON();
  writeToDataStore(content);
  res.setHeader('Content-Type', CONTENT_TYPES.json);
  res.end(content);
};

const addSubTasks = function(req, res) {
  const { id, subTask } = querystring.parse(req.body);
  const todo = new Todo(loadTodoContent());
  const content = todo.addSubTask(subTask, id);
  writeToDataStore(todo.toJSON());
  res.setHeader('Content-Type', CONTENT_TYPES.json);
  res.end(JSON.stringify(content));
};

const removeTask = function(req, res) {
  const { id } = querystring.parse(req.body);
  const todo = new Todo(loadTodoContent());
  todo.removeTask(id);
  const content = todo.toJSON();
  writeToDataStore(content);
  res.setHeader('Content-Type', CONTENT_TYPES.json);
  res.end(content);
};

const editTask = function(req, res) {
  const { taskId, title } = querystring.parse(req.body);
  const todoList = loadTodoContent();
  const todoIndex = todoList.findIndex(task => task.id === +taskId);
  todoList[todoIndex].title = title || todoList[todoIndex].title;
  storeData(todoList);
  res.setHeader('Content-Type', CONTENT_TYPES.json);
  res.end(JSON.stringify(todoList[todoIndex], null, 2));
};

const editSubTask = function(req, res) {
  const { taskId, subTaskId, subTitle } = querystring.parse(req.body);
  const todoList = loadTodoContent();
  const taskIndex = todoList.findIndex(todoBox => todoBox.id === +taskId);
  const subTaskIndex = todoList[taskIndex].tasks.findIndex(
    subTask => subTask.id === +subTaskId
  );
  todoList[taskIndex].tasks[subTaskIndex].text = subTitle;
  storeData(todoList);
  res.setHeader('Content-Type', CONTENT_TYPES.json);
  res.end(JSON.stringify(todoList[taskIndex], null, 2));
};

const removeSubTask = function(req, res) {
  const { taskId, subTaskId } = querystring.parse(req.body);
  const todoList = loadTodoContent();
  const taskIndex = todoList.findIndex(todoBox => todoBox.id === +taskId);
  const subTaskIndex = todoList[taskIndex].tasks.findIndex(
    subTask => subTask.id === +subTaskId
  );
  todoList[taskIndex].tasks.splice(subTaskIndex, 1);
  storeData(todoList);
  res.setHeader('Content-Type', CONTENT_TYPES.json);
  res.end(JSON.stringify(todoList[taskIndex], null, 2));
};

const toggleSubTaskDone = function(req, res) {
  const { taskId, subTaskId } = querystring.parse(req.body);
  const todoList = loadTodoContent();
  const taskIndex = todoList.findIndex(todoBox => todoBox.id === +taskId);
  const subTaskIndex = todoList[taskIndex].tasks.findIndex(
    subTask => subTask.id === +subTaskId
  );
  const subTask = todoList[taskIndex].tasks[subTaskIndex];
  subTask.done = !subTask.done;
  storeData(todoList);
  res.setHeader('Content-Type', CONTENT_TYPES.json);
  res.end(JSON.stringify(todoList[taskIndex], null, 2));
};

const loadHomePage = function(req, res) {
  const todoList = loadTodoContent();
  res.setHeader('Content-Type', CONTENT_TYPES.json);
  res.end(JSON.stringify(todoList, null, 2));
};

const getParticularTask = function(req, res) {
  const { id } = querystring.parse(req.body);
  const todoList = loadTodoContent();
  const todoIndex = todoList.findIndex(todoBox => todoBox.id === +id);
  res.setHeader('Content-Type', CONTENT_TYPES.json);
  res.end(JSON.stringify(todoList[todoIndex], null, 2));
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
