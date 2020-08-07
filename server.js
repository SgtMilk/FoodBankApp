#!/usr/bin node

/*
 * Copyright (C) 2020 Alix Routhier-Lalonde
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

const express = require("express");
const cors = require("cors");
const bodyparser = require("body-parser");
const mysql = require("mysql");
const crypto = require("crypto");

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
  res.sendFile("index.html", { root: "./meettheneed/build" });
});

//authentification api
app.post("/api/login", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  if (username.length > 45 || password.length > 45) {
    res.send({
      message: "please stop trying to hack our system",
      username: undefined,
    });
    return;
  }

  let hashed_password = crypto.createHmac("sha256", password).digest("hex");

  //mysql
  let sqlcheck = `select distinct username from admins where username = '${username}' and password = '${hashed_password}';`;
  connection.query(sqlcheck, (err, result) => {
    if (err) throw err;
    if (result[0] != null) {
      res.send({
        message: "authentification succeded",
        username,
      });
      console.log("login: " + username);
      return;
    } else
      res.send({
        message: "authentification failed",
        username: undefined,
      });
    console.log("bad authentification");
  });
});

//change password api
app.post("/api/changepassword", (req, res) => {
  console.log("beep");
  let username = req.body.username;
  let oldPassword = req.body.oldPassword;
  let newPassword = req.body.newPassword;
  let curuser = req.body.curuser;

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
  let sqlchange = `UPDATE admins SET password = '${new_hashed_password}' WHERE username = '${username}' and password = '${old_hashed_password}';`;
  connection.query(sqlchange, (err, result) => {
    if (err) throw err;
    if (result.changedRows === 0) {
      res.send("old password incorrect");
      console.log("admin password change failed");
    } else {
      res.send("success");
      console.log("admin password change succeded");
    }
  });
});

//add administrator api
app.post("/api/addadministrator", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  let curuser = req.body.curuser;

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
  let sqlcheck = `select distinct username from admins where username = '${username}';`;
  let sqladd = `insert into admins(username, password) values('${username}', '${hashed_password}');`;
  connection.query(sqlcheck, (err, result) => {
    if (err) throw err;
    if (result[0] != null) {
      console.log(
        `new admin: username ${username} already taken -- no new account created`
      );
      res.send("username taken");
    } else {
      connection.query(sqladd, (err, result) => {
        if (err) throw err;
        if (result.affectedRows <= 0) {
          res.send("authentification failed");
          console.log("problem with system");
        } else {
          res.send("success");
          console.log(`new admin: ${username}`);
        }
      });
    }
  });
});

//giving all admnistrators api
app.post("/api/alladministrators", (req, res) => {
  let curuser = req.body.curuser;

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
    console.log("admins query");
    res.send(result);
  });
});

//removing an administrator api
app.post("/api/removeadministrator", (req, res) => {
  let username = req.body.username;
  let curuser = req.body.curuser;

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
  let sql = `DELETE FROM admins WHERE username = '${username}';`;
  connection.query(sql, (err, result) => {
    if (err) throw err;
    if (result.affectedRows <= 0) res.send("failure");
    else res.send("success");
  });
});

//add a dependant api
app.post("/api/adddependant", (req, res) => {
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let dateOfBirth = req.body.dateOfBirth;
  let sex = req.body.sex;
  let studentStatus = req.body.studentStatus;
  let memberStatus = req.body.memberStatus;
  let volunteerStatus = req.body.volunteerStatus;
  let email = req.body.email;
  let homePhoneNumber = req.body.homePhoneNumber;
  let cellphoneNumber = req.body.cellphoneNumber;
  let homeNumber = req.body.homeNumber;
  let homeStreet = req.body.homeStreet;
  let appartmentNumber = req.body.appartmentNumber;
  let appartmentLevel = req.body.appartmentLevel;
  let homeEntryCode = req.body.homeEntryCode;
  let homePostalCode = req.body.homePostalCode;
  let residencyProofStatus = req.body.residencyProofStatus;
  let typeOfHouse = req.body.typeOfHouse;
  let sourceOfRevenue = req.body.sourceOfRevenue;
  let familyComposition = req.body.familyComposition;
  let numberOfOtherFamilyMembers = req.body.numberOfOtherFamilyMembers;
  let DOBfamilyMember1 = req.body.DOBfamilyMember1;
  let DOBfamilyMember2 = req.body.DOBfamilyMember2;
  let DOBfamilyMember3 = req.body.DOBfamilyMember3;
  let DOBfamilyMember4 = req.body.DOBfamilyMember4;
  let DOBfamilyMember5 = req.body.DOBfamilyMember5;
  let DOBfamilyMember6 = req.body.DOBfamilyMember6;
  let DOBfamilyMember7 = req.body.DOBfamilyMember7;
  let DOBfamilyMember8 = req.body.DOBfamilyMember8;
  let DOBfamilyMember9 = req.body.DOBfamilyMember9;
  let DOBfamilyMember10 = req.body.DOBfamilyMember10;
  let DOBfamilyMember11 = req.body.DOBfamilyMember11;
  let DOBfamilyMember12 = req.body.DOBfamilyMember12;
  let DOBfamilyMember13 = req.body.DOBfamilyMember13;
  let DOBfamilyMember14 = req.body.DOBfamilyMember14;
  let DOBfamilyMember15 = req.body.DOBfamilyMember15;
  let DOBfamilyMember16 = req.body.DOBfamilyMember16;
  let DOBfamilyMember17 = req.body.DOBfamilyMember17;
  let DOBfamilyMember18 = req.body.DOBfamilyMember18;
  let DOBfamilyMember19 = req.body.DOBfamilyMember19;
  let sourceOrganismName = req.body.sourceOrganismName;
  let socialWorkerNameOrganism = req.body.socialWorkerNameOrganism;
  let socialWorkerPhoneNumberOrganism =
    req.body.socialWorkerPhoneNumberOrganism;
  let socialWorkerPostOrganism = req.body.socialWorkerPostOrganism;
  let curatelName = req.body.curatelName;
  let socialWorkerNameCuratel = req.body.socialWorkerNameCuratel;
  let socialWorkerPhoneNumberCuratel = req.body.socialWorkerPhoneNumberCuratel;
  let socialWorkerPostCuratel = req.body.socialWorkerPostCuratel;
  let balance = req.body.balance;
  let curuser = req.body.curuser;

  let allParameters = [
    firstName,
    lastName,
    dateOfBirth,
    sex,
    studentStatus,
    memberStatus,
    volunteerStatus,
    email,
    homePhoneNumber,
    cellphoneNumber,
    homeNumber,
    homeStreet,
    appartmentNumber,
    appartmentLevel,
    homeEntryCode,
    homePostalCode,
    residencyProofStatus,
    typeOfHouse,
    sourceOfRevenue,
    familyComposition,
    numberOfOtherFamilyMembers,
    DOBfamilyMember1,
    DOBfamilyMember2,
    DOBfamilyMember3,
    DOBfamilyMember4,
    DOBfamilyMember5,
    DOBfamilyMember6,
    DOBfamilyMember7,
    DOBfamilyMember8,
    DOBfamilyMember9,
    DOBfamilyMember10,
    DOBfamilyMember11,
    DOBfamilyMember12,
    DOBfamilyMember13,
    DOBfamilyMember14,
    DOBfamilyMember15,
    DOBfamilyMember16,
    DOBfamilyMember17,
    DOBfamilyMember18,
    DOBfamilyMember19,
    sourceOrganismName,
    socialWorkerNameOrganism,
    socialWorkerPhoneNumberOrganism,
    socialWorkerPostOrganism,
    curatelName,
    socialWorkerNameCuratel,
    socialWorkerPhoneNumberCuratel,
    socialWorkerPostCuratel,
    balance,
    curuser,
  ];

  checkXXS(allParameters);

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
  let sqlcheck = `select distinct firstName from dependants where firstName = '${firstName}' and lastName = '${lastName}' and dateOfBirth = '${dateOfBirth}';`;
  let sqladd = `insert into dependants (firstName, lastName, dateOfBirth, sex, studentStatus, memberStatus, volunteerStatus, email, homePhoneNumber, cellphoneNumber, homeNumber, homeStreet, appartmentNumber, appartmentLevel, homeEntryCode, homePostalCode, residencyProofStatus, typeOfHouse, sourceOfRevenue, familyComposition, numberOfOtherFamilyMembers, DOBfamilyMember1, DOBfamilyMember2, DOBfamilyMember3, DOBfamilyMember4, DOBfamilyMember5, DOBfamilyMember6, DOBfamilyMember7, DOBfamilyMember8, DOBfamilyMember9, DOBfamilyMember10, DOBfamilyMember11, DOBfamilyMember12, DOBfamilyMember13, DOBfamilyMember14, DOBfamilyMember15, DOBfamilyMember16, DOBfamilyMember17, DOBfamilyMember18, DOBfamilyMember19, sourceOrganismName, socialWorkerNameOrganism, socialWorkerPhoneNumberOrganism, socialWorkerPostOrganism, curatelName, socialWorkerNameCuratel, socialWorkerPhoneNumberCuratel, socialWorkerPostCuratel, registrationDate, lastRenewment, expirationDate, balance) values ("${firstName}", "${lastName}", "${dateOfBirth}",  "${sex}", "${studentStatus}", "${memberStatus}", "${volunteerStatus}", "${email}", "${homePhoneNumber}", "${cellphoneNumber}", ${homeNumber}, "${homeStreet}", "${appartmentNumber}", "${appartmentLevel}", "${homeEntryCode}", "${homePostalCode}", "${residencyProofStatus}", "${typeOfHouse}", "${sourceOfRevenue}", "${familyComposition}", "${numberOfOtherFamilyMembers}", "${DOBfamilyMember1}", "${DOBfamilyMember2}", "${DOBfamilyMember3}", "${DOBfamilyMember4}", "${DOBfamilyMember5}", "${DOBfamilyMember6}", "${DOBfamilyMember7}", "${DOBfamilyMember8}", "${DOBfamilyMember9}", "${DOBfamilyMember10}", "${DOBfamilyMember11}", "${DOBfamilyMember12}", "${DOBfamilyMember13}", "${DOBfamilyMember14}", "${DOBfamilyMember15}", "${DOBfamilyMember16}", "${DOBfamilyMember17}", "${DOBfamilyMember18}", "${DOBfamilyMember19}", "${sourceOrganismName}", "${socialWorkerNameOrganism}", "${socialWorkerPhoneNumberOrganism}", ${socialWorkerPostOrganism}, "${curatelName}", "${socialWorkerNameCuratel}", "${socialWorkerPhoneNumberCuratel}", ${socialWorkerPostCuratel}, now(), now(), date_add(now(), INTERVAL 1 year), ${balance});`;
  let sqlid = `select distinct id from dependants where firstName = '${firstName}' and lastName = '${lastName}' and dateOfBirth = '${dateOfBirth}';`;
  connection.query(sqlcheck, (err, result) => {
    if (err) throw err;
    if (result[0] != null) {
      console.log(
        `new dependant: dependant ${firstName} ${lastName} already taken -- no new account created`
      );
      res.send({ message: "already in database" });
    } else {
      connection.query(sqladd, (err, result) => {
        if (err) throw err;
        if (result.affectedRows === 0)
          res.send({ message: "problem with system" });
        else {
          connection.query(sqlid, (err, result) => {
            if (result[0] == null) res.send({ message: "problem with system" });
            else {
              res.send({
                message: "success",
                id: result[0].id,
                email: email,
              });
            }
          });
        }
      });
    }
  });
});

//give all dependants api
app.post("/api/alldependants", (req, res) => {
  let curuser = req.body.curuser;

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
    console.log("dependants query");
    res.send(result);
  });
});

//remove a dependant api
app.post("/api/removedependant", (req, res) => {
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let dateOfBirth = req.body.dateOfBirth;
  let curuser = req.body.curuser;

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
  let sql = `DELETE FROM dependants WHERE firstName = '${firstName}' and lastName = '${lastName}' and dateOfBirth = '${dateOfBirth}';`;
  connection.query(sql, (err, result) => {
    if (err) throw err;
    if (result.affectedRows <= 0) res.send("failure");
    else res.send("success");
  });
});

//remove a dependant by id api
app.post("/api/removedependantid", (req, res) => {
  let id = req.body.id;
  let curuser = req.body.curuser;

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
  let sql = `DELETE FROM dependants WHERE id = '${id}';`;
  connection.query(sql, (err, result) => {
    if (err) throw err;
    if (result.affectedRows <= 0) res.send("failure");
    else res.send("success");
  });
});

//search for a dependant api by firstname, lastname, date of birth
app.post("/api/crm", (req, res) => {
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let dateOfBirth = req.body.dateOfBirth;

  //mysql
  let sql = `select distinct id, numberOfBaskets from dependants where firstName = '${firstName}' and lastName = '${lastName}' and dateOfBirth = '${dateOfBirth}';`;
  connection.query(sql, (err, result) => {
    if (err) throw err;
    if (result[0] == null)
      res.send({
        message: "not there",
        id: 0,
      });
    else {
      res.send({
        message: "success",
        id: result[0].id,
        numberOfBaskets: result[0].numberOfBaskets,
      });
    }
  });
});

//search for a dependant api by id
app.post("/api/crmid", (req, res) => {
  let id = req.body.id;

  //mysql
  let sql = `select distinct numberOfBaskets, firstName, lastName, dateOfBirth from dependants where id = ${id};`;
  connection.query(sql, (err, result) => {
    if (err) throw err;
    if (result[0] == null)
      res.send({
        message: "not there",
        id: 0,
      });
    else {
      res.send({
        message: "success",
        id: id,
        numberOfBaskets: result[0].numberOfBaskets,
        firstName: result[0].firstName,
        lastName: result[0].lastName,
        dateOfBirth: result[0].dateOfBirth,
      });
    }
  });
});

//search a dependant api
app.post("/api/searchdependant", (req, res) => {
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let dateOfBirth = req.body.dateOfBirth;

  //mysql
  let sql = `select distinct id, numberOfBaskets, email, homeAddress from dependants where firstName = '${firstName}' and lastName = '${lastName}' and dateOfBirth = '${dateOfBirth}';`;
  connection.query(sql, (err, result) => {
    if (err) throw err;
    if (result[0] == null)
      res.send({
        message: "not there",
        id: 0,
      });
    else {
      res.send({
        message: "success",
        id: result[0].id,
        numberOfBaskets: result[0].numberOfBaskets,
        email: result[0].email,
        homeAddress: result[0].homeAddress,
      });
    }
  });
});

//add a basket api
app.post("/api/addbasket", (req, res) => {
  let id = req.body.id;

  //mysql
  let sqlquery = `select distinct numberOfBaskets, id from dependants where id = ${id};`;
  connection.query(sqlquery, (err, result) => {
    if (err) throw err;
    if (result === []) {
      res.send("failed");
      return;
    }
    let numberOfBaskets = result[0].numberOfBaskets + 1;
    if (numberOfBaskets > 3) {
      res.send("failed");
      return;
    }
    let sql = `UPDATE dependants SET numberOfBaskets = ${numberOfBaskets} WHERE id = ${id}`;
    connection.query(sql, (err, result) => {
      if (err) throw err;
      if (result.affectedRows <= 0) res.send("failed");
      else res.send("success");
    });
  });
});

app.post("/api/removebasket", (req, res) => {
  let id = req.body.id;
  let curuser = req.body.curuser;

  //mysql
  let sqlquery = `select distinct numberOfBaskets, id from dependants where id = ${id};`;
  connection.query(sqlquery, (err, result) => {
    if (err) throw err;
    if (result === []) {
      res.send("failed");
      return;
    }
    let numberOfBaskets = result[0].numberOfBaskets - 1;
    if (numberOfBaskets < 0) {
      res.send("failed");
      return;
    }
    let sql = `UPDATE dependants SET numberOfBaskets = ${numberOfBaskets} WHERE id = ${id}`;
    connection.query(sql, (err, result) => {
      if (err) throw err;
      if (result.affectedRows <= 0) res.send("failed");
      else res.send("success");
    });
  });
});

//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//support functions

const authCheck = (username) => {
  let sqlcheck = `select * from admins where username = '${username}';`;
  connection.query(sqlcheck, (err, result) => {
    if (err) throw err;
    if (result[0] != null) {
      return true;
    } else return false;
  });
};

function validateEmail(email) {
  let re = /^(?:[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;

  return re.test(email);
}

function checkXXS(array) {
  for (let i = 0; i < array.length; i++) {
    array[i] = escapeHTML(array[i]);
  }
}

function escapeHTML(unsafe_str) {
  return unsafe_str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//starting server

const PORT = 8000;

app.listen(PORT, () => console.log(`Server Running on port ${PORT}`));
