$(document).ready(function() {
  var user = checkUrl();
  getAdminLoggedIn();
  $('#username').html('Hello, ' + user);
  $('.header').html('Welcome ' + user + '!')
});


/**
 * Parse url to determine user name for display.
 * @return {String} return user name else return null
 */
function checkUrl() {
  var path = window.location.pathname;
  var paths = path.split('/');
  if (paths.length !== 4) {
    window.location = '/';
    return null;
  } else {
    return paths[3];
  }
}

/*Check if user is an admin*/
/**
 * Check if user is admin to change logut functionality
 * @return {undefined} result is change in logout href
 */
function getAdminLoggedIn() {
  $.get('/admin/loggedin')
    .done(function(result) {
      $('logout').attr('href', '/admin/logout');
      $('#username').attr('href', '/admin/user/'+result.username)
    })
    .fail(function(result) {
      console.log(result);
    });
}
