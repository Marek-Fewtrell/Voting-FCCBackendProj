
const path = require("path")
const express = require('express')
var bodyParser = require('body-parser')
var session = require('express-session')
//const pug = require('pug')

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


app.get('/', function(req, res, next) {
  res.redirect('/index')
})

//Middleware to ensure user is logged in to view the main page.
app.use('/index', function(req, res, next) {
  if (req.session && req.session.userId === 'authed') {
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

app.post('/', function (req, res, next) {
  res.send("got a POST request")
})

app.put('/', function (req, res, next) {
  res.send("got a PUT request")
})

app.delete('/', function (req, res, next) {
  res.send("got a DELETE request")
})


app.get('/login', function(req, res, next) {
  res.render("login")
})

app.post('/login', function(req, res, next) {
  if (req.body.username && req.body.password) {
    if (req.body.username === 'test' && req.body.password === 'pass') {
      req.session.userId = 'authed'
      console.log('authed properly')
      return res.redirect('/')
    } else {
      console.log(req.body)
      var err = new Error("not correct login")
      err.status = 400
      return next(err)
    }
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
