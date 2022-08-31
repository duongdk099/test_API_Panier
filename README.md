# test_API_Panier
## Lien API:
http://localhost:3000/

## INSTRUCTIONS D'INSTALLATION : 

1 - Installer MySQL : <br /> 
https://dev.mysql.com/doc/mysql-installation-excerpt/8.0/en/installing.html<br/> <br/> 

2 - Créer une database et l'utiliser : <br/> <br/> 
CREATE DATABASE NOM_DATABASE (comme dans ce test, j'ai utilisé 'bello'). <br/> <br/> 
Ensuite,taper : 'use bello' pour qu'on peut l'utiliser <br/> <br/> 
3 - Créer des tables : <br /> <br/> 
CREATE TABLE User( <br /> 
	username varchar(50), <br /> 
	password varchar(50), <br /> 
	user_id varchar(100),<br /> 
	PRIMARY KEY (user_id)<br /> 
);<br /> 

CREATE TABLE item(<br /> 
	item_id int NOT NULL AUTO_INCREMENT ,<br /> 
	item_name varchar(50),<br /> 
	item_price DECIMAL(5,3),<br /> 
	PRIMARY KEY (item_id)<br /> 
);<br /> 

CREATE TABLE cart(<br /> 
	cart_id int NOT NULL AUTO_INCREMENT ,<br /> 
	user_id varchar(100),<br /> 
	item_id int ,<br /> 
	quantity int,<br /> 
	PRIMARY KEY (cart_id)<br /> 
);<br /> 


CREATE TABLE order_details(<br /> 
	order_id int NOT NULL AUTO_INCREMENT ,<br /> 
	user_id varchar(100),<br /> 
	item_id int NOT NULL,<br /> 
	quantity int,<br /> 
	PRIMARY KEY (order_id)<br /> 
);<br /> 

Create table orders(<br /> 
order_id int NOT NULL AUTO_INCREMENT,<br /> 
user_id varchar(100),<br /> 
total_price DECIMAL(5,3),<br /> 
PRIMARY KEY (order_id)<br /> 
);<br /> 
<br /> 

4 - Connect NodeJS à MySQL : <br /> <br /> 
Ceci est mon standard config :<br /> 
DB_HOST=127.0.0.1<br /> 
DB_USER=root<br /> 
DB_PASSWORD=password<br /> 
DB_DATABASE = bello<br /> 

5 - Installer les dépendencies de NodeJS, ExpressJS et les autres framworks <br /> 
Taper : 'npm install'
<br /> <br /> 
6 - Enjoy the product<br /> 

