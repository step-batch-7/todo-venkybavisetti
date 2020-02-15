const searchTodo = function(event) {
  const searchInput = event.target.value;
  const allTodo = selectAll('.allHeaders p');
  allTodo.forEach(todo => {
    const id = todo.parentElement.parentElement.id;
    getElement(id).style.display = 'none';
    if (todo.innerText.includes(searchInput)) {
      getElement(id).style.display = '';
    }
  });
};

const matchTask = function(task, searchInput) {
  getElement(task.id).style['backgroundColor'] = 'white';
  if (task.innerText.toLowerCase().includes(searchInput) && searchInput) {
    getElement(task.id).style['backgroundColor'] = 'rgb(120,120,120)';
  }
};

const showMatchedTask = function(todo, searchInput) {
  const taskTitle = Array.from(selectAll(`[id="${todo.id}"] li`));
  const matchedTask = taskTitle.filter(task =>
    task.innerText.toLowerCase().includes(searchInput)
  );
  taskTitle.forEach(task => matchTask(task, searchInput));
  getElement(todo.id).style.display = '';
  if (matchedTask.length === 0 && searchInput) {
    getElement(todo.id).style.display = 'none';
  }
};

const searchTask = function() {
  const searchInput = event.target.value.toLowerCase();
  const allTodo = selectAll('.todoBox');
  allTodo.forEach(todo => showMatchedTask(todo, searchInput));
};
