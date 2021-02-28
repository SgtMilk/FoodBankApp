/*
 * Copyright (C) 2021 Alix Routhier-Lalonde
 * This file is subject to the terms and conditions defined in
 * file "LICENSE.txt", which is part of this source code package.
 */

import { authCheck, escapeHTML } from "./helper/helper.js";
import connection from "../sql.js";

//========== GET ALL LIVRAISONS ==========//

const get_livraisons = (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  let curuser = escapeHTML(req.body.curuser);

  let condition = authCheck(curuser);
  if (condition == false) {
    res.send("please stop trying to hack our system");
    return;
  }

  let sql = `select * from transactions where livraison = "true" and transactionType = "add basket";`;
  connection.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    }
    res.send(result);
  });
};

//========== COMPLETE LIVRAISON ==========//

const complete_livraison = (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  let curuser = escapeHTML(req.body.curuser);
  let id = req.body.id;

  let condition = authCheck(curuser);
  if (condition == false) {
    res.send("please stop trying to hack our system");
    return;
  }

  sql = `update transactions set livraison = "true-done" where id = ${id}`;
  connection.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    }
    if (result.affectedRows <= 0) res.send("failure");
    else res.send("success");
  });
};

export default { get_livraisons, complete_livraison };
