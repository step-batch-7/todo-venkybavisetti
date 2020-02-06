const statusCode = { ok: 200 };

const postHttpMsg = function(url, callback, message) {
  const req = new XMLHttpRequest();
  req.onload = function() {
    if (this.status === statusCode.ok) {
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
    if (this.status === statusCode.ok) {
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

const createTasks = function(task) {
  const html = `<div 
    class="todoBox" 
    id="${task.id}" 
    onclick="particularTask(${task.id})"
    >
      <h4 class ="todoBoxHeader" >${task.title}</h4>
      <img 
        src="https://img.icons8.com/color/48/000000/delete-forever.png" 
        alt = 'x' 
        class = 'close' 
        onclick = 'removeTask(${task.id})'
      />
    </div>`;
  return convertHtmlToNode(html);
};

const getSubTasksList = function(task) {
  const subTaskHtml = function(subTask) {
    const html = `<li class="listDisplay">
      ${subTask.text}
      <img 
        src="https://img.icons8.com/color/48/000000/delete-forever.png" 
        class = 'close' 
        height ="30px" 
        onclick="removeSubTask(${task.id},${subTask.id})"
      />
    </li>`;
    return html;
  };
  return task.tasks.map(subTaskHtml).join('');
};

const particularTaskView = function(task) {
  const html = `<div class="particularTask">
    <div class="particularTaskHeader">
      <h1>${task.title}</h1>
      <img src="https://img.icons8.com/color/48/000000/delete-forever.png" 
           alt = 'x' class = 'close' onclick = 'removeTask(${task.id})'
      />
    </div>
    <ul class ="subTaskList">${getSubTasksList(task)}</ul>
  </div>`;
  return convertHtmlToNode(html);
};

const createTitle = function(task) {
  const titleHtml = `<li 
    onclick="particularTask(${task.id})" 
    class="listDisplay"
  >
    ${task.title}
    <img 
      src="https://img.icons8.com/color/48/000000/delete-forever.png"
      class = 'close' 
      onclick = 'removeTask(${task.id})' 
      height ="17px"
    />
  </li>`;
  return convertHtmlToNode(titleHtml);
};

const createReturnBar = function(task) {
  const html = `<div class="returnBar">
    <img 
      src="https://img.icons8.com/plasticine/100/000000/return.png" 
      onclick = "loadHomePage()" 
      height ="30px"
    >
    <div class="subTaskAdder">
      <input 
        type="text" 
        name="title" 
        class="subTaskInput" 
        placeholder="Tasks..."
      />
      <button 
        class="taskSubmit"
        onclick="addNewSubTask(${task.id})"
      >
        Add
      </button>
    </div>
  </div>`;
  return convertHtmlToNode(html);
};

const setUpTitleContainer = function(tasks) {
  const titleContainer = document.getElementById('titleContainer');
  titleContainer.innerHTML = '';
  const titleList = tasks.map(createTitle);
  titleList.forEach(title => titleContainer.appendChild(title));
};

const setUpTaskContainer = function(tasks) {
  const taskContainer = document.getElementById('taskContainer');
  taskContainer.innerHTML = '';
  const taskList = tasks.map(createTasks);
  taskList.forEach(task => taskContainer.appendChild(task));
};

const generateTodoTasks = function(text) {
  const arrayOfObjects = JSON.parse(text);
  setUpTitleContainer(arrayOfObjects);
  setUpTaskContainer(arrayOfObjects);
};

const generateParticularTask = function(text) {
  const arrayOfObjects = JSON.parse(text);
  const taskContainer = document.getElementById('taskContainer');
  taskContainer.innerHTML = '';
  taskContainer.appendChild(createReturnBar(arrayOfObjects));
  taskContainer.appendChild(particularTaskView(arrayOfObjects));
};

const addNewTask = function() {
  const newTaskInput = document.querySelector('#taskInput');
  const newTask = newTaskInput.value;
  newTaskInput.value = '';
  postHttpMsg('/addTodoBox', generateTodoTasks, `title=${newTask}`);
};

const addNewSubTask = function(id) {
  const newSubTaskInput = document.querySelector('.subTaskInput');
  const newSubTask = newSubTaskInput.value;
  newSubTaskInput.value = '';
  postHttpMsg(
    '/addSubTask',
    generateParticularTask,
    `subTask=${newSubTask}&id=${id}`
  );
};

const removeTask = function(id) {
  postHttpMsg('/removeTodoBox', generateTodoTasks, `id=${id}`);
};

const removeSubTask = function(taskId, subTaskId) {
  postHttpMsg(
    '/removeSubTask',
    generateParticularTask,
    `taskId=${taskId}&subTaskId=${subTaskId}`
  );
};

const particularTask = function(id) {
  postHttpMsg('/particularTask', generateParticularTask, `id=${id}`);
};

const loadHomePage = function() {
  getHttpMsg('/loadHomePage', generateTodoTasks);
};
