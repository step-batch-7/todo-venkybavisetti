const addNewTask = function() {
  const newTaskInput = document.querySelector('#taskInput');
  const newTask = newTaskInput.value;
  newTaskInput.value = '';
  if (newTask === '') {
    return;
  }
  postHttpMsg('/addTask', generateTodoTasks, `title=${newTask}`);
};

const addNewSubTask = function(id) {
  const newSubTaskInput = document.querySelector('.subTaskInput');
  const newSubTask = newSubTaskInput.value;
  newSubTaskInput.value = '';
  if (newSubTask === '') {
    return;
  }
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

const editTask = function(taskId) {
  const newTaskName = event.target.value;
  postHttpMsg(
    '/editTask',
    generateParticularTask,
    `taskId=${taskId}&title=${newTaskName}`
  );
};

const editSubTask = function(taskId, subTaskId) {
  const newSubTaskName = event.target.innerText;
  postHttpMsg(
    '/editSubTask',
    generateParticularTask,
    `taskId=${taskId}&subTaskId=${subTaskId}&subTitle=${newSubTaskName}`
  );
};

const toggleDone = function(taskId, subTaskId) {
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
