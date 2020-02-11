class Todo {
  constructor(todoList) {
    this.todoList = todoList;
    this.taskId = this.getNextTaskId();
  }

  getNextTaskId() {
    const lastTask = this.todoList[0];
    return lastTask ? lastTask.id + 1 : 1;
  }

  toJSON() {
    return JSON.stringify(this.todoList);
  }

  addNewTask(title) {
    const newTask = {};
    newTask.title = title;
    newTask.id = this.taskId;
    newTask.tasks = [];
    this.todoList.unshift(newTask);
  }

  removeTask(taskId) {
    const todoIndex = this.todoList.findIndex(task => task.id === +taskId);
    this.todoList.splice(todoIndex, 1);
  }

  addSubTask(title, taskId) {
    const todoIndex = this.todoList.findIndex(task => task.id === +taskId);
    const subTask = new SubTask(this.todoList[todoIndex].tasks);
    subTask.addNewSubTask(title);
    return this.todoList[todoIndex];
  }

  removeSubTask(taskId, subTaskId) {
    const todoIndex = this.todoList.findIndex(task => task.id === +taskId);
    const subTask = new SubTask(this.todoList[todoIndex].tasks);
    subTask.removeSubTask(subTaskId);
    return this.todoList[todoIndex];
  }

  editTask(taskId, title) {
    const todoIndex = this.todoList.findIndex(task => task.id === +taskId);
    const task = this.todoList[todoIndex];
    task.title = title || task.title;
    return this.todoList[todoIndex];
  }

  editSubTask(taskId, subTaskId, text) {
    const todoIndex = this.todoList.findIndex(task => task.id === +taskId);
    const subTask = new SubTask(this.todoList[todoIndex].tasks);
    subTask.editSubTask(subTaskId, text);
    return this.todoList[todoIndex];
  }

  toggleStatus(taskId, subTaskId) {
    const todoIndex = this.todoList.findIndex(task => task.id === +taskId);
    const subTask = new SubTask(this.todoList[todoIndex]);
    subTask.toggleStatus(subTaskId);
    return this.todoList[todoIndex];
  }
}

class SubTask {
  constructor(subTaskList) {
    this.subTaskList = subTaskList;
    this.subTaskId = this.getNextSubTaskId();
  }
  getNextSubTaskId() {
    const lastSubTask = this.subTaskList[0];
    return lastSubTask ? lastSubTask.id + 1 : 1;
  }

  addNewSubTask(text) {
    const newSubTask = {};
    newSubTask.text = text;
    newSubTask.id = this.subTaskId;
    newSubTask.done = false;
    this.subTaskList.unshift(newSubTask);
    this.subTaskList;
  }

  removeSubTask(subTaskId) {
    const subTaskIndex = this.subTaskList.findIndex(
      subTask => subTask.id === +subTaskId
    );
    this.subTaskList.splice(subTaskIndex, 1);
  }

  editSubTask(subTaskId, text) {
    const subTaskIndex = this.subTaskList.findIndex(
      subTask => subTask.id === +subTaskId
    );
    const subTask = this.subTaskList[subTaskIndex];
    subTask.text = text;
  }

  toggleStatus(subTaskId) {
    const subTaskIndex = this.subTaskList.findIndex(
      subTask => subTask.id === +subTaskId
    );
    const subTask = this.subTaskList[subTaskIndex];
    subTask.done = !subTask.done;
  }
}

module.exports = { Todo };
