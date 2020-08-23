/*
 * Copyright (C) 2020 Alix Routhier-Lalonde
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import React from "react";
import "./RemoveTransaction.css";
import redux from "../index";
import { Redirect } from "react-router-dom";
import { Transaction } from "../components/Transaction";
import { useHistory } from "react-router-dom";
import "../components/BackButton.css";

export const RemoveTransaction = () => {
  const allTransactions = redux.store.getState().dependants;

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
    <div className="removeTransaction">
      <script>{authCheck()}</script>
      <p id="title">Retirer une transaction</p>
      <div className="back-button-div-removeTransaction">
        <div className="back-button-link">
          <button className="back-button" onClick={goBack}>
            Retour
          </button>
        </div>
        <p>
          Note: N'effectuez pas de retour de panier et un changement de prix
          dans la même journée.
        </p>
        <ul className="list-removeTransaction">
          {allTransactions.map((transaction, index) => (
            <Transaction props={index} key={index} />
          ))}
        </ul>
      </div>
    </div>
  );
};
