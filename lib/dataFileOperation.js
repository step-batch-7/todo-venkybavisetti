const redis = require('redis');
const fs = require('fs');
const {env} = process;

const url = env.REDIS_URL || '6379';

const loadUserList = function(app) {
  const client = redis.createClient(url);
  client.get('userList', (err, data) => {
    if (err) {
      app.locals.errTodoList = err;
    }
    const userList = data || '[]';
    app.locals.userList = JSON.parse(userList);
  });
  client.quit();
};

const loadTodoContent = function(app) {
  const client = redis.createClient(url);
  client.get('todoList', (err, data) => {
    if (err) {
      app.locals.errTodoList = err;
    }
    const todoList = data || '{}';
    app.locals.todoList = JSON.parse(todoList);
  });
  client.quit();
};

const saveUserList = data => {
  const client = redis.createClient(url);
  client.set('userList', JSON.stringify(data));
  client.quit();
};

const writeToDataStore = data => {
  const client = redis.createClient(url);
  client.set('todoList', JSON.stringify(data));
  client.quit();
};

const fillTemplate = function(fileName, content) {
  const data = fs.readFileSync(`./public/${fileName}`, 'utf8');
  return data.replace(/<!-- __replace__ -->/, content);
};

module.exports = {
  loadUserList,
  writeToDataStore,
  loadTodoContent,
  saveUserList,
  fillTemplate
};
