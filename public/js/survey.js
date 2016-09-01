var currentAnswer = -1;
var modalArray = ['<!-- Button trigger modal -->',
  '<button id="survey-modal-btn" type="button" class="btn btn-primary btn-lg" data-toggle="modal" data-target="#myModal"></button>',
  '<!-- Modal -->',
  '<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">',
  '<div class="modal-dialog  modal-lg" role="document">',
  '<div class="modal-content">',
  '<div class="modal-header">',
  '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>',
  '<h4 class="modal-title" id="myModalLabel">Modal title</h4>',
  '</div>',
  '<div class="modal-body">',
  '</div>',
  '<div class="modal-footer">',
  '<button id="question-submit" type="button" class="btn btn-survey-purple">Submit</button>',
  '</div>',
  '</div>',
  '</div>',
  '</div>'
];
var modal;
var currentQuestion;

$(document).ready(function() {
  modal = modalArray.join('');
  // Attach modal to dom
  $('body').append(modal);
  // Retrieve pop-up questions
  getQuestion();
});

/**
 * Retrieve random unanswered question from server
 * @return {none }       result in new question pop up unless error occurs
 * or there are no more questions to ask
 */
function getQuestion() {
  $.get('/question')
    .done(function(question) {
      currentQuestion = question;
      var questionId = question.id;
      var choices = question.choices;
      var question = question.question;
      $('.modal-title').html(question);
      for (c in choices) {
        var choice = ['<div class="radio">',
          '<label>',
          '<input type="radio" class="choice" name="optionsRadios" id="optionsRadios' + c + '" value="' + c + '">' + choices[c] + '</label>',
          '</div>'
        ]
        choice = choice.join('');
        $('.modal-body').append(choice);
      }
      $('.choice').change(function(event) {
        currentAnswer = $(this).val();
      });
      $('#question-submit').click(function(event) {
        submitAnswer(currentQuestion, currentAnswer);
      });
      $('#survey-modal-btn').click();
    })
    .fail(function(error) {
      errorMessage = JSON.parse(error.responseText);
      result = errorMessage.error;
      console.log(result);
    });
}

/**
 * Submit answered question to the server
 * @param  {Object} questionObj object containing question details
 * @param  {int} answer      index value of answer
 * @return {none}             result answer submitted
 */
function submitAnswer(questionObj, answer) {
  var answerObj = questionObj;
  answerObj.answer = answer;
  answerObj = JSON.stringify(answerObj);
  if (currentAnswer < 0) {
    alert('Please choose an answer before submitting.');
    return;
  }

  $.post('/question/answer', { 'answer': answerObj })
    .done(function(result) {
      $('#survey-modal-btn').click();
      alert('Thank You!');
      console.log(result);
    })
    .fail(function(error) {
      $('#survey-modal-btn').click();
      errorMessage = JSON.parse(error.responseText);
      result = errorMessage.error;
      console.log(result);
    });
}
