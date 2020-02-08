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
const createTasks = function(task) {
  const taskHtml = `<div 
    class="todoBox" 
    onclick="particularTask(${task.id})"
    >
    <div class="allHeaders">
      <p style="margin:6px" >${task.title}</p>
      <img 
        src="images/delete.svg"
        height="30px"
        onclick = 'removeTask(${task.id})'
      />
      </div>
      ${getStatusHtml(task)}
    </div>`;
  return convertHtmlToNode(taskHtml);
};

const isChecked = function(boolean) {
  return boolean ? 'checked' : '';
};

const getClass = function(boolean) {
  return boolean ? 'class="checkedClass"' : 'class="unCheckedClass"';
};

const getStatusHtml = function(task) {
  const taskStatus = getStatus(task.tasks);
  const html = `  <div class="statusBar">
    <span class="totalTasks">
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
    </span>
  </div>`;
  return html;
};

const getSubTasksList = function(task) {
  const subTaskHtml = function(subTaskList, subTask) {
    const subTaskHtml = `<li ${getClass(subTask.done)} ">
      <div>
        <input 
          type="checkbox" 
          ${isChecked(subTask.done)} 
          onclick="toggleDone(${task.id},${subTask.id})"
        >
        ${subTask.text}
      </div>
      <img 
        src="images/cancel.svg"
        onclick="removeSubTask(${task.id},${subTask.id})" height ="22px"
      />
    </li>`;
    subTask.done
      ? subTaskList.push(subTaskHtml)
      : subTaskList.unshift(subTaskHtml);
    return subTaskList;
  };
  return task.tasks.reduce(subTaskHtml, []).join('');
};

const particularTaskView = function(task) {
  const particularTaskHtml = `<div class="particularTask">
    <div class="particularTaskHeader">
        <input type="text" 
        class="titleName"
          onfocusout="editTask(${task.id})"
          value=${task.title}
        >
        </>
      ${getStatusHtml(task)}
      <div style="margin-top:19px">
        <img src="images/edit.svg" height="40px">
        <img 
          src="images/delete.svg"
          height="40px" onclick = 'removeTask(${task.id})'
        />
      </div>
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
      src="images/delete.svg"
      onclick = 'removeTask(${task.id})' 
      height ="17px"
    />
  </li>`;
  return convertHtmlToNode(titleHtml);
};

const createReturnBar = function(task) {
  const returnHtml = `<div class="returnBar">
    <img 
      src="images/return.png"
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
        class="subTaskButton"
      >
      <img src="images/add.svg" height="30px"/>
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
