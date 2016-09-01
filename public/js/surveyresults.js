$(document).ready(function() {
  getQuestionIds();
  $('#results-select').change(function(event) {
    /* Act on the event */
    var value = $(this).val();
    if (value !== 'default') {
      getResults(value);
    }
  });
});

function getQuestionIds() {
  $.get('/admin/questionIds')
    .done(function(questionArray) {
      var text = '';
      for (q in questionArray) {
        text += '<option value="' + questionArray[q].id + '">' + questionArray[q].question + '</option>';
      }
      if (text)
        $('#results-select').append(text);
    })
    .fail(function(error) {
      errorMessage = JSON.parse(error.responseText);
      result = errorMessage.error;
      console.log(result);
    })
}


function resultChart(resultsObj) {
  var option = {
    credits: {
      enabled: false
    },
    chart: {
      type: 'column',
      animation: Highcharts.svg,
      marginRight: 10
    },
    title: {
      text: 'Question Results'
    },
    xAxis: {
      title: 'Answers',
      categories: ['Answer']
    },
    yAxis: {
      title: 'Results'
    },
    legend: {
      enabled: true
    },
    exporting: {
      enabled: false
    },
    series: []
  }

  this.renderChart = function () {
    var results = resultsObj.results;
    var data = [];
    var categories = [];
    for(r in results){
      categories.push(results[r].answer);
      data.push({name: results[r].answer, data:[results[r].result]});
    }
    option.title.text = resultsObj.question;
    option.series =data;
    $('#chart-holder').highcharts(option);
  }
}

function getResults(id) {
  $.get('/admin/question/' + id)
    .done(function(results) {
      var result = new resultChart(results);
      result.renderChart();

    })
    .fail(function(error) {
      errorMessage = JSON.parse(error.responseText);
      result = errorMessage.error;
      console.log(result);
    });
}

