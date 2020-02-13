const createStatusBar = function(task) {
  const statusBar = `<div class="statusBar">
  ${getStatusHtml(task)}
  </div>`;
  return convertHtmlToNode(statusBar);
};

const createDeleteButton = function(id) {
  const deleteButton = document.createElement('img');
  deleteButton.src = 'images/delete.svg';
  deleteButton.onclick = () => removeTask(id);
  return deleteButton;
};

const createTaskHeader = function(task) {
  const taskHeader = document.createElement('div');
  taskHeader.className = 'allHeaders';
  const title = document.createElement('p');
  title.contentEditable = true;
  title.onblur = () => editTask(task.id);
  title.innerText = task.title;
  const deleteButton = createDeleteButton(task.id);
  taskHeader.appendChild(title);
  taskHeader.appendChild(deleteButton);
  return taskHeader;
};

const createTasks = function(task) {
  const taskHeader = createTaskHeader(task);
  const statusBar = createStatusBar(task);
  const subTaskList = createSubTask(task);
  const subTaskAdder = addSubTask(task);
  const todoBox = document.createElement('div');
  todoBox.className = 'todoBox';
  todoBox.id = task.id;
  const child = [taskHeader, statusBar, subTaskList, subTaskAdder];
  child.forEach(child => todoBox.appendChild(child));
  return todoBox;
};

const generateParticularTask = function(taskDetails) {
  const task = getSubTasksList(taskDetails);
  const container = document.querySelector(
    `[id="${taskDetails.id}"] .subTaskList`
  );
  const statusBar = document.querySelector(
    `[id="${taskDetails.id}"] .statusBar`
  );
  statusBar.innerHTML = '';
  statusBar.innerHTML = getStatusHtml(taskDetails);
  container.innerHTML = task;
};

const editTaskTitle = function(task) {
  document.getElementById(`title${task.id}`).innerText = task.title;
};
