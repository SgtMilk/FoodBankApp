/*
 * Copyright (C) 2020 Alix Routhier-Lalonde
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import React from "react";
import "./AddAdministrator.css";
import { BackButton } from "../components/BackButton";
import { useForm } from "react-hook-form";
import redux from "../index";
import { useHistory, Redirect } from "react-router-dom";
const axios = require("axios");

export const AddAdministrator = () => {
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
    let newvalues = {
      username: values.username,
      password: values.password,
      curuser: redux.store.getState().username,
    };
    if (values.password !== values.retypePassword) {
      document.getElementById("message-addAdministrator").innerHTML =
        "Les deux entrées pour le nouveau mot de passe ne correspondent pas";
      return;
    }
    axios
      .post("/api/addadministrator", newvalues)
      .then((res) => {
        console.log(`statusCode: ${res.status}`);
        if (res.status !== 200)
          alert(
            `Une erreur de communication s'est effectuée. Ceci est probablement un problème de connection wifi. Si l'erreur persiste, veuillez contacter un développeur de Meet The Need s'il vous plait.`
          );
        if (res.data === "username taken")
          document.getElementById(
            "message-addAdministrator"
          ).innerHTML = `Il existe déjà un administrateur avec ce nom`;
        else if (res.data === "success") {
          alert("Administrateur ajouté avec succès!");
          history.push("/dashboard");
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
    <div className="addAdministrator">
      <script> {authCheck()}</script>
      <p id="title">Ajouter un administrateur</p>
      <BackButton to="/administrateurs" />
      <div className="form-addAdministrator">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="input-wrapper-addAdministrator">
            <label>Nom d'utilisateur</label>
            <br></br>
            <input
              name="username"
              className="input-addAdministrator"
              type="text"
              required
              maxLength="45"
              minLength="4"
              ref={register}
              autoComplete="off"
            ></input>
          </div>
          <div className="input-wrapper-addAdministrator">
            <label>Mot de passe: </label>
            <br></br>
            <input
              name="password"
              className="input-addAdministrator"
              type="password"
              required
              maxLength="45"
              minLength="8"
              ref={register}
              autoComplete="off"
            ></input>
          </div>
          <div className="input-wrapper-addAdministrator">
            <label>Retapez le mot de passe: </label>
            <br></br>
            <input
              name="retypePassword"
              className="input-addAdministrator"
              type="password"
              required
              maxLength="45"
              minLength="8"
              ref={register}
              autoComplete="off"
            ></input>
          </div>
          <div className="input-wrapper-addAdministrator">
            <input
              className="submit-addAdministrator"
              value="Soumettre"
              type="submit"
            ></input>
          </div>
        </form>
        <p id="message-addAdministrator"></p>
      </div>
    </div>
  );
};
