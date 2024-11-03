import React, { Component } from "react";
import { getUser, removeUserSession, getLang } from "./utils/common";
import { Link } from "react-router-dom";
import APIFunctions from "./utils/APIFunctions";
import Logo from "./Assets/Images/logo2.svg";
import $ from "jquery";
import { getValue } from "./Assets/Language/Entries";

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = { isAdmin: false, arrMenu: [], arrUsing: [] };
    this.GetMenu = this.GetMenu.bind(this);
    this.BindMenu = this.BindMenu.bind(this);
    this.addClass = this.addClass.bind(this);
  }

  componentWillMount() {
    APIFunctions.checkTokenValditiy(localStorage.getItem("Spectre_Token"))
      .then((response) => {
        if (response.data !== "Valid") {
          localStorage.removeItem("Spectre_Token");
          localStorage.removeItem("userId");
          localStorage.removeItem("userName");
          localStorage.removeItem("Spectre_IsAdmin");
          localStorage.removeItem("Spectre_AllowClientToChooseBePositive");

          window.open("/", "_self");
        }
      })
      .catch((e) => {
        localStorage.removeItem("Spectre_Token");
        localStorage.removeItem("userId");
        localStorage.removeItem("userName");
        localStorage.removeItem("Spectre_IsAdmin");
        localStorage.removeItem("Spectre_AllowClientToChooseBePositive");

        window.open("/", "_self");
      });
  }

  componentDidMount() {
    this.CheckUserIsAdmin();
    this.GetUsing();
    // this.GetMenu();
    document.documentElement.setAttribute(
      "lang",
      getLang() === "ar" ? "ar" : "en"
    );
    document.documentElement.setAttribute(
      "dir",
      getLang() === "ar" ? "rtl" : "ltr"
    );
    document.body.classList.remove("landing");
    if (getLang() == "ar") {
      document
        .getElementById("publicInnerWebStyles")
        .setAttribute("disabled", "disabled");
      document
        .getElementById("publicInnerRTLWebStyles")
        .removeAttribute("disabled");
    } else {
      document
        .getElementById("publicInnerWebStyles")
        .removeAttribute("disabled");
      document
        .getElementById("publicInnerRTLWebStyles")
        .setAttribute("disabled", "disabled");
    }
  }

  GetUsing() {
    APIFunctions.getAllHelpUsing()
      .then((response) => {
        this.setState({ arrUsing: response.data });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  CheckUserIsAdmin = async () => {
    APIFunctions.CheckIfUserIsAdmin()
      .then((response) => {
        this.setState({ isAdmin: response.data });
      })
      .then(() => {
        this.GetMenu();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  GetMenu() {
    if (!this.state.isAdmin) {
      APIFunctions.getClientMenu()
        .then((response) => {
          this.setState({ arrMenu: response.data });
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      APIFunctions.getPages()
        .then((response) => {
          this.setState({ arrMenu: response.data });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  addClass(page) {
    $(".menuItems").removeClass("active");
    $("#" + page + "_page").addClass("active");
  }

  renderHelpUsing() {
    var _menu = this.state.arrUsing;
    {
      return _menu.map((val, idx) => (
        <li className="sub" id="GettingStarted_page">
          <Link to={"/GettingStartedView/" + val.id}>
            {getLang() == "en"
              ? val.titleEn
              : getLang() == "ar"
              ? val.titleAr
              : val.titleFr}
          </Link>
        </li>
      ));
    }
  }

  BindMenu() {
    var _menu = this.state.arrMenu;
    {
      return _menu.map((val, idx) => (
        <li
          className="submenu menuItems"
          id={val.pageUrl + "_page"}
          onClick={(e) => {
            this.addClass(val.pageUrl);
          }}
        >
          <Link to={"/" + val.pageUrl}>
            <span>
              {getLang() == "en"
                ? val.name
                : getLang() == "fr"
                ? val.nameFr
                : val.nameAr}
            </span>
          </Link>
        </li>
      ));
    }
  }

  render() {
    const handleLogout = () => {
      removeUserSession();
      window.location.href = "/";
    };
    return (
      <div id="Header_wrapper">
        {/* <style scoped>
                    @import "../public_pages/css/all.min.css";
                </style> */}
        <header className="index-header" id="Header">
          <div id="Top_bar">
            <div className="container">
              <div className="column one">
                <div className="logo">
                  <Link
                    id="logo"
                    to="/Default"
                    title="Spectre home"
                    data-height={60}
                    data-padding={25}
                  >
                    <img
                      className="logo-main scale-with-grid"
                      src={Logo}
                      data-retina={Logo}
                      data-height={33}
                      alt="Spectre Logo"
                    />
                    <img
                      className="logo-sticky scale-with-grid"
                      src={Logo}
                      data-retina={Logo}
                      data-height={33}
                      alt="Spectre Logo"
                    />
                    <img
                      className="logo-mobile scale-with-grid"
                      src={Logo}
                      data-retina={Logo}
                      data-height={33}
                      alt="Spectre Logo"
                    />
                    <img
                      className="logo-mobile-sticky scale-with-grid"
                      src={Logo}
                      data-retina={Logo}
                      data-height={33}
                      alt="Spectre Logo"
                    />
                  </Link>
                </div>
                <div className="menu_wrapper">
                  <nav id="menu">
                    <ul id="menu-main-menu" className="menu menu-main">
                      {this.BindMenu()}{" "}
                      <li className="submenu">
                        <a>
                          {" "}
                          <span>{getValue("Help", getLang())}</span>
                        </a>
                        <ul>
                          <li className="sub">
                            <Link to="/AboutView">
                              {getValue("About", getLang())}
                            </Link>
                          </li>
                          <li className="sub">
                            <Link to="/FQAView">
                              {getValue("FAQ", getLang())}
                            </Link>
                          </li>
                          <li className="sub">
                            <Link to="/GlossaryView">
                              {getValue("Glossary", getLang())}
                            </Link>
                          </li>
                          <li className="sub">
                            <a>{getValue("HelpUsing", getLang())}</a>
                            <ul>{this.renderHelpUsing()}</ul>
                          </li>
                        </ul>
                      </li>
                      <li className="submenu menuItems" id="Account_page">
                        {/* <Link to="/Awards"></Link> */}

                        <Link to="/Account" className="nav-link">
                          {" "}
                          <span>{getValue("Account", getLang())}</span>
                        </Link>
                      </li>
                      <li
                        className="submenu"
                        style={{
                          display: this.state.isAdmin == true ? "" : "none",
                        }}
                      >
                        <a
                          href="/Dashboard"
                          className="nav-link"
                          style={{
                            display: this.state.isAdmin == true ? "" : "none",
                          }}
                        >
                          {" "}
                          <span>{getValue("Admin", getLang())}</span>
                        </a>
                      </li>
                      <li
                        className="submenu logoutClass"
                        onClick={handleLogout}
                      >
                        <a className="nav-link">
                          {" "}
                          <span>{getValue("Logout", getLang())}</span>
                        </a>
                      </li>
                    </ul>
                  </nav>
                  <a className="responsive-menu-toggle" href="#">
                    <i className="icon-menu-fine" />
                  </a>
                </div>
                <div className="top_bar_right_wrapper">
                  <a
                    type="button"
                    className="action_button"
                    onClick={handleLogout}
                  >
                    <i className="icon-lock" /> {getValue("Logout", getLang())}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div id="Side_slide" className="right dark" data-width={250}>
          <div className="close-wrapper">
            <a href="#" className="close">
              <i className="icon-cancel-fine" />
            </a>
          </div>
          <div className="menu_wrapper" />
        </div>
        <div id="body_overlay" />
      </div>
    );
  }
}
