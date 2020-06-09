/*
 * Copyright (C) 2020 Alix Routhier-Lalonde
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import React from "react";
import "./SearchDependant.css";
import { BackButton } from "../components/BackButton";
import { useForm } from "react-hook-form";
import redux from "../index";
import { Redirect, useHistory } from "react-router-dom";
const axios = require("axios");

export const SearchDependant = () => {
  const { handleSubmit, register } = useForm();

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
          onChange(values);
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
      .post("http://raspberrypi.local/api/searchdependant", values)
      .then((res) => {
        console.log(`statusCode: ${res.statusCode}`);
        if (res.data.message === "not there") {
          document.getElementById(
            "message-searchDependant"
          ).innerHTML = `Ce dépendant n'existe pas`;
          document.getElementById("image-searchDependant").src = "";
        } else if (res.data.message === "success") {
          redux.store.dispatch(
            redux.setDependants({
              id: res.data.id,
              numberOfBaskets: res.data.numberOfBaskets,
              email: res.data.email,
            })
          );
          document.getElementById(
            "message-searchDependant"
          ).innerHTML = `Ce dépendant existe, il a reçu ${res.data.numberOfBaskets} paniers -- ${res.data.homeAddress} -- ${res.data.email}`;
          showQR(res.data.id, undefined);
        } else
          document.getElementById(
            "message-searchDependant"
          ).innerHTML = `Veuillez contacter un administrateur de Meet The Need s'il vous plait. Une erreur s'est produite.`;
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const showQR = (id, email) => {
    let image = document.getElementById("image-searchDependant");
    let img = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${id}`;
    image.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${id}`.replace(
      "150x150",
      "225x225"
    );
    image.style.display = "block";
    if (email === null || email === "" || email === undefined) return;
    window.open(`mailto:${email}?subject=QRcode&body=${img}`);
  };

  const removeBasket = () => {
    if (redux.store.getState().dependants.numberOfBaskets <= 0) {
      alert(`Ce dépendant a 0 paniers, vous ne pouvez pas en retirer plus.`);
      return;
    }
    let values = redux.store.getState().dependants;
    values.curuser = redux.store.getState().username;
    axios
      .post("http://raspberrypi.local/api/removebasket", values)
      .then((res) => {
        console.log(`statusCode: ${res.statusCode}`);
        if (res.data === "success") {
          redux.store.dispatch(redux.setDependants([]));
          alert("Panier retiré avec succès");
          onChange({
            firstName: document.getElementById("firstName-searchDependant")
              .value,
            lastName: document.getElementById("lastName-searchDependant").value,
            dateOfBirth: document.getElementById("dateOfBirth-searchDependant")
              .value,
          });
        } else
          alert(
            `Veuillez contacter un administrateur de Meet The Need s'il vous plait. Une erreur s'est produite.`
          );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const removeDependant = () => {
    alert("Êtes-vous sûr que vous voulez supprimer ce dépendant?");
    let values = redux.store.getState().dependants;
    values.curuser = redux.store.getState().username;
    axios
      .post("http://raspberrypi.local/api/removedependantid", values)
      .then((res) => {
        if (res.data !== "success") {
          alert(
            `Veuillez contacter un administrateur de Meet The Need s'il vous plait. Une erreur s'est produite.`
          );
          return;
        }
        console.log("succeded");
        alert("succès");
        document.getElementById("form-searchDependant").reset();
        document.getElementById("message-searchDependant").innerHTML = ``;
        document.getElementById("image-searchDependant").src = "";
        history.push("/searchdependants");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const sendEmail = () => {
    let img = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${
      redux.store.getState().dependants.id
    }`;
    if (
      redux.store.getState().dependants.email === null ||
      redux.store.getState().dependants.email === "" ||
      redux.store.getState().dependants.email === undefined
    ) {
      alert("Ce dépendant n'a pas enregistré de courriel.");
      return;
    }
    window.open(
      `mailto:${
        redux.store.getState().dependants.email
      }?subject=QRcode&body=${img}`
    );
  };

  return (
    <div className="searchDependant">
      <script> {authCheck()}</script>
      <BackButton to="/dependants" />
      <div className="form-searchDependant">
        <form
          onSubmit={handleSubmit(onSubmit)}
          onChange={handleSubmit(onChange)}
          id="form-searchDependant"
        >
          <div className="input-wrapper-searchDependant">
            <label>Prénom:</label>
            <br></br>
            <input
              name="firstName"
              id="firstName-searchDependant"
              className="input-searchDependant"
              type="text"
              required
              maxLength="45"
              minLength="1"
              ref={register}
            ></input>
          </div>
          <div className="input-wrapper-searchDependant">
            <label>Nom: </label>
            <br></br>
            <input
              name="lastName"
              id="lastName-searchDependant"
              className="input-searchDependant"
              type="text"
              required
              maxLength="45"
              minLength="1"
              ref={register}
            ></input>
          </div>
          <div className="input-wrapper-searchDependant">
            <label>Date de naissance: </label>
            <br></br>
            <input
              name="dateOfBirth"
              id="dateOfBirth-searchDependant"
              className="input-searchDependant"
              type="date"
              required
              maxLength="15"
              minLength="4"
              ref={register}
            ></input>
          </div>
          <div className="input-wrapper-searchDependant">
            <input
              className="submit-searchDependant"
              value="Ajouter un panier"
              type="submit"
            ></input>
          </div>
        </form>
        <div className="buttons-searchDependants">
          <button className="submit-searchDependant" onClick={removeBasket}>
            Retirer un panier
          </button>
          <button className="submit-searchDependant" onClick={removeDependant}>
            Supprimer le dépendant
          </button>
          <button className="submit-searchDependant" onClick={sendEmail}>
            Envoyer le QR-code par courriel
          </button>
        </div>
        <br></br>
        <p id="message-searchDependant"></p>
        <img id="image-searchDependant" alt="" />
      </div>
    </div>
  );
};
