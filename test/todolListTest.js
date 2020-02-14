'use strict';
const assert = require('assert');
const { Todo } = require('../lib/todoList');

describe('TODO class', () => {
  describe('getNextTodoId', () => {
    it('should give id 1 if no content is present', () => {
      const todoList = [];
      const todo = new Todo(todoList);
      assert.strictEqual(todo.getNextTodoId(), 1);
    });
  });
  describe('toJSON', () => {
    it('should stringify the content', () => {
      const title = [{ id: 1 }];
      const todo = new Todo(title);
      assert.strictEqual(todo.toJSON(), '[{"id":1}]');
    });
  });
  describe('addTodo', () => {
    it('should add new Todo to the todoList', () => {
      const todoList = [];
      const todo = new Todo(todoList);
      todo.addTodo('VikramVenky');
      assert.deepStrictEqual(todo.list, [
        { title: 'VikramVenky', id: 1, tasks: [] }
      ]);
    });
  });
  describe('removeTodo', () => {
    it('should remove the todo from the todoList', () => {
      const todoList = [{ id: 1 }];
      const todo = new Todo(todoList);
      todo.removeTodo(1);
      assert.deepStrictEqual(todo.todoList, []);
    });
  });
  describe('addTask', () => {
    it('should add task to the todoList', () => {
      const todoList = [{ id: 1, tasks: [] }];
      const todo = new Todo(todoList);
      const actual = todo.addTask('VikramVenky', 1);
      assert.deepStrictEqual(actual, {
        id: 1,
        tasks: [{ id: 1, title: 'VikramVenky', done: false }]
      });
    });
  });
  describe('removeTask', () => {
    it('should remove tasks from the todoList', () => {
      const todoList = [
        {
          id: 1,
          tasks: [{ id: 1, title: 'VikramVenky', done: false }]
        }
      ];
      const todo = new Todo(todoList);
      const actual = todo.removeTask(1, 1);
      assert.deepStrictEqual(actual, { id: 1, tasks: [] });
    });
  });
  describe('editTodo', () => {
    it('should edit the todo from the todoList', () => {
      const todoList = [{ id: 1, title: 'VikramVenky', tasks: [] }];
      const todo = new Todo(todoList);
      const actual = todo.editTodo(1, 'VenkyVikram');
      assert.deepStrictEqual(actual, {
        id: 1,
        title: 'VenkyVikram',
        tasks: []
      });
    });
  });
  describe('editTask', () => {
    it('should edit the tasks from task in the todoList', () => {
      const todoList = [
        {
          id: 1,
          tasks: [{ id: 1, title: 'VikramVenky', done: false }]
        }
      ];
      const todo = new Todo(todoList);
      const actual = todo.editTask(1, 1, 'VenkyVikram');
      assert.deepStrictEqual(actual, {
        id: 1,
        tasks: [{ id: 1, title: 'VenkyVikram', done: false }]
      });
    });
  });
  describe('toggleStatus', () => {
    it('should toggle the done status for the tasks', () => {
      const todoList = [
        {
          id: 1,
          tasks: [{ id: 1, title: 'VikramVenky', done: false }]
        }
      ];
      const todo = new Todo(todoList);
      const actual = todo.toggleStatus(1, 1);
      assert.deepStrictEqual(actual, {
        id: 1,
        tasks: [{ id: 1, title: 'VikramVenky', done: true }]
      });
    });
  });
});
