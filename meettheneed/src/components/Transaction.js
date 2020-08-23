/*
 * Copyright (C) 2020 Alix Routhier-Lalonde
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import React from "react";
import "./Transaction.css";
import redux from "../index";
import axios from "axios";
import { useHistory } from "react-router-dom";

export const Transaction = (name) => {
  const history = useHistory();

  const id = redux.store.getState().dependants[name.props].id;
  const dependant = redux.store.getState().dependants[name.props].dependant;

  const deleteTransaction = () => {
    alert(
      "Êtes-vous sûr que vous voulez supprimer cette transaction? (Fermer la page si non)"
    );
    axios
      .post("/api/removetransaction", {
        id: id,
        balance: redux.store.getState().dependants[name.props].amount_to_admin,
        dependant: dependant,
        livraison: redux.store.getState().dependants[name.props].livraison,
        christmasBasket: redux.store.getState().dependants[name.props]
          .christmasBasket,
        depannage: redux.store.getState().dependants[name.props].depannage,
        curuser: redux.store.getState().username,
      })
      .then((res) => {
        console.log(`statusCode: ${res.status}`);
        if (res.status !== 200)
          alert(
            `Une erreur de communication s'est effectuée. Ceci est probablement un problème de connection wifi. Si l'erreur persiste, veuillez contacter un développeur de Meet The Need s'il vous plait.`
          );
        if (res.data !== "success") {
          alert(
            `Veuillez contacter un développeur de Meet The Need s'il vous plait. Une erreur s'est produite.`
          );
          return;
        }
        alert(
          `Transaction retirée du système avec succès! Veuillez remettre ${
            redux.store.getState().dependants[name.props].amount_to_admin
          }$ au client.`
        );
        axios
          .post("/api/alltransactions", {
            curuser: redux.store.getState().username,
          })
          .then((res) => {
            console.log(`statusCode: ${res.status}`);
            if (res.status !== 200)
              alert(
                `Une erreur de communication s'est effectuée. Ceci est probablement un problème de connection wifi. Si l'erreur persiste, veuillez contacter un développeur de Meet The Need s'il vous plait.`
              );
            redux.store.dispatch(redux.setDependants(res.data));
            history.push("/transactions");
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <li id="transaction">
      <div className="inside-transaction">
        <p>{dependant}</p>
        <button className="delete-transaction" onClick={deleteTransaction}>
          supprimer
        </button>
      </div>
    </li>
  );
};
