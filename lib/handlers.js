const { writeToDataStore, loadTodoContent } = require('./fs');
const { Todo } = require('./todoList');

const todo = new Todo(loadTodoContent());

const addTodo = function(req, res) {
  const { title } = req.body;
  todo.addTodo(title);
  writeToDataStore(todo.toJSON());
  res.json(todo.list);
};

const addTask = function(req, res) {
  const { id, task } = req.body;
  const content = todo.addTask(task, id);
  writeToDataStore(todo.toJSON());
  res.json(content);
};

const removeTodo = function(req, res) {
  const { id } = req.body;
  todo.removeTodo(id);
  const content = todo.list;
  writeToDataStore(content);
  res.json(content);
};

const editTodo = function(req, res) {
  const { todoId, title } = req.body;
  const content = todo.editTodo(todoId, title);
  res.json(content);
};

const editTask = function(req, res) {
  const { todoId, taskId, subTitle } = req.body;
  const content = todo.editTask(todoId, taskId, subTitle);
  writeToDataStore(todo.toJSON());
  res.json(content);
};

const removeTask = function(req, res) {
  const { todoId, taskId } = req.body;
  const content = todo.removeTask(todoId, taskId);
  writeToDataStore(todo.toJSON());
  res.json(content);
};

const toggleTaskStatus = function(req, res) {
  const { todoId, taskId } = req.body;
  const content = todo.toggleStatus(todoId, taskId);
  writeToDataStore(todo.toJSON());
  res.json(content);
};

const loadHomePage = function(req, res) {
  res.json(todo.list);
};

const methodNotAllowed = function(req, res, next) {
  const allowedMethod = ['GET', 'POST'];
  if (allowedMethod.includes(req.method)) {
    return next();
  }

  res.status(400).send('MethodNotAllowed');
};

module.exports = {
  methodNotAllowed,
  addTodo,
  removeTodo,
  addTask,
  removeTask,
  editTodo,
  editTask,
  toggleTaskStatus,
  loadHomePage
};
