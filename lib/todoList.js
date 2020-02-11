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
}

module.exports = { Todo };
