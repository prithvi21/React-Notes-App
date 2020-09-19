const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const PORT = process.env.PORT || 5000; ;
const cors = require('cors');
const path = require('path');
const URL = "https://reactnote-app.herokuapp.com";
// const URL ="http://localhost:5000";
const db = require('./db.js');
var md5 = require('md5');
const Cryptr = require('cryptr');
const cryptr = new Cryptr('gibberish');

console.log(process.env.NODE_ENV);

function requireHTTPS(req, res, next) {
  if (req.headers['x-forwarded-proto'] === 'https') return next();
  return res.redirect(URL);
}

app.use(requireHTTPS);

app.use(express.static(path.join(__dirname, '../build')));


var userNotesData = [];
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
     req.session.token = null;
     req.session.encryptedToken = null;
  }
  next();
});


// app.get('/api/notes/:id', function(req,res){
//   res.send(userNotesData[req.params.id]);
// })

// Handles updating notes
// app.post('/api/notes/:id', function (req,res) {
//   console.log('post request for note submission');
//   const notes = req.body.notes;
//   const notesArray = [];
//   while(notes.length) notesArray.push(notes.splice(0,1));
//   db.insertNotes(req.params.id, notesArray).then(function(result){
//     // console.log(result);
//   userNotesData[req.params.id] = notesArray;
//   console.log(userNotesData[req.params.id]);
//   res.send(userNotesData);
//   }).catch(function(result){
//     console.log(result);
//     res.send('error');
//   })
// });


//Sends notes for display when user logs in
app.get('/notes/:id', function(req,res) {
  console.log(req.headers.token);
  console.log(cryptr.decrypt(req.headers.token));
  if(cryptr.decrypt(req.headers.token) === req.session.token){
    db.sendNotesToClient(req.params.id).then(function(notes){
      res.send(notes);
    }).catch(function(err) {
      res.send(err);
    })
  }
  else {
    res.send('ACCESS DENIED');
  }  
})

//Updating Notes
app.post('/notes:/id', function(req,res) {
  console.log('post request for note submission');
  const notes = req.body.notes;
  const notesArray = [];
  while(notes.length) notesArray.push(notes.splice(0,1));
  if(cryptr.decrypt(req.headers.token) === req.session.token){
    db.insertNotes(req.params.id,notesArray).then( () => {
      res.status(200).send();
    }).catch( err => res.status(200).send(err));
  } 
  else res.send('ACCESS DENIED');
})


app.post('/auth', async function(req,res) {
  const username = req.body.username;
  const password = md5(req.body.password);


  db.validateUser(username, password).then(async function(){
    let fetchID = await db.getIDFromUsername(username).then(function(result){
      return result;
    },function(err){
      return err;
    });
    
    console.log('success');
    req.session.ID = fetchID;
    req.session.loggedIn = true;
    req.session.username = username;
    res.status(200);
    // res.send('success');
    const userData = JSON.stringify({
      userID   : req.session.ID,
      username : req.session.username,
      loggedIn : req.session.loggedIn,
      token    : generateToken(req, req.session.username, req.session.ID)
    })
    res.send(userData);
  }, function(){
       console.log('incorrect password');
       req.session.loggedIn = false;
      //  res.status(400);
       userData = JSON.stringify({
        userID   : req.session.ID,
        username : req.session.username,
        loggedIn : req.session.loggedIn
      })
      res.send(userData);
  })
 
});

app.get('/auth', function(req, res) {
  const userData = JSON.stringify({
    userID   : req.session.ID,
    username : req.session.username,
    loggedIn : req.session.loggedIn,
    token    : req.session.encryptedToken
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

function generateToken(req, username, userID){
  req.session.token = username + userID + Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
  console.log('ok');
  req.session.encryptedToken = cryptr.encrypt(req.session.token);
  return req.session.encryptedToken;
}

app.listen(PORT,  () => console.log(`server running on port ${PORT}`));