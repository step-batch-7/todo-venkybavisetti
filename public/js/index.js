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

const convertHtmlToNode = function(html) {
  const temp = document.createElement('div');
  temp.innerHTML = html;
  return temp.firstChild;
};

const createTodoTasks = function(task) {
  const html = `<div class="todoBox" id="${task.id}" onclick="particularTask(${task.id})">
    <h4 class ="todoBoxHeader" >${task.title}</h4>
    <img src="https://img.icons8.com/color/48/000000/delete-forever.png" alt = 'x' class = 'close' onclick = 'removeTodoTitle(${task.id})'/>
  </div>`;
  return convertHtmlToNode(html);
};

const getSubTasksList = function(task) {
  const subTaskHtml = function(subTask) {
    const html = `<li class="itemsDisplay">
      ${subTask.text}
      <img src="https://img.icons8.com/color/48/000000/delete-forever.png" class = 'close'  height ="30px" onclick="removeSubTask(${task.id},${subTask.id})"/>
    </li>`;
    return html;
  };
  return task.tasks.map(subTaskHtml).join('');
};

const particularTaskView = function(task) {
  const html = `<div class="particularTaskBox">
    <div class="particularHeader">
      <h1>${task.title}</h1>
      <img src="https://img.icons8.com/color/48/000000/delete-forever.png" 
           alt = 'x' class = 'close' onclick = 'removeTodoTitle(${task.id})'
      />
    </div>
    <ul class ="subTasksList">${getSubTasksList(task)}</ul>
  </div>`;
  return convertHtmlToNode(html);
};

const createLists = function(task) {
  const html = `<li id="${task.id}" onclick="particularTask(${task.id})" class="itemsDisplay">
    ${task.title}<img src="https://img.icons8.com/color/48/000000/delete-forever.png" class = 'close' onclick = 'removeTodoTitle(${task.id})' height ="17px"/>
  </li>`;
  return convertHtmlToNode(html);
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
const createHeaderLineOfTask = function(task) {
  const html = `<div class="returnBar"><img src="https://img.icons8.com/plasticine/100/000000/return.png"  onclick = "loadHomePage()" height ="30px"> 
  <div class="submissionOfTaskHeader"><input type="text" name="title" class="tasksInput" placeholder="Tasks..." required="true"/><button class="taskSubmit" onclick="addSubTasks(${task.id})">Add</button></div>
  </div>`;
  return convertHtmlToNode(html);
};
const generateSingleTodoTask = function(text) {
  const task = JSON.parse(text);
  const todoTitleContainer = document.getElementById('todoList');
  todoTitleContainer.innerHTML = '';
  todoTitleContainer.appendChild(createHeaderLineOfTask(task));
  todoTitleContainer.appendChild(particularTaskView(task));
};

const addTitle = function() {
  const newTitleBox = document.querySelector('#title');
  const newTitle = newTitleBox.value;
  newTitleBox.value = '';
  postHttpMsg('/addTodoBox', generateTodoTasks, `title=${newTitle}`);
};

const addSubTasks = function(id) {
  const newSubTaskBox = document.querySelector('.tasksInput');
  const newSubTask = newSubTaskBox.value;
  newSubTaskBox.value = '';
  postHttpMsg(
    '/addSubTask',
    generateSingleTodoTask,
    `subTask=${newSubTask}&id=${id}`
  );
};

const removeTodoTitle = function(id) {
  postHttpMsg('/removeTodoBox', generateTodoTasks, `id=${id}`);
};

const removeSubTask = function(taskId, subTaskId) {
  postHttpMsg(
    '/removeSubTask',
    generateSingleTodoTask,
    `taskId=${taskId}&subTaskId=${subTaskId}`
  );
};

const particularTask = function(id) {
  postHttpMsg('/particularTask', generateSingleTodoTask, `id=${id}`);
};

const loadHomePage = function() {
  getHttpMsg('/loadHomePage', generateTodoTasks);
};
