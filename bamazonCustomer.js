// Dependencies
const mysql = require("mysql");
require('dotenv').config();
const db = require("./keys.js").Database;
const inquirer = require("inquirer");
const cTable = require('console.table');

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
    runBamazonCustomer();
});

// Displays all Products in stock
function runBamazonCustomer() {
    console.log("\nWelcome to Bamazon\n------------------\n");
    console.log("Products in Stock");
    console.log("==================");
    connection.query("SELECT item_id, product_name, price FROM products", function (error, response) {
        console.table(response);
        getUserInfo();
    });
}

// Get Users input information
function getUserInfo() {
    // Creates Prompt
    console.log("\n\nOrder Product\n-------------\n");
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
    ]).then(answer => {
        let buying = {
            id: parseInt(answer.item_id),
            quantity: parseFloat(answer.quantity)
        }
        if (isNaN(buying.id)) {
            console.log(`Invalid Product ID, please enter a number.`);
            getUserInfo();
        }
        else if (isNaN(buying.quantity)) {
            console.log(`Invalid Quantity, please enter a number.`);
            getUserInfo();
        }
        else {
            getProduct(buying);
        }
    });
}

// Get a specific product by id
function getProduct(buying) {
    connection.query("SELECT * FROM products WHERE ?", [{ item_id: buying.id }], (error, getProductResponse) => {
        let product = {
            id: getProductResponse[0].item_id,
            name: getProductResponse[0].product_name,
            department: getProductResponse[0].department_name,
            price: parseFloat(getProductResponse[0].price),
            stocked: parseInt(getProductResponse[0].stock_quantity),
            shelfCapacity: parseInt(getProductResponse[0].full_stock),
            stockPercent: parseInt(getProductResponse[0].stock_percent),
            productSales: parseFloat(getProductResponse[0].product_sales)
        };

        if (buying.quantity <= product.stocked) {
            processTransaction(buying, product);
        }
        else {
            console.log(`Insufficient quantity, you can only order at most ${product.stocked} piece(s) at this time.`);
            getUserInfo();
        }
    });
}

// Processes Customer Receipt
function processTransaction(buying, product) {
    let receivingDepartment;
    console.log("\nPrinting Receipt...");
    buying.total = buying.quantity * product.price.toFixed(2);
    console.log(`
        Purchased: ${product.name},
        Quantity: ${buying.quantity} piece(s),
        Price: $${product.price},
        Total: $${buying.total}
        `);
    updateTransaction(buying, product);
}

function updateTransaction(buying, product) {
    // update stock
    product.stocked -= buying.quantity;
    // Update sales total
    console.log("\nUpdating Stock...");
    product.productSales += buying.total;
    connection.query("UPDATE products SET ? WHERE ?", [
        {
            product_sales: product.productSales,
            stock_quantity: product.stocked,
        },
        { item_id: product.id }
    ], (error, updateTransactionResponse) => {
        console.log(`Stock Updated`);
    });
    connection.end();
}