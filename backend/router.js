/*
 * Copyright (C) 2021 Alix Routhier-Lalonde
 * This file is subject to the terms and conditions defined in
 * file "LICENSE.txt", which is part of this source code package.
 */

const express = require("express");
const router = express.Router();

//==================== IMPORTS ====================//

//----- administrator -----//

import {
  get_administrators,
  add_administrator,
  delete_administrator,
} from "./functions/administrator.js";

//----- dependant -----//

import {
  get_dependants,
  add_dependant,
  delete_dependant,
  delete_dependant_by_ID,
} from "./functions/dependant.js";

import {
  modify_dependant,
  renew_card,
  change_balance,
} from "./functions/modify_dependant.js";

import { crm, crm_ID, search_dependant } from "./functions/search_dependant.js";

//----- livraison -----//

import { get_livraisons, complete_livraison } from "./functions/livraison.js";

//----- login -----//

import { login, change_password } from "./functions/login.js";

//----- price -----//

import { get_prices, change_prices } from "./functions/price.js";

//----- report -----//

import {
  daily_report,
  weekly_report,
  yearly_report,
} from "./functions/report.js";

//----- transaction -----//

import {
  all_transactions,
  add_basket,
  delete_transaction,
} from "./functions/transaction";

//==================== ROUTES ====================//

//----- administrator -----//

router.post("/alladministrators", get_administrators);

router.post("/addadministrator", add_administrator);

router.post("/removeadministrator", delete_administrator);

//----- dependant -----//

router.post("/alldependants", get_dependants);

router.post("/adddependant", add_dependant);

router.post("/removedependant", delete_dependant);

router.post("/removedependantid", delete_dependant_by_ID);

router.post("/modifydependant", modify_dependant);

router.post("/renewcard", renew_card);

router.post("/debt", change_balance);

router.post("/crm", crm);

router.post("/crmid", crm_ID);

router.post("/searchdependant", search_dependant);

//----- livraison -----//

router.post("/alllivraisons", get_livraisons);

router.post("/completelivraison", complete_livraison);

//----- login -----//

router.post("/login", login);

router.post("/changepassword", change_password);

//----- price -----//

router.post("/allprices", get_prices);

router.post("/changeprices", change_prices);

//----- report -----//

router.post("/dailyreport", daily_report);

router.post("/weeklyreport", weekly_report);

router.post("/yearlyreport", yearly_report);

//----- transaction -----//

router.post("/alltransactions", all_transactions);

router.post("/addbasket", add_basket);

router.post("/removetransaction", delete_transaction);

//==================== EXPORTS ====================//

export default router;
