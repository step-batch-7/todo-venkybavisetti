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

const callback = function(text) {
  const container = document.getElementById('todoList');
  console.log(container);
  const json = JSON.parse(text);
  const task = document.createElement('div');
  task.classList.add('todoBox');
  task.textContent = json.title;
  container.insertBefore(task, container.childNodes[0]);
};

const addTitle = function() {
  const newTitleBox = document.querySelector('#title');
  const newTitle = newTitleBox.value;
  newTitleBox.value = '';
  postHttpMsg('/addTitle', callback, `title=${newTitle}`);
};
