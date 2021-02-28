/*
 * Copyright (C) 2021 Alix Routhier-Lalonde
 * This file is subject to the terms and conditions defined in
 * file "LICENSE.txt", which is part of this source code package.
 */

import { escapeHTML } from "./helper/helper.js";
import connection from "../sql.js";

//========== SEARCH DEPENDANT BY FIRSTNAME, LASTNAME AND DATE OF BIRTH ==========//

const crm = (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  let firstName = escapeHTML(req.body.firstName);
  let lastName = escapeHTML(req.body.lastName);
  let dateOfBirth = escapeHTML(req.body.dateOfBirth);

  //mysql
  let sql1 = `select distinct id, residencyProofStatus, studentStatus from dependants where firstName = "${firstName}" and lastName = "${lastName}" and dateOfBirth = "${dateOfBirth}";`;
  connection.query(sql1, (err, result) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    }
    if (result[0] == null)
      res.send({
        message: "not there",
      });
    else {
      let residencyProofStatus = result[0].residencyProofStatus;
      let studentStatus = result[0].studentStatus;
      let sql2 = `select id from transactions where currentWeek = week(now()) and currentYear = year(now()) and dependant = "${lastName}, ${firstName} (${dateOfBirth})" and transactionType = "add basket"`;
      connection.query(sql2, (err, result) => {
        if (err) {
          console.log(err);
          res.sendStatus(500);
        }
        res.send({
          message: "success",
          numberOfBaskets: result.length,
          residencyProofStatus: residencyProofStatus,
          studentStatus: studentStatus,
        });
      });
    }
  });
};

//========== SEARCH DEPENDANT BY ID ==========//

const crm_ID = (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  let id = req.body.id;

  //mysql
  let sql = `select distinct firstName, lastName, dateOfBirth, residencyProofStatus, studentStatus from dependants where id = ${id};`;
  connection.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    }
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
        if (err) {
          console.log(err);
          res.sendStatus(500);
        }
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
};

//========== SEARCH DEPENDANT ==========//

const search_dependant = (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  let firstName = escapeHTML(req.body.firstName);
  let lastName = escapeHTML(req.body.lastName);
  let dateOfBirth = escapeHTML(req.body.dateOfBirth);

  //mysql
  let sql = `select distinct id, sex, studentStatus, memberStatus, volunteerStatus, email, homePhoneNumber, cellphoneNumber, homeNumber, homeStreet, appartmentNumber, appartmentLevel, homeEntryCode, homePostalCode, residencyProofStatus, typeOfHouse, sourceOfRevenue, familyComposition, numberOfOtherFamilyMembers, DOBfamilyMember1, DOBfamilyMember2, DOBfamilyMember3, DOBfamilyMember4, DOBfamilyMember5, DOBfamilyMember6, DOBfamilyMember7, DOBfamilyMember8, DOBfamilyMember9, DOBfamilyMember10, DOBfamilyMember11, DOBfamilyMember12, DOBfamilyMember13, DOBfamilyMember14, DOBfamilyMember15, DOBfamilyMember16, DOBfamilyMember17, DOBfamilyMember18, DOBfamilyMember19, sourceOrganismName, socialWorkerNameOrganism, socialWorkerPhoneNumberOrganism, socialWorkerPostOrganism, curatelName, socialWorkerNameCuratel, socialWorkerPhoneNumberCuratel, socialWorkerPostCuratel, registrationDate, lastRenewment, expirationDate, balance from dependants where firstName = "${firstName}" and lastName = "${lastName}" and dateOfBirth = "${dateOfBirth}";`;
  connection.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    }
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
};

export default { crm, crm_ID, search_dependant };
