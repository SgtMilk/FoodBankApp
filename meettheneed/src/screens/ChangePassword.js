/*
 * Copyright (C) 2020 Alix Routhier-Lalonde
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import React from "react";
import "./ChangePassword.css";
import { BackButton } from "../components/BackButton";
import { useForm } from "react-hook-form";
import redux from "../index";
import { useHistory, Redirect } from "react-router-dom";
const axios = require("axios");

export const ChangePassword = () => {
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
    if (values.newPassword !== values.retypeNewPassword) {
      document.getElementById("message-changePassword").innerHTML =
        "Les deux entrées pour le nouveau mot de passe ne correspondent pas";
      return;
    }
    let newvalues = {
      username: redux.store.getState().username,
      oldPassword: values.oldPassword,
      newPassword: values.newPassword,
      curuser: redux.store.getState().username,
    };
    axios
      .post("/api/changepassword", newvalues)
      .then((res) => {
        console.log(`statusCode: ${res.status}`);
        if (res.status !== 200)
          alert(
            `Une erreur de communication s'est effectuée. Ceci est probablement un problème de connection wifi. Si l'erreur persiste, veuillez contacter un développeur de Meet The Need s'il vous plait.`
          );
        if (res.data === "old password incorrect")
          document.getElementById(
            "message-changePassword"
          ).innerHTML = `L'ancien mot de passe est erroné`;
        else if (res.data === "success") {
          alert("Mot de passe changé avec succès!");
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
    <div className="changePassword">
      <script> {authCheck()}</script>
      <p id="title">Changer votre mot de passe</p>
      <BackButton to="/administrateurs" />
      <div className="form-changePassword">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="input-wrapper-changePassword">
            <label>Ancien mot de passe: </label>
            <br></br>
            <input
              name="oldPassword"
              className="input-changePassword"
              type="password"
              required
              maxLength="45"
              minLength="4"
              ref={register}
              autoComplete="new-password"
            ></input>
          </div>
          <div className="input-wrapper-changePassword">
            <label>Nouveau mot de passe: </label>
            <br></br>
            <input
              name="newPassword"
              className="input-changePassword"
              type="password"
              required
              maxLength="45"
              minLength="4"
              ref={register}
              autoComplete="new-password"
            ></input>
          </div>
          <div className="input-wrapper-changePassword">
            <label>Retapez le nouveau mot de passe: </label>
            <br></br>
            <input
              name="retypeNewPassword"
              className="input-changePassword"
              type="password"
              required
              maxLength="45"
              minLength="4"
              ref={register}
              autoComplete="new-password"
            ></input>
          </div>
          <div className="input-wrapper-changePassword">
            <input
              className="submit-changePassword"
              value="Soumettre"
              type="submit"
            ></input>
          </div>
        </form>
        <p id="message-changePassword"></p>
      </div>
    </div>
  );
};
