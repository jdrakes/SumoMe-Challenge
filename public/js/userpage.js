$(document).ready(function() {
  getAdminLoggedIn();
  var user = checkUrl();
  $('#username').html('Hello, ' + user);
  $('.header').html('Welcome ' + user + "!")
});

/*
    Function determines which user is signed in to app.
 */
function checkUrl() {
  var path = window.location.pathname;
  console.log(path);
  console.log(path.split("/")[3]);
  var paths = path.split("/");
  if (paths.length !== 4) {
    window.location = '/';
    return null;
  } else {
    return paths[3];
  }
}

/*Check if user is an admin*/
function getAdminLoggedIn() {
  $.get('/admin/loggedin')
    .done(function(result) {
      $('logout').attr('href', '/admin/logout');
    })
    .fail(function(result) {
      console.log(result);
    });
}
