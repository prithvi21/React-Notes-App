const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const PORT = 8080 || process.env.port;
const cors = require('cors')
const URL = "http://localhost:3000";
const db = require('./db.js');
var md5 = require('md5');

// app.use(cors())
// app.use(cors({credentials: true, origin: 'http://localhost:3000'}));

app.use(session({
	secret: 'st',
	resave: true,
  saveUninitialized: true,
  duration : 30 * 60 * 10000
}));


app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

var data=[];

app.use((req, res, next) => {
  // Check if we've already initialised a session
  if (!req.session.initialised) {
     // Initialise our variables on the session object (that's persisted across requests by the same user
     req.session.initialised = true;
     req.session.loggedIn = false;
     req.session.username = null;
  }
  next();
});


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


app.post('/auth', function(req,res) {
  const username = req.body.username;
  const password = md5(req.body.password);
  db.validateUser(username, password).then(function(){
    console.log('success');
    req.session.loggedIn = true;
    req.session.username = username;
    res.status(200);
    res.redirect(URL);
  }, function(){
       console.log('incorrect password');
       req.session.loggedIn = false;
       res.status(400);
       res.redirect(URL);
  })
});

app.get('/auth', function(req,res){
  res.setHeader('Access-Control-Allow-Origin','http://localhost:3000');
  res.setHeader('Access-Control-Allow-Credentials',true);
  console.log(req.session.loggedIn);
  if(req.session.loggedIn){
    console.log(req.session.username);
    res.json(req.session.username);
  } 
  else {
    res.send('NOT AUTHENTICATED');
  }
})

//Handles new account creation
app.post('/create', function(req,res) {
  db.createUser(req.body.name,req.body.username,md5(req.body.password));
  res.status(200);
  res.redirect(URL);
});

app.listen(PORT);