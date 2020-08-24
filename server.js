#!/usr/bin node

/*
 * Copyright (C) 2020 Alix Routhier-Lalonde
 * This file is subject to the terms and conditions defined in
 * file "LICENSE.txt", which is part of this source code package.
 */

const express = require("express");
const cors = require("cors");
const bodyparser = require("body-parser");
const mysql = require("mysql");
const crypto = require("crypto");
const fs = require("fs");
const { exec } = require("child_process");

const app = express();

//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//initiating mysql

const connection = mysql.createConnection({
  host: "localhost",
  user: "admin",
  password: "EszPh3pK$%",
  database: "meettheneed",
  multipleStatements: true,
  //TODO THIS IS TO CHANGE FOR YOUR MYSQL DATABASE
});

connection.connect((err) => {
  if (err) {
    console.log(err);
  } else console.log("Database connected");
});

//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//middleware

app.use(express.static("./meettheneed/build"));

app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(bodyparser.json());
app.use(
  bodyparser.urlencoded({
    extended: true,
  })
);
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//processing requests

//browser request for the web app
app.get("/", (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  res.sendFile("index.html", { root: "./meettheneed/build" });
});

//authentification api
app.post("/api/login", (req, res) => {
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
    if (err) throw err;
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
});

//change password api
app.post("/api/changepassword", (req, res) => {
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
    if (err) throw err;
    if (result.changedRows === 0) {
      res.send("old password incorrect");
      console.log(`admin password change failed (${ip})`);
    } else {
      res.send("success");
      console.log(`admin password change succeded (${ip})`);
    }
  });
});

//add administrator api
app.post("/api/addadministrator", (req, res) => {
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
    if (err) throw err;
    0;
    if (result[0] != null) {
      res.send("username taken");
    } else {
      connection.query(sqladd, (err, result) => {
        if (err) throw err;
        if (result.affectedRows <= 0) {
          res.send("authentification failed");
        } else {
          res.send("success");
          console.log(`new admin: ${username} (${ip})`);
          let sqlTransaction = `insert into transactions(date, time, currentWeek, currentYear, dependant, admin, amount_to_admin, transactionType, livraison, depannage, christmasBasket) values(now(), now(), week(now()), year(now()), "${username}", "${curuser}", ${0}, "add admin", "", "", "");`;
          connection.query(sqlTransaction, (err, result) => {
            if (err) throw err;
          });
        }
      });
    }
  });
});

//giving all admnistrators api
app.post("/api/alladministrators", (req, res) => {
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
    if (err) throw err;
    console.log(`admins query (${ip})`);
    res.send(result);
  });
});

//removing an administrator api
app.post("/api/removeadministrator", (req, res) => {
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
    if (err) throw err;
    if (result.affectedRows <= 0) res.send("failure");
    else {
      res.send("success");
      console.log(`admin ${username} removed (${ip})`);
      let sqlTransaction = `insert into transactions(date, time, currentWeek, currentYear, dependant, admin, amount_to_admin, transactionType, livraison, depannage, christmasBasket) values(now(), now(), week(now()), year(now()), "${username}", "${curuser}", ${0}, "remove admin", "", "", "");`;
      connection.query(sqlTransaction, (err, result) => {
        if (err) throw err;
      });
    }
  });
});

//add a dependant api
app.post("/api/adddependant", (req, res) => {
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
    if (err) throw err;
    if (result[0] == null) throw console.error();
    let price = result[0].priceMembership;
    connection.query(sqlcheck, (err, result) => {
      if (err) throw err;
      if (result[0] != null) {
        res.send({ message: "already in database" });
      } else {
        let sqladd = `insert into dependants (firstName, lastName, dateOfBirth, sex, studentStatus, memberStatus, volunteerStatus, email, homePhoneNumber, cellphoneNumber, homeNumber, homeStreet, appartmentNumber, appartmentLevel, homeEntryCode, homePostalCode, residencyProofStatus, typeOfHouse, sourceOfRevenue, familyComposition, numberOfOtherFamilyMembers, DOBfamilyMember1, DOBfamilyMember2, DOBfamilyMember3, DOBfamilyMember4, DOBfamilyMember5, DOBfamilyMember6, DOBfamilyMember7, DOBfamilyMember8, DOBfamilyMember9, DOBfamilyMember10, DOBfamilyMember11, DOBfamilyMember12, DOBfamilyMember13, DOBfamilyMember14, DOBfamilyMember15, DOBfamilyMember16, DOBfamilyMember17, DOBfamilyMember18, DOBfamilyMember19, sourceOrganismName, socialWorkerNameOrganism, socialWorkerPhoneNumberOrganism, socialWorkerPostOrganism, curatelName, socialWorkerNameCuratel, socialWorkerPhoneNumberCuratel, socialWorkerPostCuratel, registrationDate, lastRenewment, expirationDate, balance) values ("${firstName}", "${lastName}", "${dateOfBirth}",  "${sex}", "${studentStatus}", "${memberStatus}", "${volunteerStatus}", "${email}", "${homePhoneNumber}", "${cellphoneNumber}", ${homeNumber}, "${homeStreet}", "${appartmentNumber}", "${appartmentLevel}", "${homeEntryCode}", "${homePostalCode}", "${residencyProofStatus}", "${typeOfHouse}", "${sourceOfRevenue}", "${familyComposition}", "${numberOfOtherFamilyMembers}", "${DOBfamilyMember1}", "${DOBfamilyMember2}", "${DOBfamilyMember3}", "${DOBfamilyMember4}", "${DOBfamilyMember5}", "${DOBfamilyMember6}", "${DOBfamilyMember7}", "${DOBfamilyMember8}", "${DOBfamilyMember9}", "${DOBfamilyMember10}", "${DOBfamilyMember11}", "${DOBfamilyMember12}", "${DOBfamilyMember13}", "${DOBfamilyMember14}", "${DOBfamilyMember15}", "${DOBfamilyMember16}", "${DOBfamilyMember17}", "${DOBfamilyMember18}", "${DOBfamilyMember19}", "${sourceOrganismName}", "${socialWorkerNameOrganism}", "${socialWorkerPhoneNumberOrganism}", ${socialWorkerPostOrganism}, "${curatelName}", "${socialWorkerNameCuratel}", "${socialWorkerPhoneNumberCuratel}", ${socialWorkerPostCuratel}, now(), now(), date_add(now(), INTERVAL 1 year), ${
          balance - price
        });`;
        connection.query(sqladd, (err, result) => {
          if (err) throw err;
          if (result.affectedRows === 0)
            res.send({ message: "problem with system" });
          else {
            connection.query(sqlid, (err, result) => {
              if (err) throw err;
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
                  if (err) throw err;
                });
              }
            });
          }
        });
      }
    });
  });
});

//give all dependants api
app.post("/api/alldependants", (req, res) => {
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
    if (err) throw err;
    res.send(result);
  });
});

//remove a dependant api
app.post("/api/removedependant", (req, res) => {
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
    if (err) throw err;
    if (result.affectedRows <= 0) res.send("failure");
    else {
      res.send("success");

      let sqlTransaction = `insert into transactions(date, time, currentWeek, currentYear, dependant, admin, amount_to_admin, transactionType, livraison, depannage, christmasBasket) values(now(), now(), week(now()), year(now()), "${lastName}, ${firstName} (${dateOfBirth})", "${curuser}", ${0}, "remove dependant", "", "", "");`;
      connection.query(sqlTransaction, (err, result) => {
        if (err) throw err;
      });
    }
  });
});

//remove a dependant by id api
app.post("/api/removedependantid", (req, res) => {
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
    if (err) throw err;
    if (result[0] == null) res.send("failure");
    let firstName = result[0].firstName;
    let lastName = result[0].lastName;
    let dateOfBirth = result[0].dateOfBirth;
    let sql = `DELETE FROM dependants WHERE id = ${id};`;
    connection.query(sql, (err, result) => {
      if (err) throw err;
      if (result.affectedRows <= 0) res.send("failure");
      else {
        res.send("success");
        let sqlTransaction = `insert into transactions(date, time, currentWeek, currentYear, dependant, admin, amount_to_admin, transactionType, livraison, depannage, christmasBasket) values(now(), now(), week(now()), year(now()), "${lastName}, ${firstName} (${dateOfBirth})", "${curuser}", ${0}, "remove dependant", "", "", "");`;
        connection.query(sqlTransaction, (err, result) => {
          if (err) throw err;
        });
      }
    });
  });
});

//search for a dependant api by firstname, lastname, date of birth
app.post("/api/crm", (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  let firstName = escapeHTML(req.body.firstName);
  let lastName = escapeHTML(req.body.lastName);
  let dateOfBirth = escapeHTML(req.body.dateOfBirth);

  //mysql
  let sql1 = `select distinct id, residencyProofStatus, studentStatus from dependants where firstName = "${firstName}" and lastName = "${lastName}" and dateOfBirth = "${dateOfBirth}";`;
  connection.query(sql1, (err, result) => {
    if (err) throw err;
    if (result[0] == null)
      res.send({
        message: "not there",
      });
    else {
      let residencyProofStatus = result[0].residencyProofStatus;
      let studentStatus = result[0].studentStatus;
      let sql2 = `select id from transactions where currentWeek = week(now()) and currentYear = year(now()) and dependant = "${lastName}, ${firstName} (${dateOfBirth})" and transactionType = "add basket"`;
      connection.query(sql2, (err, result) => {
        if (err) throw err;
        res.send({
          message: "success",
          numberOfBaskets: result.length,
          residencyProofStatus: residencyProofStatus,
          studentStatus: studentStatus,
        });
      });
    }
  });
});

//search for a dependant api by id
app.post("/api/crmid", (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  let id = req.body.id;

  //mysql
  let sql = `select distinct firstName, lastName, dateOfBirth, residencyProofStatus, studentStatus from dependants where id = ${id};`;
  connection.query(sql, (err, result) => {
    if (err) throw err;
    if (result[0] == null)
      res.send({
        message: "not there",
      });
    else {
      let firstName = result[0].firstName;
      let lastName = result[0].lastName;
      let dateOfBirth = result[0].dateOfBirth;
      let residencyProofStatus = result[0].residencyProofStatus;
      let studentStatus = result[0].studentStatus;
      id = result[0].id;
      let sql2 = `select id from transactions where currentWeek = week(now()) and currentYear = year(now()) and dependant = "${lastName}, ${firstName} (${dateOfBirth})" and transactionType = "add basket"`;
      connection.query(sql2, (err, result) => {
        if (err) throw err;
        res.send({
          message: "success",
          numberOfBaskets: result.length,
          firstName: firstName,
          lastName: lastName,
          dateOfBirth: dateOfBirth,
          residencyProofStatus: residencyProofStatus,
          studentStatus: studentStatus,
        });
      });
    }
  });
});

//search a dependant api
app.post("/api/searchdependant", (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  let firstName = escapeHTML(req.body.firstName);
  let lastName = escapeHTML(req.body.lastName);
  let dateOfBirth = escapeHTML(req.body.dateOfBirth);

  //mysql
  let sql = `select distinct id, sex, studentStatus, memberStatus, volunteerStatus, email, homePhoneNumber, cellphoneNumber, homeNumber, homeStreet, appartmentNumber, appartmentLevel, homeEntryCode, homePostalCode, residencyProofStatus, typeOfHouse, sourceOfRevenue, familyComposition, numberOfOtherFamilyMembers, DOBfamilyMember1, DOBfamilyMember2, DOBfamilyMember3, DOBfamilyMember4, DOBfamilyMember5, DOBfamilyMember6, DOBfamilyMember7, DOBfamilyMember8, DOBfamilyMember9, DOBfamilyMember10, DOBfamilyMember11, DOBfamilyMember12, DOBfamilyMember13, DOBfamilyMember14, DOBfamilyMember15, DOBfamilyMember16, DOBfamilyMember17, DOBfamilyMember18, DOBfamilyMember19, sourceOrganismName, socialWorkerNameOrganism, socialWorkerPhoneNumberOrganism, socialWorkerPostOrganism, curatelName, socialWorkerNameCuratel, socialWorkerPhoneNumberCuratel, socialWorkerPostCuratel, registrationDate, lastRenewment, expirationDate, balance from dependants where firstName = "${firstName}" and lastName = "${lastName}" and dateOfBirth = "${dateOfBirth}";`;
  connection.query(sql, (err, result) => {
    if (err) throw err;
    if (result[0] == null)
      res.send({
        message: "not there",
        id: 0,
      });
    else {
      values = result[0];
      values.message = "success";
      values.registrationDate = `${values.registrationDate}`;
      values.lastRenewment = `${values.lastRenewment}`;
      values.expirationDate = `${values.expirationDate}`;
      res.send(values);
    }
  });
});

app.post("/api/modifydependant", (req, res) => {
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
    if (err) throw err;
    if (result.affectedRows <= 0) res.send({ message: "failure" });
    else {
      res.send({ message: "success" });
      let sql1 = `select firstName, lastName, dateOfBirth from dependants where id = "${id}";`;
      connection.query(sql1, (err, result) => {
        if (err) throw err;
        let firstName = result[0].firstName;
        let lastName = result[0].lastName;
        let dateOfBirth = result[0].dateOfBirth;

        let sqlTransaction = `insert into transactions(date, time, currentWeek, currentYear, dependant, admin, amount_to_admin, transactionType, livraison, depannage, christmasBasket) values(now(), now(), week(now()), year(now()), "${lastName}, ${firstName} (${dateOfBirth})", "${curuser}", ${0}, "change dependant info", "", "", "");`;
        connection.query(sqlTransaction, (err, result) => {
          if (err) throw err;
        });
      });
    }
  });
});

app.post("/api/renewcard", (req, res) => {
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
    if (err) throw err;
    if (result[0] == null) throw console.error();
    price = result[0].priceMembership;
    let sql = `update dependants set balance = balance + ${
      balance - price
    }, lastRenewment = now(), expirationDate = date_add(now(), INTERVAL 1 year) where id = ${id};`;
    connection.query(sql, (err, result) => {
      if (err) throw err;
      if (result.affectedRows <= 0) res.send({ message: "failure" });
      else {
        res.send({ message: "success" });
        let sql1 = `select firstName, lastName, dateOfBirth from dependants where id = "${id}";`;
        connection.query(sql1, (err, result) => {
          if (err) throw err;
          let firstName = result[0].firstName;
          let lastName = result[0].lastName;
          let dateOfBirth = result[0].dateOfBirth;

          let sqlTransaction = `insert into transactions(date, time, currentWeek, currentYear, dependant, admin, amount_to_admin, transactionType, livraison, depannage, christmasBasket) values(now(), now(), week(now()), year(now()), "${lastName}, ${firstName} (${dateOfBirth})", "${curuser}", ${balance}, "card renewed", "", "", "");`;
          connection.query(sqlTransaction, (err, result) => {
            if (err) throw err;
          });
        });
      }
    });
  });
});

app.post("/api/debt", (req, res) => {
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
    if (err) throw err;
    if (result.affectedRows <= 0) res.send({ message: "failure" });
    else {
      res.send({ message: "success" });
      let sql1 = `select firstName, lastName, dateOfBirth from dependants where id = "${id}";`;
      connection.query(sql1, (err, result) => {
        if (err) throw err;
        let firstName = result[0].firstName;
        let lastName = result[0].lastName;
        let dateOfBirth = result[0].dateOfBirth;

        let sqlTransaction = `insert into transactions(date, time, currentWeek, currentYear, dependant, admin, amount_to_admin, transactionType, livraison, depannage, christmasBasket) values(now(), now(), week(now()), year(now()), "${lastName}, ${firstName} (${dateOfBirth})", "${curuser}", ${balance}, "changed balance", "", "", "");`;
        connection.query(sqlTransaction, (err, result) => {
          if (err) throw err;
        });
      });
    }
  });
});

//add a basket api
app.post("/api/addbasket", (req, res) => {
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

  //change this here

  //mysql

  sql3 = "select * from variables where id = 1;";
  connection.query(sql3, (err, result) => {
    if (err) throw err;
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
      if (err) throw err;
      if (result.affectedRows <= 0) {
        res.send({ message: "failure" });
        return;
      } else {
        let sql3 = `select homeNumber, homeStreet, appartmentNumber, appartmentLevel, homePostalCode, homeEntryCode from dependants where firstName = "${firstName}" and lastName = "${lastName}" and dateOfBirth = "${dateOfBirth}";`;
        connection.query(sql3, (err, result) => {
          if (err) throw err;
          if (result[0] == null) res.send("failure");
          else {
            let homeNumber = result[0].homeNumber;
            let homeStreet = result[0].homeStreet;
            let appartmentNumber = result[0].appartmentNumber;
            let appartmentLevel = result[0].appartmentLevel;
            let homePostalCode = result[0].homePostalCode;
            let homeEntryCode = result[0].homeEntryCode;

            let address = `Numéro de porte: ${homeNumber}, Nom de rue: ${homeStreet}, Numéro d'appartement: ${appartmentNumber}, Niveau de l'appartement: ${appartmentLevel}, Code postal: ${homePostalCode}, Code d'entrée: ${homeEntryCode}`;
            let sql2 = `insert into transactions(date, time, currentWeek, currentYear, dependant, amount_to_admin, transactionType, livraison, depannage, christmasBasket, address) values(now(), now(), week(now()), year(now()), "${lastName}, ${firstName} (${dateOfBirth})", ${balance}, "add basket", "${livraison}", "${depannage}", "${christmasBasket}", "${address}");`;
            connection.query(sql2, (err, result) => {
              if (err) throw err;
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
});

app.post("/api/alllivraisons", (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  let curuser = escapeHTML(req.body.curuser);

  let condition = authCheck(curuser);
  if (condition == false) {
    res.send("please stop trying to hack our system");
    return;
  }

  let sql = `select * from transactions where livraison = "true" and transactionType = "add basket";`;
  connection.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

app.post("/api/allprices", (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  let curuser = escapeHTML(req.body.curuser);

  let condition = authCheck(curuser);
  if (condition == false) {
    res.send("please stop trying to hack our system");
    return;
  }

  sql3 = "select * from variables where id = 1;";
  connection.query(sql3, (err, result) => {
    if (err) throw err;
    if (result[0] == null) throw console.error();
    res.send(result[0]);
  });
});

app.post("/api/completelivraison", (req, res) => {
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
    if (err) throw err;
    if (result.affectedRows <= 0) res.send("failure");
    else res.send("success");
  });
});

app.post("/api/changeprices", (req, res) => {
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
      sql2 = `insert into transactions(date, time, currentWeek, currentYear, admin, amount_to_admin, transactionType, livraison, depannage, christmasBasket) values(now(), now(), week(now()), year(now()),  "${curuser}", ${0}, "changed prices", "", "", "");`;
      connection.query(sql2, (err, result) => {
        if (err) throw err;
        console.log(`prices change (${ip})`);
      });
    }
  });
});

app.post("/api/yearlyreport", (req, res) => {
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
  const sql = `SELECT date, time, dependant, admin, amount_to_admin, transactionType, livraison, depannage, christmasBasket FROM transactions where currentYear = ${year} INTO OUTFILE "/var/lib/mysql/mysql/report.csv" FIELDS TERMINATED BY "," ENCLOSED BY "'" LINES TERMINATED BY "\n";`;
  connection.query(sql, (err) => {
    if (err) throw err;
    console.log(`yearly report query (${ip})`);
    res.sendFile("/var/lib/mysql/mysql/report.csv");
  });
});

app.post("/api/weeklyreport", (req, res) => {
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
  const sql = `SELECT date, time, dependant, admin, amount_to_admin, transactionType, livraison, depannage, christmasBasket FROM transactions where currentWeek = ${week} INTO OUTFILE "/var/lib/mysql/mysql/report.csv" FIELDS TERMINATED BY "," ENCLOSED BY "'" LINES TERMINATED BY "\n";`;
  connection.query(sql, (err) => {
    if (err) throw err;
    console.log(`weekly report query (${ip})`);
    res.sendFile("/var/lib/mysql/mysql/report.csv");
  });
});

app.post("/api/dailyreport", (req, res) => {
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
  const sql = `SELECT date, time, dependant, admin, amount_to_admin, transactionType, livraison, depannage, christmasBasket FROM transactions where date = "${day}" INTO OUTFILE "/var/lib/mysql/mysql/report.csv" FIELDS TERMINATED BY "," ENCLOSED BY "'" LINES TERMINATED BY "\n";`;
  connection.query(sql, (err) => {
    if (err) throw err;
    res.sendFile("/var/lib/mysql/mysql/report.csv");
    console.log(`daily report query (${ip})`);
  });
});

app.post("/api/alltransactions", (req, res) => {
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
    if (err) throw err;
    res.send(result);
  });
});

app.post("/api/removetransaction", (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const curuser = escapeHTML(req.body.curuser);
  const id = req.body.id;
  const balance = req.body.balance;
  const dependant = escapeHTML(req.body.dependant);
  let livraison = req.body.livraison;
  let depannage = req.body.depannage;
  let christmasBasket = req.body.christmasBasket;
  if (livraison === "true") livraison = true;
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
    if (err) throw err;
    if (result.affectedRows <= 0) res.send("failure");
    else {
      res.send("success");
      sql3 = "select * from variables where id = 1;";
      connection.query(sql3, (err, result) => {
        if (err) throw err;
        if (result[0] == null) throw console.error();
        variables = result[0];
        let price = choose(depannage, livraison, christmasBasket, variables);

        let sqlquery = `update dependants set balance = balance - ${
          balance - price
        } where firstName = "${firstName}" and lastName = "${lastName}" and dateOfBirth = "${dateOfBirth}";`;
        connection.query(sqlquery, (err, result) => {
          if (err) throw err;
          if (result.affectedRows <= 0) throw console.error();
          console.log(`removed a transaction (${ip})`);
        });
      });
    }
  });
});

//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//support functions

const authCheck = (username) => {
  let sqlcheck = `select * from admins where username = "${username}";`;
  connection.query(sqlcheck, (err, result) => {
    if (err) throw err;
    if (result[0] != null) {
      return true;
    } else return false;
  });
};

function validateEmail(email) {
  let re = /^(?:[a-z0-9!#$%&amp;"*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&amp;"*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;

  return re.test(email);
}

function escapeHTML(unsafe_str) {
  return unsafe_str
    .replace(/</g, "")
    .replace(/>/g, "")
    .replace(/`/g, "'")
    .replace(/{/g, "")
    .replace(/}/g, "")
    .replace(/;/g, "");
}

const choose = (depannage, livraison, christmasBasket, variables) => {
  if (livraison == false && depannage == false && christmasBasket == false)
    return variables.priceBasket;
  else if (livraison == true && depannage == false && christmasBasket == false)
    return variables.priceBasketLivraison;
  else if (livraison == false && depannage == true && christmasBasket == false)
    return variables.priceBasketDepannage;
  else if (livraison == false && depannage == false && christmasBasket == true)
    return variables.priceBasketChristmas;
  else if (livraison == true && depannage == true && christmasBasket == false)
    return variables.priceBasketDepannageLivraison;
  else if (livraison == false && depannage == true && christmasBasket == true)
    return variables.priceBasketDepannageChristmas;
  else if (livraison == true && depannage == false && christmasBasket == true)
    return variables.priceBasketLivraisonChristmas;
  else if (livraison == true && depannage == true && christmasBasket == true)
    return variables.priceBasketDepannageLivraisonChristmas;
};

//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//starting server

const PORT = 8000;

app.listen(PORT, () => console.log(`Server Running on port ${PORT}`));
