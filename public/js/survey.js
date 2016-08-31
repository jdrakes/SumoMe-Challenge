var modalArray = ['<!-- Button trigger modal -->',
  '<button id="survey-modal-btn" type="button" class="btn btn-primary btn-lg" data-toggle="modal" data-target="#myModal"></button>',
  '<!-- Modal -->',
  '<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">',
  '<div class="modal-dialog" role="document">',
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
var modal = modalArray.join('');
var currenAnswer = -1;
var currentQuestion;

$(document).ready(function() {
  $('body').append(modal);
  getQuestion();
  $('#survey-modal-btn').click();
});


function getQuestion(defer) {
  $.get('/question')
    .done(function(question) {
      currentQuestion = question;
      var questionId = question['id'];
      var choices = question['choices'];
      var question = question['question'];
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
        console.log($(this).val());
        currenAnswer = $(this).val();
      });
      $('#question-submit').click(function(event) {
        submitAnswer(currentQuestion, currenAnswer);
      });
    })
    .fail(function(error) {
      errorMessage = JSON.parse(error.responseText);
      result = errorMessage.error;
      console.log(result);
    });
}

function submitAnswer(questionObj, answer) {
  var answerObj = questionObj;
  answerObj['answer'] = answer;
  answerObj = JSON.stringify(answerObj);
  $.post('/question/answer', { 'answer': answerObj })
    .done(function(result) {
      $('#survey-modal-btn').click();
      alert('Thank You!');
      console.log(result);
      // $('#survey-modal-btn').click();
    })
    .fail(function(error) {
      $('#survey-modal-btn').click();
      console.log(error);
      errorMessage = JSON.parse(error.responseText);
      result = errorMessage.error;
      console.log(result);
      // $('#survey-modal-btn').click();
    });
}


/*modal html*/
// <!-- Button trigger modal -->
// <button type="button" class="btn btn-primary btn-lg" data-toggle="modal" data-target="#myModal">
//   Launch demo modal
// </button>

// <!-- Modal -->
// <div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
//   <div class="modal-dialog" role="document">
//     <div class="modal-content">
//       <div class="modal-header">
//         <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
//         <h4 class="modal-title" id="myModalLabel">Modal title</h4>
//       </div>
//       <div class="modal-body">
//         ...
//       </div>
//       <div class="modal-footer">
//         <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
//         <button type="button" class="btn btn-primary">Save changes</button>
//       </div>
//     </div>
//   </div>
// </div>
