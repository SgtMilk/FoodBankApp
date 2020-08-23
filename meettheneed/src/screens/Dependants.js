/*
 * Copyright (C) 2020 Alix Routhier-Lalonde
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import React from "react";
import { BackButton } from "../components/BackButton";
import redux from "../index";
import "./Dependants.css";
import { useHistory, Redirect } from "react-router-dom";
import axios from "axios";

export const Dependants = () => {
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

  const goAddDependant = () => history.push("/adddependant");
  const goRemoveDependant = () => {
    axios
      .post("/api/alldependants", {
        curuser: redux.store.getState().username,
      })
      .then((res) => {
        console.log(`statusCode: ${res.status}`);
        if (res.status !== 200)
          alert(
            `Une erreur de communication s'est effectuée. Ceci est probablement un problème de connection wifi. Si l'erreur persiste, veuillez contacter un développeur de Meet The Need s'il vous plait.`
          );
        redux.store.dispatch(redux.setDependants(res.data));
        history.push("/removedependant");
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const goSearchDependants = () => history.push("/searchdependants");

  return (
    <div className="dependants">
      <script> {authCheck()}</script>
      <p id="title">Gérer les dépendants</p>
      <BackButton to="/dashboard" />
      <button className="button-dependants" onClick={goAddDependant}>
        Ajouter un dépendant
      </button>
      <button className="button-dependants" onClick={goRemoveDependant}>
        Retirer un dépendant
      </button>
      <button className="button-dependants" onClick={goSearchDependants}>
        Rechercher un dépendant et autres options
      </button>
    </div>
  );
};
