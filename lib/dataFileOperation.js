const fs = require('fs');
const { env } = process;

const dataStorePath = env.DATA_STORE || './data/todoList.json';
const userListPath = env.USER_LIST || './data/userList.json';

const readFile = path => fs.readFileSync(path);

const isFileNotPresent = function(path) {
  const stat = fs.existsSync(path) && fs.statSync(path);
  return !stat || !stat.isFile();
};

const loadUserList = function() {
  if (isFileNotPresent(userListPath)) {
    return [];
  }
  return JSON.parse(fs.readFileSync(userListPath, 'utf8') || '[]');
};

const loadTodoContent = function() {
  if (isFileNotPresent(dataStorePath)) {
    return {};
  }
  return JSON.parse(fs.readFileSync(dataStorePath, 'utf8') || '{}');
};

const saveUserList = data =>
  fs.writeFileSync(userListPath, JSON.stringify(data));

const writeToDataStore = data => {
  fs.writeFileSync(dataStorePath, JSON.stringify(data));
};

const fillTemplate = function(fileName, content) {
  const data = fs.readFileSync(`./public/${fileName}`, 'utf8');
  return data.replace(/<!-- __replace__ -->/, content);
};

module.exports = {
  loadUserList,
  readFile,
  writeToDataStore,
  isFileNotPresent,
  loadTodoContent,
  saveUserList,
  fillTemplate
};
