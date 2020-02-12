'use strict';
const assert = require('assert');
const { Todo } = require('../lib/todoList');

describe('TODO class', () => {
  describe('getNextTaskId', () => {
    it('should give id 1 if no content is present', () => {
      const todoList = [];
      const todo = new Todo(todoList);
      assert.strictEqual(todo.getNextTaskId(), 1);
    });
  });
  describe('toJSON', () => {
    it('should stringify the content', () => {
      const text = [{ id: 1 }];
      const todo = new Todo(text);
      assert.strictEqual(todo.toJSON(), '[{"id":1}]');
    });
  });
  describe('addNewTask', () => {
    it('should add the new task to the todoList', () => {
      const todoList = [];
      const todo = new Todo(todoList);
      todo.addNewTask('VikramVenky');
      assert.deepStrictEqual(todo.todoList, [
        { title: 'VikramVenky', id: 1, tasks: [] }
      ]);
    });
  });
  describe('removeTask', () => {
    it('should remove the task from the todoList', () => {
      const todoList = [{ id: 1 }];
      const todo = new Todo(todoList);
      todo.removeTask(1);
      assert.deepStrictEqual(todo.todoList, []);
    });
  });
  describe('addSubTask', () => {
    it('should add the subTask to the todoList', () => {
      const todoList = [{ id: 1, tasks: [] }];
      const todo = new Todo(todoList);
      const actual = todo.addSubTask('VikramVenky', 1);
      assert.deepStrictEqual(actual, {
        id: 1,
        tasks: [{ id: 1, text: 'VikramVenky', done: false }]
      });
    });
  });
  describe('removeSubTask', () => {
    it('should remove the subTask from the todoList', () => {
      const todoList = [
        {
          id: 1,
          tasks: [{ id: 1, text: 'VikramVenky', done: false }]
        }
      ];
      const todo = new Todo(todoList);
      const actual = todo.removeSubTask(1, 1);
      assert.deepStrictEqual(actual, { id: 1, tasks: [] });
    });
  });
  describe('editTask', () => {
    it('should edit the task from the todoList', () => {
      const todoList = [{ id: 1, title: 'VikramVenky', tasks: [] }];
      const todo = new Todo(todoList);
      const actual = todo.editTask(1, 'VenkyVikram');
      assert.deepStrictEqual(actual, {
        id: 1,
        title: 'VenkyVikram',
        tasks: []
      });
    });
  });
  describe('editSubTask', () => {
    it('should edit the subTask from task in the todoList', () => {
      const todoList = [
        {
          id: 1,
          tasks: [{ id: 1, text: 'VikramVenky', done: false }]
        }
      ];
      const todo = new Todo(todoList);
      const actual = todo.editSubTask(1, 1, 'VenkyVikram');
      assert.deepStrictEqual(actual, {
        id: 1,
        tasks: [{ id: 1, text: 'VenkyVikram', done: false }]
      });
    });
  });
  describe('toggleStatus', () => {
    it('should toggle the done status for the subTask', () => {
      const todoList = [
        {
          id: 1,
          tasks: [{ id: 1, text: 'VikramVenky', done: false }]
        }
      ];
      const todo = new Todo(todoList);
      const actual = todo.toggleStatus(1, 1);
      assert.deepStrictEqual(actual, {
        id: 1,
        tasks: [{ id: 1, text: 'VikramVenky', done: true }]
      });
    });
  });
});
