/*
 * Copyright (C) 2020 Alix Routhier-Lalonde
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import React from "react";
import { Link } from "react-router-dom";
import "./BackButton.css";

export const BackButton = (props) => {
  return (
    <div className="back-button-div">
      <Link to={props.to} className="back-button-link">
        <button className="back-button">Retour</button>
      </Link>
    </div>
  );
};
