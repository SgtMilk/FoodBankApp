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
        console.log(`statusCode: ${res.statusCode}`);
        if (res.data.message === "failure")
          alert(
            "Une erreur s'est produite. Veuillez contacter un développeur de Meet the Need."
          );
        else if (res.data.message === "success") {
          alert("Le compte a été modifié avec succès");
          redux.store.dispatch(redux.setDependants({}));
          history.push("/searchdependants");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="renewCard">
      <script> {authCheck()}</script>
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
