# bamazon

Create a MySQL Database called bamazon.
Then create a Table inside of that database called products.
The products table should have each of the following columns:



item_id (unique id for each product)
product_name (Name of product)
department_name
price (cost to customer)
stock_quantity (how much of the product is available in stores)

Populate this database with around 10 different products. (i.e. Insert "mock" data rows into this database and table).
Then create a Node application called bamazonCustomer.js. Running this application will first display all of the items available for sale. Include the ids, names, and prices of products for sale.
The app should then prompt users with two messages.

The first should ask them the ID of the product they would like to buy.
The second message should ask how many units of the product they would like to buy.

Once the customer has placed the order, application should check if store has enough of the product to meet the customer's request.

If not, the app should log a phrase like Insufficient quantity!, and then prevent the order from going through.

However, if store does have enough of the product, should fulfill the customer's order.

This means updating the SQL database to reflect the remaining quantity.
Once the update goes through, show the customer the total cost of their purchase.


Create a new Node application called bamazonManager.js. Running this application will:
List a set of menu options:
View Products for Sale
View Low Inventory
Add to Inventory
Add New Product
If a manager selects View Products for Sale, the app should list every available item: the item IDs, names, prices, and quantities.
If a manager selects View Low Inventory, then it should list all items with an inventory count lower than five.
If a manager selects Add to Inventory, app should display a prompt that will let the manager "add more" of any item currently in the store.
If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.

If finished Challenge #2 and put in all the hours were willing to spend on this activity, then rest easy! Otherwise continue to the next and final challenge.

Create a new MySQL table called departments. table should include the following columns:

department_id
department_name
over_head_costs (A dummy number set for each department)

Modify the products table so that there's a product_sales column and modify the bamazonCustomer.js app so that this value is updated with each individual products total revenue from each sale.
Modify bamazonCustomer.js app so that when a customer purchases anything from the store, the price of the product multiplied by the quantity purchased is added to the product's product_sales column.

Make sure app still updates the inventory listed in the products column.

Create another Node app called bamazonSupervisor.js. Running this application will list a set of menu options:

View Product Sales by Department
Create New Department

When a supervisor selects View Product Sales by Department, the app should display a summarized table in their terminal/bash window. Use the table below as a guide.