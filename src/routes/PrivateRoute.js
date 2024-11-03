import { Route, Redirect } from "react-router-dom";

import APIFunctions from "../utils/APIFunctions";
import React, { useState, useEffect, useMemo, useRef } from "react";

// handle the private routes
function PrivateRoute({ component: Component, ...rest }) {
  const [isAdmin, setIsAdmin] = useState(false);

  const CheckIfUserIsAdmin = () => {
    if (localStorage.getItem("Spectre_Token") == null) setIsAdmin(false);
    APIFunctions.CheckIfUserIsAdmin(localStorage.getItem("Spectre_Token"))
      .then((response) => {
        if (response.data) return <Component {...rest} />;
        else
          <Redirect
            to={{ pathname: "/Default", state: { from: rest.location } }}
          />;
      })
      .catch((e) => {
        localStorage.removeItem("Spectre_Token");
        localStorage.removeItem("userId");
        localStorage.removeItem("userName");
        localStorage.removeItem("Spectre_IsAdmin");
        localStorage.removeItem("Spectre_AllowClientToChooseBePositive");
        <Redirect
            to={{ pathname: "/", state: { from: rest.location } }}
          />;
        console.log(e);
        setIsAdmin(false);
      });
  };
  return <Route {...rest}>{CheckIfUserIsAdmin()}</Route>;
}

export default PrivateRoute;
