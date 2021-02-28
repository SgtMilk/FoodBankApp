/*
 * Copyright (C) 2021 Alix Routhier-Lalonde
 * This file is subject to the terms and conditions defined in
 * file "LICENSE.txt", which is part of this source code package.
 */

import { authCheck, escapeHTML } from "./helper/helper.js";
const crypto = require("crypto");
import connection from "../sql.js";

//========== FUNCTION TO GET ALL ADMINISTRATORS ==========//

const get_administrators = (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  let curuser = escapeHTML(req.body.curuser);

  if (curuser > 45) {
    res.send("please stop trying to hack our system");
    return;
  }

  let condition = authCheck(curuser);
  if (condition == false) {
    res.send("please stop trying to hack our system");
    return;
  }

  //mysql
  let sql = `select username from admins;`;
  connection.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    }
    console.log(`admins query (${ip})`);
    res.send(result);
  });
};

//========== FUNCTION TO ADD ADMINISTRATOR ==========//

const add_administrator = (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  let username = escapeHTML(req.body.username);
  let password = escapeHTML(req.body.password);
  let curuser = escapeHTML(req.body.curuser);

  let hashed_password = crypto.createHmac("sha256", password).digest("hex");

  let condition = authCheck(curuser);
  if (condition == false) {
    res.send("please stop trying to hack our system");
    return;
  }

  if (
    password.length > 45 ||
    username.length > 45 ||
    curuser.length > 45 ||
    password === null ||
    password === undefined ||
    password === "" ||
    username === null ||
    username === undefined ||
    username === ""
  ) {
    res.send("please stop trying to hack our system");
    return;
  }
  //mysql
  let sqlcheck = `select distinct username from admins where username = "${username}";`;
  let sqladd = `insert into admins(username, password) values("${username}", "${hashed_password}");`;
  connection.query(sqlcheck, (err, result) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    }
    0;
    if (result[0] != null) {
      res.send("username taken");
    } else {
      connection.query(sqladd, (err, result) => {
        if (err) {
          console.log(err);
          res.sendStatus(500);
        }
        if (result.affectedRows <= 0) {
          res.send("authentification failed");
        } else {
          res.send("success");
          console.log(`new admin: ${username} (${ip})`);
          let sqlTransaction = `insert into transactions(date, time, currentWeek, currentYear, dependant, admin, amount_to_admin, transactionType, livraison, depannage, christmasBasket) values(now(), now(), week(now()), year(now()), "${username}", "${curuser}", ${0}, "add admin", "", "", "");`;
          connection.query(sqlTransaction, (err, result) => {
            if (err) {
              console.log(err);
              res.sendStatus(500);
            }
          });
        }
      });
    }
  });
};

//========== FUNCTION DELETE AN ADMINISTRATOR ==========//

const delete_administrator = (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  let username = escapeHTML(req.body.username);
  let curuser = escapeHTML(req.body.curuser);

  if (username.length > 45 || curuser.length > 45) {
    res.send("please stop trying to hack our system");
    return;
  }

  let condition = authCheck(curuser);
  if (condition == false) {
    res.send("please stop trying to hack our system");
    return;
  }

  //mysql
  let sql = `DELETE FROM admins WHERE username = "${username}";`;
  connection.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    }
    if (result.affectedRows <= 0) res.send("failure");
    else {
      res.send("success");
      console.log(`admin ${username} removed (${ip})`);
      let sqlTransaction = `insert into transactions(date, time, currentWeek, currentYear, dependant, admin, amount_to_admin, transactionType, livraison, depannage, christmasBasket) values(now(), now(), week(now()), year(now()), "${username}", "${curuser}", ${0}, "remove admin", "", "", "");`;
      connection.query(sqlTransaction, (err, result) => {
        if (err) {
          console.log(err);
          res.sendStatus(500);
        }
      });
    }
  });
};

export default { get_administrators, add_administrator, delete_administrator };
