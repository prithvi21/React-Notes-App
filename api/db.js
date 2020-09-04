const mysql = require('mysql');


/** CLEARDB_MAROON_URL = "mysql://bbf3ad21c5ef87:4483e0cf@eu-cdbr-west-03.cleardb.net/heroku_6d429a82e99620d?reconnect=true" **/
// var con = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "root",
//   database : "notesDB",
//   multipleStatements : true
// });

var con = mysql.createConnection({
  host : "eu-cdbr-west-03.cleardb.net",
  user : "bbf3ad21c5ef87",
  password : "4483e0cf",
  database : "heroku_6d429a82e99620d",
  multipleStatements : true
});

// con.connect(function(err) {
//   if (err) throw err;
//   // console.log("Connected!");
//   con.query("CREATE DATABASE IF NOT EXISTS notesDB", function (err, result) {
//     if (err) throw err;
//     // console.log("Database created");
//   });
// });


var sql = "CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), username VARCHAR(255), password VARCHAR(255))";
con.query(sql, function (err, result) {
  if (err) throw err;
  // console.log("Table created");
  });


function createUser(name, username, password) {
  var sql = "INSERT INTO users (name,username,password) VALUES (?, ?, ?)";
  var values = [name, username, password];
  return new Promise((resolve,reject) => {
    con.query(sql, values, function (err, result) {
    if (err) reject(err);
    if(result.affectedRows > 0) {
      console.log(result.affectedRows + " record(s) updated");
      resolve(true);
    }
    else reject(false);
    });  
  });
}


function validateUser(username, password) {
  var sql = "SELECT * FROM users WHERE username = ? AND password = ?";
  var values = [username, password];

  return new Promise((resolve, reject) => {
    con.query(sql,values, function(err, results) {
      if (err) reject(err);

      if (results.length > 0) resolve("true");
      else reject("false");
    }) 
  });
}

function getIDFromUsername(username) {
  var sql = "SELECT (id) FROM users WHERE username = ?";
  var values = [username];
  return new Promise((resolve, reject) => {
    con.query(sql,values, function(err, results) {
      if (err) reject(err);
      if (results.length > 0) resolve(results[0].id);
      else reject(null);
    }) 
  });
}

function numberOfUsers() {
  var sql = "SELECT COUNT(*) FROM users";
  return new Promise((resolve,reject) => {
    con.query(sql, function(err,results) {
      if (err) reject(err);
      if (results.length > 0) {
        const res = JSON.parse(JSON.stringify(results[0]))
        resolve(res[ 'COUNT(*)' ]);
      }
    })
  }) 
}


// numberOfUsers().then(res => console.log(res));



/** Create a table for each user storing their notes **/
async function createUserTable(){
  console.log('start');
  const numOfIDs = await numberOfUsers().then(res => {return res}).catch(err => {return err});
  console.log(numOfIDs);
  console.log('end');
  for(let i = 1; i <= numOfIDs; i++) {
    var sql = "CREATE TABLE IF NOT EXISTS ?? (id INT AUTO_INCREMENT PRIMARY KEY, note VARCHAR(255))";
    var values = ['user_' + i];
    con.query(sql, values, function (err, result) {
      if (err) throw err;
      // console.log(`Table user_${i} created`);
    });
  }

}

// createUserTable();



/**
 *  @param (array) notes.
 **/
function insertNotes(userID, notesArray) {
  var sql = "TRUNCATE TABLE ??;INSERT INTO ?? (note) VALUES ?;";
  console.log(userID);
  var tableName = ['user_' + userID];
  return new Promise((resolve, reject) => {
    con.query(sql, [tableName, tableName, notesArray], function(err, result){
      if(err) reject(err);
      else resolve(true);
    })
  });
}

function sendNotesToClient(userID) {
  var sql = "SELECT note FROM ??";
  var tableName = [`user_${userID}`];
  return new Promise((resolve, reject) => {
    con.query(sql, tableName, function(err, result){
      if(err) reject(err);
      // else resolve(JSON.parse(JSON.stringify(result)));
      else resolve(JSON.stringify(result));
    })
  });
}

// sendNotesToClient(1).then(res => console.log(res)).catch(err => console.log(err));



module.exports = { createUser, validateUser, getIDFromUsername, createUserTable , insertNotes, sendNotesToClient};