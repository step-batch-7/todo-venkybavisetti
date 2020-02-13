const selectAll = document.querySelectorAll.bind(document);
const getElement = document.getElementById.bind(document);

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
