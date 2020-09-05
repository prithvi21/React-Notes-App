const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const PORT = 5000 || process.env.port;
const cors = require('cors');
const path = require('path');
const clientURL = "https://reactnote-app.herokuapp.com";
// const clientURL ="http://localhost:3000";
// const db = require('./db.js');
var md5 = require('md5');


app.use(express.static(path.join(__dirname, '../build')));

var userData;
var userNotesData = [];
app.use(cors());
// app.use(cors({credentials: true,'Access-Control-Allow-Origin' : 'http://localhost:3000'}));

// a middleware with no mount path; gets executed for every request to the app
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin',clientURL);
  next();
});

app.get('/', function(req,res) {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

// app.use(session({
// 	secret: 'st',
// 	resave: true,
//   saveUninitialized: true,
//   // cookie: {
//   //   maxAge: 30 * 24 * 60 * 60 * 1000
//   // }
// }));


// app.use(bodyParser.urlencoded({
//   extended: false
// }));
// app.use(bodyParser.json());

// var userData=[];

// app.use((req, res, next) => {
//   // Check if we've already initialised a session
//   if (!req.session.initialised) {
//      // Initialise our variables on the session object (that's persisted across requests by the same user
//      req.session.initialised = true;
//      req.session.loggedIn = false;
//      req.session.username = null;
//      req.session.ID = null;
//   }
//   next();
// });


// app.get('/api/notes/:id', function(req,res){
//   res.send(userNotesData[req.params.id]);
//   // res.end();
// })

// // Handles updating notes
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


// //Sends notes for display when user logs in
// app.get('/notes/:id', function(req,res) {
//   db.sendNotesToClient(req.params.id).then(function(notes){
//     res.send(notes);
//   }).catch(function() {
//     res.send('ERROR');
//   })
// })


// app.post('/auth', function(req,res) {
//   const username = req.body.username;
//   const password = md5(req.body.password);
//   db.getIDFromUsername(username).then(function(result){
//     console.log('get method:'+result);
//     req.session.ID = result;
//     console.log(req.session.ID);
//   },function(){
//     console.log('not ok');
//   });
//   db.validateUser(username, password).then(function(){
//     console.log('success');
//     req.session.loggedIn = true;
//     req.session.username = username;
//     res.status(200);
//     // res.send('success');
//     userData = JSON.stringify({
//       userID   : req.session.ID,
//       username : req.session.username,
//       loggedIn : req.session.loggedIn
//     })
//     res.send(userData);
//     // res.redirect(URL);
//   }, function(){
//        console.log('incorrect password');
//        req.session.loggedIn = false;
//       //  res.status(400);
//        userData = JSON.stringify({
//         userID   : req.session.ID,
//         username : req.session.username,
//         loggedIn : req.session.loggedIn
//       })
//       res.send(userData);
//       //  res.redirect(URL);
//   })
 
// });

// app.get('/auth', function(req, res) {
//   res.send(userData);
// })

// app.post('/logout', function(req, res) {
//   req.session.destroy();
//   res.status(200).send('Logout Successful');
// })

// //Handles new account creation
// app.post('/create', function(req,res) {
//   db.createUser(req.body.name,req.body.username,md5(req.body.password))
//   .then(function(){
//     console.log('OK');
//   }).catch(function(){
//     console.log('NOT OK');
//   });
//   db.createUserTable().then(function(){
//     res.status(200);
//     res.send('created');
//   }).catch(function(){
//     res.status(200);
//     res.send('not created');
//   });
// });

app.listen(PORT);