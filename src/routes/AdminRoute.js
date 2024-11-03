import { Route, Redirect } from "react-router-dom";

import APIFunctions from "../utils/APIFunctions";
import React, { useContext } from "react";
import { getToken, checkToken, checkIsAdminToken } from "../utils/common";

import { AuthContext } from "./ValidateIsAdmin";
import Header from "../Header";
import Menu from "../Menu";
import Footer from "../Footer";
// handle the private routes
function AdminRoute({ component: Component, ...rest }) {
  const { isAuthenticated, isLoading } = useContext(AuthContext);

  return (
    <div>
      <Header />
      <Menu />{" "}
      <Route
        {...rest}
        render={(props) =>
          checkIsAdminToken() == true && checkToken() ? (
            <Component {...props} />
          ) : (
            <Redirect
              to={{ pathname: "/Default", state: { from: props.location } }}
            />
          )
        }
      />
      <Footer />
    </div>
  );
}

export default AdminRoute;
