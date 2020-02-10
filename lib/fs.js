const fs = require('fs');
const dataStorePath = process.env.DATA_STORE;

const readFile = path => fs.readFileSync(path);

const isFileNotPresent = function(path) {
  const stat = fs.existsSync(path) && fs.statSync(path);
  return !stat || !stat.isFile();
};

const loadTodoContent = function() {
  if (isFileNotPresent(dataStorePath)) {
    return '[]';
  }
  return JSON.parse(fs.readFileSync(dataStorePath, 'utf8') || '[]');
};

const writeToDataStore = data => fs.writeFileSync(dataStorePath, data);

module.exports = {
  readFile,
  writeToDataStore,
  isFileNotPresent,
  loadTodoContent
};
