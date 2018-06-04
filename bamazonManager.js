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
    runBamazonManager();
});

// Get Users input information
function runBamazonManager() {
    // Creates Prompt
    console.log("\nWelcome to Bamazon\n------------------\n");
    inquirer.prompt([
        {
            type: "list",
            message: "Choose an Option",
            choices: ["View Products for Sale",
                "View Low Inventory",
                "Add to Inventory",
                "Add New Product"],
            name: "options"
        }
    ]).then(productQty => {
        let action = productQty.options;
        switch (action) {
            case "View Products for Sale":
                getProduct();
            case "View Low Inventory":

            case "Add to Inventory":
                updateStock();
            case "Add New Product":

            // default:
            //     console.log("Error");
        }
    });
}
function getProduct() {
    console.log("Products in Stock");
    console.log("==================");
    connection.query("SELECT item_id, product_name, price, stock_quantity FROM products", function (error, response) {
        for (let element in response) {
            console.log(`${response[element].item_id} | ${response[element].product_name} | $${response[element].price} | ${response[element].stock_quantity}`);
        }
    });
    connection.end();
}

function updateStock() {
    console.log("\n\nAdd to Product Stock\n------------------\n");
    inquirer.prompt([
        {
            type: "input",
            message: "Please Enter Product ID",
            name: "item_id"
        }
    ]).then(productID => {
        connection.query("SELECT stock_quantity, full_stock FROM products WHERE ?", [{ item_id: productID.item_id }], (error, getProductResponse) => {
            console.log(parseInt(getProductResponse[0].full_stock), parseInt(getProductResponse[0].stock_quantity));
            let full_stock = parseInt(getProductResponse[0].full_stock);
            let present_stock = parseInt(getProductResponse[0].stock_quantity);
            console.log(`Must Enter quantity not more than ${full_stock - present_stock}`);
            inquirer.prompt([
                {
                    type: "input",
                    message: "Quantity",
                    name: "quantity",
                    // validate
                }
            ]).then(productQty => {
                console.log("Updating Stock...");
                let new_stock = parseInt(productQty.quantity) + present_stock;
                if (new_stock <= full_stock) {
                    connection.query("UPDATE products SET ? WHERE ?", [
                        { stock_quantity: parseInt(new_stock) },
                        { item_id: productID.item_id }
                    ]);
                    console.log("\nUpdated Stock");
                    getProduct();
                }
                else {
                    console.log(`Quantity is more than the required full stock, requires less than ${full_stock - present_stock} pieces`);
                    getProduct();
                }
            });

        });
    });

}