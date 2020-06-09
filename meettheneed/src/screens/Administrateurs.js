/*
 * Copyright (C) 2020 Alix Routhier-Lalonde
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import React from "react";
import { BackButton } from "../components/BackButton";
import redux from "../index";
import axios from "axios";
import { Redirect, useHistory } from "react-router-dom";
import "./Administrateurs.css";

export const Administrateurs = () => {
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

  const goChangePassword = () => history.push("/changepassword");
  const goAddAdministrator = () => history.push("/addadministrator");
  const goRemoveAdministrator = () => {
    axios
      .post("http://raspberrypi.local/api/alladministrators", {
        curuser: redux.store.getState().username,
      })
      .then((res) => {
        console.log(`statusCode: ${res.statusCode}`);
        redux.store.dispatch(redux.setAdmins(res.data));
        history.push("/removeadministrator");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="administrateurs">
      <script> {authCheck()}</script>
      <BackButton to="/dashboard" />
      <button className="button-administrateurs" onClick={goChangePassword}>
        Changer votre mot de passe
      </button>
      <button className="button-administrateurs" onClick={goAddAdministrator}>
        Ajouter un administrateur
      </button>
      <button
        className="button-administrateurs"
        onClick={goRemoveAdministrator}
      >
        Retirer un administrateur
      </button>
    </div>
  );
};
