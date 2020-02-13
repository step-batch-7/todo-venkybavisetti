const searchTask = function(event) {
  const searchInput = event.target.value;
  const allTask = selectAll('.allHeaders p');
  allTask.forEach(task => {
    const id = task.parentElement.parentElement.id;
    getElement(id).style.display = 'none';
    if (task.innerText.includes(searchInput)) {
      getElement(id).style.display = '';
    }
  });
};

const matchSubTask = function(subTask, searchInput) {
  getElement(subTask.id).style['backgroundColor'] = 'white';
  if (subTask.innerText.toLowerCase().includes(searchInput) && searchInput) {
    getElement(subTask.id).style['backgroundColor'] = 'rgb(120,120,120)';
  }
};

const showMatchedSubTask = function(task, searchInput) {
  const subTaskTitle = Array.from(selectAll(`[id="${task.id}"] li`));
  const matchedSubTask = subTaskTitle.filter(subTask =>
    subTask.innerText.toLowerCase().includes(searchInput)
  );
  subTaskTitle.forEach(subTask => matchSubTask(subTask, searchInput));
  getElement(task.id).style.display = '';
  if (matchedSubTask.length === 0 && searchInput) {
    getElement(task.id).style.display = 'none';
  }
};

const searchSubTask = function() {
  const searchInput = event.target.value.toLowerCase();
  const allTask = selectAll('.todoBox');
  allTask.forEach(task => showMatchedSubTask(task, searchInput));
};
