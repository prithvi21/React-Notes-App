const mysql = require('mysql');


/** CLEARDB_MAROON_URL = "mysql://bbf3ad21c5ef87:4483e0cf@eu-cdbr-west-03.cleardb.net/heroku_6d429a82e99620d?reconnect=true" **/
// var con = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "root",
//   database : "notesDB",
//   multipleStatements : true
// });

var con = mysql.createPool({
  host: "eu-cdbr-west-03.cleardb.net",
  user: "bbf3ad21c5ef87",
  password: "4483e0cf",
  database: "heroku_6d429a82e99620d",
  multipleStatements: true
});





// var db_config = {
//   host : "eu-cdbr-west-03.cleardb.net",
//   user : "bbf3ad21c5ef87",
//   password : "4483e0cf",
//   database : "heroku_6d429a82e99620d",
//   multipleStatements : true
// };

// var connection;

// function handleDisconnect() {
//   connection = mysql.createConnection(db_config); // Recreate the connection, since
//                                                   // the old one cannot be reused.

//   connection.connect(function(err) {              // The server is either down
//     if(err) {                                     // or restarting (takes a while sometimes).
//       console.log('error when connecting to db:', err);
//       setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
//     }                                     // to avoid a hot loop, and to allow our node script to
//   });                                     // process asynchronous requests in the meantime.
//                                           // If you're also serving http, display a 503 error.
//   connection.on('error', function(err) {
//     console.log('db error', err);
//     if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
//       handleDisconnect();                         // lost due to either server restart, or a
//     } else {                                      // connnection idle timeout (the wait_timeout
//       throw err;                                  // server variable configures this)
//     }
//   });
// }

// handleDisconnect();



// var sql = "CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), username VARCHAR(255), password VARCHAR(255))";
// con.query(sql, function (err, result) {
//   if (err) throw err;
//   // console.log("Table created");
//   });


function createUser(name, username, password) {
  var sql = "INSERT INTO users (name,username,password) VALUES (?, ?, ?)";
  var values = [name, username, password];
  return new Promise((resolve, reject) => {
    con.query(sql, values, function (err, result) {
      if (err) reject(err);
      if (result.affectedRows > 0) {
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
    con.query(sql, values, function (err, results) {
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
    con.query(sql, values, function (err, results) {
      if (err) reject(err);
      if (results.length > 0) resolve(results[0].id);
      else reject(null);
    })
  });
}

function numberOfUsers() {
  var sql = "SELECT COUNT(*) FROM users";
  return new Promise((resolve, reject) => {
    con.query(sql, function (err, results) {
      if (err) reject(err);
      if (results.length > 0) {
        const res = JSON.parse(JSON.stringify(results[0]))
        resolve(res['COUNT(*)']);
      }
    })
  })
}

/**
 * USED FOR VALIDATING USERNAME WHEN USER IS TRYING TO SIGN UP
 */
function getAllUsernames() {
  var sql = "SELECT username FROM users";
  return new Promise( (resolve, reject) => {
    con.query(sql, function (err, result) {
      if(err) reject(err);
      else resolve(JSON.stringify(result));
    })
  })    
 
}


// numberOfUsers().then(res => console.log(res));
// getAllUsernames().then(res => console.log(res));



/** Create a table for each user storing their notes **/
async function createUserTable() {
  console.log('start');
  const numOfIDs = await numberOfUsers().then(res => { return res }).catch(err => { return err });
  console.log(numOfIDs);
  console.log('end');
  for (let i = 1; i <= numOfIDs; i++) {
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
    con.query(sql, [tableName, tableName, notesArray], function (err, result) {
      if (err) reject(err);
      else resolve(true);
    })
  });
}

function sendNotesToClient(userID) {
  var sql = "SELECT note FROM ??";
  var tableName = [`user_${userID}`];
  return new Promise((resolve, reject) => {
    con.query(sql, tableName, function (err, result) {
      if (err) reject(err);
      else resolve(JSON.stringify(result));
    })
  });
}

// sendNotesToClient(1).then(res => console.log(res)).catch(err => console.log(err));



module.exports = { createUser, validateUser, getIDFromUsername, createUserTable, insertNotes, sendNotesToClient, getAllUsernames };