import React, { useState, useEffect, useMemo, useRef, Component } from "react";
import axios from "axios";
import {
  getLang,
  getUser,
  removeUserSession,
  setIMF,
  setLanguage,
  setPPP,
} from "./utils/common";
import APIFunctions from "./utils/APIFunctions";
import Modal from "react-bootstrap/Modal";
import { setUserSession, validateEmail } from "./utils/common";
import Button from "./components/Button";
import { isArray } from "jquery";
import Path from "./Assets/Images/flags.png";
import {
  AlertConfirm,
  AlertError,
  AlertSuccess,
  Alert,
} from "./components/f_Alerts";
import { ReactTelephoneInput } from "react-telephone-input";
import Select from "react-select";
import { getValue } from "./Assets/Language/Entries";
import langEn from "./Assets/Images/flags/gb.svg";
import langFr from "./Assets/Images/flags/fr.svg";
import langAr from "./Assets/Images/flags/sa.svg";

export default class PublicHeader extends Component {
  constructor(props) {
    super(props);
    this.state = { isOpen: false };
    this.state = { title: "Transitioning.." };
    this.state = { loading: false };
    this.state = { username: "" };
    this.state = { password: "" };
    this.state = { error: "" };
    this.state = { aboutUs: [] };
    this.state = { showLogin: true };
    this.state = { ipAddress: "" };

    // this.state = { preRegistration: {id: 0, name: "",email: "",phoneNumber: "",message: "",
    // preferredPackage: 0,isDeleted: false, isViewed: false,creationDate: null }}

    this.state = { prRegid: 0 };
    this.state = { preRegistrationName: "" };
    this.state = { preRegistrationEmail: "" };
    this.state = { preRegistrationPhoneNumber: "" };
    this.state = { preRegistrationMessage: "" };
    this.state = { preRegistrationCompany: "" };
    this.state = { preferredPackage: 0 };
    this.state = { preRegistrationIsDeleted: false };
    this.state = { preRegistrationIsViewed: false };
    this.state = { preRegistrationCreationDate: null };
    this.state = { showVideoViewer: false };

    this.state = { resultPackage: [] };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.renderAboutUs = this.renderAboutUs.bind(this);
    this.getAboutUS = this.getAboutUS.bind(this);
    this.handleRegister = this.handleRegister.bind(this);
    this.getPackages = this.getPackages.bind(this);
    this.saveRegistration = this.saveRegistration.bind(this);
    this.handlePhoneChange = this.handlePhoneChange.bind(this);
    this.handlePackageChange = this.handlePackageChange.bind(this);
    this.returnStyles = this.returnStyles.bind(this);
    this.openRegistrationForms = this.openRegistrationForms.bind(this);
    this.openVideoViewer = this.openVideoViewer.bind(this);
    this.renderUserLanguage = this.renderUserLanguage.bind(this);
    this.changeLang = this.changeLang.bind(this);
  }

  componentDidMount() {
    this.getAboutUS();
    this.getPackages();
    this.GetIpAddress();
    document.documentElement.setAttribute(
      "lang",
      getLang() === "ar" ? "ar" : "en"
    );
    document.documentElement.setAttribute(
      "dir",
      getLang() === "ar" ? "rtl" : "ltr"
    );
    if (getLang() == "ar") {
      document
        .getElementById("publicWebLTRStyles")
        .setAttribute("disabled", "disabled");
      document.getElementById("publicWebRTLStyles").removeAttribute("disabled");
    } else {
      document.getElementById("publicWebLTRStyles").removeAttribute("disabled");
      document
        .getElementById("publicWebRTLStyles")
        .setAttribute("disabled", "disabled");
    }
    document.body.classList.add("landing");
  }

  getPackages() {
    APIFunctions.getPublicPackages()
      .then((resp) => resp)
      .then((resp) => this.setState({ resultPackage: resp.data }));
  }

  getAboutUS() {
    APIFunctions.publicGetWelcome()
      .then((response) => {
        this.setState({ aboutUs: response.data });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  handleChange(event) {
    this.setState({ username: event.target.value });
  }

  GetIpAddress = () => {
    var userIPaddress = "";
    const baseURL = "https://api.ipify.org/";
    axios.get(baseURL).then((response) => {
      console.log("ip address " + response.data);
      userIPaddress = response.data;
      console.log("My public IP address is: " + userIPaddress);
      this.setState({ ipAddress: userIPaddress.toString() });
    });

    // var http = require('http');
    // http.get({'host': 'api.ipify.org', 'port': 80, 'path': '/'}, (resp) => {
    //   resp.on('data', (ip) => {
    //     console.log("My public IP address is: " + ip);
    //     this.setState({ipAddress: ip.toString()});
    //   });
    // });
  };

  handleSubmit(event) {
    this.state.error = null;
    this.state.loading = true;

    var data = {
      userName: this.state.username,
      password: btoa(this.state.password),
      lang: "en",
    };
    console.log(data);
    APIFunctions.login(data)
      .then((response) => {
        this.state.loading = false;

        var UserInfo = JSON.parse(response.data.messageEn);
        if (response.data.success) {
          setUserSession(
            UserInfo.Token,
            UserInfo.UserId,
            UserInfo.UserName,
            UserInfo.IsAdmin,
            UserInfo.AllowClientToChooseBePositive
          );

          window.open("Default", "_self");
        } else {
          //   AlertError(response.data.messageEn);
          this.state.error = response.data.messageEn;
        }
      })
      .catch((error) => {
        console.log(error);
        this.state.loading = false;
        this.state.error = "Something went wrong. Please try again later.";
      });
    event.preventDefault();
  }
  handleChangePassword(event) {
    this.setState({ password: event.target.value });
  }

  handleRegister() {
    this.setState({ showLogin: false });
  }

  handlePackageChange(selectedOptions) {
    this.setState({ preferredPackage: selectedOptions.id });
  }

  handlePhoneChange(telNumber, selectedCountry) {
    this.setState({ preRegistrationPhoneNumber: telNumber });
  }

  openRegistrationForms() {
    var data = this.state.resultPackage;
    var packageId = data.filter((item) => item.isDemoPackage == true);

    if (packageId.length > 0)
      this.setState({
        isOpen: true,
        showLogin: false,
        preferredPackage: packageId[0].id,
      });
    else this.setState({ isOpen: true, showLogin: false });
  }

  openVideoViewer(show) {
    this.setState({ showVideoViewer: show });

    if(!show) 
      document.getElementById("spectre-youtube-video").setAttribute("src", "https://www.youtube.com/embed/nDl2YrRPphY?si=TtGvgwTRs3MWhbJt&rel=0");
  }

  renderUserLanguage() {
    var lang = getLang();
    var langTxt = lang == "en" ? "English" : lang == "ar" ? "عربي" : "Français";
    var flag =
      lang == "en"
        ? "Grand Brittain flag"
        : lang == "ar"
        ? "Saudi Arabia flag"
        : "France flag";
    {
      return (
        <a>
          <img
            className="lang-flag"
            src={lang == "en" ? langEn : lang == "ar" ? langAr : langFr}
            data-retina={lang == "en" ? langEn : lang == "ar" ? langAr : langFr}
            data-height={33}
            alt={flag}
          />
          {langTxt}
        </a>
      );
    }
  }

  changeLang(value) {
    if (value == "en") {
      setLanguage(value);
      window.location.reload(false);
    } else if (value == "ar") {
      setLanguage(value);
      window.location.reload(false);
    } else {
      setLanguage(value);
      window.location.reload(false);
    }
  }

  renderAboutUs() {
    var data = this.state.aboutUs;

    if (data != null && data.length > 0) {
      {
        return data.map((val, idx) => (
          <div className="">
            <h3 className="home-hero-welcome">
              {getLang() == "en"
                ? val.title1En
                : getLang() == "fr"
                ? val.title1Fr
                : val.title1Ar}
            </h3>
            <h1 className="home-hero-heading">
              {getLang() == "en"
                ? val.title2En
                : getLang() == "fr"
                ? val.title2Fr
                : val.title2Ar}
            </h1>
            <small className="home-hero-desc">
              {getLang() == "en"
                ? val.descriptionEn
                : getLang() == "fr"
                ? val.descriptionFr
                : val.descriptionAr}
            </small>
          </div>
        ));
      }
    }
  }

  saveRegistration() {
    if (
      this.state.preRegistrationName == "" ||
      this.state.preRegistrationName == null ||
      this.state.preRegistrationEmail == "" ||
      this.state.preRegistrationEmail == null ||
      this.state.preRegistrationPhoneNumber == "" ||
      this.state.preRegistrationPhoneNumber == null ||
      this.state.preferredPackage == "" ||
      this.state.preferredPackage == null ||
      this.state.preRegistrationCompany == "" ||
      this.state.preRegistrationCompany == null
    ) {
      AlertError("Please fill required fields");
      return;
    }
    if (!validateEmail(this.state.preRegistrationEmail)) {
      AlertError("Please enter a valid email");
      return;
    }

    var obj = new Object();
    obj.id = 0;
    obj.name = this.state.preRegistrationName;
    obj.email = this.state.preRegistrationEmail;
    obj.phoneNumber = this.state.preRegistrationPhoneNumber;
    obj.message = this.state.preRegistrationMessage;
    obj.preferredPackage = this.state.preferredPackage;
    obj.companyName = this.state.preRegistrationCompany;
    obj.isDeleted = false;
    obj.isViewed = false;
    obj.creationDate = null;

    console.log(obj);
    APIFunctions.savePreRegistration(obj)
      .then((response) => {
        if (response.data) {
          AlertSuccess("Request sent successfully");
          setTimeout(() => {
            this.setState({
              isOpen: false,
              preRegistrationName: "",
              preRegistrationEmail: "",
              preRegistrationPhoneNumber: "",
              preRegistrationMessage: "",
              preferredPackage: 0,
              preRegistrationCompany: "",
            });
          }, 500);

          return;
        } else {
          AlertError("Something went wrong");
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }

  returnStyles() {
    if (getLang() == "ar") {
      {
        return (
          <style scoped>
            {/* @import "../public_pages/css/global.rtl.css";
                    @import "../public_pages/css/structure.rtl.css";
                    @import "../public_pages/css/internet2.rtl.css";
                    @import "../public_pages/css/custom.css";
                    @import "../public_pages/css/custom.rtl.css"; */}
          </style>
        );
      }
    } else {
      {
        return (
          <style scoped>
            {/* @import "../public_pages/css/global.css";
                    @import "../public_pages/css/structure.css";
                    @import "../public_pages/css/internet2.css";
                    @import "../public_pages/css/custom.css";
                    @import "../public_pages/css/dashboard.css"; */}
          </style>
        );
      }
    }
  }

  render() {
    const handleLogout = () => {
      removeUserSession();
      window.location.href = "login";
    };
    const ShowLoginForm = () => {
      this.setState({ isOpen: true, showLogin: true });
    };
    const modalLoaded = () => {
      this.setState({ title: "Login Form" });
    };

    const hideModal = () => {
      this.state.isOpen = false;

      this.setState({ title: "Transitioning..." });
      this.setState({ isOpen: false });
    };

    const handleLogin = (e) => {
      e.preventDefault();
      this.setState({ error: null });
      this.setState({ loading: true });

      var data = {
        userName: this.state.username,
        password: btoa(this.state.password),
        lang: "en",
        IPaddress: this.state.ipAddress,
      };

      // console.log("date: ", data);
      APIFunctions.login(data)
        .then((response) => {
          this.setState({ loading: false });
          if (response.data.success) {
            var UserInfo = JSON.parse(response.data.messageEn);

            setUserSession(
              UserInfo.Token,
              UserInfo.UserId,
              UserInfo.UserName,
              UserInfo.IsAdmin,
              UserInfo.AllowClientToChooseBePositive
            );

            if (UserInfo.LoggedInBefore == true)
              window.open("Default", "_self");
            else window.open("Account", "_self");
          } else {
            Alert(response.data.messageEn);
            this.state.error = response.data.messageEn;
          }
        })
        .catch((error) => {
          console.log(error);
          this.state.loading = false;
          this.state.error = "Something went wrong. Please try again later.";
        });
    };

    const getSavedUserFilters = () => {
      console.log("call api");
      APIFunctions.getUserFilters(null)
        .then((response) => {
          var obj = response.data;
          console.log(obj);
          if (obj.length > 0) {
            var imf = obj.filter((item) => item.field == "IMF");
            var ppp = obj.filter((item) => item.field == "PPP");

            setIMF(imf[0].value);
            setPPP(ppp[0].value);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    };
    return (
      <div id="Header_wrapper" class="public-page no-margin-h">
        {" "}
        {this.returnStyles()}
        <header className="index-header" id="Header">
          <div id="Top_bar">
            <div className="container">
              <div className="column one">
                <div className="top_bar_left clearfix">
                  <div className="logo">
                    <a
                      id="logo"
                      href="./"
                      title="Spectre home"
                      data-height={60}
                      data-padding={25}
                    >
                      <img
                        className="logo-main scale-with-grid"
                        src={"./public_pages/images/spectre-logo.svg"}
                        data-retina={"./public_pages/images/spectre-logo.svg"}
                        data-height={33}
                        alt="Spectre Logo"
                      />
                      <img
                        className="logo-sticky scale-with-grid"
                        src={"./public_pages/images/spectre-logo.svg"}
                        data-retina={"./public_pages/images/spectre-logo.svg"}
                        data-height={33}
                        alt="Spectre Logo"
                      />
                      <img
                        className="logo-mobile scale-with-grid"
                        src={"./public_pages/images/spectre-logo.svg"}
                        data-retina={"./public_pages/images/spectre-logo.svg"}
                        data-height={33}
                        alt="Spectre Logo"
                      />
                      <img
                        className="logo-mobile-sticky scale-with-grid"
                        src={"./public_pages/images/spectre-logo.svg"}
                        data-retina={"./public_pages/images/spectre-logo.svg"}
                        data-height={33}
                        alt="Spectre Logo"
                      />
                    </a>
                  </div>
                  <div className="menu_wrapper">
                    <nav id="menu">
                      <ul id="menu-main-menu" className="menu menu-main">
                        <li className="submenu current-menu-item">
                          <a href="#home-about">
                            <span> {getValue("About", getLang())}</span>
                          </a>
                        </li>
                        <li className="submenu">
                          <a href="#home-features">
                            <span>{getValue("Features", getLang())}</span>
                          </a>
                        </li>
                        <li className="submenu">
                          <a href="#home-packages">
                            <span>
                              {getValue("PackagesAndServices", getLang())}
                            </span>
                          </a>
                        </li>
                        <li className="submenu">
                          <a href="#home-news-slider">
                            <span>{getValue("News", getLang())}</span>
                          </a>
                        </li>
                        <li className="submenu">
                          <a href="#home-contact">
                            <span>{getValue("ContactUs", getLang())}</span>
                          </a>
                        </li>
                        <li className="submenu lang-menu">
                          {this.renderUserLanguage()}

                          <ul>
                            <li
                              className="sub"
                              onClick={(e) => this.changeLang("en")}
                            >
                              <img
                                className="lang-flag"
                                src={langEn}
                                data-retina={langEn}
                                data-height={33}
                                alt="Grand Brittain flag"
                              />
                              English
                            </li>
                            <li
                              className="sub"
                              onClick={(e) => this.changeLang("fr")}
                            >
                              <img
                                className="lang-flag"
                                src={langFr}
                                data-retina={langFr}
                                data-height={33}
                                alt="France flag"
                              />
                              Français
                            </li>
                            <li
                              className="sub"
                              onClick={(e) => this.changeLang("ar")}
                            >
                              <img
                                className="lang-flag"
                                src={langAr}
                                data-retina={langAr}
                                data-height={33}
                                alt="Saudi Arabia flag"
                              />
                              عربي
                            </li>
                          </ul>
                        </li>
                      </ul>
                    </nav>
                    <a className="responsive-menu-toggle" href="#">
                      <i className="icon-menu-fine" />
                    </a>
                  </div>
                </div>
                <div className="top_bar_right">
                  <div className="top_bar_right_wrapper">
                    <a
                      onClick={() => ShowLoginForm()}
                      className="action_button"
                      target="_blank"
                    >
                      <i className="icon-lock" /> {getValue("Login", getLang())}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="container">
            <div id="home-hero" className="column one">
              <div className="home-hero-captions">
                {this.renderAboutUs()}
                <div className="home-hero-links">
                  <a
                    className="home-hero-btn home-hero-btn-primary"
                    onClick={(e) => {
                      this.openRegistrationForms();
                    }}
                  >
                    {getValue("RequestADemo", getLang())}{" "}
                  </a>
                  <a
                    className="home-hero-btn home-hero-btn-primary"
                    onClick={(e) => {
                      this.openVideoViewer(true);
                    }}
                  >
                    {getValue("WatchVideo", getLang())}{" "}
                  </a>
                </div>
                <div className="mouse" />
              </div>
            </div>
          </div>
        </header>
        <div 
          className="video-viewer-container" 
          style={{ display: this.state.showVideoViewer ? 'flex' : 'none' }}
        >
          <div className="youtube-video-container">
            <button 
              title="Close" 
              type="button" 
              class="btn-close-video-viewer"
              onClick={(e) => {
                this.openVideoViewer(false);
              }}
            >
              ×
            </button>
            <iframe id="spectre-youtube-video" width="100%" height="100%" src="https://www.youtube.com/embed/nDl2YrRPphY?si=TtGvgwTRs3MWhbJt&rel=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
          </div>
        </div>
        <div>
          <Modal
            onCloseModal={hideModal}
            size="lg"
            show={this.state.isOpen}
            onHide={hideModal}
            onEntered={modalLoaded}
          >
            <Modal.Header closeButton>
              {" "}
              <p
                className="login-box-msg"
                style={{
                  color: "black",
                  fontWeight: "bold",
                  fontSize: "25px",
                  float: "left",
                  padding: "0 0px 0px !important",
                }}
              >
                {this.state.showLogin
                  ? getValue("Login", getLang())
                  : getValue("RegistrationForm", getLang())}
              </p>
            </Modal.Header>
            <Modal.Body className="row">
              {" "}
              <div className=" col-12"></div>
              <div
                className="login-box col-12"
                style={{ direction: getLang() == "ar" ? "rtl" : "ltr" }}
              >
                <div className="card card-outline card-primary">
                  <div className=""></div>
                  <div className="card-body">
                    <hr />
                    <form
                      style={{ display: this.state.showLogin ? "" : "none" }}
                    >
                      <div
                        className="col-lg-6"
                        style={{ float: getLang() == "ar" ? "right" : "left" }}
                      >
                        <div className="mb-3">
                          <div class="col-lg-12">
                            <div className="input-group">
                              <div class="col-lg-12">
                                <label
                                  style={{
                                    float: getLang() == "ar" ? "right" : "left",
                                  }}
                                >
                                  {getValue("Username", getLang())}
                                </label>
                              </div>
                              <input
                                type="text"
                                style={{ borderRadius: "3px" }}
                                className="form-control"
                                placeholder={getValue("Username", getLang())}
                                value={this.state.username}
                                onChange={this.handleChange}
                              />
                              <div className="input-group-append">
                                <div
                                  className="input-group-text"
                                  style={{
                                    color: "#427bff",
                                    backgroundColor: "white",
                                  }}
                                >
                                  <span className="fas fa-envelope" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="mb-3">
                          <div class="col-lg-12">
                            <div className="input-group">
                              <div class="col-lg-12">
                                <label
                                  style={{
                                    float: getLang() == "ar" ? "right" : "left",
                                  }}
                                >
                                  {getValue("Password", getLang())}
                                </label>
                              </div>
                              <input
                                type="password"
                                style={{ borderRadius: "3px" }}
                                className="form-control"
                                placeholder={getValue("Password", getLang())}
                                value={this.state.password}
                                onChange={this.handleChangePassword}
                              />
                              <div className="input-group-append">
                                <div
                                  className="input-group-text"
                                  style={{
                                    color: "#427bff",
                                    backgroundColor: "white",
                                  }}
                                >
                                  <span className="fas fa-lock" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div
                            className="col-12"
                            style={{
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <Button
                              block
                              type="submit"
                              value={
                                this.state.loading ? "Loading..." : "Login"
                              }
                              onClick={handleLogin}
                              disabled={this.state.loading}
                              style={{ fontWeight: "bold", width: "40%" }}
                            >
                              {getValue("Login", getLang())}
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div
                        className="col-lg-6"
                        style={{ float: getLang() == "ar" ? "left" : "right" }}
                      >
                        <p
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            paddingTop: "65px",
                            color: "black",
                            fontWeight: "bold",
                          }}
                        >
                          {getValue("SendRegistrationRequest", getLang())}
                        </p>
                        <div
                          className="col-lg-12"
                          style={{ display: "flex", justifyContent: "center" }}
                        >
                          <Button
                            onClick={this.handleRegister}
                            style={{
                              backgroundColor: "#0a1843",
                              width: "40%",
                              fontWeight: "bold",
                              borderColor: "#0a1843",
                            }}
                          >
                            {getValue("Register", getLang())}
                          </Button>
                        </div>
                      </div>
                    </form>
                    {/* 
                    Working On Sending Registrations */}

                    <form
                      style={{ display: this.state.showLogin ? "none" : "" }}
                    >
                      <div
                        className="col-lg-6"
                        style={{ float: getLang() == "ar" ? "right" : "left" }}
                      >
                        <div className="mb-3">
                          <div class="col-lg-12">
                            <div className="form-group">
                              <label
                                style={{
                                  float: getLang() == "ar" ? "right" : "left",
                                }}
                              >
                                {getValue("Name", getLang())}
                                <small className="text-danger"> * </small>
                              </label>
                              <input
                                style={{ width: "100%", borderRadius: "3px" }}
                                type="text"
                                className="form-control"
                                placeholder={getValue("Name", getLang())}
                                value={this.state.preRegistrationName}
                                onChange={(e) => {
                                  this.setState({
                                    preRegistrationName: e.target.value,
                                  });
                                }}
                              />
                            </div>
                          </div>
                          <div class="col-lg-12">
                            <div className="form-group">
                              <label
                                style={{
                                  float: getLang() == "ar" ? "right" : "left",
                                }}
                              >
                                {getValue("Email", getLang())}
                                <small className="text-danger"> * </small>
                              </label>
                              <input
                                style={{ width: "100%", borderRadius: "3px" }}
                                type="text"
                                className="form-control"
                                placeholder={getValue("Email", getLang())}
                                value={this.state.preRegistrationEmail}
                                onChange={(e) => {
                                  this.setState({
                                    preRegistrationEmail: e.target.value,
                                  });
                                }}
                              />
                            </div>
                          </div>
                          <div class="col-lg-12">
                            <div className="form-group">
                              <label
                                style={{
                                  float: getLang() == "ar" ? "right" : "left",
                                }}
                              >
                                {getValue("CompanyName", getLang())}
                                <small className="text-danger"> * </small>
                              </label>
                              <input
                                style={{ width: "100%", borderRadius: "3px" }}
                                type="text"
                                className="form-control"
                                placeholder={getValue("CompanyName", getLang())}
                                value={this.state.preRegistrationCompany}
                                onChange={(e) => {
                                  this.setState({
                                    preRegistrationCompany: e.target.value,
                                  });
                                }}
                              />
                            </div>
                          </div>
                          <div class="col-lg-12">
                            <div className="form-group">
                              <label
                                style={{
                                  float: getLang() == "ar" ? "right" : "left",
                                }}
                              >
                                {getValue("PreferredPackage", getLang())}
                                <small className="text-danger"> * </small>
                              </label>
                              <Select
                                id="ddlPackages"
                                name="id"
                                value={this.state.resultPackage.find((obj) => {
                                  return obj.id == this.state.preferredPackage;
                                })}
                                getOptionLabel={(option) => option.nameEn}
                                getOptionValue={(option) => option.id}
                                options={this.state.resultPackage}
                                onChange={this.handlePackageChange}
                              ></Select>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div
                        className="col-lg-6"
                        style={{ float: getLang() == "ar" ? "left" : "right" }}
                      >
                        <div
                          class="col-lg-12"
                          style={{
                            direction: getLang() == "ar" ? "ltr" : "rtl",
                          }}
                        >
                          <div className="form-group">
                            <label
                              style={{
                                float: getLang() == "ar" ? "right" : "",
                              }}
                            >
                              {getValue("PhoneNumber", getLang())}
                              <small className="text-danger"> * </small>
                            </label>
                            <ReactTelephoneInput
                              defaultCountry="lb"
                              flagsImagePath={Path}
                              value={this.state.preRegistrationPhoneNumber}
                              onChange={this.handlePhoneChange}
                              // onChange={handlePhoneChange}
                              // onChange={(e) => setPreRegistration({ ...preRegistration, phoneNumber: e.target.value })}
                            />
                          </div>
                        </div>
                        <div class="col-lg-12">
                          <div className="form-group">
                            <label
                              style={{
                                float: getLang() == "ar" ? "right" : "left",
                              }}
                            >
                              {getValue("Message", getLang())}
                            </label>
                            <textarea
                              style={{
                                resize: "unset",
                                height: "95px",
                                borderRadius: "3px",
                              }}
                              className="form-control"
                              type="text"
                              placeholder={getValue("Message", getLang())}
                              value={this.state.preRegistrationMessage}
                              onChange={(e) =>
                                this.setState({
                                  preRegistrationMessage: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                        <div
                          class="col-lg-12"
                          style={{
                            display: "flex",
                            justifyContent: "start",
                            paddingTop: "11px",
                          }}
                        >
                          <div className="form-group">
                            <Button
                              onClick={this.saveRegistration}
                              style={{
                                backgroundColor: "#0a1843",
                                fontWeight: "bold",
                                borderColor: "#0a1843",
                              }}
                            >
                              {getValue("SendRequest", getLang())}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </form>

                    <p className="mb-1"></p>
                    <p className="mb-0"></p>
                  </div>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              {/* <Button
                                data-bs-dismiss="modal"
                                variant="secondary"
                                onClick={hideModal}
                            >
                                Close
                            </Button> */}
            </Modal.Footer>
          </Modal>
        </div>{" "}
      </div>
    );
  }
}
