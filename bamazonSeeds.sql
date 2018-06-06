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

use bamazon;
insert into departments(department_name, over_head_cost)
values("Children Clothes", 200404);

insert into departments(department_name, over_head_cost)
values("Children Toys", 250404),
("Hardware", 250965),
("Medicine", 291019);

update departments set over_head_cost = 23434 where department_id = 1;
update departments set over_head_cost = 19343 where department_id = 2;
update departments set over_head_cost = 63434 where department_id = 3;
update departments set over_head_cost = 44777 where department_id = 4;
update departments set over_head_cost = 34564 where department_id = 5;
update departments set over_head_cost = 10489 where department_id = 6;
update departments set over_head_cost = 58644 where department_id = 7;
update departments set over_head_cost = 34564 where department_id = 230001;
update departments set over_head_cost = 10489 where department_id = 230002;
update departments set over_head_cost = 58644 where department_id = 230003;
update departments set over_head_cost = 10489 where department_id = 230004;

update products set product_sales = 0.0;

delete from departments where department_id = 230007;

update products set price = 20.45 where item_id = 19;
update products set product_sales = 0.00 where item_id = 19;
