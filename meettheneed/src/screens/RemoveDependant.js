/*
 * Copyright (C) 2020 Alix Routhier-Lalonde
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import React from "react";
import "./RemoveDependant.css";
import redux from "../index";
import { Redirect } from "react-router-dom";
import { Dependant } from "../components/Dependant";
import { useHistory } from "react-router-dom";
import "../components/BackButton.css";

export const RemoveDependant = () => {
  const allDependants = redux.store.getState().dependants;

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
    history.push("/dependants");
  };

  return (
    <div className="removeDependants">
      <script>{authCheck()}</script>
      <div className="back-button-div-removeDependant">
        <div className="back-button-link">
          <button className="back-button" onClick={goBack}>
            Retour
          </button>
        </div>
        <ul className="list-removeDependants">
          {allDependants.map((dependant, index) => (
            <Dependant props={index} key={index} />
          ))}
        </ul>
      </div>
    </div>
  );
};
