const getIndex = function(list, id) {
  return list.findIndex(task => task.id === +id);
};

class Todo {
  constructor(todoList) {
    this.todoList = todoList;
    this.todoId = this.getNextTodoId();
  }

  getNextTodoId() {
    const lastTask = this.todoList[0];
    return lastTask ? lastTask.id + 1 : 1;
  }

  toJSON() {
    return JSON.stringify(this.todoList);
  }

  get list() {
    return this.todoList;
  }

  addTodo(title) {
    const todo = {};
    todo.title = title;
    todo.id = this.todoId;
    todo.tasks = [];
    this.todoList.unshift(todo);
  }

  removeTodo(todoId) {
    const todoIndex = getIndex(this.todoList, todoId);
    this.todoList.splice(todoIndex, 1);
  }

  addTask(title, todoId) {
    const todoIndex = getIndex(this.todoList, todoId);
    const task = new Task(this.todoList[todoIndex].tasks);
    task.addTask(title);
    return this.todoList[todoIndex];
  }

  removeTask(todoId, taskId) {
    const todoIndex = getIndex(this.todoList, todoId);
    const task = new Task(this.todoList[todoIndex].tasks);
    task.removeTask(taskId);
    return this.todoList[todoIndex];
  }

  editTodo(todoId, title) {
    const todoIndex = getIndex(this.todoList, todoId);
    const task = this.todoList[todoIndex];
    task.title = title || task.title;
    return this.todoList[todoIndex];
  }

  editTask(todoId, taskId, title) {
    const todoIndex = getIndex(this.todoList, todoId);
    const task = new Task(this.todoList[todoIndex].tasks);
    task.editTask(taskId, title);
    return this.todoList[todoIndex];
  }

  toggleStatus(todoId, taskId) {
    const todoIndex = getIndex(this.todoList, todoId);
    const task = new Task(this.todoList[todoIndex].tasks);
    task.toggleStatus(taskId);
    return this.todoList[todoIndex];
  }
}

class Task {
  constructor(tasks) {
    this.tasks = tasks;
    this.taskId = this.getNextTaskId();
  }
  getNextTaskId() {
    const lastTask = this.tasks[0];
    return lastTask ? lastTask.id + 1 : 1;
  }

  addTask(title) {
    const task = {};
    task.title = title;
    task.id = this.taskId;
    task.done = false;
    this.tasks.unshift(task);
  }

  removeTask(taskId) {
    const taskIndex = getIndex(this.tasks, taskId);
    this.tasks.splice(taskIndex, 1);
  }

  editTask(taskId, title) {
    const taskIndex = getIndex(this.tasks, taskId);
    const task = this.tasks[taskIndex];
    task.title = title;
  }

  toggleStatus(taskId) {
    const taskIndex = getIndex(this.tasks, taskId);
    const task = this.tasks[taskIndex];
    task.done = !task.done;
  }
}

module.exports = { Todo };
