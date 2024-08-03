//import mysql from 'mysql2/promise';
const mysql = require('mysql2');

// Create the connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'Youtube',
  dateStrings: true
});

// connection.query(
//   'SELECT * FROM `users`',
//   function(err, results, fields){
//       var {id, email, name, created_at} = results[0];
//       console.log(id);
//       console.log(email);
//       console.log(name);
//       console.log(created_at);
//   }
// );

module.exports = connection

// A simple SELECT query
// try {
//   const [results, fields] = await connection.query(
//     'SELECT * FROM `users`'
//   );

//   console.log(results);
//   //console.log(email); // results contains rows returned by server
//   //console.log(created_at);
//   console.log(fields); // fields contains extra meta data about results, if available
// } catch (err) {
//   console.log(err);
// }


// try {
//   connection.query(
//     'SELECT * FROM `users`',
//     function(err, results, fields){
//         var {id, email, name, created_at} = results[0];
//         console.log(id)
//     }
//   );
  
// } catch (err) {
//   console.log(err);
// }