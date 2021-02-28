/*
 * Copyright (C) 2021 Alix Routhier-Lalonde
 * This file is subject to the terms and conditions defined in
 * file "LICENSE.txt", which is part of this source code package.
 */

import { authCheck, validateEmail, escapeHTML } from "./helper/helper.js";
import connection from "../sql.js";

//========== FUNCTION TO GET ALL DEPENDANTS ==========//

const get_dependants = (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  let curuser = escapeHTML(req.body.curuser);

  if (authCheck(curuser) == false) {
    res.send("please stop trying to hack our system");
    return;
  }
  if (curuser.length > 45) {
    res.send("please stop trying to hack our system");
    return;
  }

  //mysql
  sql = `select firstName, lastName, dateOfBirth from dependants order by lastName;`;
  connection.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    }
    res.send(result);
  });
};

//========== FUNCTION TO ADD A DEPENDANT ==========//

const add_dependant = (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  let firstName = escapeHTML(req.body.firstName);
  let lastName = escapeHTML(req.body.lastName);
  let dateOfBirth = escapeHTML(req.body.dateOfBirth);
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
  let balance = req.body.balance;
  let curuser = escapeHTML(req.body.curuser);

  if (authCheck(curuser) == false) {
    res.send("please stop trying to hack our system");
    return;
  }
  if (email === null || email === undefined || email === "") {
  } else {
    if (validateEmail(email) == false) {
      res.send("invalid email");
      return;
    }
  }
  if (
    socialWorkerPostCuratel === undefined ||
    socialWorkerPostCuratel === null ||
    socialWorkerPostCuratel === ""
  )
    socialWorkerPostCuratel = "NULL";
  if (
    socialWorkerPostOrganism === undefined ||
    socialWorkerPostOrganism === null ||
    socialWorkerPostOrganism === ""
  )
    socialWorkerPostOrganism = "NULL";

  //mysql
  let sqlcheck = `select distinct firstName from dependants where firstName = "${firstName}" and lastName = "${lastName}" and dateOfBirth = "${dateOfBirth}";`;
  let sqlid = `select distinct id from dependants where firstName = "${firstName}" and lastName = "${lastName}" and dateOfBirth = "${dateOfBirth}";`;
  sql3 = "select * from variables where id = 1;";
  connection.query(sql3, (err, result) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    }
    if (result[0] == null) throw console.error();
    let price = result[0].priceMembership;
    const nonmember = (memberStatus) => {
      if (memberStatus === "Non-Membre") return 0;
      else return price;
    };
    price = nonmember(memberStatus);
    connection.query(sqlcheck, (err, result) => {
      if (err) {
        console.log(err);
        res.sendStatus(500);
      }
      if (result[0] != null) {
        res.send({ message: "already in database" });
      } else {
        let sqladd = `insert into dependants (firstName, lastName, dateOfBirth, sex, studentStatus, memberStatus, volunteerStatus, email, homePhoneNumber, cellphoneNumber, homeNumber, homeStreet, appartmentNumber, appartmentLevel, homeEntryCode, homePostalCode, residencyProofStatus, typeOfHouse, sourceOfRevenue, familyComposition, numberOfOtherFamilyMembers, DOBfamilyMember1, DOBfamilyMember2, DOBfamilyMember3, DOBfamilyMember4, DOBfamilyMember5, DOBfamilyMember6, DOBfamilyMember7, DOBfamilyMember8, DOBfamilyMember9, DOBfamilyMember10, DOBfamilyMember11, DOBfamilyMember12, DOBfamilyMember13, DOBfamilyMember14, DOBfamilyMember15, DOBfamilyMember16, DOBfamilyMember17, DOBfamilyMember18, DOBfamilyMember19, sourceOrganismName, socialWorkerNameOrganism, socialWorkerPhoneNumberOrganism, socialWorkerPostOrganism, curatelName, socialWorkerNameCuratel, socialWorkerPhoneNumberCuratel, socialWorkerPostCuratel, registrationDate, lastRenewment, expirationDate, balance) values ("${firstName}", "${lastName}", "${dateOfBirth}",  "${sex}", "${studentStatus}", "${memberStatus}", "${volunteerStatus}", "${email}", "${homePhoneNumber}", "${cellphoneNumber}", ${homeNumber}, "${homeStreet}", "${appartmentNumber}", "${appartmentLevel}", "${homeEntryCode}", "${homePostalCode}", "${residencyProofStatus}", "${typeOfHouse}", "${sourceOfRevenue}", "${familyComposition}", "${numberOfOtherFamilyMembers}", "${DOBfamilyMember1}", "${DOBfamilyMember2}", "${DOBfamilyMember3}", "${DOBfamilyMember4}", "${DOBfamilyMember5}", "${DOBfamilyMember6}", "${DOBfamilyMember7}", "${DOBfamilyMember8}", "${DOBfamilyMember9}", "${DOBfamilyMember10}", "${DOBfamilyMember11}", "${DOBfamilyMember12}", "${DOBfamilyMember13}", "${DOBfamilyMember14}", "${DOBfamilyMember15}", "${DOBfamilyMember16}", "${DOBfamilyMember17}", "${DOBfamilyMember18}", "${DOBfamilyMember19}", "${sourceOrganismName}", "${socialWorkerNameOrganism}", "${socialWorkerPhoneNumberOrganism}", ${socialWorkerPostOrganism}, "${curatelName}", "${socialWorkerNameCuratel}", "${socialWorkerPhoneNumberCuratel}", ${socialWorkerPostCuratel}, now(), now(), date_add(now(), INTERVAL 1 year), ${
          balance - price
        });`;
        connection.query(sqladd, (err, result) => {
          if (err) {
            console.log(err);
            res.sendStatus(500);
          }
          if (result.affectedRows === 0)
            res.send({ message: "problem with system" });
          else {
            connection.query(sqlid, (err, result) => {
              if (err) {
                console.log(err);
                res.sendStatus(500);
              }
              if (result[0] == null)
                res.send({ message: "problem with system" });
              else {
                res.send({
                  message: "success",
                  id: result[0].id,
                  email: email,
                });
                let sqlTransaction = `insert into transactions(date, time, currentWeek, currentYear, dependant, admin, amount_to_admin, transactionType, livraison, depannage, christmasBasket) values(now(), now(), week(now()), year(now()), "${lastName}, ${firstName} (${dateOfBirth})", "${curuser}", ${balance}, "new dependant", "", "", "");`;
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
      }
    });
  });
};

//========== FUNCTION TO DELETE A DEPENDANT ==========//

const delete_dependant = (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  let firstName = escapeHTML(req.body.firstName);
  let lastName = escapeHTML(req.body.lastName);
  let dateOfBirth = escapeHTML(req.body.dateOfBirth);
  let curuser = escapeHTML(req.body.curuser);

  if (
    firstName.length > 45 ||
    curuser.length > 45 ||
    lastName.length > 45 ||
    dateOfBirth.length > 45
  ) {
    res.send("please stop trying to hack our system");
    return;
  }

  let condition = authCheck(curuser);
  if (condition == false) {
    res.send("please stop trying to hack our system");
    return;
  }

  //mysql
  let sql = `DELETE FROM dependants WHERE firstName = "${firstName}" and lastName = "${lastName}" and dateOfBirth = "${dateOfBirth}";`;
  connection.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    }
    if (result.affectedRows <= 0) res.send("failure");
    else {
      res.send("success");

      let sqlTransaction = `insert into transactions(date, time, currentWeek, currentYear, dependant, admin, amount_to_admin, transactionType, livraison, depannage, christmasBasket) values(now(), now(), week(now()), year(now()), "${lastName}, ${firstName} (${dateOfBirth})", "${curuser}", ${0}, "remove dependant", "", "", "");`;
      connection.query(sqlTransaction, (err, result) => {
        if (err) {
          console.log(err);
          res.sendStatus(500);
        }
      });
    }
  });
};

//========== FUNCTION TO DELETE A DEPENDANT BY ID ==========//

const delete_dependant_by_ID = (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  let id = req.body.id;
  let curuser = escapeHTML(req.body.curuser);

  if (curuser.length > 45) {
    res.send("please stop trying to hack our system");
    return;
  }

  let condition = authCheck(curuser);
  if (condition == false) {
    res.send("please stop trying to hack our system");
    return;
  }

  //mysql
  let sql1 = `select firstName, lastName, dateOfBirth from dependants where id = ${id};`;
  connection.query(sql1, (err, result) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    }
    if (result[0] == null) res.send("failure");
    let firstName = result[0].firstName;
    let lastName = result[0].lastName;
    let dateOfBirth = result[0].dateOfBirth;
    let sql = `DELETE FROM dependants WHERE id = ${id};`;
    connection.query(sql, (err, result) => {
      if (err) {
        console.log(err);
        res.sendStatus(500);
      }
      if (result.affectedRows <= 0) res.send("failure");
      else {
        res.send("success");
        let sqlTransaction = `insert into transactions(date, time, currentWeek, currentYear, dependant, admin, amount_to_admin, transactionType, livraison, depannage, christmasBasket) values(now(), now(), week(now()), year(now()), "${lastName}, ${firstName} (${dateOfBirth})", "${curuser}", ${0}, "remove dependant", "", "", "");`;
        connection.query(sqlTransaction, (err, result) => {
          if (err) {
            console.log(err);
            res.sendStatus(500);
          }
        });
      }
    });
  });
};

export default {
  get_dependants,
  add_dependant,
  delete_dependant,
  delete_dependant_by_ID,
};
