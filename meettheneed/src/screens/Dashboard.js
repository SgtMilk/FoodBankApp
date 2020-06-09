/*
 * Copyright (C) 2020 Alix Routhier-Lalonde
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import React from "react";
import "./Dashboard.css";
import redux from "../index";
import { Redirect, useHistory } from "react-router-dom";

export const Dashboard = () => {
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

  const logout = () => {
    redux.store.dispatch(redux.logout());
    history.push("/auth");
  };

  const goDependants = () => {
    history.push("/dependants");
  };

  const goAdministrateurs = () => {
    history.push("/administrateurs");
  };

  const goAddDependant = () => {
    history.push("/adddependant");
  };

  return (
    <div className="dashboard">
      <script> {authCheck()}</script>
      <button onClick={logout} className="button-dashboard">
        Se déconnecter
      </button>
      <button className="button-dashboard" onClick={goAdministrateurs}>
        Gérer les administrateurs
      </button>
      <button className="button-dashboard" onClick={goDependants}>
        Gérer les dépendants
      </button>
      <button className="button-dashboard" onClick={goAddDependant}>
        Ajouter un dépendant
      </button>
    </div>
  );
};
