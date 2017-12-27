
const express = require('express')

const app = express()

app.use(express.static('public'))

app.get('/', function (req, res) {
  return res.sendFile(process.cwd() + '/views/index.html')
  //res.send("hello world")
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

app.listen(23200, ()=> console.log("app listenting on port 23200."))
