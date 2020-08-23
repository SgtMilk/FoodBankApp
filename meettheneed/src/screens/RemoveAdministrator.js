/*
 * Copyright (C) 2020 Alix Routhier-Lalonde
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import React from "react";
import "./RemoveAdministrator.css";
import redux from "../index";
import { Redirect } from "react-router-dom";
import { Admin } from "../components/Admin";
import { useHistory } from "react-router-dom";
import "../components/BackButton.css";

export const RemoveAdministrator = () => {
  const allAdmins = redux.store.getState().admins;

  const history = useHistory();

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

  const goBack = () => {
    redux.store.dispatch(redux.setAdmins([]));
    history.push("/administrateurs");
  };

  return (
    <div className="removeAdministrator">
      <p id="title">Retirer un administrateur</p>
      <script>{authCheck()}</script>
      <div className="back-button-div-removeAdministrator">
        <div className="back-button-link">
          <button className="back-button" onClick={goBack}>
            Retour
          </button>
        </div>
        <ul className="list-removeAdministrator">
          {allAdmins.map((admin, index) => (
            <Admin props={admin.username} key={index} />
          ))}
        </ul>
      </div>
    </div>
  );
};
