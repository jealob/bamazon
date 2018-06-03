// Dependencies
const mysql = require("mysql");
require('dotenv').config();
let db = require("./keys.js").Database;

// Create Connections
let connection = mysql.createConnection({
    host: db.host,
    port: db.port,
    // Your username
    user: db.user,
    // Your password
    password: db.password,
    database: db.database
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    connection.end();
});