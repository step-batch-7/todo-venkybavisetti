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
  const taskHtml = `<div 
    class="todoBox" 
    onclick="particularTask(${task.id})"
    >
    <div class="allHeaders">
      <p style="margin:6px" >${task.title}</p>
      <img 
        src="https://img.icons8.com/wired/64/000000/trash.png"
        height="30px"
        onclick = 'removeTask(${task.id})'
      />
      </div>
    </div>`;
  return convertHtmlToNode(taskHtml);
};

const isChecked = function(boolean) {
  return boolean ? 'checked' : '';
};

const getClass = function(boolean) {
  return boolean ? 'class="checkedClass"' : 'class="unCheckedClass"';
};

const getSubTasksList = function(task) {
  const subTaskHtml = function(subTask) {
    const subTaskHtml = `<li ${getClass(subTask.done)} ">
    <div>
      <input 
        type="checkbox" 
        ${isChecked(subTask.done)} 
        onclick="toggleDone(${task.id},${subTask.id})"
      >
      ${subTask.text}
      </div>
      <div>
      <img 
        src="https://img.icons8.com/ios-glyphs/30/000000/cancel.png"
        onclick="removeSubTask(${task.id},${subTask.id})" height ="22px"
      />
      </div>
    </li>`;
    return subTaskHtml;
  };
  return task.tasks.map(subTaskHtml).join('');
};

const particularTaskView = function(task) {
  const particularTaskHtml = `<div class="particularTask">
    <div class="particularTaskHeader">
      <h1>${task.title}</h1>
      <img src="https://img.icons8.com/wired/64/000000/trash.png"
           height="40px" onclick = 'removeTask(${task.id})'
      />
    </div>
    <ul class ="subTaskList">${getSubTasksList(task)}</ul>
  </div>`;
  return convertHtmlToNode(particularTaskHtml);
};

const createTitle = function(task) {
  const titleHtml = `<li 
    onclick="particularTask(${task.id})" 
    class="titleListDisplay"
  >
    ${task.title}
    <img 
      src="https://img.icons8.com/wired/64/000000/trash.png"
      onclick = 'removeTask(${task.id})' 
      height ="17px"
    />
  </li>`;
  return convertHtmlToNode(titleHtml);
};

const createReturnBar = function(task) {
  const returnHtml = `<div class="returnBar">
    <img 
      src="https://img.icons8.com/carbon-copy/100/000000/return.png"
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
        onclick="addNewSubTask(${task.id})"
      >
      Add
      </button>
    </div>
  </div>`;
  return convertHtmlToNode(returnHtml);
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
  postHttpMsg('/addTask', generateTodoTasks, `title=${newTask}`);
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
  postHttpMsg('/removeTask', generateTodoTasks, `id=${id}`);
};

const removeSubTask = function(taskId, subTaskId) {
  postHttpMsg(
    '/removeSubTask',
    generateParticularTask,
    `taskId=${taskId}&subTaskId=${subTaskId}`
  );
};

const duplicate = function(text) {
  const object = JSON.parse(text);
  console.log(object);
};

const toggleDone = function(taskId, subTaskId) {
  console.log(taskId, subTaskId);
  postHttpMsg(
    '/toggleDone',
    generateParticularTask,
    `taskId=${taskId}&subTaskId=${subTaskId}`
  );
};

const particularTask = function(id) {
  postHttpMsg('/viewParticularTask', generateParticularTask, `id=${id}`);
};

const loadHomePage = function() {
  getHttpMsg('/loadHomePage', generateTodoTasks);
};
