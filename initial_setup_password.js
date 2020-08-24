/*
 * Copyright (C) 2020 Alix Routhier-Lalonde
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

const crypto = require("crypto");

const password = escapeHTML(""); //YOUR PASSWORD HERE (MUST BE AT LEAST 8 CHARACTERS LONG)

const hashed_password = crypto.createHmac("sha256", password).digest("hex");

console.log(hashed_password);

function escapeHTML(unsafe_str) {
  return unsafe_str
    .replace(/</g, "")
    .replace(/>/g, "")
    .replace(/`/g, "'")
    .replace(/{/g, "")
    .replace(/}/g, "")
    .replace(/;/g, "");
}
