use bamazon;
use products;
select * from products;
insert into products (product_name, department_name, price, stock_quantity, full_stock)
values("Lawn Mower", "Gardening", 299.99, 8, 20),
("Baking Soda", "Baking", 0.99, 80, 200),
("Corn Flakes", "Foods", 4.59, 89, 150),
("Snicker Chocolate Bar", "Snack", 1.29, 450, 1000),
("Great Bicycle", "Sport", 449.99, 12, 30),
("Wrist Watch", "Jewelery", 14.29, 45, 140),
("Corn Bread", "Snack", 5.59, 19, 100),
("Donuts", "Snack", 1.99, 45, 100),
("Table Fan", "Household", 49.99, 12, 80),
("Window AC Unit", "Household", 199.99, 25, 40);

use bamazon;
use products;
insert into products (product_name, department_name, price, stock_quantity, full_stock)
values("Comfy Single Chair", "Household", 99.99, 15, 20);