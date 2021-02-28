/*
 * Copyright (C) 2021 Alix Routhier-Lalonde
 * This file is subject to the terms and conditions defined in
 * file "LICENSE.txt", which is part of this source code package.
 */

import { authCheck, escapeHTML } from "./helper/helper.js";
import connection from "../sql.js";

//========== MODIFY DEPENDANT PARAMETERS ==========//

const modify_dependant = (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  let id = req.body.id;
  let sex = escapeHTML(req.body.sex);
  let studentStatus = escapeHTML(req.body.studentStatus);
  let memberStatus = escapeHTML(req.body.memberStatus);
  let volunteerStatus = escapeHTML(req.body.volunteerStatus);
  let email = escapeHTML(req.body.email);
  let homePhoneNumber = escapeHTML(req.body.homePhoneNumber);
  let cellphoneNumber = escapeHTML(req.body.cellphoneNumber);
  let homeNumber = req.body.homeNumber;
  let homeStreet = escapeHTML(req.body.homeStreet);
  let appartmentNumber = escapeHTML(req.body.appartmentNumber);
  let appartmentLevel = escapeHTML(req.body.appartmentLevel);
  let homeEntryCode = escapeHTML(req.body.homeEntryCode);
  let homePostalCode = escapeHTML(req.body.homePostalCode);
  let residencyProofStatus = escapeHTML(req.body.residencyProofStatus);
  let typeOfHouse = escapeHTML(req.body.typeOfHouse);
  let sourceOfRevenue = escapeHTML(req.body.sourceOfRevenue);
  let familyComposition = escapeHTML(req.body.familyComposition);
  let numberOfOtherFamilyMembers = req.body.numberOfOtherFamilyMembers;
  let DOBfamilyMember1 = escapeHTML(req.body.DOBfamilyMember1);
  let DOBfamilyMember2 = escapeHTML(req.body.DOBfamilyMember2);
  let DOBfamilyMember3 = escapeHTML(req.body.DOBfamilyMember3);
  let DOBfamilyMember4 = escapeHTML(req.body.DOBfamilyMember4);
  let DOBfamilyMember5 = escapeHTML(req.body.DOBfamilyMember5);
  let DOBfamilyMember6 = escapeHTML(req.body.DOBfamilyMember6);
  let DOBfamilyMember7 = escapeHTML(req.body.DOBfamilyMember7);
  let DOBfamilyMember8 = escapeHTML(req.body.DOBfamilyMember8);
  let DOBfamilyMember9 = escapeHTML(req.body.DOBfamilyMember9);
  let DOBfamilyMember10 = escapeHTML(req.body.DOBfamilyMember10);
  let DOBfamilyMember11 = escapeHTML(req.body.DOBfamilyMember11);
  let DOBfamilyMember12 = escapeHTML(req.body.DOBfamilyMember12);
  let DOBfamilyMember13 = escapeHTML(req.body.DOBfamilyMember13);
  let DOBfamilyMember14 = escapeHTML(req.body.DOBfamilyMember14);
  let DOBfamilyMember15 = escapeHTML(req.body.DOBfamilyMember15);
  let DOBfamilyMember16 = escapeHTML(req.body.DOBfamilyMember16);
  let DOBfamilyMember17 = escapeHTML(req.body.DOBfamilyMember17);
  let DOBfamilyMember18 = escapeHTML(req.body.DOBfamilyMember18);
  let DOBfamilyMember19 = escapeHTML(req.body.DOBfamilyMember19);
  let sourceOrganismName = escapeHTML(req.body.sourceOrganismName);
  let socialWorkerNameOrganism = escapeHTML(req.body.socialWorkerNameOrganism);
  let socialWorkerPhoneNumberOrganism = escapeHTML(
    req.body.socialWorkerPhoneNumberOrganism
  );
  let socialWorkerPostOrganism = escapeHTML(req.body.socialWorkerPostOrganism);
  let curatelName = escapeHTML(req.body.curatelName);
  let socialWorkerNameCuratel = escapeHTML(req.body.socialWorkerNameCuratel);
  let socialWorkerPhoneNumberCuratel = escapeHTML(
    req.body.socialWorkerPhoneNumberCuratel
  );
  let socialWorkerPostCuratel = escapeHTML(req.body.socialWorkerPostCuratel);
  let curuser = escapeHTML(req.body.curuser);

  let condition = authCheck(curuser);
  if (condition == false) {
    res.send("please stop trying to hack our system");
    return;
  }

  //mysql
  let sqlchange = `UPDATE dependants SET sex = "${sex}", studentStatus = "${studentStatus}", memberStatus = "${memberStatus}", volunteerStatus = "${volunteerStatus}", email = "${email}", homePhoneNumber = "${homePhoneNumber}", cellphoneNumber = "${cellphoneNumber}", homeNumber = "${homeNumber}", homeStreet = "${homeStreet}", appartmentNumber = "${appartmentNumber}", appartmentLevel = "${appartmentLevel}", homeEntryCode = "${homeEntryCode}", homePostalCode = "${homePostalCode}", residencyProofStatus = "${residencyProofStatus}", typeOfHouse = "${typeOfHouse}", sourceOfRevenue = "${sourceOfRevenue}", familyComposition = "${familyComposition}", numberOfOtherFamilyMembers = "${numberOfOtherFamilyMembers}", DOBfamilyMember1 = "${DOBfamilyMember1}", DOBfamilyMember2 = "${DOBfamilyMember2}", DOBfamilyMember3 = "${DOBfamilyMember3}", DOBfamilyMember4 = "${DOBfamilyMember4}", DOBfamilyMember5 = "${DOBfamilyMember5}", DOBfamilyMember6 = "${DOBfamilyMember6}", DOBfamilyMember7 = "${DOBfamilyMember7}", DOBfamilyMember8 = "${DOBfamilyMember8}", DOBfamilyMember9 = "${DOBfamilyMember9}", DOBfamilyMember10 = "${DOBfamilyMember10}", DOBfamilyMember11 = "${DOBfamilyMember11}", DOBfamilyMember12 = "${DOBfamilyMember12}", DOBfamilyMember13 = "${DOBfamilyMember13}", DOBfamilyMember14 = "${DOBfamilyMember14}", DOBfamilyMember15 = "${DOBfamilyMember15}", DOBfamilyMember16 = "${DOBfamilyMember16}", DOBfamilyMember17 = "${DOBfamilyMember17}", DOBfamilyMember18 = "${DOBfamilyMember18}", DOBfamilyMember19 = "${DOBfamilyMember19}", sourceOrganismName = "${sourceOrganismName}", socialWorkerNameOrganism = "${socialWorkerNameOrganism}", socialWorkerPhoneNumberOrganism = "${socialWorkerPhoneNumberOrganism}", socialWorkerPostOrganism  = "${socialWorkerPostOrganism}", curatelName  = "${curatelName}", socialWorkerNameCuratel  = "${socialWorkerNameCuratel}", socialWorkerPhoneNumberCuratel = "${socialWorkerPhoneNumberCuratel}", socialWorkerPostCuratel = "${socialWorkerPostCuratel}" WHERE id = ${id};`;
  connection.query(sqlchange, (err, result) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    }
    if (result.affectedRows <= 0) res.send({ message: "failure" });
    else {
      res.send({ message: "success" });
      let sql1 = `select firstName, lastName, dateOfBirth from dependants where id = "${id}";`;
      connection.query(sql1, (err, result) => {
        if (err) {
          console.log(err);
          res.sendStatus(500);
        }
        let firstName = result[0].firstName;
        let lastName = result[0].lastName;
        let dateOfBirth = result[0].dateOfBirth;

        let sqlTransaction = `insert into transactions(date, time, currentWeek, currentYear, dependant, admin, amount_to_admin, transactionType, livraison, depannage, christmasBasket) values(now(), now(), week(now()), year(now()), "${lastName}, ${firstName} (${dateOfBirth})", "${curuser}", ${0}, "change dependant info", "", "", "");`;
        connection.query(sqlTransaction, (err, result) => {
          if (err) {
            console.log(err);
            res.sendStatus(500);
          }
        });
      });
    }
  });
};

//========== RENEW DEPENDANT'S CARD ==========//

const renew_card = (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  let id = req.body.id;
  let balance = req.body.balance;
  let curuser = escapeHTML(req.body.curuser);

  let condition = authCheck(curuser);
  if (condition == false) {
    res.send("please stop trying to hack our system");
    return;
  }

  //mysql
  sql3 = "select * from variables where id = 1;";
  connection.query(sql3, (err, result) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    }
    if (result[0] == null) throw console.error();
    price = result[0].priceMembership;
    let sql = `update dependants set balance = balance + ${
      balance - price
    }, lastRenewment = now(), expirationDate = date_add(now(), INTERVAL 1 year) where id = ${id};`;
    connection.query(sql, (err, result) => {
      if (err) {
        console.log(err);
        res.sendStatus(500);
      }
      if (result.affectedRows <= 0) res.send({ message: "failure" });
      else {
        res.send({ message: "success" });
        let sql1 = `select firstName, lastName, dateOfBirth from dependants where id = "${id}";`;
        connection.query(sql1, (err, result) => {
          if (err) {
            console.log(err);
            res.sendStatus(500);
          }
          let firstName = result[0].firstName;
          let lastName = result[0].lastName;
          let dateOfBirth = result[0].dateOfBirth;

          let sqlTransaction = `insert into transactions(date, time, currentWeek, currentYear, dependant, admin, amount_to_admin, transactionType, livraison, depannage, christmasBasket) values(now(), now(), week(now()), year(now()), "${lastName}, ${firstName} (${dateOfBirth})", "${curuser}", ${balance}, "card renewed", "", "", "");`;
          connection.query(sqlTransaction, (err, result) => {
            if (err) {
              console.log(err);
              res.sendStatus(500);
            }
          });
        });
      }
    });
  });
};

//========== ADD OR REMOVE AN AMOUNT TO A DEPENDANT'S BALANCE ==========//

const change_balance = (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  let id = req.body.id;
  let balance = req.body.balance;
  let curuser = escapeHTML(req.body.curuser);

  let condition = authCheck(curuser);
  if (condition == false) {
    res.send("please stop trying to hack our system");
    return;
  }

  //mysql
  let sql = `update dependants set balance = balance + ${balance} where id = ${id};`;
  connection.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    }
    if (result.affectedRows <= 0) res.send({ message: "failure" });
    else {
      res.send({ message: "success" });
      let sql1 = `select firstName, lastName, dateOfBirth from dependants where id = "${id}";`;
      connection.query(sql1, (err, result) => {
        if (err) {
          console.log(err);
          res.sendStatus(500);
        }
        let firstName = result[0].firstName;
        let lastName = result[0].lastName;
        let dateOfBirth = result[0].dateOfBirth;

        let sqlTransaction = `insert into transactions(date, time, currentWeek, currentYear, dependant, admin, amount_to_admin, transactionType, livraison, depannage, christmasBasket) values(now(), now(), week(now()), year(now()), "${lastName}, ${firstName} (${dateOfBirth})", "${curuser}", ${balance}, "changed balance", "", "", "");`;
        connection.query(sqlTransaction, (err, result) => {
          if (err) {
            console.log(err);
            res.sendStatus(500);
          }
        });
      });
    }
  });
};

export default { modify_dependant, renew_card, change_balance };
