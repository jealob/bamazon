// Dependencies
const mysql = require("mysql");
require('dotenv').config();
const db = require("./keys.js").Database;
const inquirer = require("inquirer");
// console.table node package
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
    runBamazonSupervisor();
});

// Get Users input information
function runBamazonSupervisor() {
    // Creates Prompt
    console.log("\nWelcome to Bamazon\n------------------\n");
    inquirer.prompt([
        {
            type: "list",
            message: "Choose an Option",
            choices: ["View Product Sales by Department",
                "Create New Department"],
            name: "options"
        }
    ]).then(answer => {
        switch (answer.options) {
            case "View Product Sales by Department":
                getSales();
                break;
            case "Create New Department":
                createDepartment();
        }
    });
}

// Get department sales
function getSales() {
    console.log("Welcome to Bamazon\n------------------\n");
    console.log("Sales By Department");
    console.log("==================");
    // Declare mySql Query
    let myQuery = "SELECT department_id, departments.department_name, SUM(product_sales) AS department_sales, over_head_cost, (SUM(product_sales) - over_head_cost) AS total_profit FROM products JOIN departments ON products.department_name = departments.department_name GROUP BY departments.department_name ORDER BY departments.department_name";
    connection.query(myQuery, function (error, response) {
// Uses console.table node package dependencies installed "npm install console.table"
        console.table(response);
    });
    connection.end();
}

// update stock
function createDepartment() {
    inquirer.prompt([
        {
            type: "input",
            message: "Please Enter Department Name",
            name: "department_name"
        },
        {
            type: "input",
            message: "Please Enter Over Head Cost",
            name: "over_head_cost",
        },
    ]).then(answer => {
        let department = {
            name: answer.department_name,
            cost: parseFloat(answer.over_head_cost)
        }
        console.log(department);
        if (isNaN(department.cost)) {
            console.log("Invalid Over Head Cost, Please Enter a Number.");
            createDepartment();
        }
        else {
            updateDepartment(department);
        }
    });
}
// Update department
function updateDepartment(department) {
    console.log("\nUpdating New Department...");
    connection.query("INSERT INTO departments SET ?",
        {
            department_name: department.name,
            over_head_cost: department.cost
        }
        , (error, updateDepartmentResponse) => {
            console.log(updateDepartmentResponse.affectedRows + " New Department Created");
            getSales();
        });
}