const fs = require('fs');
const querystring = require('querystring');
const { App } = require('./app');
const CONTENT_TYPES = require('./mimeTypes');
const { loadTemplate } = require('./viewTemplate');
const todoListPath = './data/todoList.json';

const getPath = function(url, extension) {
  const STATIC_FOLDER = `${__dirname}/../public`;
  const htmlFile = extension === 'html' ? '/html' : '';
  return `${STATIC_FOLDER}${htmlFile}${url}`;
};

const getUrl = function(url) {
  return url === '/' ? '/index.html' : url;
};

const areStatsNotOk = function(stat) {
  return !stat || !stat.isFile();
};

const serveHomePage = function(req, res) {
  const todoList = loadTodoContent();
  const html = loadTemplate('index.html', {
    todoList: generateTodoTitlesHtml(todoList)
  });
  res.setHeader('Content-Type', CONTENT_TYPES.html);
  res.end(html);
};

const loadTodoContent = function() {
  const path = todoListPath;
  const stat = fs.existsSync(path) && fs.statSync(path);
  if (!stat || !stat.isFile()) {
    return [];
  }
  return JSON.parse(fs.readFileSync(path, 'utf8'));
};

const generateTitleHtml = function(todo) {
  const html = `<div class= "todoBox"id="${todo.id}">
  <h4 class ="todoBoxHeader">${todo.title}</h4>
  <img src="https://img.icons8.com/color/48/000000/delete-forever.png" alt = 'x' class = 'close' onclick = 'removeTodoTitle()'/>
  </div>`;
  return html;
};

const generateTodoTitlesHtml = function(todoList) {
  return todoList.map(generateTitleHtml).join('\n');
};

const serveStaticFile = (req, res, next) => {
  const url = getUrl(req.url);
  const [, extension] = url.match(/.*\.(.*)$/) || [];
  const path = getPath(url, extension);
  const stat = fs.existsSync(path) && fs.statSync(path);
  if (areStatsNotOk(stat)) {
    return next();
  }
  const content = fs.readFileSync(path);
  res.setHeader('Content-Type', CONTENT_TYPES[extension]);
  res.end(content);
};

const storeTodoList = function(todoList) {
  const string = JSON.stringify(todoList);
  fs.writeFileSync(todoListPath, string, 'utf8');
};

let todoBoxId = 1;

// const addNewTitle = function(req, res) {
//   const todoList = loadTodoContent();
//   const newTitle = querystring.parse(req.body);
//   newTitle.id = todoBoxId++;
//   todoList.unshift(newTitle);
//   storeTodoList(todoList);
//   res.setHeader('Content-Type', CONTENT_TYPES.html);
//   res.end(generateTodoTitlesHtml(todoList));
// };

const addNewTitle = function(req, res) {
  const todoList = loadTodoContent();
  const newTitle = querystring.parse(req.body);
  newTitle.id = todoBoxId++;
  todoList.unshift(newTitle);
  storeTodoList(todoList);
  res.setHeader('Content-Type', CONTENT_TYPES.json);
  res.end(JSON.stringify(todoList, null, 2));
};

const removeTitle = function(req, res) {
  const { id } = querystring.parse(req.body);
  const todoList = loadTodoContent();
  const todoIndex = todoList.findIndex(todoBox => todoBox.id === +id);
  todoList.splice(todoIndex, 1);
  storeTodoList(todoList);
  res.setHeader('Content-Type', CONTENT_TYPES.json);
  res.end(JSON.stringify(todoList, null, 2));
};

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

const app = new App();

app.use(readBody);

app.get('/', serveHomePage);
app.get('', serveStaticFile);
app.get('', notFound);
app.post('/addTodoBox', addNewTitle);
app.post('/removeTodoBox', removeTitle);
app.post('', notFound);
app.use(methodNotAllowed);

module.exports = { app };
