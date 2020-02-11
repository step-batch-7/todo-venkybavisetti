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
}

module.exports = { Todo };
