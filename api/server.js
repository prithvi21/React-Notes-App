const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = 8080 || process.env.port;

const URL = "http://localhost:3000";
const db = require('./db.js');
var md5 = require('md5');
const { validateUser } = require('./db.js');


app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

var data=[];

app.get('/',function (req,res) {
  res.status(200).send();
});

app.get('/api/:id', function(req,res){
  res.send(data[req.params.id]);
})

// Handles creating/updating notes
app.post('/api/:id', function (req,res) {
  data[req.params.id] = req.body;
  res.send(data);
});

//Handles Login authentication
app.post('/auth', function(req,res) {
  const username = req.body.username;
  const password = req.body.password;
  db.validateUser(username, password)
  .then(value => console.log("login successful"))
  .catch(error => console.log('incorrect'));
  res.status(200);
  res.redirect(URL);
});

//Handles new account creation
app.post('/create', function(req,res) {
  db.createUser(req.body.name,req.body.username,md5(req.body.password));
  res.status(200);
  res.redirect(URL);
});

app.listen(PORT);