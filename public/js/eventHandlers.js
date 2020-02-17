const addTodo = function() {
  const todo = document.querySelector('#todoInput');
  const todoTitle = todo.value;
  todo.value = '';
  if (todoTitle === '') {
    return;
  }
  postHttpMsg('/user/addTodo', generateTodoTasks, `title=${todoTitle}`);
};

const addTask = function(id) {
  const task = event.target.parentElement.previousSibling.previousSibling;
  if (task.value === '') {
    return;
  }
  postHttpMsg(
    '/user/addTask',
    generateParticularTodo,
    `task=${task.value}&id=${id}`
  );
  task.value = '';
};

const removeTodo = function(id) {
  postHttpMsg('/user/removeTodo', generateTodoTasks, `id=${id}`);
};

const removeTask = function(todoId, taskId) {
  postHttpMsg(
    '/user/removeTask',
    generateParticularTodo,
    `todoId=${todoId}&taskId=${taskId}`
  );
};

const editTodo = function(todoId) {
  const newTodoTitle = event.target.innerText;
  postHttpMsg(
    '/user/editTodo',
    editTaskTitle,
    `todoId=${todoId}&title=${newTodoTitle}`
  );
};

const editTask = function(todoId, taskId) {
  const newTaskName = event.target.innerText;
  postHttpMsg(
    '/user/editTask',
    generateParticularTodo,
    `todoId=${todoId}&taskId=${taskId}&subTitle=${newTaskName}`
  );
};

const toggleDone = function(todoId, taskId) {
  postHttpMsg(
    '/user/toggleDone',
    generateParticularTodo,
    `todoId=${todoId}&taskId=${taskId}`
  );
};

const loadHomePage = function() {
  getHttpMsg('/user/loadHomePage', generateTodoTasks);
};

const logOut = function() {
  getHttpMsg('/user/logOut');
};
