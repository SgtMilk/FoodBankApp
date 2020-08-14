/*
 * Copyright (C) 2020 Alix Routhier-Lalonde, Winkel Yin
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./App.css";
import { MainPage } from "./screens/MainPage";
import { Authentification } from "./screens/Authentification";
import { NotFoundPage } from "./screens/NotFoundPage";
import { CRMPage } from "./screens/CRMPage";
import { Dashboard } from "./screens/Dashboard";
import { Dependants } from "./screens/Dependants";
import { Administrateurs } from "./screens/Administrateurs";
import { ChangePassword } from "./screens/ChangePassword";
import { AddAdministrator } from "./screens/AddAdministrator";
import { RemoveAdministrator } from "./screens/RemoveAdministrator";
import { AddDependant } from "./screens/AddDependant";
import { RemoveDependant } from "./screens/RemoveDependant";
import { SearchDependant } from "./screens/SearchDependant";
import { ModifyDependant } from "./screens/ModifyDependant";
import { RenewCard } from "./screens/RenewCard";
import { Debt } from "./screens/Debt";
import { Livraisons } from "./screens/Livraisons";
import { Rapports } from "./screens/Rapports";
import { ChangePrices } from "./screens/ChangePrices";
import { YearlyReport } from "./screens/YearlyReport";
import { WeeklyReport } from "./screens/WeeklyReport";
import { DailyReport } from "./screens/DailyReport";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={MainPage} />
        <Route path="/auth" exact component={Authentification} />
        <Route path="/crm" exact component={CRMPage} />
        <Route path="/dashboard" exact component={Dashboard} />
        <Route path="/dependants" exact component={Dependants} />
        <Route path="/administrateurs" exact component={Administrateurs} />
        <Route path="/changepassword" exact component={ChangePassword} />
        <Route path="/addadministrator" exact component={AddAdministrator} />
        <Route path="/adddependant" exact component={AddDependant} />
        <Route path="/removedependant" exact component={RemoveDependant} />
        <Route path="/searchdependants" exact component={SearchDependant} />
        <Route
          path="/removeadministrator"
          exact
          component={RemoveAdministrator}
        />
        <Route path="/modifydependant" exact component={ModifyDependant} />
        <Route path="/renewcard" exact component={RenewCard} />
        <Route path="/debt" exact component={Debt} />
        <Route path="/rapports" exact component={Rapports} />
        <Route path="/livraisons" exact component={Livraisons} />
        <Route path="/changeprices" exact component={ChangePrices} />
        <Route path="/yearlyreport" exact component={YearlyReport} />
        <Route path="/weeklyreport" exact component={WeeklyReport} />
        <Route path="/dailyreport" exact component={DailyReport} />
        <Route component={NotFoundPage} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
