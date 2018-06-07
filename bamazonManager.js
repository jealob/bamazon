// Dependencies
const mysql = require("mysql");
require('dotenv').config();
const db = require("./keys.js").Database;
const inquirer = require("inquirer");
// console.table node package
const cTable = require("console.table");

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
    // console.log("connected as id " + connection.threadId + "\n");
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
    ]).then(answer => {
        switch (answer.options) {
            case "View Products for Sale":
                getProducts();
                break;
            case "View Low Inventory":
                getLowInventory();
                break;
            case "Add to Inventory":
                updateStock();
                break;
            case "Add New Product":
                addNewProduct();
                break;
        }
    });
}
// Gets all Products
function getProducts() {
    console.log("\nProducts in Stock");
    console.log("==================");
    connection.query("SELECT item_id, product_name, price, stock_quantity FROM products", function (error, response) {
        // Uses console.table node package dependencies installed "npm install console.table"
        console.table(response);
    });
    connection.end();
}

// If a manager selects View Low Inventory, then it should list all items with an inventory is lower than 10%.
function getLowInventory() {
    // updatePercent();
    console.log("\nProducts in Low Quantity");
    console.log("==========================");
    connection.query("SELECT item_id, product_name, price, stock_quantity FROM products WHERE (stock_quantity * 100 / full_stock) <=?", ["10"], function (error, response) {
        console.table(response);
    });
    connection.end();
}

// Add to Present Stock
function updateStock() {
    console.log("\n\nAdd to Product Stock\n------------------\n");
    inquirer.prompt([
        {
            type: "input",
            message: "Please Enter Product ID",
            name: "item_id"
        }
    ]).then(productID => {
        // Check if Product ID is a valid 
        let id = parseInt(productID.item_id);
        if (isNaN(id)) {
            console.log("Invalid Product ID, Please enter a Valid Number");
            updateStock();
        }
        // First get stock quantity
        else {
            connection.query("SELECT stock_quantity, full_stock FROM products WHERE ?", [{ item_id: id }], (error, getProductsResponse) => {
                let product = {
                    stocked: parseInt(getProductsResponse[0].stock_quantity),
                    shelfCapacity: parseInt(getProductsResponse[0].full_stock)
                }
                // Alert user to not add more than required quantity
                console.log(`Must Enter quantity not more than ${product.shelfCapacity - product.stocked}`);
                inquirer.prompt([
                    {
                        type: "input",
                        message: "Quantity",
                        name: "quantity",
                    }
                ]).then(answer => {
                    console.log("Updating Stock...");
                    product.stocked += parseInt(answer.quantity);
                    // Check if user added more than required quantity
                    if (product.stocked <= product.shelfCapacity) {
                        connection.query("UPDATE products SET ? WHERE ?", [
                            {
                                stock_quantity: product.stocked,
                            },
                            { item_id: productID.item_id }
                        ]);
                        console.log("\nUpdated Stock");
                        getProducts();
                    }
                    // User prompted to enter valid amount 
                    else {
                        console.log(`Invalid Quantity, requires less than ${product.shelfCapacity - product.stocked} pieces`);
                        updateStock();
                    }
                });
            });
        }
    });
}

// Add a new product
function addNewProduct() {
    console.log("\n\nAdd to Product Stock\n------------------\n");
    // An array to hold all current departments
    let departments = [];
    connection.query("SELECT department_name FROM departments", (error, response) => {
        for (let dept in response) {
            departments[dept] = response[dept].department_name;
        }
        inquirer.prompt([
            {
                type: "input",
                message: "Please Enter Product Name",
                name: "product_name"
            },
            {
                type: "list",
                message: "Please Enter Product Department",
                choices: departments,
                name: "department_name"
            },
            {
                type: "input",
                message: "Please Enter Product Price",
                name: "price"
            },
            {
                type: "input",
                message: "Please Enter Product Stock Quantity",
                name: "stock_quantity"
            },
            {
                type: "input",
                message: "Please Enter Shelf Capacity for Product",
                name: "full_stock"
            }
        ]).then(answer => {
            console.log("Adding New Product...");
            let product = {
                name: answer.product_name,
                department_name: answer.department_name,
                price: answer.price,
                stocked: parseInt(answer.stock_quantity),
                shelfCapacity: parseInt(answer.full_stock)
            };
            // Check if product space capacity >= quantity user is adding
            console.log(product);
            if (product.stocked <= product.shelfCapacity) {
                connection.query("INSERT INTO products SET ?",[
                    {
                        product_name: product.name,
                        department_name: product.department_name,
                        price: product.price,
                        stock_quantity: product.stocked,
                        full_stock: product.shelfCapacity
                    }], (error, addProductResponse) => {
                        console.log("\nNew Product added");
                        getProducts();
                    });
            }
            else {
                console.log(`Quantity is more than the required full stock, requires less than ${full_stock - present_stock} pieces`);
                getProducts();
            }
        });
    });
}
