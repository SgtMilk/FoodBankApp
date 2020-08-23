/*
 * Copyright (C) 2020 Alix Routhier-Lalonde
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import React from "react";
import "./Rapports.css";
import redux from "../index";
import { Redirect, useHistory } from "react-router-dom";
import { BackButton } from "../components/BackButton";

export const Rapports = () => {
  let history = useHistory();

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

  const gotoYearly = () => {
    history.push("/yearlyreport");
  };

  const gotoWeekly = () => {
    history.push("/weeklyreport");
  };

  const gotoDaily = () => {
    history.push("/dailyreport");
  };

  return (
    <div className="rapports">
      <script> {authCheck()}</script>
      <p id="title">Page des rapports</p>
      <BackButton to="/dashboard" />
      <button className="button-rapports" onClick={gotoYearly}>
        Par an
      </button>
      <button className="button-rapports" onClick={gotoWeekly}>
        Par semaine
      </button>
      <button className="button-rapports" onClick={gotoDaily}>
        Par jour
      </button>
    </div>
  );
};
