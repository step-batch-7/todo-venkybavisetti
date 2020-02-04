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

const postCallback = function(text) {
  const container = document.getElementById('todoList');
  container.innerHTML = '';
  container.innerHTML = text;
};

const createTitles = function(task) {
  const todoBox = document.createElement('div');
  todoBox.classList.add('todoBox');
  todoBox.textContent = task.title;
  return todoBox;
};

const generateTodoTasks = function(text) {
  const todoTitleContainer = document.getElementById('todoList');
  todoTitleContainer.innerHTML = '';
  const todoTasksJson = JSON.parse(text);
  console.log(todoTasksJson);
  const todoTitles = todoTasksJson.map(createTitles);
  todoTitles.forEach(task => todoTitleContainer.appendChild(task));
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
  postHttpMsg('/removeTodoBox', postCallback, `id=${todoBoxId}`);
};
