import React, { Component, useState, useEffect, useMemo, useRef } from "react";
import { getUser, removeUserSession } from "./utils/common";
import APIFunctions from "./utils/APIFunctions";
import dateFormat from "dateformat";
import { Link } from "react-router-dom";
import { BindNotifications } from "./utils/Globals";

export default class Header extends Component {


  constructor(props) {
    super(props);

    this.state = {
      MINUTE_MS: 60000,
      viewCount: 0,
      userNotifications: []
    }

    this.getNotifications = this.getNotifications.bind(this);
    this.renderNotifications = this.renderNotifications.bind(this);
    this.setAsViewed = this.setAsViewed.bind(this);

  }


  componentDidMount() {
    this.getNotifications();
  }

  setAsViewed(id) {
    APIFunctions.setNotificationAsViewed(id)
      .then((response) => {

      })
      .catch((e) => {
        console.log(e);
      });
  }

  getNotifications() {
    if (BindNotifications == true) {
      APIFunctions.getUserNotifications("Top")
        .then((response) => {
          if (response.data != null || response.data != []) {
            this.setState({ viewCount: response.data[0].viewedCount, userNotifications: response.data });
          }

          console.log(this.state);
        })
        .catch((e) => {
          console.log(e);
        });
    }
    setTimeout(() => {
      this.getNotifications()
    }, this.state.MINUTE_MS);
  }

  renderNotifications() {


    var _notifications = this.state.userNotifications;
    {
      return (_notifications.map((val, idx) => (
        <div>
          <Link to={val.url == "" ? "/UserNotifications" : ("/" + val.url)}
            className="dropdown-item"
            style={{ color: val.viewed == true ? "#000" : "#427bff" }}
            onClick={() => { this.setAsViewed(val.id) }}
          >
            <i className="fas fa-envelope mr-2" /> <p style={{ overflowWrap: "break-word", width: "100%" }}>{val.textEn}</p>
            <span className="float-right text-muted text-sm">{dateFormat(val.creationDate, 'yyyy-mm-dd')}</span>
          </Link>
          <div className="dropdown-divider" />
        </div>
      )));
    }


  }

  render() {
    const handleLogout = () => {
      removeUserSession();
      window.location.href = "/";
    };




    // const MINUTE_MS = 60000;

    // useEffect(() => {
    //   const interval = setInterval(() => {
    //     console.log('Logs every minute');
    //   }, MINUTE_MS);

    //   return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
    // }, [])


    return (
      <div>
        <nav className="main-header navbar navbar-expand navbar-white navbar-light">
          {/* Left navbar links */}
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className="nav-link" data-widget="pushmenu" href="#">
                <i className="fas fa-bars" />
              </a>
            </li>
            <li className="nav-item d-none d-sm-inline-block">
              <a href="Default" className="nav-link">
                Home
              </a>
            </li>
          </ul>
          {/* SEARCH FORM */}
          <form className="form-inline ml-3">
            <div className="input-group input-group-sm">

            </div>
          </form>
          {/* Right navbar links */}
          <ul className="navbar-nav ml-auto">
            {" "}

            <a className="nav-link" data-toggle="dropdown"
              style={{ paddingRight: "unset", paddingLeft: "unset" }} onClick={handleLogout}>
              <i className="fas fa-sign-out-alt" />
              {/* <span className="badge badge-warning navbar-badge">
                {this.state.viewCount == 0 ? '' : this.state.viewCount}
              </span> */}
            </a>
            {/* <input
              type="button"
              className="btn btn-danger"
              onClick={handleLogout}
              value="Logout"
            /> */}
            {/* Messages Dropdown Menu */}

            {/* Notifications Dropdown Menu */}
            <li className="nav-item dropdown">
              <a className="nav-link" data-toggle="dropdown" >
                <i className="far fa-bell" />
                <span className="badge badge-warning navbar-badge">
                  {this.state.viewCount == 0 ? '' : this.state.viewCount}
                </span>
              </a>
              <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right">
                {/* <div className="dropdown-divider" /> */}
                {this.renderNotifications()}

                <Link to="/UserNotifications" className="dropdown-item dropdown-footer">
                  See All Notifications
                </Link>
              </div>
            </li>
          </ul>
        </nav>
      </div>
    );
  }
}
