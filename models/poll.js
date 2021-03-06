var mongoose = require('mongoose')
var Schema = mongoose.Schema

var pollOptionSchema = new Schema({
  name: {
    type: String
  },
  count: {
    type: Number,
    default: 0
  }
})

var PollSchema = new Schema({
  pollCreator: {
    type: String,
    required: true
  },
  pollName: {
    type: String,
    required: true
  },
/*  pollId: {
    type:String,
    required: true,
    //unique: true
  },*/
  pollAggregateCount: {
    type: Number,
    default: 0
  },
  pollOptions: [pollOptionSchema]
})

var Poll = mongoose.model('polls', PollSchema)
module.exports = Poll;
