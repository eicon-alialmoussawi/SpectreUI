import React, { useEffect, useState } from "react";
import APIFunctions from "../utils/APIFunctions";

import PropTypes from "prop-types";
export const AuthContext = React.createContext({});

export default function Auth({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    checkAuth();
  }, []);
  const checkAuth = () => {
    alert("hah");
    if (localStorage.getItem("Spectre_Token") == null) return false;
    APIFunctions.CheckIfUserIsAdmin(localStorage.getItem("Spectre_Token"))
      .then((response) => {
        alert(response.data);
        setIsAuthenticated(response.data);
        setIsLoading(false);
        //  return response.data;
      })
      .catch((e) => {
        console.log(e);
        return false;
      });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

Auth.propTypes = {
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.array]),
};
