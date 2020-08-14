/*
 * Copyright (C) 2020 Alix Routhier-Lalonde
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import React from "react";
import "./Livraison.css";
import redux from "../index";
import axios from "axios";
import { useHistory } from "react-router-dom";

export const Livraison = (name) => {
  const history = useHistory();

  const dependant = redux.store.getState().dependants[name.props].dependant;
  const address = redux.store.getState().dependants[name.props].address;

  const deleteDependant = () => {
    alert("Êtes-vous sûr que cette livraison a été effectuée?");
    axios
      .post("/api/completelivraison", {
        curuser: redux.store.getState().username,
        id: redux.store.getState().dependants[name.props].id,
      })
      .then((res) => {
        if (res.data !== "success") {
          alert(
            `Veuillez contacter un administrateur de Meet The Need s'il vous plait. Une erreur s'est produite.`
          );
          return;
        }
        console.log("succeded");
        axios
          .post("/api/alllivraisons", {
            curuser: redux.store.getState().username,
          })
          .then((res) => {
            console.log(`statusCode: ${res.statusCode}`);
            redux.store.dispatch(redux.setDependants(res.data));
            history.push("/livraisons");
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
    <li id="livraison">
      <div className="inside-livraison">
        <div className="inside-inside-livraison">
          <p>{dependant}</p>
          <button className="delete-livraison" onClick={deleteDependant}>
            supprimer
          </button>
          <br></br>
        </div>
        <p>{address}</p>
      </div>
    </li>
  );
};
