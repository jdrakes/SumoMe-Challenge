$(document).ready(function() {
  getAdminLoggedIn();
});

/**
 * Check is admin is currently signed in
 * @return {none} result change login functionality depending on admin status
 */
function getAdminLoggedIn() {
  $.get('/admin/loggedin')
    .done(function(result) {
      $('#myNavbar').append('<ul class="nav navbar-nav navbar-right"><li class="active"><a href="/admin/user/' + result.username + '" id="username">' + result.username + '</a></li></ul>');
      $('#username').html('Hello, admin');
    })
    .fail(function(result) {
      if (window.location.pathname === '/login') {
        loginAction();
      } else
        getLoggedIn();
    });
}

/**
 * Check is user is currently signed in
 * @return {none} result change login functionality depending on user status
 */
function getLoggedIn() {
  $.get('/users/loggedin')
    .done(function(result) {
      $('#myNavbar').append('<ul class="nav navbar-nav navbar-right"><li class="active"><a href="/users/user/' + result.username + '" id="username">' + result.username + '</a></li></ul>');
      $('#username').html('Hello ' + result.username);
    })
    .fail(function(result) {
      $('#myNavbar').append('<form id="login-form" action="/login/login_action" method="post" class="navbar-form navbar-right"><div class="form-group"><input id="username" name="username" type="text" placeholder="Email" class="input-round form-control"></div><div class="form-group"><input type="password" id="password" name="password" placeholder="Password" class="input-round form-control"></div><button type="submit" class="btn-survey-purple">Sign in</button></form>');
      loginAction();
    });
}

/**
 * Validate login inputs before sending to server
 * @return {none} result inputs will be sent to server if valid else reported
 */
function loginAction() {
  $('#login-form').submit(function(evt) {
    evt.preventDefault();
    var defer = $.Deferred();
    var inputArr = [];
    var inputObj = {};
    var msg = '';
    $('#login-form input').each(function() {
      var input = $(this);
      var inputVal = $(this).val();

      if (!inputVal) {
        msg += 'Please fill out ' + this.name + '.\n';
        inputArr.push(inputVal);
      } else if (inputVal !== 'Sign Up') {
        inputObj[this.name] = inputVal;
        inputArr.push(inputVal);
      }

    });

    if (msg) {
      alert(msg);
    } else if (!/[\w.+-_]+@[\w.-]+.[\w]+/.test(inputObj.username))
      alert('Invalid email address was input.');
    else {
      login(inputObj, defer);
      defer.then(function(result) {
        if (result !== 'success')
          alert(result);
        else
          alert('You have succesfully logged in!');
      });
    }
  });
}

/**
 * Send login information to server
 * @param  {Object} data  login credentials
 * @param  {Promise} defer promise object
 * @return {none}       result login success or failure
 */
function login(data, defer) {
  data = JSON.stringify(data);
  $.ajax({
      url: '/login/login_action',
      method: 'POST',
      data: data,
      contentType: 'application/json',
      dataType: 'json'
    }).done(function(data) {
      var result;
      if (!data.error) {
        result = 'success';
        if (typeof data.redirect == 'string')
          window.location = data.redirect;
      }
      if (defer)
        defer.resolve(result);
    })
    .fail(function(error) {
      errorMessage = JSON.parse(error.responseText);
      result = errorMessage.error;
      if (defer)
        defer.resolve(result);
    });
}
