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

const serveHomePage = function(req, res, next) {
  // if (req.url !== '/' && req.url !== '/index.html') return next();
  const todoList = loadTodoContent();
  const html = loadTemplate('index.html', getTodoTitles(todoList));
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

const getTodoTitles = function(todoList) {
  const todoHtml = todoList
    .map(todo => {
      const html = `<div class= "todoBox">
      ${todo.title}
      </div>`;
      return html;
    })
    .join('\n');
  return { todoList: todoHtml };
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

const addNewTitle = function(req, res) {
  const todoList = loadTodoContent();
  const newTitle = querystring.parse(req.body);
  todoList.unshift(newTitle);
  storeTodoList(todoList);
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(todoList[0], null, 2));
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
app.post('/addTitle', addNewTitle);
app.post('', notFound);
app.use(methodNotAllowed);

module.exports = { app };
