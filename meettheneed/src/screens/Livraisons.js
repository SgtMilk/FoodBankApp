/*
 * Copyright (C) 2020 Alix Routhier-Lalonde
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import React from "react";
import "./Livraisons.css";
import redux from "../index";
import { Redirect } from "react-router-dom";
import { Livraison } from "../components/Livraison.js";
import { useHistory } from "react-router-dom";
import "../components/BackButton.css";

export const Livraisons = () => {
  const allAdmins = redux.store.getState().dependants;

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
    redux.store.dispatch(redux.setDependants([]));
    history.push("/dashboard");
  };

  return (
    <div className="livraisons">
      <script>{authCheck()}</script>
      <div className="back-button-div-livraisons">
        <div className="back-button-link">
          <button className="back-button" onClick={goBack}>
            Retour
          </button>
        </div>
        <ul className="list-livraisons">
          {allAdmins.map((admin, index) => (
            <Livraison props={index} key={index} />
          ))}
        </ul>
      </div>
    </div>
  );
};
