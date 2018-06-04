// Dependencies
const mysql = require("mysql");
require('dotenv').config();
const db = require("./keys.js").Database;
const inquirer = require("inquirer");

// Create Connections
const connection = mysql.createConnection({
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
    runBamazon();
});

// Displays all Products in stock
function runBamazon() {
    connection.query("SELECT item_id, product_name, price FROM products", function (error, response) {
        console.log("\nWelcome to Bamazon\n------------------\n");
        console.log("Products in Stock");
        console.log("==================");
        for (let element in response) {
            console.log(`${response[element].item_id} | ${response[element].product_name} | $${response[element].price}`);
        }
        getUserInfo();
    });
}
// Get Users input information
function getUserInfo() {
    // Creates Prompt
    console.log("\n\nBuy your favorite product\n------------------\n");
    inquirer.prompt([
        {
            type: "input",
            message: "Please Enter Product ID",
            name: "item_id"
        },
        {
            type: "input",
            message: "Quantity",
            name: "quantity",
            // validate
        },
    ]).then(answer => getProduct(answer));
}

// Get a specific product by id
function getProduct(answer) {
    connection.query("SELECT stock_quantity FROM products WHERE ?", [{ item_id: answer.item_id }], (error, getProductResponse) => {
        getProductResponse;
        let stocked = getProductResponse[0].stock_quantity;
        let purchased = answer.quantity;
        let productID = answer.item_id;
        if (purchased > stocked) {
            console.log(`Insufficient quantity, you can only order ${qty} piece(s) at this time.`);
        }
        else {
            console.log("Updating Stock...");
            let remainingStock = stocked - purchased;
            recordTransaction(productID, purchased, remainingStock);
        }
    });
}

function recordTransaction(id, qty, remain) {
    console.log("Updated Stock\nPrinting Receipt...");
    connection.query("SELECT product_name, price FROM products WHERE ?", [{ item_id: id }], (error, recordTransactionResponse) => console.log(`Purchased: ${recordTransactionResponse[0].product_name}, \nQuantity: ${qty} piece(s), \nPrice: $${recordTransactionResponse[0].price}, \nTotal: $${(qty * recordTransactionResponse[0].price).toFixed(2)}`));
    updateStock(id, remain)
}

function updateStock(id, remain) {
    connection.query("UPDATE products SET ? WHERE ?", [
        { stock_quantity: remain },
        { item_id: id }
    ]);
    connection.end();
}