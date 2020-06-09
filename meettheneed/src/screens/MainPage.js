/*
 * Copyright (C) 2020 Alix Routhier-Lalonde
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import React from "react";
import "./MainPage.css";
import { useHistory } from "react-router-dom";

export const MainPage = () => {
  let history = useHistory();

  const goAdmin = () => history.push("/auth");
  const goEmployee = () => history.push("/crm");

  return (
    <div className="row">
      <button className="button-mainpage" onClick={goAdmin}>
        Administrateur
      </button>
      <button className="button-mainpage" onClick={goEmployee}>
        Employé
      </button>
    </div>
  );
};
