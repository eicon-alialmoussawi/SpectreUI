import React, { useEffect, useState, useMemo } from "react";
import { Container } from "reactstrap";
import TableContainer from "./TableContainer";
import APIFunctions from "../utils/APIFunctions";

const MainPage = () => {
  useEffect(() => {
    CheckUserIsAdmin();
  }, []);
  const [isAdmin, setAdmin] = React.useState(false);
  const CheckUserIsAdmin = () => {
    APIFunctions.CheckIfUserIsAdmin()
      .then((response) => {
        setAdmin(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  return (
    <div>
      <a href="/AwardsMenu" className="nav-link">
        <i className="far fa-circle nav-icon" />
        <p> Awards</p>
      </a>
      <a href="/Pricing" className="nav-link">
        <i className="far fa-circle nav-icon" />
        <p> Pricing</p>
      </a>
      <a
        href="/Dashboard"
        className="nav-link"
        style={{ display: isAdmin == true ? "" : "none" }}
      >
        <i className="far fa-circle nav-icon" />
        <p> Admin</p>
      </a>

      <a href="/PublicSocioEconomics" className="nav-link">
        <i className="far fa-circle nav-icon" />
        <p> Social Data</p>
      </a>
    </div>
  );
};

export default MainPage;
