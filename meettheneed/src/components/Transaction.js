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
    alert("Êtes-vous sûr que vous voulez supprimer ce dépendant?");
    axios
      .post("/api/removetransaction", {
        id: id,
        curuser: redux.store.getState().username,
      })
      .then((res) => {
        console.log(res.data);
        if (res.data !== "success") {
          alert(
            `Veuillez contacter un administrateur de Meet The Need s'il vous plait. Une erreur s'est produite.`
          );
          return;
        }
        console.log("succeded");
        axios
          .post("/api/alltransactions", {
            curuser: redux.store.getState().username,
          })
          .then((res) => {
            console.log(`statusCode: ${res.statusCode}`);
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
