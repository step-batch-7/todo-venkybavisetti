const postHttpMsg = function(url, callback, message) {
  const req = new XMLHttpRequest();
  req.onload = function() {
    if (this.status == '200') {
      callback(this.responseText);
    }
  };
  req.open('POST', url);
  req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  req.send(message);
};

const getHttpMsg = function(url, callback) {
  const req = new XMLHttpRequest();
  req.onload = function() {
    if (this.status == '200') {
      callback(this.responseText);
    }
  };
  req.open('GET', url);
  req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  req.send();
};

const createTodoTasks = function(task) {
  const todoBox = document.createElement('div');
  todoBox.classList.add('todoBox');
  todoBox.id = task.id;
  todoBox.innerHTML = `<h4 class ="todoBoxHeader">${task.title}</h4>
    <img src="https://img.icons8.com/color/48/000000/delete-forever.png" alt = 'x' class = 'close' onclick = 'removeTodoTitle()'/>`;
  return todoBox;
};

const createLists = function(task) {
  const titlesList = document.createElement('li');
  titlesList.innerHTML = `${task.title}`;
  return titlesList;
};

const generateTodoContainer = function(todoTasks) {
  const todoTitleContainer = document.getElementById('todoList');
  todoTitleContainer.innerHTML = '';
  const todoTitles = todoTasks.map(createTodoTasks);
  todoTitles.forEach(task => todoTitleContainer.appendChild(task));
};
const generateTitlesContainer = function(todoTasks) {
  const listContainer = document.getElementById('titlesList');
  listContainer.innerHTML = '';
  const titlesList = todoTasks.map(createLists);
  titlesList.forEach(title => listContainer.appendChild(title));
};

const generateTodoTasks = function(text) {
  const arrayOfObjects = JSON.parse(text);
  generateTodoContainer(arrayOfObjects);
  generateTitlesContainer(arrayOfObjects);
};

const addTitle = function() {
  const newTitleBox = document.querySelector('#title');
  const newTitle = newTitleBox.value;
  newTitleBox.value = '';
  postHttpMsg('/addTodoBox', generateTodoTasks, `title=${newTitle}`);
};

const removeTodoTitle = function() {
  const [, todoBox] = event.path;
  const todoBoxId = todoBox.id;
  postHttpMsg('/removeTodoBox', generateTodoTasks, `id=${todoBoxId}`);
};

const loadHomePage = function() {
  getHttpMsg('/loadHomePage', generateTodoTasks);
};
