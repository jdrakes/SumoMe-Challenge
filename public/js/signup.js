/**
 * Validate signup inputs before sending to server
 * @return {none} result inputs will be sent to server if valid else reported
 */
$('#signup-form').submit(function(evt) {
  evt.preventDefault();
  var defer = $.Deferred();
  var inputArr = [];
  var inputObj = {};
  var msg = '';
  $('#signup-form input').each(function() {
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
  } else if (!/[\w.+-_]+@[\w.-]+.[\w]+/.test(inputObj.email))
    alert('Invalid email address was input.');
  else if (!/^[a-z0-9]+$/i.test(inputObj.display))
    alert('Invalid username was input.');
  else if (inputObj.password !== inputObj.re_password) {
    alert('Passwords do not match please re-enter them.');
    $('#password').val('');
    $('#re_password').val('');
  } else {
    signUp(inputObj, defer);
    defer.then(function(result) {
      if (result !== 'success')
        alert(result);
      else
        alert('Your profile has been created please sign in.');
    });
  }
});

/**
 * Send signup information to server
 * @param  {Object} data  login credentials
 * @param  {Promise} defer promise object
 * @return {none}       result login success or failure
 */
function signUp(data, defer) {
  data = JSON.stringify(data);
  $.ajax({
      url: '/signup/signup_action',
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
