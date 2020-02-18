const selectAll = document.querySelectorAll.bind(document);
const getElement = document.getElementById.bind(document);

const convertHtmlToNode = function(html) {
  const temp = document.createElement('div');
  temp.innerHTML = html;
  return temp.firstChild;
};

const getStatus = function(tasks) {
  const doneTasks = tasks.reduce((doneNum, task) => {
    return task.done ? ++doneNum : doneNum;
  }, 0);
  return {
    totalTasks: tasks.length,
    doneTasks,
    notDoneTasks: tasks.length - doneTasks
  };
};

const getStatusHtml = function(todo) {
  const todoStatus = getStatus(todo.tasks);
  const statusHtml = `<span class="totalTasks">
      Total Tasks :- ${todoStatus.totalTasks}
    </span>
    <span class="tasksDone">
      <p >${todoStatus.doneTasks}</p>
      <img 
        src="images/done.svg" 
      
      >
    </span>
    <span class="tasksNotDone">
      <p >${todoStatus.notDoneTasks}</p>
      <img 
        src="images/wrong.svg">
    </span>`;
  return statusHtml;
};

const createTodoTitle = function(todo) {
  const titleHtml = `<li
    class="titleListDisplay"
    id="title${todo.id}"
  >
    ${todo.title}
    <img
      src="images/delete.svg"
      onclick = 'removeTodo(${todo.id})'
      height ="17px"
    />
  </li>`;
  return convertHtmlToNode(titleHtml);
};

const setUpTitleContainer = function(todoList) {
  const titleContainer = getElement('titleContainer');
  titleContainer.innerHTML = '';
  const titleList = todoList.map(createTodoTitle);
  titleList.forEach(title => titleContainer.appendChild(title));
};

const setUpTaskContainer = function(todoList) {
  const taskContainer = getElement('taskContainer');
  taskContainer.innerHTML = '';
  const allTodo = todoList.map(createTodoList);
  allTodo.forEach(todo => taskContainer.appendChild(todo));
};

const generateTodoTasks = function(todoList) {
  setUpTitleContainer(todoList);
  setUpTaskContainer(todoList);
};
