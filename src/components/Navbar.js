import React from "react";
// import { NavLink } from "./NavbarElements";

import { BrowserRouter, Switch, Route, NavLink } from "react-router-dom";
const BindMenu = () => {
    var html = "";
    return (
        <NavLink activeClassName="active" to="/About">
            About
        </NavLink>
    );
};
const Navbar = () => {
    return (
        <div className="header" id="nav">
            <NavLink exact activeClassName="active" to="/">
                Home
            </NavLink>{" "}
            <NavLink exact activeClassName="active" to="/User">
                Users
            </NavLink>
            <NavLink exact activeClassName="active" to="/Lookup">
                Lookups
            </NavLink>{" "}
            <NavLink exact activeClassName="active" to="/Role">
                Roles
            </NavLink>{" "}
            <NavLink exact activeClassName="active" to="/Awards">
                Awards
            </NavLink>{" "}
            <NavLink exact activeClassName="active" to="/Bands">
                Bands
            </NavLink>{" "}
            <NavLink exact activeClassName="active" to="/SocioEconomics">
                SocioEconomics
            </NavLink>
            <NavLink activeClassName="active" to="/login">
                Login
            </NavLink>
            <small>(Access without token only)</small>
            <NavLink activeClassName="active" to="/dashboard">
                Dashboard
            </NavLink>
            <small>(Access with token only)</small>
            <BindMenu></BindMenu>
        </div>
    );
};
export default Navbar;
