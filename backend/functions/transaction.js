/*
 * Copyright (C) 2021 Alix Routhier-Lalonde
 * This file is subject to the terms and conditions defined in
 * file "LICENSE.txt", which is part of this source code package.
 */

import { authCheck, escapeHTML, choose } from "./helper/helper.js";
import connection from "../sql.js";

//========== GET ALL TRANSACTIONS ==========//
const all_transactions = (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const curuser = escapeHTML(req.body.curuser);

  let condition = authCheck(curuser);
  if (condition == false) {
    res.send("please stop trying to hack our system");
    return;
  }

  //mysql
  let sql = `select * from transactions where transactionType = "add basket" and currentWeek = week(now());`;
  connection.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    }
    res.send(result);
  });
};

//========== ADD A BASKET TO A DEPENDANT (ADD A TRANSACTION) ==========//

const add_basket = (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  let firstName = escapeHTML(req.body.firstName);
  let lastName = escapeHTML(req.body.lastName);
  let dateOfBirth = escapeHTML(req.body.dateOfBirth);
  let balance = req.body.balance;
  let livraison = req.body.livraison;
  let depannage = req.body.depannage;
  let christmasBasket = req.body.christmasBasket;
  let residencyProofStatus = req.body.residencyProofStatus;
  let studentStatus = req.body.studentStatus;

  //mysql

  sql3 = "select * from variables where id = 1;";
  connection.query(sql3, (err, result) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    }
    if (result[0] == null) throw console.error();
    variables = result[0];
    let price = choose(depannage, livraison, christmasBasket, variables);
    const choosesql = () => {
      if (
        residencyProofStatus !== "Non" &&
        studentStatus !== "Oui, mais n'a pas sa preuve d'études"
      ) {
        return `update dependants set balance = balance + ${
          balance - price
        }, residencyProofStatus = "${residencyProofStatus}", studentStatus = "${studentStatus}" where firstName = "${firstName}" and lastName = "${lastName}" and dateOfBirth = "${dateOfBirth}";`;
      } else if (
        residencyProofStatus === "Non" &&
        studentStatus !== "Oui, mais n'a pas sa preuve d'études"
      ) {
        return `update dependants set balance = balance + ${
          balance - price
        }, studentStatus = "${studentStatus}" where firstName = "${firstName}" and lastName = "${lastName}" and dateOfBirth = "${dateOfBirth}";`;
      } else if (
        residencyProofStatus !== "Non" &&
        studentStatus === "Oui, mais n'a pas sa preuve d'études"
      ) {
        return `update dependants set balance = balance + ${
          balance - price
        }, residencyProofStatus = "${residencyProofStatus}" where firstName = "${firstName}" and lastName = "${lastName}" and dateOfBirth = "${dateOfBirth}";`;
      } else if (
        residencyProofStatus === "Non" &&
        studentStatus === "Oui, mais n'a pas sa preuve d'études"
      ) {
        return `update dependants set balance = balance + ${
          balance - price
        } where firstName = "${firstName}" and lastName = "${lastName}" and dateOfBirth = "${dateOfBirth}";`;
      }
    };
    let sqlquery = choosesql();
    connection.query(sqlquery, (err, result) => {
      if (err) {
        console.log(err);
        res.sendStatus(500);
      }
      if (result.affectedRows <= 0) {
        res.send({ message: "failure" });
        return;
      } else {
        let sql3 = `select homeNumber, homeStreet, appartmentNumber, appartmentLevel, homePostalCode, homeEntryCode from dependants where firstName = "${firstName}" and lastName = "${lastName}" and dateOfBirth = "${dateOfBirth}";`;
        connection.query(sql3, (err, result) => {
          if (err) {
            console.log(err);
            res.sendStatus(500);
          }
          if (result[0] == null) res.send("failure");
          else {
            let homeNumber = result[0].homeNumber;
            let homeStreet = result[0].homeStreet;
            let appartmentNumber = result[0].appartmentNumber;
            let appartmentLevel = result[0].appartmentLevel;
            let homePostalCode = result[0].homePostalCode;
            let homeEntryCode = result[0].homeEntryCode;

            let address = `Numéro de porte: ${homeNumber}, Nom de rue: ${homeStreet}, Numéro d'appartement: ${appartmentNumber}, Niveau de l'appartement: ${appartmentLevel}, Code postal: ${homePostalCode}, Code d'entrée: ${homeEntryCode}`;
            let sql2 = `insert into transactions(date, time, currentWeek, currentYear, dependant, admin, amount_to_admin, transactionType, livraison, depannage, christmasBasket, address) values(now(), now(), week(now()), year(now()), "${lastName}, ${firstName} (${dateOfBirth})", "\N", ${balance}, "add basket", "${livraison}", "${depannage}", "${christmasBasket}", "${address}");`;
            connection.query(sql2, (err, result) => {
              if (err) {
                console.log(err);
                res.sendStatus(500);
              }
              if (result.affectedRows <= 0) res.send({ message: "failure" });
              else {
                res.send({ message: "success" });
              }
            });
          }
        });
      }
    });
  });
};

//========== DELETE A TRANSACTION ==========//

const delete_transaction = (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const curuser = escapeHTML(req.body.curuser);
  const id = req.body.id;
  const balance = req.body.balance;
  const dependant = escapeHTML(req.body.dependant);
  let livraison = req.body.livraison;
  let depannage = req.body.depannage;
  let christmasBasket = req.body.christmasBasket;
  if (livraison === "true") livraison = true;
  if (livraison === "true-done") livraison = true;
  if (livraison === "false") livraison = false;
  if (depannage === "true") depannage = true;
  if (depannage === "false") depannage = false;
  if (christmasBasket === "true") christmasBasket = true;
  if (christmasBasket === "false") christmasBasket = false;

  const lastName = dependant.split(", ")[0];
  const firstName = dependant.split(", ")[1].split(" (")[0];
  const dateOfBirth = dependant.split(", ")[1].split(" (")[1].split(")")[0];

  let condition = authCheck(curuser);
  if (condition == false) {
    res.send("please stop trying to hack our system");
    return;
  }

  let sql = `DELETE from transactions where id = ${id}`;
  connection.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    }
    if (result.affectedRows <= 0) res.send("failure");
    else {
      res.send("success");
      sql3 = "select * from variables where id = 1;";
      connection.query(sql3, (err, result) => {
        if (err) {
          console.log(err);
          res.sendStatus(500);
        }
        if (result[0] == null) throw console.error();
        variables = result[0];
        let price = choose(depannage, livraison, christmasBasket, variables);

        let sqlquery = `update dependants set balance = balance - ${
          balance - price
        } where firstName = "${firstName}" and lastName = "${lastName}" and dateOfBirth = "${dateOfBirth}";`;
        connection.query(sqlquery, (err, result) => {
          if (err) {
            console.log(err);
            res.sendStatus(500);
          }
          if (result.affectedRows <= 0) throw console.error();
          console.log(`removed a transaction (${ip})`);
        });
      });
    }
  });
};

export default { all_transactions, add_basket, delete_transaction };
