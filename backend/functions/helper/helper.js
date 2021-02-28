/*
 * Copyright (C) 2021 Alix Routhier-Lalonde
 * This file is subject to the terms and conditions defined in
 * file "LICENSE.txt", which is part of this source code package.
 */

import connection from "../../sql.js";

const authCheck = (username) => {
  let sqlcheck = `select * from admins where username = "${username}";`;
  connection.query(sqlcheck, (err, result) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    }
    if (result[0] != null) {
      return true;
    } else return false;
  });
};

function validateEmail(email) {
  let re = /^(?:[a-z0-9!#$%&amp;"*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&amp;"*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;

  return re.test(email);
}

function escapeHTML(unsafe_str) {
  return unsafe_str
    .replace(/</g, "")
    .replace(/>/g, "")
    .replace(/`/g, "'")
    .replace(/{/g, "")
    .replace(/}/g, "")
    .replace(/;/g, "");
}

const choose = (depannage, livraison, christmasBasket, variables) => {
  if (livraison == false && depannage == false && christmasBasket == false)
    return variables.priceBasket;
  else if (livraison == true && depannage == false && christmasBasket == false)
    return variables.priceBasketLivraison;
  else if (livraison == false && depannage == true && christmasBasket == false)
    return variables.priceBasketDepannage;
  else if (livraison == false && depannage == false && christmasBasket == true)
    return variables.priceBasketChristmas;
  else if (livraison == true && depannage == true && christmasBasket == false)
    return variables.priceBasketDepannageLivraison;
  else if (livraison == false && depannage == true && christmasBasket == true)
    return variables.priceBasketDepannageChristmas;
  else if (livraison == true && depannage == false && christmasBasket == true)
    return variables.priceBasketLivraisonChristmas;
  else if (livraison == true && depannage == false && christmasBasket == true)
    return variables.priceBasketDepannageLivraisonChristmas;
  else {
    console.log("error remove transaction");
    return 0;
  }
};

export default { authCheck, validateEmail, escapeHTML, choose };
