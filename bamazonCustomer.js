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
    runBamazonCustomer();
});

// Displays all Products in stock
function runBamazonCustomer() {
    console.log("\nWelcome to Bamazon\n------------------\n");
    console.log("Products in Stock");
    console.log("==================");
    connection.query("SELECT item_id, product_name, price FROM products", function (error, response) {
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
    connection.query("SELECT * FROM products WHERE ?", [{ item_id: answer.item_id }], (error, getProductResponse) => {
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
        let buying = {
            quantity: answer.quantity,
            id: answer.item_id
        }
        if (buying.quantity > product.stocked) {
            console.log(`Insufficient quantity, you can only order ${qty} piece(s) at this time.`);
        }
        else {
            processTransaction(buying, product);
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
        nTotal: $${buying.total}
        `);
    updateTransaction(buying, product);
}

function updateTransaction(buying, product) {
    // update stock
    product.stocked -= buying.quantity;
    // Update sales total
    console.log("\nUpdating Stock...");
    product.productSales += buying.total;
    console.log(product);
    connection.query("UPDATE products SET ? WHERE ?", [
        {
            product_sales: product.productSales,
            stock_quantity: product.stocked
        },
        { department_name: product.department }
    ], (error, updateTransactionResponse) => {
        console.log(`\n${updateTransactionResponse.affectedRows} Stock Updated`);
    });
    connection.end();
}