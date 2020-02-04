const postHttpMsg = function(url, callback, newTitle) {
  const req = new XMLHttpRequest();
  req.onload = function() {
    if (this.status == '200') {
      callback(this.responseText);
    }
  };
  req.open('POST', url);
  req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  req.send(newTitle);
};

const postCallback = function(text) {
  const container = document.getElementById('todoList');
  container.innerHTML = '';
  container.innerHTML = text;
};

const addTitle = function() {
  const newTitleBox = document.querySelector('#title');
  const newTitle = newTitleBox.value;
  newTitleBox.value = '';
  postHttpMsg('/addTodoBox', postCallback, `title=${newTitle}`);
};

const removeTodoTitle = function() {
  const [, , todoBox] = event.path;
  const todoBoxId = todoBox.id;
  postHttpMsg('/removeTodoBox', postCallback, `id=${todoBoxId}`);
};
