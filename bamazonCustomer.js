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
    inStock();
    connection.end();
});

function inStock() {
    connection.query("SELECT item_id, product_name, price FROM products",
        function (error, response) {
            console.log("Products in Stock");
            console.log("==================");
            for (let element in response) {
                console.log(`${response[element].item_id} | ${response[element].product_name} | $${response[element].price}`);
            }
        });
}