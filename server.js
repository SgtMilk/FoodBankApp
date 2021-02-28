#!/usr/bin node

/*
 * Copyright (C) 2020 Alix Routhier-Lalonde
 * This file is subject to the terms and conditions defined in
 * file "LICENSE.txt", which is part of this source code package.
 */

const express = require("express");
const cors = require("cors");
const bodyparser = require("body-parser");
import data from "./backend/constants/constants.js";
import router from "./backend/router.js";

const app = express();

//========== MIDDLEWARE ==========//

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

//========== PROCESSIGN WEB-APP REQUESTS ==========//

app.use("/api", router);

app.use(express.static("./meettheneed/build"));

//browser request for the web app
app.get("/", (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  res.sendFile("index.html", { root: "./meettheneed/build" });
});

//========== STARTING EXPRESS SERVER ==========//

app.listen(data.backend_port, () =>
  console.log(`Server Running on port ${data.backend_port}`)
);
