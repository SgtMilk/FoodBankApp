/*
 * Copyright (C) 2020 Alix Routhier-Lalonde
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import React from "react";
import "./AddDependant.css";
import { BackButton } from "../components/BackButton";
import { useForm } from "react-hook-form";
import redux from "../index";
import { Redirect } from "react-router-dom";
const axios = require("axios");

export const AddDependant = () => {
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
      firstName: values.firstName,
      lastName: values.lastName,
      dateOfBirth: values.dateOfBirth,
      email: values.email,
      homeAddress: values.homeAddress,
      curuser: redux.store.getState().username,
    };
    axios
      .post("http://raspberrypi.local/api/adddependant", newvalues)
      .then((res) => {
        console.log(`statusCode: ${res.statusCode}`);
        if (res.data.message === "already in database") {
          document.getElementById(
            "message-addDependant"
          ).innerHTML = `Il existe déjà un dépendant avec ce nom et date de naissance`;
        } else if (res.data.message === "success") {
          alert("Dépendant ajouté avec succès!");
          console.log("success");
          showQR(res.data.id, res.data.email);
          document.getElementById("form-adddependant").reset();
          document.getElementById("message-addDependant").innerHTML = ``;
        } else {
          document.getElementById(
            "message-addDependant"
          ).innerHTML = `Veuillez contacter un administrateur de Meet The Need s'il vous plait. Une erreur s'est produite.`;
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const showQR = (id, email) => {
    let image = document.getElementById("image-addDependant");
    let img = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${id}`;
    image.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${id}`.replace(
      "150x150",
      "225x225"
    );
    image.style.display = "block";
    if (email === null || email === "" || email === undefined) return;
    window.open(`mailto:${email}?subject=QRcode&body=${img}`);
  };

  return (
    <div className="addDependant">
      <script> {authCheck()}</script>
      <BackButton to="/dependants" />
      <div className="form-addDependant">
        <form onSubmit={handleSubmit(onSubmit)} id="form-adddependant">
          <div className="input-wrapper-addDependant">
            <label>Prénom:</label>
            <br></br>
            <input
              name="firstName"
              className="input-addDependant"
              type="text"
              required
              maxLength="45"
              minLength="1"
              ref={register}
              autoComplete="off"
            ></input>
          </div>
          <div className="input-wrapper-addDependant">
            <label>Nom:</label>
            <br></br>
            <input
              name="lastName"
              className="input-addDependant"
              type="text"
              required
              maxLength="45"
              minLength="1"
              ref={register}
              autoComplete="off"
            ></input>
          </div>
          <div className="input-wrapper-addDependant">
            <label>Date de naissance:</label>
            <br></br>
            <input
              name="dateOfBirth"
              className="input-addDependant"
              type="date"
              required
              maxLength="10"
              minLength="4"
              ref={register}
              autoComplete="off"
            ></input>
          </div>
          <div className="input-wrapper-addDependant">
            <label>Courriel (optionnel):</label>
            <br></br>
            <input
              name="email"
              className="input-addDependant"
              type="email"
              maxLength="45"
              minLength="2"
              ref={register}
              autoComplete="off"
            ></input>
          </div>
          <div className="input-wrapper-addDependant">
            <label>Adresse (optionnel):</label>
            <br></br>
            <input
              name="homeAddress"
              className="input-addDependant"
              type="text"
              maxLength="45"
              minLength="2"
              ref={register}
              autoComplete="off"
            ></input>
          </div>
          <div className="input-wrapper-addDependant">
            <input
              className="submit-addDependant"
              value="Soumettre"
              type="submit"
            ></input>
          </div>
        </form>
        <p id="message-addDependant"></p>
        <img id="image-addDependant" alt="" />
      </div>
    </div>
  );
};
