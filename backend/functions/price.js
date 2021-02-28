/*
 * Copyright (C) 2021 Alix Routhier-Lalonde
 * This file is subject to the terms and conditions defined in
 * file "LICENSE.txt", which is part of this source code package.
 */

import { authCheck, escapeHTML } from "./helper/helper.js";
import connection from "../sql.js";

//========== GET ALL PRICES ==========//

const get_prices = (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  let curuser = escapeHTML(req.body.curuser);

  let condition = authCheck(curuser);
  if (condition == false) {
    res.send("please stop trying to hack our system");
    return;
  }

  sql3 = "select * from variables where id = 1;";
  connection.query(sql3, (err, result) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    }
    if (result[0] == null) throw console.error();
    res.send(result[0]);
  });
};

//========== CHANGE ALL PRICES ==========//

const change_prices = (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  let curuser = escapeHTML(req.body.curuser);
  let priceBasket = req.body.priceBasket;
  let priceBasketChristmas = req.body.priceBasketChristmas;
  let priceBasketDepannage = req.body.priceBasketDepannage;
  let priceBasketLivraison = req.body.priceBasketLivraison;
  let priceBasketDepannageChristmas = req.body.priceBasketDepannageChristmas;
  let priceBasketDepannageLivraison = req.body.priceBasketDepannageLivraison;
  let priceBasketLivraisonChristmas = req.body.priceBasketLivraisonChristmas;
  let priceBasketDepannageLivraisonChristmas =
    req.body.priceBasketDepannageLivraisonChristmas;
  let priceMembership = req.body.priceMembership;

  let condition = authCheck(curuser);
  if (condition == false) {
    res.send("please stop trying to hack our system");
    return;
  }

  //mysql
  let sql1 = `update variables set priceBasket = ${priceBasket}, priceBasketChristmas = ${priceBasketChristmas}, priceBasketDepannage = ${priceBasketDepannage}, priceBasketLivraison = ${priceBasketLivraison}, priceBasketDepannageChristmas = ${priceBasketDepannageChristmas}, priceBasketDepannageLivraison = ${priceBasketDepannageLivraison}, priceBasketLivraisonChristmas = ${priceBasketLivraisonChristmas}, priceBasketDepannageLivraisonChristmas = ${priceBasketDepannageLivraisonChristmas}, priceMembership = ${priceMembership}; `;
  connection.query(sql1, (err, result) => {
    if (result.affectedRows <= 0) res.send("failure");
    else {
      res.send("success");
      sql2 = `insert into transactions(date, time, currentWeek, currentYear, dependant, admin, amount_to_admin, transactionType, livraison, depannage, christmasBasket) values(now(), now(), week(now()), year(now()), "\N", "${curuser}", ${0}, "changed prices", "", "", "");`;
      connection.query(sql2, (err, result) => {
        if (err) {
          console.log(err);
          res.sendStatus(500);
        }
        console.log(`prices change (${ip})`);
      });
    }
  });
};

export default { get_prices, change_prices };
