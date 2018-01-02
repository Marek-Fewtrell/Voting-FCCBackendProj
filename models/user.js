var mongoose = require('mongoose')
var Schema = mongoose.Schema

var UserSchema = new Schema({
  username: {
    type:String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  passwordConf: {
    type: String,
    required: true
  }
})

//authenticate input against database
UserSchema.statics.authenticate = function(email, password, callback) {
  User.findOne({username: email})
    .exec(function (err, user) {
      if (err) {
        return callback(err)
      } else if (!user) {
        var err = new Error('User not found')
        err.status = 401
        return callback(err)
      }
      if (password === user.password) {
        return callback(null, user)
      } else {
        return callback()
      }
    })
}


var User = mongoose.model('users', UserSchema)
module.exports = User;
