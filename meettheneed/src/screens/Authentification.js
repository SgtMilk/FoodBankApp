/*
 * Copyright (C) 2020 Alix Routhier-Lalonde
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import React from "react";
import "./Authentification.css";
import { BackButton } from "../components/BackButton";
import { useForm } from "react-hook-form";
import redux from "../index";
import { useHistory } from "react-router-dom";
const axios = require("axios");

export const Authentification = () => {
  let history = useHistory();

  const { handleSubmit, register } = useForm();

  const onSubmit = (values) => {
    axios
      .post("/api/login", values)
      .then((res) => {
        console.log(`statusCode: ${res.statusCode}`);
        redux.store.dispatch(redux.setUser(res.data.username));
        if (res.data.message === "authentification failed") {
          document.getElementById(
            "message-authentification"
          ).innerHTML = `Mauvais nom d'utilisateur ou mot de passe`;
        } else if (res.data.message === "authentification succeded") {
          console.log("succeded");
          history.push("/dashboard");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="Authentification">
      <BackButton to="/" />
      <div className="form-authentification">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="input-wrapper-authentification">
            <label>Nom d'utilisateur: </label>
            <br></br>
            <input
              name="username"
              className="input-authentification"
              type="text"
              required
              maxLength="45"
              minLength="4"
              ref={register}
            ></input>
          </div>
          <div className="input-wrapper-authentification">
            <label>Mot de passe: </label>
            <br></br>
            <input
              name="password"
              className="input-authentification"
              type="password"
              required
              maxLength="45"
              minLength="4"
              ref={register}
            ></input>
          </div>
          <div className="input-wrapper-authentification">
            <input
              className="submit-authentification"
              value="Soumettre"
              type="submit"
            ></input>
          </div>
        </form>
        <p id="message-authentification"></p>
      </div>
    </div>
  );
};
