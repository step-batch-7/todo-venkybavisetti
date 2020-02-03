const fs = require('fs');
const { App } = require('./app');
const CONTENT_TYPES = require('./mimeTypes');
const { loadTemplate } = require('./viewTemplate');

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
  if (req.url != '/') return next();
  const todoList = loadTodoContent();
  console.log(todoList);
  const html = loadTemplate('index.html', getTodoTitles(todoList));
  res.setHeader('Content-Type', CONTENT_TYPES.html);
  res.end(html);
};

const loadTodoContent = function() {
  const path = './data/todoList.json';
  const stat = fs.existsSync(path) && fs.statSync(path);

  console.log(fs.existsSync(path));
  if (!stat || !stat.isFile()) {
    return [];
  }
  return JSON.parse(fs.readFileSync(path, 'utf8'));
};

const getTodoTitles = function(todoList) {
  const todoHtml = todoList
    .map(todo => {
      const html = `<div class= "todoBox">
      <div class="title">${todo.title}
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
app.post('', notFound);
app.use(methodNotAllowed);

module.exports = { app };
