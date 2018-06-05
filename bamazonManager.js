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
        for (let element in response) {
            console.log(`${response[element].item_id} | ${response[element].product_name} | $${response[element].price} | ${response[element].stock_quantity}`);
        }
    });
    connection.end();
}

// If a manager selects View Low Inventory, then it should list all items with an inventory is lower than 10%.
function getLowInventory() {
    // updatePercent();
    console.log("\nProducts in Low Quantity");
    console.log("==========================");
    connection.query("SELECT item_id, product_name, price, stock_quantity FROM products WHERE stock_percent<=?", ["10"], function (error, response) {
        for (let element in response) {
            console.log(`${response[element].item_id} | ${response[element].product_name} | $${response[element].price} | ${response[element].stock_quantity}`);
        }
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
        // First get stock quantity
        connection.query("SELECT stock_quantity, full_stock FROM products WHERE ?", [{ item_id: productID.item_id }], (error, getProductsResponse) => {
            let full_stock = parseInt(getProductsResponse[0].full_stock);
            let present_stock = parseInt(getProductsResponse[0].stock_quantity);
            // Alert user to not add more than required quantity
            console.log(`Must Enter quantity not more than ${full_stock - present_stock}`);
            inquirer.prompt([
                {
                    type: "input",
                    message: "Quantity",
                    name: "quantity",
                }
            ]).then(answer => {
                console.log("Updating Stock...");
                let new_stock = parseInt(answer.quantity) + present_stock;
                // Check if user added more than required quantity
                if (new_stock <= full_stock) {
                    connection.query("UPDATE products SET ? WHERE ?", [
                        {
                            stock_quantity: parseInt(new_stock),
                            stock_percent: new_stock * 100 / full_stock
                        },
                        { item_id: productID.item_id }
                    ]);
                    console.log("\nUpdated Stock");
                    getProducts();
                }
                // User prompted to enter valid amount 
                else {
                    console.log(`Invalid Quantity, requires less than ${full_stock - present_stock} pieces`);
                    updateStock();
                }
            });
        });
    });
}

// Add a new product
function addNewProduct() {
    console.log("\n\nAdd to Product Stock\n------------------\n");
    inquirer.prompt([
        {
            type: "input",
            message: "Please Enter Product Name",
            name: "product_name"
        },
        {
            type: "input",
            message: "Please Enter Product Department",
            name: "department_name"
        },
        {
            type: "input",
            message: "Please Enter Product Price",
            name: "price"
        }
        ,
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
    ]).then(newProduct => {
        console.log("Adding New Product...");
        let full_stock = parseInt(newProduct.full_stock);
        let present_stock = parseInt(newProduct.stock_quantity);
        // Check if product space capacity >= quantity user is adding
        if (present_stock <= full_stock) {
            connection.query("INSERT INTO products SET ?",
                {
                    product_name: newProduct.product_name,
                    department_name: newProduct.department_name,
                    price: newProduct.price,
                    stock_quantity: newProduct.stock_quantity,
                    full_stock: newProduct.full_stock,
                    stock_percent: present_stock * 100 / full_stock
                }, (error, addProductResponse) => {
                    console.log("\nNew Product added");
                    getProducts();
                });
        }
        else {
            console.log(`Quantity is more than the required full stock, requires less than ${full_stock - present_stock} pieces`);
            getProducts();
        }
    });
}
