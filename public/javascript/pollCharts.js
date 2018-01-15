
window.onload = function() {
  var ctx = document.getElementById("myChart").getContext('2d');

  var pollLabels = []
  var pollDataSet = []
  var backgroundColour = []

  var pollOptions = pollData.pollOptions

  for (var i = 0 ; i < pollOptions.length; i++) {
    pollLabels.push(pollOptions[i].hasOwnProperty('name') ? pollOptions[i].name : "unnamed")
    pollDataSet.push(pollOptions[i].count)
    backgroundColour.push(createRandomColour())
  }

  var data = {
    datasets: [{
      data: pollDataSet,
      backgroundColor: backgroundColour
    }],

    labels: pollLabels
  }

  var options = {}


  var myPieChart = new Chart (ctx, {
    type: 'pie',
    data: data,
    options: options
  })
};

function createRandomColour() {
  var r = Math.floor(Math.random() * 255);
  var g = Math.floor(Math.random() * 255);
  var b = Math.floor(Math.random() * 255);
  return "rgba(" + r + "," + g + "," + b + ", 0.2)";
}
