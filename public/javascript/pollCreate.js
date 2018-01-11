'use strict'
function addOption() {
  alert("test")
  //var pollOptionItems = document.getElementsByClassName("pollOptionItem")

  var newPollItem = document.createElement('input');
  newPollItem.className = 'pollOptionItem'
  newPollItem.name = 'pollOption'
  //input(type="text", class="pollOptionItem", name="pollOption1")
  var pollOptions = document.getElementById("pollOptions");
  pollOptions.appendChild(newPollItem)

}

function removeOption() {
  alert("other test")
  //var pollOptionItems = document.getElementsByClassName("pollOptionItem")
  var pollOptions = document.getElementById("pollOptions");
  pollOptions.removeChild(pollOptions.childNodes[pollOptions.childNodes.length -1])

}
