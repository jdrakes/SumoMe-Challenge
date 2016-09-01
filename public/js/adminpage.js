$(document).ready(function() {
  var user = checkUrl();
  $('#username').html('Hello, admin');
  $('.header').html('Welcome Admin!')
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
