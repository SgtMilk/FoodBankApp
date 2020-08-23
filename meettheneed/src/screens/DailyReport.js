/*
 * Copyright (C) 2020 Alix Routhier-Lalonde
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import React from "react";
import "./Report.css";
import { BackButton } from "../components/BackButton";
import { useForm } from "react-hook-form";
import redux from "../index";
import { Redirect } from "react-router-dom";
const axios = require("axios");
const FileDownload = require("js-file-download");

export const DailyReport = () => {
  const { handleSubmit, register } = useForm();

  const authCheck = () => {
    if (
      redux.store.getState() === null ||
      redux.store.getState() === "" ||
      redux.store.getState() === undefined ||
      redux.store.getState().username === null ||
      redux.store.getState().username === "" ||
      redux.store.getState().username === undefined
    )
      return <Redirect to="/auth" />;
  };

  const onSubmit = (values) => {
    values.curuser = redux.store.getState().username;
    axios
      .post("/api/dailyreport", values)
      .then(function (res) {
        console.log(`statusCode: ${res.status}`);
        if (res.status !== 200)
          alert(
            `Une erreur de communication s'est effectuée. Ceci est probablement un problème de connection wifi. Si l'erreur persiste, veuillez contacter un développeur de Meet The Need s'il vous plait.`
          );
        if (res.data.message === "failure") {
          alert(
            `Veuillez contacter un développeur de Meet The Need s'il vous plait. Une erreur s'est produite.`
          );
          return;
        }
        FileDownload(res.data, "report.csv");
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <div className="report">
      <script> {authCheck()}</script>
      <p id="title">Rapport journalier</p>
      <BackButton to="/rapports" />
      <div className="form-report">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="input-wrapper-report">
            <label>Jour</label>
            <br></br>
            <input
              name="day"
              className="input-report"
              type="date"
              required
              ref={register}
            ></input>
          </div>
          <div className="input-wrapper-report">
            <input
              className="submit-report"
              value="Soumettre"
              type="submit"
            ></input>
          </div>
        </form>
      </div>
    </div>
  );
};
