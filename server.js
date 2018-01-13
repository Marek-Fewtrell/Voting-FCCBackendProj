
const path = require("path")
const express = require('express')
var bodyParser = require('body-parser')
var session = require('express-session')
var mongoose = require('mongoose')

//var MongoClient = require('mongodb').MongoClient;
var mongoURL = "mongodb://localhost/votingApp";
var promise = mongoose.connect(mongoURL, {
  useMongoClient: true
})
var db = mongoose.connection
//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
  console.log("Successfully connected to database")
});


const app = express()

app.set("view engine", "pug")
app.set('views', './views')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static(path.join(__dirname, '/public')))
app.use('/charting', express.static(__dirname + '/node_modules/chart.js/dist/'));

app.use(session({
    secret: 'test',
    resave: true,
    saveUninitialized: false
  }))

var user = require ('./models/user')
var polls = require ('./models/poll')

app.get('/', function(req, res, next) {
  res.redirect('polls')
})

//Middleware to ensure user is logged in to view the main page.
app.use('/index', function(req, res, next) {
  if (req.session && req.session.userId) {
    return next()
  } else {
    res.redirect('/login')
    /*var err = new Error('You must be logged in')
    err.status = 400
    return next(err)*/
  }
})

app.get('/index', function (req, res, next) {
  //return res.sendFile(process.cwd() + '/views/index.html')
  //res.send("hello world")
  res.render("index")
})

/*app.post('/', function (req, res, next) {
  res.send("got a POST request")
})

app.put('/', function (req, res, next) {
  res.send("got a PUT request")
})

app.delete('/', function (req, res, next) {
  res.send("got a DELETE request")
})*/


/*
  -------------------Poll CRUD Start-------------------
*/
/*
  Creating a new poll
*/
app.get('/polls/create', function(req, res, next) {
  res.render('pollcreate')
})
app.post('/polls/create', function(req, res, next) {
  if (req.body.pollName) {
    var newPollOptions = []

    if (Array.isArray(req.body.pollOption)) {
      for(var i = 0; i < req.body.pollOption.length; i++) {
        newPollOptions.push({name: req.body.pollOption[i]})
      }
    } else {
      newPollOptions.push({name: req.body.pollOption})
    }

    /*console.log("poll Options:")
    console.log(newPollOptions)*/

    var pollData = {
      pollName: req.body.pollName,
      pollCreator: req.session.hasOwnProperty("userId") ? req.session.userId : -1,
      pollOptions: newPollOptions
    }

    polls.create(pollData, function(err, poll) {
      if (err) {
        return next(err)
      } else {
        return res.redirect('/polls')
      }
    })
  }
})

/*
  Veiwing list of polls
*/
app.get('/polls', function (req, res, next) {
  polls.find().exec(
    function(err, polls) {
      if (err) {
        return next(err)
      } else {
        var myPolls = []
        if (req.session && req.session.userId) {
          myPolls = polls.filter(x => x.pollCreator == req.session.userId)
          //var otherPolls = polls.map()
        }
        res.render('polls', {listOfPolls: polls, userPolls: myPolls})
      }
    }
  )
})
app.post('/polls', function(req, res, next) {
  if (req.body.type && req.body.type == 'add') {

  } else if (req.body.type && req.body.type == 'remove') {

  }
})

/*
  View one specific poll
*/
app.get('/poll/:pollId', function(req, res, next) {
    polls.findOne({_id: req.params.pollId}).exec(
      function(err, result) {
        if (err) {
          return next(err)
        } else {
          //console.log(result)
          var isOwner = false
          var isAuthed = false
          if (req.session.hasOwnProperty("userId")) {
            isAuthed = true
          }
          if (result.pollCreator === req.session.userId) {
            isOwner = true
          }
          res.render('poll', {poll: result, isOwner: isOwner, isAuthed: isAuthed})
        }
      }
    )
})

/*
  Update a poll
*/

/*
  Deleting a poll
*/
app.get('/polls/delete/:pollId', function(req, res, next) {

  polls.remove({_id: req.params.pollId, pollCreator: req.session.userId}, function(err) {
    if (err) return next(err)
    console.log("deleted poll")
  })
  /*polls.findOne({_id: req.params.pollId}).exec(
    function(err, result) {
      if (err) {
        return next(err)
      } else {
        if (req.session.userId == result.pollCreator) {
          return res.send("Deleting a poll: " + req.params.pollId)
        }

      }
  )*/


})

/*
  -------------------Poll CRUD End-------------------
*/
/*
  -------------------Poll Option CRUD Start-------------------
*/
/*
  Creating an option to a poll
*/
app.get('polls/:pollId/add', function(req, res, next) {

})
app.post('/poll/:pollId/add', function(req, res, next) {
  polls.findOne({_id: req.params.pollId}).exec(
    function(err, result) {
      if (err) {
        return next(err)
      } else {
        var newPollItem = {name: req.body.pollOptionItem}

        result.pollOptions.push(newPollItem)

        result.save(function(err, updateResult) {
          if (err) return next(err)
          res.redirect("/poll/"+ result._id)
          //res.render('poll', {poll: result, isOwner: isOwner, isAuthed: isAuthed})
        })

      }
    }
  )
})

/*
  voting for an option for a poll
*/
app.get('/polls/:pollId/vote/:voteId', function(req, res, next) {

  polls.findById(req.params.pollId, function(err, result) {
    if (err) return next(err)

    var voteItem = result.pollOptions.findIndex(function(element) {
      return element._id == req.params.voteId
    })

    result.pollOptions[voteItem].count += 1
    result.pollAggregateCount += 1

    result.save(function(err, updateResult) {
      if (err) return next(err)
      res.redirect('/poll/' + req.params.pollId)
    })
  })

  // redirect to polls/:pollId with status message.
  //return res.send("In voting for something")
})

/*
  -------------------Poll Option CRUD End-------------------
*/


app.get('/register', function(req, res, next) {
  res.render('register')
})

app.post('/register', function(req, res, next) {
  if (req.body.username && req.body.password && req.body.passwordConf) {
    var userData = {
      username: req.body.username,
      password: req.body.password,
      passwordConf: req.body.passwordConf
    }

    //use schema.create to insert data into the db
    user.create(userData, function(err, user) {
      if (err) {
        return next(err)
      } else {
        req.session.userId = user._id
        return res.redirect('/')
      }
    })
  }
})

app.get('/login', function(req, res, next) {
  res.render("login")
})

app.post('/login', function(req, res, next) {
  if (req.body.username && req.body.password) {
    user.authenticate(req.body.username, req.body.password, function(error, user) {
      if (error || !user) {
        var err = new Error("wrong email or password")
        err.status = 401
        return next(err)
      } else {
        req.session.userId = user._id
        return res.redirect('/')
      }
    })
  } else {
    var err = new Error("not correct login")
    err.status = 400
    return next(err)
  }
})

app.get('/logout', function(req, res, next) {
  if (req.session) {
    //delete session object
    req.session.destroy(function(err) {
      if (err) {
        return next(err)
      } else {
        //return res.render('index')
        res.redirect('/')
      }
    })
  }
})


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', {err: err});
});

app.listen(23200, ()=> console.log("app listenting on port 23200."))
