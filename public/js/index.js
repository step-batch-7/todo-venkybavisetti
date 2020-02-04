const postHttpMsg = function(url, postCallback, newTitle) {
  const req = new XMLHttpRequest();
  req.onload = function() {
    if (this.status == '200') {
      postCallback(this.responseText);
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
  postHttpMsg('/addTitle', postCallback, `title=${newTitle}`);
};

const displayHide = function() {};
