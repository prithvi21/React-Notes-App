const mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database : "notesDB"
});

con.connect(function(err) {
  if (err) throw err;
  // console.log("Connected!");
  con.query("CREATE DATABASE IF NOT EXISTS notesDB", function (err, result) {
    if (err) throw err;
    // console.log("Database created");
  });
});


var sql = "CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), username VARCHAR(255), password VARCHAR(255))";
con.query(sql, function (err, result) {
  if (err) throw err;
  // console.log("Table created");
  });


function createUser(name, username, password) {
  var sql = "INSERT INTO users (name,username,password) VALUES (?, ?, ?)";
  var values = [name, username, password];
  con.query(sql, values, function (err, result) {
    if (err) throw err;
    console.log('inserted');
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

/** Create a table for each user storing their notes */
function createUserTable(userID){
  //for loop for all id's
  var sql = "CREATE TABLE IF NOT EXISTS ? (id INT AUTO_INCREMENT PRIMARY KEY, note VARCHAR(255)";
  var values = 'user_' + userID;
  con.query(sql, [values], function (err, result) {
  if (err) throw err;
  // console.log("Table created");
  });

}





module.exports = { createUser, validateUser, getIDFromUsername };