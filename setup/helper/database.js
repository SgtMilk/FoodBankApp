/*
 * Copyright (C) 2021 Alix Routhier-Lalonde
 * This file is subject to the terms and conditions defined in
 * file "LICENSE.txt", which is part of this source code package.
 */

import mysql from "mysql";
import fs from "fs";
import crypto from "crypto";

//========== CREATING THE DATABASE PARAMETERS ==========//

let sql_parameters = {
  username: Math.random().toString(16).substr(2, 14),
  password: Math.random().toString(16).substr(2, 14),
  database: Math.random().toString(16).substr(2, 14),
  host: "localhost",
};

const parameters_to_json = JSON.stringify(sql_parameters);
let condition = fs.existsSync("../../backend/constants/mysql.json");
if (condition == false) {
  fs.writeFile("mysql.json", parameters_to_json, (err, result) => {
    if (err) throw err;
  });
} else {
  let data = JSON.parse(fs.readFileSync("../../backend/constants/mysql.json"));
  sql_parameters = data;
}

//========== CREATING THE SERVICE ==========//

let service = `
[Unit]
Description=Service to run administration system
After=network.target
[Service]
ExecStart=sudo /usr/bin/node /home/pi/FoodBankApp/server.js
WorkingDirectory=/home/pi/FoodBankApp
StandardOutput=inherit
StandardError=inherit
Restart=always
User=pi
[Install]
WantedBy=multi-user.target
`;

fs.writeFile(
  "/etc/systemd/system/administration_system.service",
  service,
  (err, result) => {
    if (err) throw err;
  }
);

//========== INSTANTIATING MYSQL ==========//

const connection = mysql.createConnection({
  host: sql_parameters.host,
  user: "temp",
  password: "qwertyui",
  multipleStatements: true,
});

connection.connect((err) => {
  if (err) {
    throw err;
  } else console.log("Database connected");
});

let sql = `select user from mysql.user where user = '${sql_parameters.username}';`;
connection.query(sql, (err, result) => {
  if (err) throw err;
  if (result[0] === undefined) {
    sql = `CREATE USER '${sql_parameters.username}'@'localhost' IDENTIFIED BY '${sql_parameters.password}';`;
    connection.query(sql, (err, result) => {
      if (err) throw err;
    });

    sql = `GRANT ALL PRIVILEGES ON * . * TO '${sql_parameters.username}'@'localhost';`;
    connection.query(sql, (err, result) => {
      if (err) throw err;
    });

    sql = `FLUSH PRIVILEGES;`;
    connection.query(sql, (err, result) => {
      if (err) throw err;
    });
  }
});

sql = `SELECT schema_name FROM information_schema.schemata where schema_name = '${sql_parameters.database}';`;
connection.query(sql, (err, result) => {
  if (err) throw err;
  if (result[0] === undefined) {
    sql = `CREATE DATABASE ${sql_parameters.database};`;
    connection.query(sql, (err, result) => {
      if (err) throw err;
    });
  }
});

const password = escapeHTML("12345678");

const hashed_password = crypto.createHmac("sha256", password).digest("hex");

function escapeHTML(unsafe_str) {
  return unsafe_str
    .replace(/</g, "")
    .replace(/>/g, "")
    .replace(/`/g, "'")
    .replace(/{/g, "")
    .replace(/}/g, "")
    .replace(/;/g, "");
}

sql = `
CREATE DATABASE meettheneed;

    USE meettheneed;

    CREATE TABLE 'meettheneed'.'admins' (
        'id' INT NOT NULL AUTO_INCREMENT,
        'username' VARCHAR(45) NOT NULL,
        'password' VARCHAR(64) NOT NULL,
        PRIMARY KEY ('id'));

    CREATE TABLE 'meettheneed'.'dependants' (
    'id' INT NOT NULL AUTO_INCREMENT,
    'firstName' VARCHAR(45) NOT NULL,
    'lastName' VARCHAR(45) NOT NULL,
    'dateOfBirth' VARCHAR(45) NOT NULL,
    'sex' VARCHAR(15) NOT NULL,
    'studentStatus' VARCHAR(45) NOT NULL,
    'memberStatus' VARCHAR(45) NOT NULL,
    'volunteerStatus' VARCHAR(45) NOT NULL,
    'email' VARCHAR(45) NULL DEFAULT NULL,
    'homePhoneNumber' VARCHAR(45) NULL DEFAULT NULL,
    'cellphoneNumber' VARCHAR(45) NULL DEFAULT NULL,
    'homeNumber' INT NOT NULL,
    'homeStreet' VARCHAR(45) NOT NULL,
    'appartmentNumber' VARCHAR(45) NULL DEFAULT NULL,
    'appartmentLevel' VARCHAR(45) NULL DEFAULT NULL,
    'homeEntryCode' VARCHAR(45) NULL DEFAULT NULL,
    'homePostalCode' VARCHAR(20) NOT NULL,
    'residencyProofStatus' VARCHAR(45) NOT NULL,
    'typeOfHouse' VARCHAR(100) NOT NULL,
    'sourceOfRevenue' VARCHAR(100) NOT NULL,
    'familyComposition' VARCHAR(100) NOT NULL,
    'numberOfOtherFamilyMembers' VARCHAR(45) NOT NULL,
    'DOBfamilyMember1' VARCHAR(20) NULL DEFAULT NULL,
    'DOBfamilyMember2' VARCHAR(20) NULL DEFAULT NULL,
    'DOBfamilyMember3' VARCHAR(20) NULL DEFAULT NULL,
    'DOBfamilyMember4' VARCHAR(20) NULL DEFAULT NULL,
    'DOBfamilyMember5' VARCHAR(20) NULL DEFAULT NULL,
    'DOBfamilyMember6' VARCHAR(20) NULL DEFAULT NULL,
    'DOBfamilyMember7' VARCHAR(20) NULL DEFAULT NULL,
    'DOBfamilyMember8' VARCHAR(20) NULL DEFAULT NULL,
    'DOBfamilyMember9' VARCHAR(20) NULL DEFAULT NULL,
    'DOBfamilyMember10' VARCHAR(20) NULL DEFAULT NULL,
    'DOBfamilyMember11' VARCHAR(20) NULL DEFAULT NULL,
    'DOBfamilyMember12' VARCHAR(20) NULL DEFAULT NULL,
    'DOBfamilyMember13' VARCHAR(20) NULL DEFAULT NULL,
    'DOBfamilyMember14' VARCHAR(20) NULL DEFAULT NULL,
    'DOBfamilyMember15' VARCHAR(20) NULL DEFAULT NULL,
    'DOBfamilyMember16' VARCHAR(20) NULL DEFAULT NULL,
    'DOBfamilyMember17' VARCHAR(20) NULL DEFAULT NULL,
    'DOBfamilyMember18' VARCHAR(20) NULL DEFAULT NULL,
    'DOBfamilyMember19' VARCHAR(20) NULL DEFAULT NULL,
    'sourceOrganismName' VARCHAR(100) NULL DEFAULT NULL,
    'socialWorkerNameOrganism' VARCHAR(100) NULL DEFAULT NULL,
    'socialWorkerPhoneNumberOrganism' VARCHAR(45) NULL DEFAULT NULL,
    'socialWorkerPostOrganism' INT NULL DEFAULT NULL,
    'curatelName' VARCHAR(100) NULL DEFAULT NULL,
    'socialWorkerNameCuratel' VARCHAR(100) NULL DEFAULT NULL,
    'socialWorkerPhoneNumberCuratel' VARCHAR(45) NULL DEFAULT NULL,
    'socialWorkerPostCuratel' INT NULL DEFAULT NULL,
    'registrationDate' DATETIME NOT NULL,
    'lastRenewment' DATETIME NOT NULL,
    'expirationDate' DATETIME NOT NULL,
    'balance' DECIMAL(10,2) NOT NULL,
    PRIMARY KEY ('id'));

    CREATE TABLE 'meettheneed'.'transactions' (
        'id' INT NOT NULL AUTO_INCREMENT,
        'date' DATE NOT NULL,
        'time' TIME NULL DEFAULT NULL,
        'currentWeek' INT NOT NULL,
        'currentYear' INT NOT NULL,
        'dependant' VARCHAR(145) NULL DEFAULT NULL,
        'admin' VARCHAR(100) NULL DEFAULT NULL,
        'amount_to_admin' DECIMAL(10,2) NOT NULL,
        'transactionType' VARCHAR(45) NOT NULL,
        'livraison' VARCHAR(45) NULL DEFAULT NULL,
        'depannage' VARCHAR(45) NULL DEFAULT NULL,
        'christmasBasket' VARCHAR(45) NULL DEFAULT NULL,
        'address' VARCHAR(500) NULL DEFAULT NULL,
        PRIMARY KEY ('id'));

    CREATE TABLE 'meettheneed'.'variables' (
        'id' INT NOT NULL AUTO_INCREMENT,
        'priceBasket' DECIMAL(10,2) NOT NULL,
        'priceBasketDepannage' DECIMAL(10,2) NOT NULL,
        'priceBasketLivraison' DECIMAL(10,2) NOT NULL,
        'priceBasketChristmas' DECIMAL(10,2) NOT NULL,
        'priceBasketDepannageLivraison' DECIMAL(10,2) NOT NULL,
        'priceBasketDepannageChristmas' DECIMAL(10,2) NOT NULL,
        'priceBasketLivraisonChristmas' DECIMAL(10,2) NOT NULL,
        'priceBasketDepannageLivraisonChristmas' DECIMAL(10,2) NOT NULL,
        'priceMembership' DECIMAL(10,2) NOT NULL,
        PRIMARY KEY ('id'));
    
    INSERT INTO admins(username, password) VALUES('admin', '${hashed_password}');

    INSERT INTO variables(priceBasket, priceBasketDepannage, priceBasketLivraison, priceBasketChristmas, priceBasketDepannageLivraison, priceBasketDepannageChristmas, priceBasketLivraisonChristmas, priceBasketDepannageLivraisonChristmas, priceMembership) values(0,0,0,0,0,0,0,0,0);
`;
connection.query(sql, (err, result) => {
  if (err) throw err;
});

sql = ``;
connection.query(sql, (err, result) => {
  if (err) throw err;
});

setTimeout(function () {
  connection.end();
}, 1000);
