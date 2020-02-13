const selectAll = document.querySelectorAll.bind(document);
const getElement = document.getElementById.bind(document);

const focusOnSubTask = function() {
  document.querySelector('.subTaskText').focus();
};

const convertHtmlToNode = function(html) {
  const temp = document.createElement('div');
  temp.innerHTML = html;
  return temp.firstChild;
};

const getStatus = function(subTasks) {
  const doneTasks = subTasks.reduce((doneNum, task) => {
    return task.done ? ++doneNum : doneNum;
  }, 0);
  return {
    totalTasks: subTasks.length,
    doneTasks,
    notDoneTasks: subTasks.length - doneTasks
  };
};

const isChecked = function(boolean) {
  return boolean ? 'checked' : '';
};

const getClass = function(boolean) {
  return boolean ? 'class="checkedClass"' : 'class="unCheckedClass"';
};

const getStatusHtml = function(task) {
  const taskStatus = getStatus(task.tasks);
  const html = `<span class="totalTasks">
      Total Tasks :- ${taskStatus.totalTasks}
    </span>
    <span class="tasksDone">
      <p style="margin:1px">${taskStatus.doneTasks}</p>
      <img 
        src="images/done.svg" 
        height="20"
      >
    </span>
    <span class="tasksNotDone">
      <p style="margin:0px">${taskStatus.notDoneTasks}</p>
      <img 
        src="images/wrong.svg"
        height="17px"
      >
    </span>`;
  return html;
};

const getSubTasksList = function(task) {
  const subTaskHtml = function(subTaskList, subTask) {
    const subTaskHtml = `<li 
      ${getClass(subTask.done)} 
      id="${task.id}_${subTask.id}"
    >
      <div >
        <input 
          type="checkbox" 
          ${isChecked(subTask.done)} 
          onclick="toggleDone(${task.id},${subTask.id})"
        >
        <span 
          contenteditable class="subTaskText"
          spellcheck = "false"
          onfocusout="editSubTask(${task.id},${subTask.id})"
        >
          ${subTask.text}
        </span>
      </div>
      <div class = "subTaskImages">
      <span style='margin-top:2px'><img src="images/edit.svg" height ="18px" onclick="focusOnSubTask()"/></span>
      <img 
        src="images/cancel.svg"
        onclick="removeSubTask(${task.id},${subTask.id})" height ="22px"
      />
      </div>
    </li>`;
    subTask.done
      ? subTaskList.push(subTaskHtml)
      : subTaskList.unshift(subTaskHtml);
    return subTaskList;
  };
  return task.tasks.reduce(subTaskHtml, []).join('');
};

const createTitle = function(task) {
  const titleHtml = `<li
    class="titleListDisplay"
    id="title${task.id}"
  >
    ${task.title}
    <img
      src="images/delete.svg"
      onclick = 'removeTask(${task.id})'
      height ="17px"
    />
  </li>`;
  return convertHtmlToNode(titleHtml);
};

const setUpTitleContainer = function(tasks) {
  const titleContainer = getElement('titleContainer');
  titleContainer.innerHTML = '';
  const titleList = tasks.map(createTitle);
  titleList.forEach(title => titleContainer.appendChild(title));
};

const setUpTaskContainer = function(tasks) {
  const taskContainer = getElement('taskContainer');
  taskContainer.innerHTML = '';
  const taskList = tasks.map(createTasks);
  taskList.forEach(task => taskContainer.appendChild(task));
};

const generateTodoTasks = function(arrayOfObjects) {
  setUpTitleContainer(arrayOfObjects);
  setUpTaskContainer(arrayOfObjects);
};

const createSubTask = function(task) {
  const subTaskHtml = `<div class="subTaskList">
  ${getSubTasksList(task)}
  </div>`;
  return convertHtmlToNode(subTaskHtml);
};

const addSubTask = function(task) {
  const subTaskAdderHtml = `<div class="subTaskAdder">
  <input 
    type="text" 
    name="title" 
    class="subTaskInput" 
    placeholder="Tasks..."
  />
  <button 
    onclick="addNewSubTask(${task.id})"
    class="subTaskButton"
  >
  <img src="images/add.svg" height="30px"/>
  </button>
</div>`;
  return convertHtmlToNode(subTaskAdderHtml);
};

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
