/*
 * Copyright (C) 2020 Alix Routhier-Lalonde
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import React from "react";
import "./Admin.css";
import redux from "../index";
import axios from "axios";
import { useHistory } from "react-router-dom";

export const Admin = (name) => {
  const history = useHistory();

  const deleteAdmin = () => {
    if (name.props === "admin")
      alert(`Vous ne pouvez pas supprimer cet administrateur d'urgence`);
    else if (name.props === redux.store.getState().username)
      alert(`Vous ne pouvez pas supprimer votre propre compte administrateur`);
    else {
      alert("Êtes-vous sûr que vous voulez supprimer cet administrateur?");
      axios
        .post("/api/removeadministrator", {
          username: name.props,
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
            .post("/api/alladministrators", {
              curuser: redux.store.getState().username,
            })
            .then((res) => {
              console.log(`statusCode: ${res.statusCode}`);
              redux.store.dispatch(redux.setAdmins(res.data));
              history.push("/removeadministrator");
            })
            .catch((error) => {
              console.error(error);
            });
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  return (
    <li id="admin" key={name.props}>
      <div className="inside-admin">
        <p>{name.props}</p>
        <button className="delete-admin" onClick={deleteAdmin}>
          supprimer
        </button>
      </div>
    </li>
  );
};
