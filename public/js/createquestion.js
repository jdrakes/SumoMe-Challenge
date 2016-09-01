/**
 * Function to validate inputs before sending to server.
 * @param  {Object} evt)    submit event
 * @return {none}        Result invalid inputs reported otherwise send question to server
 */
$("#question-form").submit(function(evt) {
  evt.preventDefault();
  var defer = $.Deferred();
  var inputArr = [];
  var inputObj = {};
  var msg = '';
  var data = $('#question-form').serializeArray().reduce(function(obj, item) {
    obj[item.name] = item.value;
    return obj;
  }, {});

  if (!data.choice3)
    delete data.choice3;
  if (!data.question)
      msg += 'Please fill out question box.\n';
  else if (!data.choice1)
      msg += 'Please fill out answer choice 1.\n';
  else if (!data.choice2)
      msg += 'Please fill out answer choice 2.\n';

  if (msg) {
    alert(msg);
  } else {
    createQuestion(data, defer);
    defer.then(function(result) {
      if (result !== 'success')
        alert(result);
      else
        alert('Your question has been created.');
    });
  }
});

/**
 * Function to send new question to server
 * @param  {Object} data  question information
 * @param  {Promise} defer defferred promise object
 * @return {String}       Return results of question creation
 */
function createQuestion(data, defer) {
  data = JSON.stringify(data);
  $.ajax({
      url: '/admin/question',
      method: "POST",
      data: data,
      contentType: 'application/json',
      dataType: 'json'
    }).done(function(data) {
      var result;
      if (!data.error) {
        result = 'success';
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
