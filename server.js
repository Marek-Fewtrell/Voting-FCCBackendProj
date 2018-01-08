
const path = require("path")
const express = require('express')
var bodyParser = require('body-parser')
var session = require('express-session')
var mongoose = require('mongoose')

//var MongoClient = require('mongodb').MongoClient;
var mongoURL = "mongodb://localhost/votingApp";
mongoose.connect(mongoURL)
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

//app.use(express.static('./public'))
app.use(express.static(path.join(__dirname, '/public')))

app.use(session({
    secret: 'test',
    resave: true,
    saveUninitialized: false
  }))

var user = require ('./models/user')
var polls = require ('./models/poll')

app.get('/', function(req, res, next) {
  res.redirect('/index')
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


app.get('/polls', function (req, res, next) {
  polls.find().exec(
    function(err, polls) {
      if (err) {
        return next(err)
      } else {
        console.log(polls)
        res.render('polls', {listOfPolls: polls})
      }
    }
  )
  //res.render('polls')
})
app.post('/polls', function(req, res, next) {
  if (req.body.type && req.body.type == 'add') {

  } else if (req.body.type && req.body.type == 'remove') {

  }
})

app.get('/poll/:pollId', function(req, res, next) {
    polls.findOne({pollId: req.params.pollId}).exec(
      function(err, result) {
        if (err) {
          return next(err)
        } else {
          console.log(result)
          res.render('poll', {poll: result})
        }
      }
    )
})

app.get('/polls/create', function(req, res, next) {
  res.render('pollcreate')
})
app.post('/polls/create', function(req, res, next) {
  if (req.body.pollName) {

    var newPollOptions = []
    newPollOptions.push({name: req.body.pollOption1})
    newPollOptions.push({name: "Test Option 3"})

    console.log("poll Options:")
    console.log(newPollOptions)
    var pollData = {
      pollId: 'test4',
      pollName: req.body.pollName,
      pollCreator: 1,
      pollOptions: newPollOptions
    }
    console.log(pollData)
    polls.create(pollData, function(err, poll) {
      if (err) {
        return next(err)
      } else {
        return res.redirect('/polls')
      }
    })
  }
})

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
