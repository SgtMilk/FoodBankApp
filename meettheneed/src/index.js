/*
 * Copyright (C) 2020 Alix Routhier-Lalonde
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { createStore } from "redux";

//ACTIONS
const setUser = (username) => {
  return {
    type: "SETUSER",
    username: username,
  };
};

const logout = () => {
  return {
    type: "SETUSER",
    username: undefined,
  };
};

const setAdmins = (admins) => {
  return {
    type: "SETADMINS",
    admins: admins,
  };
};

const setDependants = (dependants) => {
  return {
    type: "SETDEPENDANTS",
    dependants: dependants,
  };
};

//REDUCER
const curuser = (state, action) => {
  if (action.type === "SETUSER")
    return {
      username: action.username,
      admins: [],
      dependants: [],
    };
  else if (action.type === "SETADMINS")
    return {
      username: state.username,
      admins: action.admins,
      dependants: [],
    };
  else if (action.type === "SETDEPENDANTS")
    if (state === undefined) {
      return {
        username: undefined,
        admins: [],
        dependants: action.dependants,
      };
    } else {
      return {
        username: state.username,
        admins: [],
        dependants: action.dependants,
      };
    }
};

let store = createStore(curuser);

//DISPATCH
export default { store, setUser, logout, setAdmins, setDependants };

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
