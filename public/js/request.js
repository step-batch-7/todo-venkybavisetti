const statusCode = {ok: 200, unauthorized: 401};

const postHttpMsg = function(url, callback, message) {
  const req = new XMLHttpRequest();
  req.onload = function() {
    if (this.status === statusCode.unauthorized) {
      window.location.href = '/login.html';
    }
    if (this.status === statusCode.ok) {
      callback(JSON.parse(this.responseText));
    }
  };
  req.open('POST', url);
  req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  req.send(message);
};

const getHttpMsg = function(url, callback) {
  const req = new XMLHttpRequest();
  req.onload = function() {
    if (this.status === statusCode.unauthorized) {
      window.location.href = '/login.html';
    }
    if (this.status === statusCode.ok) {
      callback(JSON.parse(this.responseText));
    }
  };
  req.open('GET', url);
  req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  req.send();
};
