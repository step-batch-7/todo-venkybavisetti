const checkUser = function(isUser) {
  const userName = document.querySelector('#userName');
  document.querySelector('#submit').disabled = false;
  userName.style['background-color'] = 'white';
  if (isUser) {
    document.querySelector('#submit').disabled = true;
    userName.style['background-color'] = '#f88383';
  }
};

const isUserNameExists = function() {
  const userName = document.querySelector('#userName').value;
  postHttpMsg('/checkUserExists', checkUser, `userName=${userName}`);
};
