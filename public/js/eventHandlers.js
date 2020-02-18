const addTodo = function() {
  const todo = document.querySelector('#todoInput');
  const todoTitle = todo.value;
  todo.value = '';
  if (todoTitle === '') {
    return;
  }
  postHttpMsg('/user/addTodo', generateTodoTasks, `title=${todoTitle}`);
};

const addTodoOnEnter = function() {
  if (event.key === 'Enter') {
    addTodo();
  }
};

const addTask = function(id) {
  const task = event.target.value;
  if (event.key === 'Enter' && task) {
    postHttpMsg(
      '/user/addTask',
      generateParticularTodo,
      `task=${task}&id=${id}`
    );
    event.target.value = '';
  }
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
