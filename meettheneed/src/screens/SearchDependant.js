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

  const onChange = (values) => {
    axios
      .post("/api/searchdependant", values)
      .then((res) => {
        console.log(`statusCode: ${res.statusCode}`);
        if (res.data.message === "not there") {
          document.getElementById(
            "message-searchDependant"
          ).innerHTML = `Ce dépendant n'existe pas`;
          document.getElementById("image-searchDependant").src = "";
        } else if (res.data.message === "success") {
          let values = res.data;
          redux.store.dispatch(redux.setDependants(values));
          document.getElementById("buttons-searchDependants").style.display =
            "flex";
          document.getElementById("message-searchDependant").innerHTML = `
          <div>
            <br></br>
            <br></br>
            <h1>Informations sur le dépendant</h1>
            <br></br>
            <p>Sexe: ${res.data.sex}</p>
            <p>Statut d'étudiant: ${res.data.studentStatus}</p>
            <p>Statut de membre: ${res.data.memberStatus}</p>
            <p>Statut de bénévole: ${res.data.volunteerStatus}</p>
            <p>--------------------------------------------------------------------------------------------------------------</p>
            <p>Sexe: ${res.data.sex}</p>
            <p>Courriel: ${res.data.email}</p>
            <p>Numéro de téléphone à la maison: ${res.data.homePhoneNumber}</p>
            <p>Numéro de téléphone cellulaire: ${res.data.cellphoneNumber}</p>
            <p>Numéro de porte: ${res.data.homeNumber}</p>
            <p>Rue: ${res.data.homeStreet}</p>
            <p>Numéro d'appartement: ${res.data.appartmentNumber}</p>
            <p>Étage: ${res.data.appartmentLevel}</p>
            <p>Code de la sonnette: ${res.data.homeEntryCode}</p>
            <p>Code Postal: ${res.data.homePostalCode}</p>
            <p>Preuve de résidence montrée: ${res.data.residencyProofStatus}</p>
            <p>Type de logement: ${res.data.typeOfHouse}</p>
            <p>Source de revenu: ${res.data.sourceOfRevenue}</p>
            <p>Composition du foyer: ${res.data.familyComposition}</p>
            <p>Nombre de personnes vivant avec ce dépendant: ${res.data.numberOfOtherFamilyMembers}</p>
            <p>Date de naissance du membre de la famille 1: ${res.data.DOBfamilyMember1}</p>
            <p>Date de naissance du membre de la famille 2: ${res.data.DOBfamilyMember2}</p>
            <p>Date de naissance du membre de la famille 3: ${res.data.DOBfamilyMember3}</p>
            <p>Date de naissance du membre de la famille 4: ${res.data.DOBfamilyMember4}</p>
            <p>Date de naissance du membre de la famille 5: ${res.data.DOBfamilyMember5}</p>
            <p>Date de naissance du membre de la famille 6: ${res.data.DOBfamilyMember6}</p>
            <p>Date de naissance du membre de la famille 7: ${res.data.DOBfamilyMember7}</p>
            <p>Date de naissance du membre de la famille 8: ${res.data.DOBfamilyMember8}</p>
            <p>Date de naissance du membre de la famille 9: ${res.data.DOBfamilyMember9}</p>
            <p>Date de naissance du membre de la famille 10: ${res.data.DOBfamilyMember10}</p>
            <p>Date de naissance du membre de la famille 11: ${res.data.DOBfamilyMember11}</p>
            <p>Date de naissance du membre de la famille 12: ${res.data.DOBfamilyMember12}</p>
            <p>Date de naissance du membre de la famille 13: ${res.data.DOBfamilyMember13}</p>
            <p>Date de naissance du membre de la famille 14: ${res.data.DOBfamilyMember14}</p>
            <p>Date de naissance du membre de la famille 15: ${res.data.DOBfamilyMember15}</p>
            <p>Date de naissance du membre de la famille 16: ${res.data.DOBfamilyMember16}</p>
            <p>Date de naissance du membre de la famille 17: ${res.data.DOBfamilyMember17}</p>
            <p>Date de naissance du membre de la famille 18: ${res.data.DOBfamilyMember18}</p>
            <p>Date de naissance du membre de la famille 19: ${res.data.DOBfamilyMember19}</p>
            <p>Organisme ressource et/ou qui a référé le membre (comme la CNEEST ou le CLSC): ${res.data.sourceOrganismName}</p>
            <p>Nom de l’intervenant: ${res.data.socialWorkerNameOrganism}</p>
            <p>Numéro de Téléphone de l’intervenant: ${res.data.socialWorkerPhoneNumberOrganism}</p>
            <p>Poste: ${res.data.socialWorkerPostOrganism}</p>
            <p>Curatel: ${res.data.curatelName}</p>
            <p>Nom de l’intervenant: ${res.data.socialWorkerNameCuratel}</p>
            <p>Numéro de Téléphone de l’intervenant: ${res.data.socialWorkerPhoneNumberCuratel}</p>
            <p>Poste: ${res.data.socialWorkerPostCuratel}</p>
            <p>Date d'inscription: ${res.data.registrationDate}</p>
            <p>Dernier renouvellement de la carte de membre: ${res.data.lastRenewment}</p>
            <p>Date d'expiration de la carte de membre: ${res.data.expirationDate}</p>
            <p>Balance du compte: ${res.data.balance}</p>
            <br></br>
          </div>
          `;
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

  const removeDependant = () => {
    alert("Êtes-vous sûr que vous voulez supprimer ce dépendant?");
    let values = redux.store.getState().dependants;
    values.curuser = redux.store.getState().username;
    axios
      .post("/api/removedependantid", values)
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

  const goToModifyDependant = () => {
    history.push("/modifydependant");
  };

  return (
    <div className="searchDependant">
      <script> {authCheck()}</script>
      <BackButton to="/dependants" />
      <div className="form-searchDependant">
        <form onChange={handleSubmit(onChange)} id="form-searchDependant">
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
        </form>
        <div className="buttons-searchDependants" id="buttons-searchDependants">
          <button className="submit-searchDependant" onClick={removeDependant}>
            Supprimer le dépendant
          </button>
          <button className="submit-searchDependant" onClick={sendEmail}>
            Envoyer le QR-code par courriel
          </button>
          <br></br>
          <button
            className="submit-searchDependant"
            onClick={goToModifyDependant}
          >
            Modifier le compte
          </button>
          <button className="submit-searchDependant" onClick={sendEmail}>
            Renouveler carte de membre
          </button>
        </div>
        <br></br>
        <p id="message-searchDependant"></p>
        <img id="image-searchDependant" alt="" />
      </div>
    </div>
  );
};
