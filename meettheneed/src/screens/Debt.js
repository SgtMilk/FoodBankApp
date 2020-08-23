/*
 * Copyright (C) 2020 Alix Routhier-Lalonde
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import React from "react";
import { BackButton } from "../components/BackButton";
import { useForm } from "react-hook-form";
import redux from "../index";
import { useHistory, Redirect } from "react-router-dom";
const axios = require("axios");

export const Debt = () => {
  let history = useHistory();

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
    values.id = redux.store.getState().dependants.id;
    values.curuser = redux.store.getState().username;
    axios
      .post("/api/debt", values)
      .then((res) => {
        console.log(`statusCode: ${res.status}`);
        if (res.status !== 200)
          alert(
            `Une erreur de communication s'est effectuée. Ceci est probablement un problème de connection wifi. Si l'erreur persiste, veuillez contacter un développeur de Meet The Need s'il vous plait.`
          );
        if (res.data.message === "success") {
          alert("La balance du compte a été modifié avec succès");
          redux.store.dispatch(redux.setDependants({}));
          history.push("/searchdependants");
        } else
          alert(
            `Veuillez contacter un développeur de Meet The Need s'il vous plait. Une erreur s'est produite.`
          );
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="renewCard">
      <script> {authCheck()}</script>
      <p id="title">Ajouter/Retirer des fonds au dépendant</p>
      <BackButton to="/administrateurs" />
      <div className="form-renewCard">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="input-wrapper-renewCard">
            <label>
              'Nombre d'argent donné (négatif = le centre donne de l'argent au
              dépendant): '
            </label>
            <br></br>
            <input
              name="balance"
              className="input-renewCard"
              type="number"
              required
              ref={register}
              autoComplete="new-password"
              step="0.01"
            ></input>
          </div>
          <div className="input-wrapper-renewCard">
            <input
              className="submit-renewCard"
              value="Soumettre"
              type="submit"
            ></input>
          </div>
        </form>
      </div>
    </div>
  );
};
