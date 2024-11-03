import React from "react";
import { Route, Redirect } from "react-router-dom";
import { getToken } from "../utils/common";

import PublicHeader from "../PublicHeader";
// handle the public routes
function PublicRoute({ component: Component, ...rest }) {
  if(getToken()) {
    var publicInnerWebStyles = document.getElementById("publicInnerWebStyles");
    var forIndexAndInner = document.getElementById("forIndexAndInner");
    var forInnerOnly = document.getElementById("forInnerOnly");
    var indexSpectreIcons = document.getElementById("indexSpectreIcons");
    var publicWebRTLStyles = document.getElementById("publicWebRTLStyles");
    var publicWebLTRStyles = document.getElementById("publicWebLTRStyles");
    publicInnerWebStyles.removeAttribute("disabled");
    forIndexAndInner.removeAttribute("disabled");
    forInnerOnly.removeAttribute("disabled");
    indexSpectreIcons.setAttribute("disabled", "disabled");
    publicWebLTRStyles.setAttribute("disabled", "disabled");
    publicWebRTLStyles.setAttribute("disabled", "disabled");
  }
  return (
    <div>
      <PublicHeader />
      <Route
        {...rest}
        render={(props) =>
          !getToken() ? (
            <Component {...props} />
          ) : (
            <Redirect to={{ pathname: "/Default" }} />
          )
        }
      />
    </div>
  );
}

export default PublicRoute;
