/*
 * Copyright (C) 2020 Alix Routhier-Lalonde
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import React from "react";
import "./Dependant.css";
import redux from "../index";
import axios from "axios";
import { useHistory } from "react-router-dom";

export const Dependant = (name) => {
  const history = useHistory();

  const firstName = redux.store.getState().dependants[name.props].firstName;
  const lastName = redux.store.getState().dependants[name.props].lastName;
  const dateOfBirth = redux.store.getState().dependants[name.props].dateOfBirth;

  const deleteDependant = () => {
    alert("Êtes-vous sûr que vous voulez supprimer ce dépendant?");
    axios
      .post("/api/removedependant", {
        firstName: firstName,
        lastName: lastName,
        dateOfBirth: dateOfBirth,
        curuser: redux.store.getState().username,
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
          .post("/api/alldependants", {
            curuser: redux.store.getState().dependants,
          })
          .then((res) => {
            console.log(`statusCode: ${res.statusCode}`);
            redux.store.dispatch(redux.setDependants(res.data));
            history.push("/removedependant");
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
    <li id="dependant">
      <div className="inside-dependant">
        <p>{`${lastName}, ${firstName} (${dateOfBirth})`}</p>
        <button className="delete-dependant" onClick={deleteDependant}>
          supprimer
        </button>
      </div>
    </li>
  );
};
