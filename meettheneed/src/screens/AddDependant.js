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
    values.curuser = redux.store.getState().username;
    axios
      .post("/api/adddependant", values)
      .then((res) => {
        console.log(`statusCode: ${res.status}`);
        if (res.status !== 200)
          alert(
            `Une erreur de communication s'est effectuée. Ceci est probablement un problème de connection wifi. Si l'erreur persiste, veuillez contacter un développeur de Meet The Need s'il vous plait.`
          );
        if (res.data.message === "already in database") {
          document.getElementById(
            "message-addDependant"
          ).innerHTML = `Il existe déjà un dépendant avec ce nom et date de naissance`;
        } else if (res.data.message === "success") {
          alert("Dépendant ajouté avec succès!");
          showQR(res.data.id, res.data.email);
          document.getElementById("form-adddependant").reset();
          document.getElementById("message-addDependant").innerHTML = ``;
        } else
          alert(
            `Veuillez contacter un développeur de Meet The Need s'il vous plait. Une erreur s'est produite.`
          );
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const onChange = (values) => {
    for (let i = 0; i < 19; i++) {
      document.getElementById(`${i + 1}`).style.display = "block";
      document.getElementById(`${i + 1}`).style.height = "inherit";
    }
    for (let i = 0; i < 19; i++) {
      if (values.numberOfOtherFamilyMembers < i + 1) {
        document.getElementById(`${i + 1}`).style.display = "none";
        document.getElementById(`${i + 1}`).style.height = 0;
        document.getElementById(`${i + 1}`).style.value = "";
      }
    }
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
    window.open(
      `mailto:${email}?subject=QRcode&body="<img src=${img} alt='qrcode'/>"`
    );
  };

  return (
    <div className="addDependant">
      <script> {authCheck()}</script>
      <p id="title">Ajouter un dépendant</p>
      <BackButton to="/dependants" />
      <div className="form-addDependant">
        <form
          onSubmit={handleSubmit(onSubmit)}
          onChange={handleSubmit(onChange)}
          onload={handleSubmit(onChange)}
          id="form-adddependant"
        >
          <div className="input-wrapper-addDependant">
            <label>Prénom (requis): </label>
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
            <label>Nom (requis): </label>
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
            <label>Date de naissance (requis): </label>
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
            <label>Sexe (requis): </label>
            <br></br>
            <select name="sex" required ref={register}>
              <option value="none" selected disabled hidden>
                Choisir une option
              </option>
              <option value="homme">Homme</option>
              <option value="femme">Femme</option>
              <option value="non-genré">Non-Genré</option>
            </select>
          </div>
          <br></br>
          <p>
            --------------------------------------------------------------------------------------------------------------
          </p>
          <br></br>
          <div className="input-wrapper-addDependant">
            <label>Statut d'étudiant (requis): </label>
            <br></br>
            <select name="studentStatus" required ref={register}>
              <option value="none" selected disabled hidden>
                Choisir une option
              </option>
              <option value="Oui">Oui</option>
              <option value="Oui, mais n'a pas sa preuve d'études">
                Oui, mais n'a pas sa preuve d'études
              </option>
              <option value="Non">Non</option>
            </select>
          </div>
          <div className="input-wrapper-addDependant">
            <label>Statut de membre (requis): </label>
            <br></br>
            <select name="memberStatus" required ref={register}>
              <option value="none" selected disabled hidden>
                Choisir une option
              </option>
              <option value="Non-Membre">Non-Membre </option>
              <option value="Membre régulier ">Membre régulier </option>
              <option value="Membre honoraire">Membre honoraire</option>
            </select>
          </div>
          <div className="input-wrapper-addDependant">
            <label>Statut de bénévole (requis): </label>
            <br></br>
            <select name="volunteerStatus" required ref={register}>
              <option value="none" selected disabled hidden>
                Choisir une option
              </option>
              <option value="Non-bénévole">Non-bénévole</option>
              <option value="Bénévole actif">Bénévole actif</option>
              <option value="Bénévole inactif">Bénévole inactif</option>
            </select>
          </div>
          <br></br>
          <p>
            --------------------------------------------------------------------------------------------------------------
          </p>
          <br></br>
          <div className="input-wrapper-addDependant">
            <label>Courriel:</label>
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
            <label>Numéro de téléphone à la maison (___-___-____): </label>
            <br></br>
            <input
              name="homePhoneNumber"
              className="input-addDependant"
              type="tel"
              maxLength="45"
              minLength="2"
              ref={register}
              autoComplete="off"
            ></input>
          </div>
          <div className="input-wrapper-addDependant">
            <label>Numéro de téléphone cellulaire (___-___-____): </label>
            <br></br>
            <input
              name="cellphoneNumber"
              className="input-addDependant"
              type="tel"
              maxLength="45"
              minLength="2"
              ref={register}
              autoComplete="off"
            ></input>
          </div>
          <br></br>
          <p>
            --------------------------------------------------------------------------------------------------------------
          </p>
          <br></br>
          <div className="input-wrapper-addDependant">
            <label>Numéro de porte (requis): </label>
            <br></br>
            <input
              name="homeNumber"
              className="input-addDependant"
              type="number"
              max="100000"
              min="0"
              ref={register}
              autoComplete="off"
              required
            ></input>
          </div>
          <div className="input-wrapper-addDependant">
            <label>Rue (requis): </label>
            <br></br>
            <input
              name="homeStreet"
              className="input-addDependant"
              type="text"
              maxLength="45"
              minLength="2"
              ref={register}
              autoComplete="off"
              required
            ></input>
          </div>
          <div className="input-wrapper-addDependant">
            <label>Numéro d'appartement: </label>
            <br></br>
            <input
              name="appartmentNumber"
              className="input-addDependant"
              type="text"
              maxLength="45"
              ref={register}
              autoComplete="off"
            ></input>
          </div>
          <div className="input-wrapper-addDependant">
            <label>Étage: </label>
            <br></br>
            <input
              name="appartmentLevel"
              className="input-addDependant"
              type="text"
              maxLength="45"
              ref={register}
              autoComplete="off"
            ></input>
          </div>
          <div className="input-wrapper-addDependant">
            <label>Code de la sonnette (pour livraison)</label>
            <br></br>
            <input
              name="homeEntryCode"
              className="input-addDependant"
              type="text"
              maxLength="45"
              ref={register}
              autoComplete="off"
            ></input>
          </div>
          <div className="input-wrapper-addDependant">
            <label>Code Postal (requis): </label>
            <br></br>
            <input
              name="homePostalCode"
              className="input-addDependant"
              type="text"
              maxLength="20"
              minLength="2"
              ref={register}
              autoComplete="off"
              required
            ></input>
          </div>
          <div className="input-wrapper-addDependant">
            <label>Preuve de résidence montrée (requis): </label>
            <br></br>
            <select name="residencyProofStatus" required ref={register}>
              <option value="none" selected disabled hidden>
                Choisir une option
              </option>
              <option value="Oui">Oui</option>
              <option value="Non">Non</option>
            </select>
          </div>
          <div className="input-wrapper-addDependant">
            <label>Type de logement (requis): </label>
            <br></br>
            <select name="typeOfHouse" required ref={register}>
              <option value="none" selected disabled hidden>
                Choisir une option
              </option>
              <option value="Propriétaire">Propriétaire</option>
              <option value="Locataire privé sans subvention">
                Locataire privé sans subvention
              </option>
              <option value="Locataire Privé avec subvention">
                Locataire Privé avec subvention
              </option>
              <option value="Maison de chambres sans subvention">
                Maison de chambres sans subvention
              </option>
              <option value="Maison de chambres avec subvention">
                Maison de chambres avec subvention
              </option>
              <option value="Coopérative sans subvention">
                Coopérative sans subvention
              </option>
              <option value="Coopérative avec subvention">
                Coopérative avec subvention
              </option>
              <option value="Logement social HLM (Toujours subventionné)">
                Logement social HLM (Toujours subventionné)
              </option>
              <option value="Logement supervisé (Toujours subventionné)">
                Logement supervisé (Toujours subventionné)
              </option>
              <option value="Refuge d'urgence">Refuge d'urgence</option>
              <option value="Hébergement pour jeunes">
                Hébergement pour jeunes
              </option>
              <option value="Dans la rue/Sans domicile fixe">
                Dans la rue/Sans domicile fixe
              </option>
              <option value="Avec famille-amis/temporaire">
                Avec famille-amis/temporaire
              </option>
              <option value="Autres">Autres</option>
            </select>
          </div>
          <br></br>
          <p>
            --------------------------------------------------------------------------------------------------------------
          </p>
          <br></br>
          <div className="input-wrapper-addDependant">
            <label>Source de revenu (requis): </label>
            <br></br>
            <select name="sourceOfRevenue" required ref={register}>
              <option value="none" selected disabled hidden>
                Choisir une option
              </option>
              <option value="Emplois temps plein">Emplois temps plein</option>
              <option value="Emplois temps partiel">
                Emplois temps partiel
              </option>
              <option value="Chômage">Chômage</option>
              <option value="Aide sociale sans contraite sévère à l’emploi">
                Aide sociale sans contraite sévère à l’emploi
              </option>
              <option value="Aide sociale avec contraite sévère à l’emploi">
                Aide sociale avec contraite sévère à l’emploi
              </option>
              <option value="Pension de vieillesse">
                Pension de vieillesse
              </option>
              <option value="Pension d'invalidité (CSST) - RRQ maladie">
                Pension d'invalidité (CSST) - RRQ maladie
              </option>
              <option value="Prêts et bourses – Étudiant">
                Prêts et bourses – Étudiant
              </option>
              <option value="Aucun revenu">Aucun revenu</option>
              <option value="Autres">Autres</option>
            </select>
          </div>
          <div className="input-wrapper-addDependant">
            <label>Composition du foyer (requis): </label>
            <br></br>
            <select name="familyComposition" required ref={register}>
              <option value="none" selected disabled hidden>
                Choisir une option
              </option>
              <option value="Seul, sans dépendant">Seul, sans dépendant</option>
              <option value="Seul avec dépendant">Seul avec dépendant</option>
              <option value="Couple sans dépendant">
                Couple sans dépendant
              </option>
              <option value="Couple avec dépendants">
                Couple avec dépendants
              </option>
              <option value="Partage appartement avec autres personnes indépendantes (coloc/frères/enfants…)">
                Partage appartement avec autres personnes indépendantes
                (coloc/frères/enfants…)
              </option>
              <option value="Autre">Autre</option>
            </select>
          </div>
          <div className="input-wrapper-addDependant">
            <label>
              Nombre de personnes vivant avec ce dépendant (requis):
            </label>
            <br></br>
            <select name="numberOfOtherFamilyMembers" required ref={register}>
              <option value="0" selected>
                0
              </option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
              <option value="11">11</option>
              <option value="12">12</option>
              <option value="13">13</option>
              <option value="14">14</option>
              <option value="15">15</option>
              <option value="16">16</option>
              <option value="17">17</option>
              <option value="18">18</option>
              <option value="19">19</option>
            </select>
          </div>
          <div className="input-wrapper-addDependant" id="1">
            <label>Date de naissance du membre de la famille 1:</label>
            <br></br>
            <input
              name="DOBfamilyMember1"
              className="input-addDependant"
              type="date"
              maxLength="10"
              minLength="4"
              ref={register}
              autoComplete="off"
            ></input>
          </div>
          <div className="input-wrapper-addDependant" id="2">
            <label>Date de naissance du membre de la famille 2:</label>
            <br></br>
            <input
              name="DOBfamilyMember2"
              className="input-addDependant"
              type="date"
              maxLength="10"
              minLength="4"
              ref={register}
              autoComplete="off"
            ></input>
          </div>
          <div className="input-wrapper-addDependant" id="3">
            <label>Date de naissance du membre de la famille 3:</label>
            <br></br>
            <input
              name="DOBfamilyMember3"
              className="input-addDependant"
              type="date"
              maxLength="10"
              minLength="4"
              ref={register}
              autoComplete="off"
            ></input>
          </div>
          <div className="input-wrapper-addDependant" id="4">
            <label>Date de naissance du membre de la famille 4:</label>
            <br></br>
            <input
              name="DOBfamilyMember4"
              className="input-addDependant"
              type="date"
              maxLength="10"
              minLength="4"
              ref={register}
              autoComplete="off"
            ></input>
          </div>
          <div className="input-wrapper-addDependant" id="5">
            <label>Date de naissance du membre de la famille 5:</label>
            <br></br>
            <input
              name="DOBfamilyMember5"
              className="input-addDependant"
              type="date"
              maxLength="10"
              minLength="4"
              ref={register}
              autoComplete="off"
            ></input>
          </div>
          <div className="input-wrapper-addDependant" id="6">
            <label>Date de naissance du membre de la famille 6:</label>
            <br></br>
            <input
              name="DOBfamilyMember6"
              className="input-addDependant"
              type="date"
              maxLength="10"
              minLength="4"
              ref={register}
              autoComplete="off"
            ></input>
          </div>
          <div className="input-wrapper-addDependant" id="7">
            <label>Date de naissance du membre de la famille 7:</label>
            <br></br>
            <input
              name="DOBfamilyMember7"
              className="input-addDependant"
              type="date"
              maxLength="10"
              minLength="4"
              ref={register}
              autoComplete="off"
            ></input>
          </div>
          <div className="input-wrapper-addDependant" id="8">
            <label>Date de naissance du membre de la famille 8:</label>
            <br></br>
            <input
              name="DOBfamilyMember8"
              className="input-addDependant"
              type="date"
              maxLength="10"
              minLength="4"
              ref={register}
              autoComplete="off"
            ></input>
          </div>
          <div className="input-wrapper-addDependant" id="9">
            <label>DDate de naissance du membre de la famille 9:</label>
            <br></br>
            <input
              name="DOBfamilyMember9"
              className="input-addDependant"
              type="date"
              maxLength="10"
              minLength="4"
              ref={register}
              autoComplete="off"
            ></input>
          </div>
          <div className="input-wrapper-addDependant" id="10">
            <label>Date de naissance du membre de la famille 10:</label>
            <br></br>
            <input
              name="DOBfamilyMember10"
              className="input-addDependant"
              type="date"
              maxLength="10"
              minLength="4"
              ref={register}
              autoComplete="off"
            ></input>
          </div>
          <div className="input-wrapper-addDependant" id="11">
            <label>Date de naissance du membre de la famille 11:</label>
            <br></br>
            <input
              name="DOBfamilyMember11"
              className="input-addDependant"
              type="date"
              maxLength="10"
              minLength="4"
              ref={register}
              autoComplete="off"
            ></input>
          </div>
          <div className="input-wrapper-addDependant" id="12">
            <label>Date de naissance du membre de la famille 12:</label>
            <br></br>
            <input
              name="DOBfamilyMember12"
              className="input-addDependant"
              type="date"
              maxLength="10"
              minLength="4"
              ref={register}
              autoComplete="off"
            ></input>
          </div>
          <div className="input-wrapper-addDependant" id="13">
            <label>Date de naissance du membre de la famille 13:</label>
            <br></br>
            <input
              name="DOBfamilyMember13"
              className="input-addDependant"
              type="date"
              maxLength="10"
              minLength="4"
              ref={register}
              autoComplete="off"
            ></input>
          </div>
          <div className="input-wrapper-addDependant" id="14">
            <label>Date de naissance du membre de la famille 14:</label>
            <br></br>
            <input
              name="DOBfamilyMember14"
              className="input-addDependant"
              type="date"
              maxLength="10"
              minLength="4"
              ref={register}
              autoComplete="off"
            ></input>
          </div>
          <div className="input-wrapper-addDependant" id="15">
            <label>Date de naissance du membre de la famille 15:</label>
            <br></br>
            <input
              name="DOBfamilyMember15"
              className="input-addDependant"
              type="date"
              maxLength="10"
              minLength="4"
              ref={register}
              autoComplete="off"
            ></input>
          </div>
          <div className="input-wrapper-addDependant" id="16">
            <label>Date de naissance du membre de la famille 16:</label>
            <br></br>
            <input
              name="DOBfamilyMember16"
              className="input-addDependant"
              type="date"
              maxLength="10"
              minLength="4"
              ref={register}
              autoComplete="off"
            ></input>
          </div>
          <div className="input-wrapper-addDependant" id="17">
            <label>Date de naissance du membre de la famille 17:</label>
            <br></br>
            <input
              name="DOBfamilyMember17"
              className="input-addDependant"
              type="date"
              maxLength="10"
              minLength="4"
              ref={register}
              autoComplete="off"
            ></input>
          </div>
          <div className="input-wrapper-addDependant" id="18">
            <label>Date de naissance du membre de la famille 18:</label>
            <br></br>
            <input
              name="DOBfamilyMember18"
              className="input-addDependant"
              type="date"
              maxLength="10"
              minLength="4"
              ref={register}
              autoComplete="off"
            ></input>
          </div>
          <div className="input-wrapper-addDependant" id="19">
            <label>Date de naissance du membre de la famille 19:</label>
            <br></br>
            <input
              name="DOBfamilyMember19"
              className="input-addDependant"
              type="date"
              maxLength="10"
              minLength="4"
              ref={register}
              autoComplete="off"
            ></input>
          </div>
          <br></br>
          <p>
            --------------------------------------------------------------------------------------------------------------
          </p>
          <br></br>
          <div className="input-wrapper-addDependant">
            <label>
              Organisme ressource et/ou qui a référé le membre (comme la CNEEST
              ou le CLSC):{" "}
            </label>
            <br></br>
            <input
              name="sourceOrganismName"
              className="input-addDependant"
              type="text"
              maxLength="100"
              ref={register}
              autoComplete="off"
            ></input>
          </div>
          <div className="input-wrapper-addDependant">
            <label>Nom de l’intervenant: </label>
            <br></br>
            <input
              name="socialWorkerNameOrganism"
              className="input-addDependant"
              type="text"
              maxLength="100"
              ref={register}
              autoComplete="off"
            ></input>
          </div>
          <div className="input-wrapper-addDependant">
            <label>Numéro de Téléphone de l’intervenant (___-___-____): </label>
            <br></br>
            <input
              name="socialWorkerPhoneNumberOrganism"
              className="input-addDependant"
              type="tel"
              maxLength="45"
              ref={register}
              autoComplete="off"
            ></input>
          </div>
          <div className="input-wrapper-addDependant">
            <label>Poste: </label>
            <br></br>
            <input
              name="socialWorkerPostOrganism"
              className="input-addDependant"
              type="number"
              max="100000"
              min="0"
              ref={register}
              autoComplete="off"
            ></input>
          </div>
          <div className="input-wrapper-addDependant">
            <label>Curatel: </label>
            <br></br>
            <input
              name="curatelName"
              className="input-addDependant"
              type="text"
              maxLength="100"
              ref={register}
              autoComplete="off"
            ></input>
          </div>
          <div className="input-wrapper-addDependant">
            <label>Nom de l’intervenant: </label>
            <br></br>
            <input
              name="socialWorkerNameCuratel"
              className="input-addDependant"
              type="text"
              maxLength="100"
              ref={register}
              autoComplete="off"
            ></input>
          </div>
          <div className="input-wrapper-addDependant">
            <label>Numéro de Téléphone de l’intervenant (___-___-____): </label>
            <br></br>
            <input
              name="socialWorkerPhoneNumberCuratel"
              className="input-addDependant"
              type="tel"
              maxLength="45"
              ref={register}
              autoComplete="off"
            ></input>
          </div>
          <div className="input-wrapper-addDependant">
            <label>Poste: </label>
            <br></br>
            <input
              name="socialWorkerPostCuratel"
              className="input-addDependant"
              type="number"
              max="100000"
              min="0"
              ref={register}
              autoComplete="off"
            ></input>
          </div>
          <div className="input-wrapper-addDependant">
            <label>Dépôt initial (requis): </label>
            <br></br>
            <input
              name="balance"
              className="input-addDependant"
              type="number"
              step="0.01"
              required
              max="1000"
              min="-1000"
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
