/*
 * Copyright (C) 2020 Alix Routhier-Lalonde
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import React from "react";
import "./Dashboard.css";
import redux from "../index";
import { Redirect, useHistory } from "react-router-dom";
import axios from "axios";

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

  const goLivraisons = () => {
    axios
      .post("/api/alllivraisons", {
        curuser: redux.store.getState().username,
      })
      .then(function (res) {
        console.log(`statusCode: ${res.status}`);
        if (res.status !== 200)
          alert(
            `Une erreur de communication s'est effectuée. Ceci est probablement un problème de connection wifi. Si l'erreur persiste, veuillez contacter un développeur de Meet The Need s'il vous plait.`
          );
        redux.store.dispatch(redux.setDependants(res.data));
        history.push("/livraisons");
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const goRapports = () => {
    history.push("/rapports");
  };

  const goChangePrices = () => {
    axios
      .post("/api/allprices", {
        curuser: redux.store.getState().username,
      })
      .then(function (res) {
        console.log(`statusCode: ${res.status}`);
        if (res.status !== 200)
          alert(
            `Une erreur de communication s'est effectuée. Ceci est probablement un problème de connection wifi. Si l'erreur persiste, veuillez contacter un développeur de Meet The Need s'il vous plait.`
          );
        redux.store.dispatch(redux.setDependants(res.data));
        history.push("/changeprices");
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const goAllTransactions = () => {
    axios
      .post("/api/alltransactions", {
        curuser: redux.store.getState().username,
      })
      .then(function (res) {
        console.log(`statusCode: ${res.status}`);
        if (res.status !== 200)
          alert(
            `Une erreur de communication s'est effectuée. Ceci est probablement un problème de connection wifi. Si l'erreur persiste, veuillez contacter un développeur de Meet The Need s'il vous plait.`
          );
        redux.store.dispatch(redux.setDependants(res.data));
        history.push("/transactions");
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <div className="dashboard">
      <script> {authCheck()}</script>
      <p id="title">Menu administratif</p>
      <button onClick={logout} className="button-dashboard">
        Se déconnecter
      </button>
      <button className="button-dashboard" onClick={goAdministrateurs}>
        Gérer les administrateurs
      </button>
      <button className="button-dashboard" onClick={goDependants}>
        Gérer les dépendants
      </button>
      <button className="button-dashboard" onClick={goLivraisons}>
        Livraisons
      </button>
      <button className="button-dashboard" onClick={goRapports}>
        Rapports
      </button>
      <button className="button-dashboard" onClick={goChangePrices}>
        Changer les prix
      </button>
      <button className="button-dashboard" onClick={goAllTransactions}>
        Retirer une transaction
      </button>
    </div>
  );
};
