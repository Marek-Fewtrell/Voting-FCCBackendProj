'use strict'
function addOption() {
  var newPollItem = document.createElement('input');
  newPollItem.className = 'pollOptionItem'
  newPollItem.name = 'pollOption'
  newPollItem.type = 'text'
  var pollOptions = document.getElementById("pollOptions");
  pollOptions.appendChild(newPollItem)
}

function removeOption() {
  var pollOptions = document.getElementById("pollOptions");
  pollOptions.removeChild(pollOptions.childNodes[pollOptions.childNodes.length -1])
}
