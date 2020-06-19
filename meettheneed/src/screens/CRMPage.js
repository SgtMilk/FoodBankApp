/*
 * Copyright (C) 2020 Alix Routhier-Lalonde
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import React from "react";
import "./CRMPage.css";
import { BackButton } from "../components/BackButton";
import { useForm } from "react-hook-form";
import redux from "../index";
const axios = require("axios");

export const CRMPage = () => {
  const { handleSubmit, register } = useForm();

  const onSubmit = (values) => {
    if (redux.store.getState().dependants.numberOfBaskets > 2) {
      alert(
        `Ce dépendant a déjà reçu ses 3 paniers, il ne peut pas en recevoir d'autres`
      );
      return;
    }
    axios
      .post(
        "http://raspberrypi.local/api/addbasket",
        redux.store.getState().dependants
      )
      .then((res) => {
        console.log(`statusCode: ${res.statusCode}`);
        if (res.data === "success") {
          redux.store.dispatch(redux.setDependants([]));
          alert("Panier ajouté avec succès");
          document.getElementById("form-crm").reset();
          document.getElementById("message-crm").innerHTML = ``;
        } else
          alert(
            `Veuillez contacter un administrateur de Meet The Need s'il vous plait. Une erreur s'est produite.`
          );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onChange = (values) => {
    axios
      .post("/api/crm", values)
      .then((res) => {
        console.log(`statusCode: ${res.statusCode}`);
        if (res.data.message === "not there")
          document.getElementById(
            "message-crm"
          ).innerHTML = `Ce dépendant n'existe pas`;
        else if (res.data.message === "success") {
          redux.store.dispatch(
            redux.setDependants({
              id: res.data.id,
              numberOfBaskets: res.data.numberOfBaskets,
            })
          );
          if (redux.store.getState().dependants.numberOfBaskets < 3)
            document.getElementById(
              "message-crm"
            ).innerHTML = `Ce dépendant existe, il peut recevoir un panier`;
          else
            document.getElementById(
              "message-crm"
            ).innerHTML = `Ce dépendant existe, il a déjà reçu ses 3 paniers`;
        } else
          document.getElementById(
            "message-crm"
          ).innerHTML = `Veuillez contacter un administrateur de Meet The Need s'il vous plait. Une erreur s'est produite.`;
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="crm">
      <BackButton to="/" />
      <div className="form-crm">
        <form
          onSubmit={handleSubmit(onSubmit)}
          onChange={handleSubmit(onChange)}
          id="form-crm"
        >
          <div className="input-wrapper-crm">
            <label>Prénom:</label>
            <br></br>
            <input
              name="firstName"
              className="input-crm"
              type="text"
              required
              maxLength="45"
              minLength="1"
              ref={register}
            ></input>
          </div>
          <div className="input-wrapper-crm">
            <label>Nom: </label>
            <br></br>
            <input
              name="lastName"
              className="input-crm"
              type="text"
              required
              maxLength="45"
              minLength="1"
              ref={register}
            ></input>
          </div>
          <div className="input-wrapper-crm">
            <label>Date de naissance: </label>
            <br></br>
            <input
              name="dateOfBirth"
              className="input-crm"
              type="date"
              required
              maxLength="15"
              minLength="4"
              ref={register}
            ></input>
          </div>
          <div className="input-wrapper-crm">
            <input
              className="submit-crm"
              value="Ajouter un panier"
              type="submit"
            ></input>
          </div>
        </form>
        <p id="message-crm"></p>
      </div>
    </div>
  );
};
