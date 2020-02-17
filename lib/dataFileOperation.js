const fs = require('fs');
const { env } = process;

const dataStorePath = env.DATA_STORE;
const userListPath = env.USER_LIST || './data/userList.json';
const sessionPath = env.USER_LIST || './data/session.json';

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
    return [];
  }
  return JSON.parse(fs.readFileSync(dataStorePath, 'utf8') || '[]');
};

const loadSession = function() {
  if (isFileNotPresent(sessionPath)) {
    return [];
  }
  return JSON.parse(fs.readFileSync(sessionPath, 'utf8') || '[]');
};

const saveSession = data => fs.writeFileSync(sessionPath, JSON.stringify(data));

const saveUserList = data =>
  fs.writeFileSync(userListPath, JSON.stringify(data));

const writeToDataStore = data =>
  fs.writeFileSync(dataStorePath, JSON.stringify(data));

const fillTemplate = function(fileName, content) {
  const data = fs.readFileSync(`./public/${fileName}`, 'utf8');
  return data.replace(/<!-- incorrect -->/, content);
};

module.exports = {
  loadSession,
  saveSession,
  loadUserList,
  readFile,
  writeToDataStore,
  isFileNotPresent,
  loadTodoContent,
  saveUserList,
  fillTemplate
};
