const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("../commerce/connect");
const { v4: uuidv4 } = require("uuid");
const { resolve } = require("path");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/**
 * check if the username existed or not
 * If existed => false
 * Not existed => true
 * @param username : username to check from database
 */
const check_username = (username) => {
  const sql_check = `SELECT username from User where username = '${username}'`;

  return new Promise((resolve, reject) => {
    connection.query(sql_check, function (err, res) {
      if (err) reject(err);
      if (res.length >= 1) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
};

const check_userID = (userID) => {
  const sql_check = `SELECT user_id from User where user_id = '${userID}'`;

  return new Promise((resolve, reject) => {
    connection.query(sql_check, function (err, res) {
      if (err) reject(err);
      if (res.length >= 1) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
};

const check_itemname = (item_name) => {
  const sql_check = `SELECT item_name from item where item_name = '${item_name}'`;

  return new Promise((resolve, reject) => {
    connection.query(sql_check, function (err, res) {
      if (err) reject(err);
      if (res.length >= 1) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
};

const check_itemID = (item_ID) => {
  const sql_check = `SELECT item_id from item where item_id = '${item_ID}'`;

  return new Promise((resolve, reject) => {
    connection.query(sql_check, function (err, res) {
      if (err) reject(err);
      if (res.length >= 1) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
};

app.post("/register", (req, resp) => {
  let check = true;
  check_username(req.body.username).then((val) => {
    check = val;
    if (check == false) {
      resp.send("already existed");
    } else {
      const body = req.body;
      const sql = `INSERT INTO User(username,password,user_id) VALUES('${
        body.username
      }','${body.password}','${uuidv4()}') `;
      connection.query(sql, function (err) {
        if (err) throw err;
        resp.send("Registed success");
      });
    }
  });
});

app.post("/login", (req, resp) => {
  const body = req.body;
  const sql = `select username,password from User where username = '${body.username}' and password = '${body.password}'`;
  connection.query(sql, function (err, res) {
    if (err) throw err;
    if (res.length >= 1) {
      resp.send("login oke");
    } else {
      resp.send("wrong password ");
    }
  });
});

app.post("/add_item", (req, resp) => {
  const body = req.body;

  let check = true;

  check_itemname(body.item_name).then((val) => {
    check = val;
    if (check == false) {
      console.log("existed");
      resp.send("existed");
    } else {
      const sql = `insert  into item(item_name,item_price) values('${body.item_name}','${body.item_price}') `;
      connection.query(sql, function (err, res) {
        if (err) throw err;
        resp.send("create");
      });
    }
  });
});

app.post("/update_item", (req, resp) => {
  const body = req.body;

  let check = true;

  check_itemID(body.item_id).then((val) => {
    check = val;
    console.log(check);
    if (check == false) {
      console.log(body.item_id);
      const sql = `update item set item_name = '${body.item_name}', item_price = '${body.item_price}' where item_id = ${body.item_id} `;
      connection.query(sql, function (err) {
        if (err) throw err;
        resp.send("changed success");
      });
    } else {
      resp.send("not found");
    }
  });
});

app.post("/create_cart", (req, resp) => {
  const body = req.body;
  let check = true;
  check_userID(body.user_id).then((val) => {
    console.log(val);
    check = val;
    if (check == false) {
      const sql = `insert into cart(user_id) values ('${body.user_id}')`;
      connection.query(sql, function (err) {
        if (err) throw err;
        resp.send("created OKE");
      });
      // resp.send("found");
    } else {
      resp.send("not found user");
    }
  });
  // resp.send(body.user_id);
});

/**
 * Add new id product into a cart
 * If all cart_id has product_id => create new cart_id with product_id
 * Else => just make an update
 */
app.post("/add_product", (req, resp) => {
  const body = req.body;

  check_userID_Cart(body.user_id).then((val) => {
    if (Object.entries(val).length === 0) {
      resp.send("You have no right to add");
    } else {
      // Check if item ID existed or not
      check_itemID(body.item_id).then((val) => {
        if (val == true) {
          resp.send("not found item_id");
        } else {
          check_cart_duplicated_product(body.item_id).then((val) => {
            if (val == false) {
              resp.send("duplicated");
            } else {
              find_cartID_without_product(body.cart_id).then((val) => {
                // If we found 0 cart_id without product_id
                // Insert new
                if (Object.entries(val).length === 0) {
                  const sql = `insert into cart(user_id,item_id,quantity) values ('${body.user_id}',${body.item_id},1)`;
                  connection.query(sql, (err) => {
                    if (err) throw err;
                    resp.send("add product success");
                  });
                } else {
                  // Update
                  const sql = `update cart set item_id = ${body.item_id},quantity=1 where cart_id = ${val[0].cart_id}`;
                  connection.query(sql, (err) => {
                    if (err) throw err;
                    resp.send("add product success");
                  });
                }
              });
            }
          });
        }
      });
    }
  });
});

const find_cartID_without_product = () => {
  const sql = `select cart_id from cart where item_id is null`;
  return new Promise((resolve, reject) => {
    connection.query(sql, (err, res) => {
      if (err) reject(err);
      if (
        res && // 👈 null and undefined check
        Object.keys(res).length === 0 &&
        Object.getPrototypeOf(res) === Object.prototype
      ) {
        resolve("create new order_id");
      } else {
        resolve(res);
      }
    });
  });
};

const check_userID_Cart = (user_id) => {
  const sql = `select user_id from cart where user_id = '${user_id}'`;
  return new Promise((resolve, reject) => {
    connection.query(sql, (err, res) => {
      if (err) reject(err);
      resolve(res);
    });
  });
};

const check_cart_duplicated_product = (item_id) => {
  const sql = `select cart_id from cart where item_id = ${item_id}`;
  return new Promise((resolve, reject) => {
    connection.query(sql, (err, res) => {
      if (err) reject(err);
      if (res.length >= 1) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
};

app.post("/delete_product", (req, resp) => {
  const body = req.body;
  check_userID_Cart(body.user_id).then((val) => {
    if (Object.entries(val).length === 0) {
      resp.send("You have no right to delete");
    } else {
      check_itemID(body.item_id).then((val) => {
        if (val == true) {
          resp.send("not found item_id");
        } else {
          const sql = `delete from cart where item_id = ${body.item_id}`;
          connection.query(sql, (err) => {
            if (err) {
              throw err;
            }
            resp.send("delete success");
          });
        }
      });
    }
  });
});

app.post("/update_product", (req, resp) => {
  const body = req.body;
  check_userID_Cart(body.user_id).then((val) => {
    if (Object.entries(val).length === 0) {
      resp.send("You have no right to update");
    } else {
      check_itemID(body.item_id).then((val) => {
        if (val == true) {
          resp.send("not found item_id");
        } else {
          const sql = `update cart set quantity = ${body.quantity} where user_id = '${body.user_id}' AND item_id = ${body.item_id}`;
          connection.query(sql, (err) => {
            if (err) {
              throw err;
            }
            resp.send("update success");
          });
        }
      });
    }
  });
});

app.post("/validation", (req, resp) => {
  const body = req.body;
  check_userID_Cart(body.user_id).then((val) => {
    if (Object.entries(val).length === 0) {
      resp.send("You have no right to valide");
    } else {
      // Valide
      let sql = `INSERT INTO order_details (order_id,user_id,item_id,quantity)
      SELECT cart_id,user_id,item_id,quantity
      FROM cart;`;

      sql += `delete from cart where user_id ='${body.user_id}';`;

      sql += `insert into orders(user_id) values (${body.user_id}) `;

      connection.query(sql, (err) => {
        if (err) throw err;
        resp.send("valide success");
      });
    }
  });
});

app.listen(3000);
