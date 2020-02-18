const createStatusBar = function(todo) {
  const statusBar = `<div class="statusBar">
  ${getStatusHtml(todo)}
  </div>`;
  return convertHtmlToNode(statusBar);
};

const createDeleteButton = function(id) {
  const deleteButton = document.createElement('img');
  deleteButton.src = 'images/delete.svg';
  deleteButton.onclick = () => removeTodo(id);
  return deleteButton;
};

const createTodoHeader = function(todo) {
  const todoHeader = document.createElement('div');
  todoHeader.className = 'allHeaders';
  const title = document.createElement('p');
  title.contentEditable = true;
  title.onblur = () => editTodo(todo.id);
  title.innerText = todo.title;
  const deleteButton = createDeleteButton(todo.id);
  todoHeader.appendChild(title);
  todoHeader.appendChild(deleteButton);
  return todoHeader;
};

const createTodoList = function(todo) {
  const todoHeader = createTodoHeader(todo);
  const statusBar = createStatusBar(todo);
  const taskList = createTask(todo);
  const taskAdder = addNewTask(todo);
  const todoBox = document.createElement('div');
  todoBox.className = 'todoBox';
  todoBox.id = todo.id;
  const child = [todoHeader, statusBar, taskList, taskAdder];
  child.forEach(child => todoBox.appendChild(child));
  return todoBox;
};

const generateParticularTodo = function(todoDetails) {
  const todo = getTasksList(todoDetails);
  const container = document.querySelector(
    `[id="${todoDetails.id}"] .taskList`
  );
  const statusBar = document.querySelector(
    `[id="${todoDetails.id}"] .statusBar`
  );
  statusBar.innerHTML = '';
  statusBar.innerHTML = getStatusHtml(todoDetails);
  container.innerHTML = todo;
  container.scrollTop = container.scrollHeight;
};

const editTodoTitle = function(todo) {
  document.getElementById(`title${todo.id}`).innerText = todo.title;
};
