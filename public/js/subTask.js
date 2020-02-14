const focusOnTask = function(todoId, taskId) {
  document.querySelector(`[id="${todoId}_${taskId}"] .taskText`).focus();
};

const taskTitle = function(todo, task) {
  return `<span 
  contenteditable class="taskText"
  spellcheck = "false"
  onfocusout="editTask(${todo.id},${task.id})"
>
  ${task.title}
</span>`;
};

const taskOption = function(todo, task) {
  return `<div class = "taskImages">
  <img 
    class="editIcon" 
    src="images/edit.svg" 
    onclick="focusOnTask(${todo.id},${task.id})"
  />
  <img 
    src="images/cancel.svg" class="deleteIcon"
    onclick="removeTask(${todo.id},${task.id})"   />
  </div>`;
};

const isDone = function(boolean) {
  return boolean ? 'class="checkedClass"' : 'class="unCheckedClass"';
};

const getTasksList = function(todo) {
  const taskHtml = function(taskList, task) {
    const taskHtml = `<li 
      ${isDone(task.done)} 
      id="${todo.id}_${task.id}"
    >
      <div >
        <input 
          type="checkbox" 
          ${task.done ? 'checked' : ''}
          onclick="toggleDone(${todo.id},${task.id})"
        >
        ${taskTitle(todo, task)}
      </div>
      ${taskOption(todo, task)}
    </li>`;
    task.done ? taskList.push(taskHtml) : taskList.unshift(taskHtml);
    return taskList;
  };
  console.log(todo);
  return todo.tasks.reduce(taskHtml, []).join('');
};

const createTask = function(todo) {
  const taskHtml = `<div class="taskList">
  ${getTasksList(todo)}
  </div>`;
  return convertHtmlToNode(taskHtml);
};

const addButton = function(taskId) {
  return `<button onclick="addTask(${taskId})" class="taskButton">
    <img src="images/add.svg" height="30px" />
  </button>`;
};

const addNewTask = function(task) {
  const taskAdderHtml = `<div class="taskAdder">
  <input 
    type="text" 
    name="title" 
    class="taskInput" 
    placeholder="Tasks..."
  />
  ${addButton(task.id)}
</div>`;
  return convertHtmlToNode(taskAdderHtml);
};
