$(document).ready(function() {
  if (window.location.pathname === '/admin') {
    loginAction();
  } else
    getAdminLoggedIn();
});

/*
    Function to determine if a seesion exists for current user.
 */
function getAdminLoggedIn() {
  $.get('/admin/loggedin/permission')
    .done(function(result) {
      $('#myNavbar').append('<ul class="nav navbar-nav navbar-right"><li class="active"><a href="/admin/user/' + result.username + '" id="username">' + result.username + '</a></li></ul>');
      $('#username').html('Hello, admin');
    })
    .fail(function(result) {
      $('#myNavbar').append('<form id="login-form" action="/login/login_action" method="post" class="navbar-form navbar-right"><div class="form-group"><input id="username" name="username" type="text" placeholder="Email" class="input-round form-control"></div><div class="form-group"><input type="password" id="password" name="password" placeholder="Password" class="input-round form-control"></div><button type="submit" class="btn-survey-purple">Sign in</button></form>');
      loginAction();
    });
}

/*
    Function to validate inputs before sending to server.
 */
function loginAction() {
  $("#login-form").submit(function(evt) {
    evt.preventDefault();
    var defer = $.Deferred();
    var inputArr = [];
    var inputObj = {};
    var msg = "";
    $("#login-form input").each(function() {
      var input = $(this);
      var inputVal = $(this).val();

      if (inputVal === "") {
        msg += "Please fill out " + this.name + ".\n";
        inputArr.push(inputVal);
      } else if (inputVal !== "Sign Up") {
        inputObj[this.name] = inputVal;
        inputArr.push(inputVal);
      }

    });

    if (msg !== "") {
      alert(msg);
    } else if (!/[\w.+-_]+@[\w.-]+.[\w]+/.test(inputObj.username))
      alert("Invalid email address was input.");
    else {
      login(inputObj, defer);
      defer.then(function(result) {
        if (result !== "success")
          alert(result);
        else
          alert("You have succesfully logged in!");
      });
    }
  });
}

/*
    Function to send login information to server and return results.
 */
function login(data, defer) {
  data = JSON.stringify(data);
  $.ajax({
      url: '/admin/login_action',
      method: "POST",
      data: data,
      contentType: "application/json",
      dataType: "json"
    }).done(function(data) {
      var result;
      if (data.error === "") {
        result = 'success';
        if (typeof data.redirect == 'string')
          window.location = data.redirect;
      }
      if (defer !== null || defer !== undefined)
        defer.resolve(result);
    })
    .fail(function(error) {
      errorMessage = JSON.parse(error.responseText);
      result = errorMessage.error;
      if (defer !== null || defer !== undefined)
        defer.resolve(result);
    });
}
