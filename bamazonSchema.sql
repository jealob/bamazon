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

alter table products
add stock_percent integer(3);
update products set stock_percent = stock_quantity*100/full_stock;

create table departments as select distinct department_name from products order by department_name;

alter table departments
add column department_id integer(5) auto_increment primary key first,
add over_head_cost decimal(10, 2);

alter table departments auto_increment = 230001;

alter table products
drop product_sales;

alter table products
add product_sales decimal(10,2);