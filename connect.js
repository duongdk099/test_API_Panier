const mysql = require("mysql2");
require("dotenv").config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: "3306",
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  multipleStatements: true,
});

connection.connect((err) => {
  let mess = !err ? "connected" : "connection failed";
  console.log(`mysql : ${mess}`);
});

module.exports = connection;
