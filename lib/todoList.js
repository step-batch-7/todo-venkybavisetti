class Todo {
  constructor(todoList) {
    this.todoList = todoList;
    this.todoId = this.getNextId();
  }

  getNextId() {
    const lastElement = this.todoList[0];
    return lastElement ? lastElement.id + 1 : 1;
  }

  toJSON() {
    return JSON.stringify(this.todoList);
  }

  addNewTodo(title) {
    const newTodo = {};
    newTodo.title = title;
    newTodo.id = this.todoId;
    newTodo.tasks = [];
    this.todoList.unshift(newTodo);
  }
}

module.exports = { Todo };
