/*
 * Copyright (C) 2021 Alix Routhier-Lalonde
 * This file is subject to the terms and conditions defined in
 * file "LICENSE.txt", which is part of this source code package.
 */

import { authCheck, escapeHTML } from "./helper/helper.js";
const fs = require("fs");
import connection from "../sql.js";

//========== DAILY REPORT ==========//

const daily_report = (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const curuser = escapeHTML(req.body.curuser);
  const day = req.body.day;

  let condition = authCheck(curuser);
  if (condition == false) {
    res.send("please stop trying to hack our system");
    return;
  }

  if (fs.existsSync("/var/lib/mysql/mysql/report.csv")) {
    fs.unlinkSync("/var/lib/mysql/mysql/report.csv");
  }
  const sql = `SELECT date, time, dependant, admin, amount_to_admin, transactionType, livraison, depannage, christmasBasket FROM transactions where date = "${day}" INTO OUTFILE "/var/lib/mysql/mysql/report.csv" FIELDS TERMINATED BY ";" ENCLOSED BY "'" LINES TERMINATED BY "\n";`;
  connection.query(sql, (err) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    }
    res.sendFile("/var/lib/mysql/mysql/report.csv");
    console.log(`daily report query (${ip})`);
  });
};

//========== WEEKLY REPORT ==========//

const weekly_report = (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const curuser = escapeHTML(req.body.curuser);
  let week = req.body.week;
  week = `${week}`;
  week = week.slice(6, 8) - 1;

  let condition = authCheck(curuser);
  if (condition == false) {
    res.send("please stop trying to hack our system");
    return;
  }

  if (fs.existsSync("/var/lib/mysql/mysql/report.csv")) {
    fs.unlinkSync("/var/lib/mysql/mysql/report.csv");
  }
  const sql = `SELECT date, time, dependant, admin, amount_to_admin, transactionType, livraison, depannage, christmasBasket FROM transactions where currentWeek = ${week} INTO OUTFILE "/var/lib/mysql/mysql/report.csv" FIELDS TERMINATED BY ";" ENCLOSED BY "'" LINES TERMINATED BY "\n";`;
  connection.query(sql, (err) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    }
    console.log(`weekly report query (${ip})`);
    res.sendFile("/var/lib/mysql/mysql/report.csv");
  });
};

//========== YEARLY REPORT ==========//

const yearly_report = (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const curuser = escapeHTML(req.body.curuser);
  const year = req.body.year;

  let condition = authCheck(curuser);
  if (condition == false) {
    res.send("please stop trying to hack our system");
    return;
  }

  if (fs.existsSync("/var/lib/mysql/mysql/report.csv")) {
    fs.unlinkSync("/var/lib/mysql/mysql/report.csv");
  }
  const sql = `SELECT date, time, dependant, admin, amount_to_admin, transactionType, livraison, depannage, christmasBasket FROM transactions where currentYear = ${year} INTO OUTFILE "/var/lib/mysql/mysql/report.csv" FIELDS TERMINATED BY ";" ENCLOSED BY "'" LINES TERMINATED BY "\n";`;
  connection.query(sql, (err) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    }
    console.log(`yearly report query (${ip})`);
    res.sendFile("/var/lib/mysql/mysql/report.csv");
  });
};

export default { daily_report, weekly_report, yearly_report };
