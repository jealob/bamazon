DROP DATABASE IF EXISTS bamazon;
create database bamazon;
use bamazon;

create table products (
item_id integer(5) auto_increment not null,
product_name varchar(100) not null,
department_name varchar(50),
price decimal (8,2),
stock_quantity integer(5),
full_stock integer(5),
primary key (item_id)
);

use bamazon;
use products;
alter table products
add stock_percent integer(3);
update products set stock_percent = stock_quantity*100/full_stock;
