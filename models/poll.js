var mongoose = require('mongoose')
var Schema = mongoose.Schema

var PollSchema = new Schema({
  pollCreator: {
    type: int,
    required: true
  },
  pollName: {
    type: String,
    required: true
  },
  pollId: {
    type:String,
    required: true,
    unique: true
  },
  pollOptions: {
    type: []
  }
})

var Poll = mongoose.model('polls', PollSchema)
module.exports = Poll;
