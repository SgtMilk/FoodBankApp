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
    axios
      .post("/api/addbasket", values)
      .then((res) => {
        console.log(`statusCode: ${res.status}`);
        if (res.status !== 200)
          alert(
            `Une erreur de communication s'est effectuée. Ceci est probablement un problème de connection wifi. Si l'erreur persiste, veuillez contacter un développeur de Meet The Need s'il vous plait.`
          );
        if (res.data.message === "success") {
          redux.store.dispatch(redux.setDependants([]));
          alert("Panier ajouté avec succès!");
          document.getElementById("form-crm").reset();
          document.getElementById("message-crm").innerHTML = ``;
          document.getElementById("appears-crm").style.visibility = "hidden";
          window.scrollTo(0, 0);
        } else
          alert(
            `Veuillez contacter un développeur de Meet The Need s'il vous plait. Une erreur s'est produite.`
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
        console.log(`statusCode: ${res.status}`);
        if (res.status !== 200)
          alert(
            `Une erreur de communication s'est effectuée. Ceci est probablement un problème de connection wifi. Si l'erreur persiste, veuillez contacter un développeur de Meet The Need s'il vous plait.`
          );
        if (res.data.message === "not there") {
          document.getElementById(
            "message-crm"
          ).innerHTML = `Ce dépendant n'existe pas.`;
          document.getElementById("appears-crm").style.visibility = "hidden";
        } else if (res.data.message === "success") {
          document.getElementById("appears-crm").style.visibility = "visible";
          document.getElementById(
            "message-crm"
          ).innerHTML = `Ce dépendant existe, il a déjà reçu ${res.data.numberOfBaskets} paniers.`;
          document.getElementById("residencyProofStatus").selected =
            res.data.residencyProofStatus;
          document.getElementById("studentStatus").selected =
            res.data.studentStatus;
          if (res.data.residencyProofStatus === "Non") {
            document.getElementById("residencyProofStatus").style.display =
              "inherit";
          } else
            document.getElementById("residencyProofStatus").style.display =
              "none";
          if (res.data.studentStatus === "Oui, mais n'a pas sa preuve d'études")
            document.getElementById("studentStatus").style.display = "inherit";
          else document.getElementById("studentStatus").style.display = "none";
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
    <div className="crm">
      <p id="title">Ajouter un panier à un dépendant</p>
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
              autoComplete="off"
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
              autoComplete="off"
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
              autoComplete="off"
            ></input>
          </div>
          <p id="message-crm"></p>
          <div id="appears-crm">
            <div className="input-wrapper-crm">
              <label>
                'Nombre d'argent donné (négatif = le centre donne de l'argent au
                dépendant): '
              </label>
              <br></br>
              <input
                name="balance"
                className="input-crm"
                type="number"
                required
                max="1000"
                min="-1000"
                ref={register}
                autoComplete="new-password"
                step="0.01"
              ></input>
            </div>
            <div className="input-wrapper-crm">
              <br></br>
              <input
                name="livraison"
                className="checkbox-crm"
                type="checkbox"
                ref={register}
              ></input>
              <label> Livraison</label>
            </div>
            <div className="input-wrapper-crm">
              <br></br>
              <input
                name="depannage"
                className="checkbox-crm"
                type="checkbox"
                ref={register}
              ></input>
              <label> Dépannage d'urgence</label>
            </div>
            <div className="input-wrapper-crm">
              <br></br>
              <input
                name="christmasBasket"
                className="checkbox-crm"
                type="checkbox"
                ref={register}
              ></input>
              <label> Panier de Noël</label>
            </div>
            <div className="input-wrapper-crm" id="residencyProofStatus">
              <label>Preuve de résidence montrée (requis): </label>
              <br></br>
              <select
                name="residencyProofStatus"
                required
                ref={register}
                id="residencyProofStatus"
              >
                <option value="Oui">Oui</option>
                <option value="Non" selected>
                  Non
                </option>
              </select>
            </div>
            <div className="input-wrapper-crm" id="studentStatus">
              <label>Statut d'étudiant (requis): </label>
              <br></br>
              <select
                name="studentStatus"
                required
                ref={register}
                id="studentStatus"
              >
                <option value="Oui">Oui</option>
                <option value="Oui, mais n'a pas sa preuve d'études" selected>
                  Oui, mais n'a pas sa preuve d'études
                </option>
                <option value="Non">Non</option>
              </select>
            </div>
            <div className="input-wrapper-crm">
              <input
                className="submit-crm"
                value="Ajouter un panier"
                type="submit"
              ></input>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
