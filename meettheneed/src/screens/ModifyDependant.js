/*
 * Copyright (C) 2020 Alix Routhier-Lalonde
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import React from "react";
import "./ModifyDependant.css";
import { BackButton } from "../components/BackButton";
import { useForm } from "react-hook-form";
import redux from "../index";
import { Redirect, useHistory } from "react-router-dom";
const axios = require("axios");

export const ModifyDependant = () => {
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
    values.curuser = redux.store.getState().username;
    values.id = redux.store.getState().dependants.id;

    axios
      .post("/api/modifydependant", values)
      .then((res) => {
        console.log(`statusCode: ${res.status}`);
        if (res.status !== 200)
          alert(
            `Une erreur de communication s'est effectuée. Ceci est probablement un problème de connection wifi. Si l'erreur persiste, veuillez contacter un développeur de Meet The Need s'il vous plait.`
          );
        if (res.data.message === "success") {
          alert("Le compte a été modifié avec succès");
          redux.store.dispatch(redux.setDependants({}));
          history.push("/searchdependants");
        } else {
          alert(
            `Veuillez contacter un développeur de Meet The Need s'il vous plait. Une erreur s'est produite.`
          );
          redux.store.dispatch(redux.setDependants({}));
          history.push("/searchdependants");
        }
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

  return (
    <div className="modifyDependant">
      <script> {authCheck()}</script>
      <p id="title">Modifier les informations d'un dépendant</p>
      <BackButton to="/searchdependants" />
      <div className="form-modifyDependant">
        <form
          onSubmit={handleSubmit(onSubmit)}
          onChange={handleSubmit(onChange)}
          id="form-modifyDependant"
        >
          <div className="input-wrapper-modifyDependant">
            <label>Sexe (requis): </label>
            <br></br>
            <select
              name="sex"
              required
              ref={register}
              defaultValue={redux.store.getState().dependants.sex}
            >
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
          <div className="input-wrapper-modifyDependant">
            <label>Statut d'étudiant (requis): </label>
            <br></br>
            <select
              name="studentStatus"
              required
              ref={register}
              defaultValue={redux.store.getState().dependants.studentStatus}
            >
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
          <div className="input-wrapper-modifyDependant">
            <label>Statut de membre (requis): </label>
            <br></br>
            <select
              name="memberStatus"
              required
              ref={register}
              defaultValue={redux.store.getState().dependants.memberStatus}
            >
              <option value="none" selected disabled hidden>
                Choisir une option
              </option>
              <option value="Membre régulier ">Membre régulier </option>
              <option value="Membre honoraire">Membre honoraire</option>
            </select>
          </div>
          <div className="input-wrapper-modifyDependant">
            <label>Statut de bénévole (requis): </label>
            <br></br>
            <select
              name="volunteerStatus"
              required
              ref={register}
              defaultValue={redux.store.getState().dependants.volunteerStatus}
            >
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
          <div className="input-wrapper-modifyDependant">
            <label>Courriel:</label>
            <br></br>
            <input
              name="email"
              className="input-modifyDependant"
              type="email"
              maxLength="45"
              minLength="2"
              ref={register}
              autoComplete="new-password"
              defaultValue={redux.store.getState().dependants.email}
            ></input>
          </div>
          <div className="input-wrapper-modifyDependant">
            <label>Numéro de téléphone à la maison (___-___-____): </label>
            <br></br>
            <input
              name="homePhoneNumber"
              className="input-modifyDependant"
              type="tel"
              maxLength="45"
              minLength="2"
              ref={register}
              autoComplete="new-password"
              defaultValue={redux.store.getState().dependants.homePhoneNumber}
            ></input>
          </div>
          <div className="input-wrapper-modifyDependant">
            <label>Numéro de téléphone cellulaire (___-___-____): </label>
            <br></br>
            <input
              name="cellphoneNumber"
              className="input-modifyDependant"
              type="tel"
              maxLength="45"
              minLength="2"
              ref={register}
              autoComplete="new-password"
              defaultValue={redux.store.getState().dependants.cellphoneNumber}
            ></input>
          </div>
          <br></br>
          <p>
            --------------------------------------------------------------------------------------------------------------
          </p>
          <br></br>
          <div className="input-wrapper-modifyDependant">
            <label>Numéro de porte (requis): </label>
            <br></br>
            <input
              name="homeNumber"
              className="input-modifyDependant"
              type="number"
              max="100000"
              min="0"
              ref={register}
              autoComplete="new-password"
              required
              defaultValue={redux.store.getState().dependants.homeNumber}
            ></input>
          </div>
          <div className="input-wrapper-modifyDependant">
            <label>Rue (requis): </label>
            <br></br>
            <input
              name="homeStreet"
              className="input-modifyDependant"
              type="text"
              maxLength="45"
              minLength="2"
              ref={register}
              autoComplete="new-password"
              required
              defaultValue={redux.store.getState().dependants.homeStreet}
            ></input>
          </div>
          <div className="input-wrapper-modifyDependant">
            <label>Numéro d'appartement: </label>
            <br></br>
            <input
              name="appartmentNumber"
              className="input-modifyDependant"
              type="text"
              maxLength="45"
              ref={register}
              autoComplete="new-password"
              defaultValue={redux.store.getState().dependants.appartmentNumber}
            ></input>
          </div>
          <div className="input-wrapper-modifyDependant">
            <label>Étage: </label>
            <br></br>
            <input
              name="appartmentLevel"
              className="input-modifyDependant"
              type="text"
              maxLength="45"
              ref={register}
              autoComplete="new-password"
              defaultValue={redux.store.getState().dependants.appartmnentLevel}
            ></input>
          </div>
          <div className="input-wrapper-modifyDependant">
            <label>Code de la sonnette (pour livraison)</label>
            <br></br>
            <input
              name="homeEntryCode"
              className="input-modifyDependant"
              type="text"
              maxLength="45"
              ref={register}
              autoComplete="new-password"
              defaultValue={redux.store.getState().dependants.homeEntryCode}
            ></input>
          </div>
          <div className="input-wrapper-modifyDependant">
            <label>Code Postal (requis): </label>
            <br></br>
            <input
              name="homePostalCode"
              className="input-modifyDependant"
              type="text"
              maxLength="20"
              minLength="2"
              ref={register}
              autoComplete="new-password"
              required
              defaultValue={redux.store.getState().dependants.homePostalCode}
            ></input>
          </div>
          <div className="input-wrapper-modifyDependant">
            <label>Preuve de résidence montrée (requis): </label>
            <br></br>
            <select
              name="residencyProofStatus"
              required
              ref={register}
              defaultValue={
                redux.store.getState().dependants.residencyProofStatus
              }
            >
              <option value="none" selected disabled hidden>
                Choisir une option
              </option>
              <option value="Oui">Oui</option>
              <option value="Non">Non</option>
            </select>
          </div>
          <div className="input-wrapper-modifyDependant">
            <label>Type de logement (requis): </label>
            <br></br>
            <select
              name="typeOfHouse"
              required
              ref={register}
              defaultValue={redux.store.getState().dependants.typeOfHouse}
            >
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
          <div className="input-wrapper-modifyDependant">
            <label>Source de revenu (requis): </label>
            <br></br>
            <select
              name="sourceOfRevenue"
              required
              ref={register}
              defaultValue={redux.store.getState().dependants.sourceOfRevenue}
            >
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
          <div className="input-wrapper-modifyDependant">
            <label>Composition du foyer (requis): </label>
            <br></br>
            <select
              name="familyComposition"
              required
              ref={register}
              defaultValue={redux.store.getState().dependants.familyComposition}
            >
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
          <div className="input-wrapper-modifyDependant">
            <label>
              Nombre de personnes vivant avec ce dépendant (requis):
            </label>
            <br></br>
            <select
              name="numberOfOtherFamilyMembers"
              required
              ref={register}
              defaultValue={
                redux.store.getState().dependants.numberOfOtherFamilyMembers
              }
            >
              <option value="none" selected disabled hidden>
                Choisir une option
              </option>
              <option value="0">0</option>
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
          <div className="input-wrapper-modifyDependant" id="1">
            <label>Date de naissance du membre de la famille 1:</label>
            <br></br>
            <input
              name="DOBfamilyMember1"
              className="input-modifyDependant"
              type="date"
              maxLength="10"
              minLength="4"
              ref={register}
              autoComplete="new-password"
              defaultValue={redux.store.getState().dependants.DOBfamilyMember1}
            ></input>
          </div>
          <div className="input-wrapper-modifyDependant" id="2">
            <label>Date de naissance du membre de la famille 2:</label>
            <br></br>
            <input
              name="DOBfamilyMember2"
              className="input-modifyDependant"
              type="date"
              maxLength="10"
              minLength="4"
              ref={register}
              autoComplete="new-password"
              defaultValue={redux.store.getState().dependants.DOBfamilyMember2}
            ></input>
          </div>
          <div className="input-wrapper-modifyDependant" id="3">
            <label>Date de naissance du membre de la famille 3:</label>
            <br></br>
            <input
              name="DOBfamilyMember3"
              className="input-modifyDependant"
              type="date"
              maxLength="10"
              minLength="4"
              ref={register}
              autoComplete="new-password"
              defaultValue={redux.store.getState().dependants.DOBfamilyMember3}
            ></input>
          </div>
          <div className="input-wrapper-modifyDependant" id="4">
            <label>Date de naissance du membre de la famille 4:</label>
            <br></br>
            <input
              name="DOBfamilyMember4"
              className="input-modifyDependant"
              type="date"
              maxLength="10"
              minLength="4"
              ref={register}
              autoComplete="new-password"
              defaultValue={redux.store.getState().dependants.DOBfamilyMember4}
            ></input>
          </div>
          <div className="input-wrapper-modifyDependant" id="5">
            <label>Date de naissance du membre de la famille 5:</label>
            <br></br>
            <input
              name="DOBfamilyMember5"
              className="input-modifyDependant"
              type="date"
              maxLength="10"
              minLength="4"
              ref={register}
              autoComplete="new-password"
              defaultValue={redux.store.getState().dependants.DOBfamilyMember5}
            ></input>
          </div>
          <div className="input-wrapper-modifyDependant" id="6">
            <label>Date de naissance du membre de la famille 6:</label>
            <br></br>
            <input
              name="DOBfamilyMember6"
              className="input-modifyDependant"
              type="date"
              maxLength="10"
              minLength="4"
              ref={register}
              autoComplete="new-password"
              defaultValue={redux.store.getState().dependants.DOBfamilyMember6}
            ></input>
          </div>
          <div className="input-wrapper-modifyDependant" id="7">
            <label>Date de naissance du membre de la famille 7:</label>
            <br></br>
            <input
              name="DOBfamilyMember7"
              className="input-modifyDependant"
              type="date"
              maxLength="10"
              minLength="4"
              ref={register}
              autoComplete="new-password"
              defaultValue={redux.store.getState().dependants.DOBfamilyMember7}
            ></input>
          </div>
          <div className="input-wrapper-modifyDependant" id="8">
            <label>Date de naissance du membre de la famille 8:</label>
            <br></br>
            <input
              name="DOBfamilyMember8"
              className="input-modifyDependant"
              type="date"
              maxLength="10"
              minLength="4"
              ref={register}
              autoComplete="new-password"
              defaultValue={redux.store.getState().dependants.DOBfamilyMember8}
            ></input>
          </div>
          <div className="input-wrapper-modifyDependant" id="9">
            <label>DDate de naissance du membre de la famille 9:</label>
            <br></br>
            <input
              name="DOBfamilyMember9"
              className="input-modifyDependant"
              type="date"
              maxLength="10"
              minLength="4"
              ref={register}
              autoComplete="new-password"
              defaultValue={redux.store.getState().dependants.DOBfamilyMember9}
            ></input>
          </div>
          <div className="input-wrapper-modifyDependant" id="10">
            <label>Date de naissance du membre de la famille 10:</label>
            <br></br>
            <input
              name="DOBfamilyMember10"
              className="input-modifyDependant"
              type="date"
              maxLength="10"
              minLength="4"
              ref={register}
              autoComplete="new-password"
              defaultValue={redux.store.getState().dependants.DOBfamilyMember10}
            ></input>
          </div>
          <div className="input-wrapper-modifyDependant" id="11">
            <label>Date de naissance du membre de la famille 11:</label>
            <br></br>
            <input
              name="DOBfamilyMember11"
              className="input-modifyDependant"
              type="date"
              maxLength="10"
              minLength="4"
              ref={register}
              autoComplete="new-password"
              defaultValue={redux.store.getState().dependants.DOBfamilyMember11}
            ></input>
          </div>
          <div className="input-wrapper-modifyDependant" id="12">
            <label>Date de naissance du membre de la famille 12:</label>
            <br></br>
            <input
              name="DOBfamilyMember12"
              className="input-modifyDependant"
              type="date"
              maxLength="10"
              minLength="4"
              ref={register}
              autoComplete="new-password"
              defaultValue={redux.store.getState().dependants.DOBfamilyMember12}
            ></input>
          </div>
          <div className="input-wrapper-modifyDependant" id="13">
            <label>Date de naissance du membre de la famille 13:</label>
            <br></br>
            <input
              name="DOBfamilyMember13"
              className="input-modifyDependant"
              type="date"
              maxLength="10"
              minLength="4"
              ref={register}
              autoComplete="new-password"
              defaultValue={redux.store.getState().dependants.DOBfamilyMember13}
            ></input>
          </div>
          <div className="input-wrapper-modifyDependant" id="14">
            <label>Date de naissance du membre de la famille 14:</label>
            <br></br>
            <input
              name="DOBfamilyMember14"
              className="input-modifyDependant"
              type="date"
              maxLength="10"
              minLength="4"
              ref={register}
              autoComplete="new-password"
              defaultValue={redux.store.getState().dependants.DOBfamilyMember14}
            ></input>
          </div>
          <div className="input-wrapper-modifyDependant" id="15">
            <label>Date de naissance du membre de la famille 15:</label>
            <br></br>
            <input
              name="DOBfamilyMember15"
              className="input-modifyDependant"
              type="date"
              maxLength="10"
              minLength="4"
              ref={register}
              autoComplete="new-password"
              defaultValue={redux.store.getState().dependants.DOBfamilyMember15}
            ></input>
          </div>
          <div className="input-wrapper-modifyDependant" id="16">
            <label>Date de naissance du membre de la famille 16:</label>
            <br></br>
            <input
              name="DOBfamilyMember16"
              className="input-modifyDependant"
              type="date"
              maxLength="10"
              minLength="4"
              ref={register}
              autoComplete="new-password"
              defaultValue={redux.store.getState().dependants.DOBfamilyMember16}
            ></input>
          </div>
          <div className="input-wrapper-modifyDependant" id="17">
            <label>Date de naissance du membre de la famille 17:</label>
            <br></br>
            <input
              name="DOBfamilyMember17"
              className="input-modifyDependant"
              type="date"
              maxLength="10"
              minLength="4"
              ref={register}
              autoComplete="new-password"
              defaultValue={redux.store.getState().dependants.DOBfamilyMember17}
            ></input>
          </div>
          <div className="input-wrapper-modifyDependant" id="18">
            <label>Date de naissance du membre de la famille 18:</label>
            <br></br>
            <input
              name="DOBfamilyMember18"
              className="input-modifyDependant"
              type="date"
              maxLength="10"
              minLength="4"
              ref={register}
              autoComplete="new-password"
              defaultValue={redux.store.getState().dependants.DOBfamilyMember18}
            ></input>
          </div>
          <div className="input-wrapper-modifyDependant" id="19">
            <label>Date de naissance du membre de la famille 19:</label>
            <br></br>
            <input
              name="DOBfamilyMember19"
              className="input-modifyDependant"
              type="date"
              maxLength="10"
              minLength="4"
              ref={register}
              autoComplete="new-password"
              defaultValue={redux.store.getState().dependants.DOBfamilyMember19}
            ></input>
          </div>
          <br></br>
          <p>
            --------------------------------------------------------------------------------------------------------------
          </p>
          <br></br>
          <div className="input-wrapper-modifyDependant">
            <label>
              Organisme ressource et/ou qui a référé le membre (comme la CNEEST
              ou le CLSC):{" "}
            </label>
            <br></br>
            <input
              name="sourceOrganismName"
              className="input-modifyDependant"
              type="text"
              maxLength="100"
              ref={register}
              autoComplete="new-password"
              defaultValue={
                redux.store.getState().dependants.sourceOrganismName
              }
            ></input>
          </div>
          <div className="input-wrapper-modifyDependant">
            <label>Nom de l’intervenant: </label>
            <br></br>
            <input
              name="socialWorkerNameOrganism"
              className="input-modifyDependant"
              type="text"
              maxLength="100"
              ref={register}
              autoComplete="new-password"
              defaultValue={
                redux.store.getState().dependants.socialWorkerNameOrganism
              }
            ></input>
          </div>
          <div className="input-wrapper-modifyDependant">
            <label>Numéro de Téléphone de l’intervenant (___-___-____): </label>
            <br></br>
            <input
              name="socialWorkerPhoneNumberOrganism"
              className="input-modifyDependant"
              type="tel"
              ref={register}
              maxLength="45"
              autoComplete="new-password"
              defaultValue={
                redux.store.getState().dependants
                  .socialWorkerPhoneNumberOrganism
              }
            ></input>
          </div>
          <div className="input-wrapper-modifyDependant">
            <label>Poste: </label>
            <br></br>
            <input
              name="socialWorkerPostOrganism"
              className="input-modifyDependant"
              type="number"
              ref={register}
              max="100000"
              min="0"
              autoComplete="new-password"
              defaultValue={
                redux.store.getState().dependants.socialWorkerPostOrganism
              }
            ></input>
          </div>
          <div className="input-wrapper-modifyDependant">
            <label>Curatel: </label>
            <br></br>
            <input
              name="curatelName"
              className="input-modifyDependant"
              type="text"
              maxLength="100"
              ref={register}
              autoComplete="new-password"
              defaultValue={redux.store.getState().dependants.curatelName}
            ></input>
          </div>
          <div className="input-wrapper-modifyDependant">
            <label>Nom de l’intervenant: </label>
            <br></br>
            <input
              name="socialWorkerNameCuratel"
              className="input-modifyDependant"
              type="text"
              maxLength="100"
              ref={register}
              autoComplete="new-password"
              defaultValue={
                redux.store.getState().dependants.socialWorkerNameCuratel
              }
            ></input>
          </div>
          <div className="input-wrapper-modifyDependant">
            <label>Numéro de Téléphone de l’intervenant (___-___-____): </label>
            <br></br>
            <input
              name="socialWorkerPhoneNumberCuratel"
              className="input-modifyDependant"
              type="tel"
              ref={register}
              maxLength="45"
              autoComplete="new-password"
              defaultValue={
                redux.store.getState().dependants.socialWorkerPhoneNumberCuratel
              }
            ></input>
          </div>
          <div className="input-wrapper-modifyDependant">
            <label>Poste: </label>
            <br></br>
            <input
              name="socialWorkerPostCuratel"
              className="input-modifyDependant"
              type="number"
              ref={register}
              max="100000"
              min="0"
              autoComplete="new-password"
              defaultValue={
                redux.store.getState().dependants.socialWorkerPostCuratel
              }
            ></input>
          </div>
          <div className="input-wrapper-modifyDependant">
            <input
              className="submit-modifyDependant"
              value="Soumettre"
              type="submit"
            ></input>
          </div>
        </form>
        <p id="message-modifyDependant"></p>
        <img id="image-modifyDependant" alt="" />
      </div>
    </div>
  );
};
