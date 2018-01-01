
const path = require("path")
const express = require('express')
//const pug = require('pug')

const app = express()

app.set("view engine", "pug")
app.set('views', './views')

//app.use(express.static('./public'))
app.use(express.static(path.join(__dirname, '/public')))

app.get('/', function (req, res) {
  //return res.sendFile(process.cwd() + '/views/index.html')
  //res.send("hello world")
  res.render("index")
})

app.post('/', function (req, res) {
  res.send("got a POST request")
})

app.put('/', function (req, res) {
  res.send("got a PUT request")
})

app.delete('/', function (req, res) {
  res.send("got a DELETE request")
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
