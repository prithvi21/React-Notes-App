const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const PORT = process.env.PORT || 5000; ;
const cors = require('cors');
const path = require('path');
// // const URL = "https://reactnote-app.herokuapp.com"; //production
// const URL ="http://localhost:5000"; // dev
var URL;
const db = require('./db.js');
var md5 = require('md5');
const Cryptr = require('cryptr');
const cryptr = new Cryptr('gibberish');

console.log(process.env.NODE_ENV);

function requireHTTPS(req, res, next) {
  if (req.headers['x-forwarded-proto'] === 'https') return next();
  return res.redirect(URL);
}

// app.use(requireHTTPS);

if (process.env.NODE_ENV === 'production') {
  URL = "https://reactnote-app.herokuapp.com"; 
  app.use(requireHTTPS);
} else URL ="http://localhost:5000";

app.use(express.static(path.join(__dirname, '../build')));


app.use(cors());


app.get('/', function(req,res) {
  console.log('get react app');
  return res.sendFile(path.join(__dirname, '../build', 'index.html')); 
});

// a middleware with no mount path; gets executed for every request to the app
app.use(function(req, res, next) {
  console.log(req.protocol);
  if(req.xhr){
    res.setHeader('Access-Control-Allow-Origin', URL);
    next();
  }
  else res.send('Access Denied');  
});



app.use(session({
	secret: 'st',
	resave: true,
  saveUninitialized: true,
  // cookie: {
  //   maxAge: 30 * 24 * 60 * 60 * 1000
  // }
}));


app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());


app.use((req, res, next) => {
  // Check if we've already initialised a session
  if (!req.session.initialised) {
     // Initialise our variables on the session object (that's persisted across requests by the same user
     req.session.initialised = true;
     req.session.loggedIn = false;
     req.session.username = null;
     req.session.ID = null;
  }
  next();
});


//Sends notes for display when user logs in
app.get('/notes/:id', function(req,res) {
  db.sendNotesToClient(req.params.id).then(function(notes){
  res.send(notes);
  }).catch(function(err) {
  res.send(err);
  }) 
})

//Updating Notes
app.post('/notes/:id', function(req,res) {
  console.log('post request for note submission');
  const notes = req.body.notes;
  const notesArray = [];
  while(notes.length) notesArray.push(notes.splice(0,1));
  db.insertNotes(req.params.id, notesArray).then( () => {
    res.status(200).send();
  }).catch( err => res.status(200).send(err));
  
})


app.post('/auth', async function(req,res) {
  // verify auth credentials
  const base64Credentials =  req.headers.authorization.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [username, password] = credentials.split(':');
  // const username = req.body.username;
  // const password = md5(req.body.password);
  db.validateUser(username, md5(password)).then(async function() {
    let fetchID = await db.getIDFromUsername(username).then((result) => {
      return result;
    }).catch(err => {
      return err;
    })
    req.session.ID = fetchID;
    req.session.loggedIn = true;
    req.session.username = username;
    res.status(200).send();
  }).catch(err => {
    return err;
  });  
})

app.get('/auth', function(req, res) {
  const userData = JSON.stringify({
    userID   : req.session.ID,
    username : req.session.username,
    loggedIn : req.session.loggedIn,
  })
  res.send(userData);
})

app.post('/logout', function(req, res) {
  req.session.destroy();
  res.status(200).send('Logout Successful');
})

//Handles new account creation
app.post('/create', function(req,res) {
  db.createUser(req.body.name,req.body.username,md5(req.body.password))
  .then(function(){
    console.log('OK');
  }).catch(function(){
    console.log('NOT OK');
  });
  db.createUserTable().then(function(){
    res.status(200);
    res.send('created');
  }).catch(function(){
    res.status(200);
    res.send('not created');
  });
});

app.get('/validateUsername', function(req,res) {
  db.getAllUsernames().then(function(usernames) {
    res.send(usernames);
  }).catch(function(err){
    res.send(err);
  })
})

app.listen(PORT,  () => console.log(`server running on port ${PORT}`));