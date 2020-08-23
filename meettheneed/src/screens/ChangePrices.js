/*
 * Copyright (C) 2020 Alix Routhier-Lalonde
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import React from "react";
import "./ChangePrices.css";
import { BackButton } from "../components/BackButton";
import { useForm } from "react-hook-form";
import redux from "../index";
import { useHistory, Redirect } from "react-router-dom";
const axios = require("axios");

export const ChangePrices = () => {
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
    values.curuser = redux.store.getState().username;

    axios
      .post("/api/changeprices", values)
      .then(function (res) {
        console.log(`statusCode: ${res.status}`);
        if (res.status !== 200)
          alert(
            `Une erreur de communication s'est effectuée. Ceci est probablement un problème de connection wifi. Si l'erreur persiste, veuillez contacter un développeur de Meet The Need s'il vous plait.`
          );
        if (res.data !== "success")
          alert(
            `Veuillez contacter un développeur de Meet The Need s'il vous plait. Une erreur s'est produite.`
          );
        else {
          alert("Prix changés avec succès!");
          redux.store.dispatch(redux.setDependants({}));
          history.push("/dashboard");
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <div className="changePrices">
      <script> {authCheck()}</script>
      <p id="title">Changer les prix</p>
      <BackButton to="/dashboard" />
      <div className="form-changePrices">
        <form onSubmit={handleSubmit(onSubmit)}>
          <p>
            Note: N'effectuez pas de retour de panier et un changement de prix
            dans la même journée.
          </p>
          <div className="input-wrapper-changePrices">
            <label>Prix d'un panier</label>
            <br></br>
            <input
              name="priceBasket"
              className="input-changePrices"
              type="number"
              required
              defaultValue={redux.store.getState().dependants.priceBasket}
              ref={register}
              autoComplete="new-password"
              step="0.01"
            ></input>
          </div>
          <div className="input-wrapper-changePrices">
            <label>Prix d'un panier + Dépannage</label>
            <br></br>
            <input
              name="priceBasketDepannage"
              className="input-changePrices"
              type="number"
              required
              defaultValue={
                redux.store.getState().dependants.priceBasketDepannage
              }
              ref={register}
              autoComplete="new-password"
              step="0.01"
            ></input>
          </div>
          <div className="input-wrapper-changePrices">
            <label>Prix d'un panier + Livraison</label>
            <br></br>
            <input
              name="priceBasketLivraison"
              className="input-changePrices"
              type="number"
              required
              defaultValue={
                redux.store.getState().dependants.priceBasketLivraison
              }
              ref={register}
              autoComplete="new-password"
              step="0.01"
            ></input>
          </div>
          <div className="input-wrapper-changePrices">
            <label>Prix d'un panier de Noël</label>
            <br></br>
            <input
              name="priceBasketChristmas"
              className="input-changePrices"
              type="number"
              required
              defaultValue={
                redux.store.getState().dependants.priceBasketChristmas
              }
              ref={register}
              autoComplete="new-password"
              step="0.01"
            ></input>
          </div>
          <div className="input-wrapper-changePrices">
            <label>Prix d'un panier + Dépannage + Livraison</label>
            <br></br>
            <input
              name="priceBasketDepannageLivraison"
              className="input-changePrices"
              type="number"
              required
              defaultValue={
                redux.store.getState().dependants.priceBasketDepannageLivraison
              }
              ref={register}
              autoComplete="new-password"
              step="0.01"
            ></input>
          </div>
          <div className="input-wrapper-changePrices">
            <label>Prix d'un panier de Noël + Depannage</label>
            <br></br>
            <input
              name="priceBasketDepannageChristmas"
              className="input-changePrices"
              type="number"
              required
              defaultValue={
                redux.store.getState().dependants.priceBasketDepannageChristmas
              }
              ref={register}
              autoComplete="new-password"
              step="0.01"
            ></input>
          </div>
          <div className="input-wrapper-changePrices">
            <label>Prix d'un panier de Noël + Livraison</label>
            <br></br>
            <input
              name="priceBasketLivraisonChristmas"
              className="input-changePrices"
              type="number"
              required
              defaultValue={
                redux.store.getState().dependants.priceBasketLivraisonChristmas
              }
              ref={register}
              autoComplete="new-password"
              step="0.01"
            ></input>
          </div>
          <div className="input-wrapper-changePrices">
            <label>Prix d'un panier de Noël + Livraison + Dépannage</label>
            <br></br>
            <input
              name="priceBasketDepannageLivraisonChristmas"
              className="input-changePrices"
              type="number"
              required
              defaultValue={
                redux.store.getState().dependants
                  .priceBasketDepannageLivraisonChristmas
              }
              ref={register}
              autoComplete="new-password"
              step="0.01"
            ></input>
          </div>
          <div className="input-wrapper-changePrices">
            <label>Prix pour devenir membre</label>
            <br></br>
            <input
              name="priceMembership"
              className="input-changePrices"
              type="number"
              required
              defaultValue={redux.store.getState().dependants.priceMembership}
              ref={register}
              autoComplete="new-password"
              step="0.01"
            ></input>
          </div>
          <div className="input-wrapper-changePrices">
            <input
              className="submit-changePrices"
              value="Soumettre"
              type="submit"
            ></input>
          </div>
        </form>
      </div>
    </div>
  );
};
