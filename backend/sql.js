/*
 * Copyright (C) 2021 Alix Routhier-Lalonde
 * This file is subject to the terms and conditions defined in
 * file "LICENSE.txt", which is part of this source code package.
 */

import mysql from "mysql";
import data from "./constants/constants.js";

//========== INSTANTIATING MYSQL ==========//

const connection = mysql.createConnection({
  host: data.sql_options.host,
  user: data.sql_options.username,
  password: data.sql_options.password,
  database: data.sql_options.database,
  multipleStatements: true,
});

connection.connect((err) => {
  if (err) {
    console.log(err);
  } else console.log("Database connected");
});

export default connection;
