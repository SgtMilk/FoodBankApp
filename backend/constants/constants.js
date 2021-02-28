/*
 * Copyright (C) 2021 Alix Routhier-Lalonde
 * This file is subject to the terms and conditions defined in
 * file "LICENSE.txt", which is part of this source code package.
 */

import fs from "fs";

//========== BACKEND SERVER PARAMETERS ==========//

const backend_port = 80;

//========== SQL SERVER PARAMETERS ==========//

let data = JSON.parse(fs.readFileSync("./backend/constants/mysql.json"));

const sql_options = {
  // TODO: change this
  database: data.database,
  username: data.username,
  password: data.password,
  host: data.host,
};

export default { backend_port, sql_options };
