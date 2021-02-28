/*
 * Copyright (C) 2021 Alix Routhier-Lalonde
 * This file is subject to the terms and conditions defined in
 * file "LICENSE.txt", which is part of this source code package.
 */

import { authCheck, escapeHTML } from "./helper/helper.js";
const crypto = require("crypto");
import connection from "../sql.js";

//========== FUNCTION TO LOGIN ==========//

const login = (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  let username = escapeHTML(req.body.username);
  let password = escapeHTML(req.body.password);

  if (username.length > 45 || password.length > 45) {
    res.send({
      message: "please stop trying to hack our system",
      username: undefined,
    });
    return;
  }

  let hashed_password = crypto.createHmac("sha256", password).digest("hex");

  //mysql
  let sqlcheck = `select distinct username from admins where username = "${username}" and password = "${hashed_password}";`;
  connection.query(sqlcheck, (err, result) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    }
    if (result[0] != null) {
      res.send({
        message: "authentification succeded",
        username,
      });
      console.log(`login: ${username} (${ip})`);
      return;
    } else
      res.send({
        message: "authentification failed",
        username: undefined,
      });
    console.log(`bad authentification (${ip})`);
  });
};

//========== FUNCTION TO CHANGE PASSWORD ==========//

const change_password = (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  let username = escapeHTML(req.body.username);
  let oldPassword = escapeHTML(req.body.oldPassword);
  let newPassword = escapeHTML(req.body.newPassword);
  let curuser = escapeHTML(req.body.curuser);

  let old_hashed_password = crypto
    .createHmac("sha256", oldPassword)
    .digest("hex");
  let new_hashed_password = crypto
    .createHmac("sha256", newPassword)
    .digest("hex");

  let condition = authCheck(curuser);
  if (condition == false) {
    res.send("please stop trying to hack our system");
    return;
  }

  if (
    oldPassword.length > 45 ||
    newPassword.length > 45 ||
    username.length > 45 ||
    newPassword === null ||
    newPassword === undefined ||
    newPassword === "" ||
    curuser.length > 45
  ) {
    res.send("please stop trying to hack our system");
    return;
  }

  //mysql
  let sqlchange = `UPDATE admins SET password = "${new_hashed_password}" WHERE username = "${username}" and password = "${old_hashed_password}";`;
  connection.query(sqlchange, (err, result) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    }
    if (result.changedRows === 0) {
      res.send("old password incorrect");
      console.log(`admin password change failed (${ip})`);
    } else {
      res.send("success");
      console.log(`admin password change succeded (${ip})`);
    }
  });
};

export default { login, change_password };
