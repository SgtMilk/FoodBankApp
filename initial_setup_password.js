/*
 * Copyright (C) 2020 Alix Routhier-Lalonde
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

const crypto = require("crypto");

const password = ""; //YOUR PASSWORD HERE

const hashed_password = crypto.createHmac("sha256", password).digest("hex");

console.log(hashed_password);
