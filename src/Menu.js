import React, { Component } from "react";
import APIFunctions from "../src/utils/APIFunctions";
import { getUser, removeUserSession } from "./utils/common";
import { Link } from "react-router-dom";

export default class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      MenuPermissions: [],
      parentMenu: [],
    };
  }
  bindUserPermissions = () => {
    APIFunctions.GetMenuPermissions()
      .then((response) => {
        this.setState({ MenuPermissions: response.data });
        var parents = [];
        for (var i in response.data) {
          if (parents.indexOf(response.data[i].groupNameEn) == -1) {
            parents.push(response.data[i].groupNameEn);
          }
        }
        this.setState({ parentMenu: parents });
      })
      .catch((e) => {
        console.log(e);
      });
  };



  openPage(PageName) {
    if (PageName != null) this.props.history.push("/" + PageName);
  }
  componentDidMount() {
    this.bindUserPermissions();
  }
  render() {
    const userName = getUser();
    return (
      <div>
        <aside className="main-sidebar sidebar-dark-primary elevation-4">
          {/* Brand Logo */}
          <a href="Dashboard" className="brand-link">
            <img
              src="./public_pages/images/spectre-logo.svg"
              alt="AdminLTE Logo"
              className="brand-image img-circle"
              style={{ borderRadius: "unset", margin: "auto", float: "unset" }}
            />
            {/* <span className="brand-text font-weight-light">Spectre</span> */}
          </a>
          {/* Sidebar */}
          <div className="sidebar">
            {/* Sidebar user panel (optional) */}
            <div className="user-panel mt-3 pb-3 mb-3 d-flex">
              <div className="image">
                {/* <img
                  src="/dist/img/user2-160x160.jpg"
                  className="img-circle elevation-2"
                  alt="User Image"
                /> */}
              </div>
              <div className="info">
                <a className="d-block">
                  Welcome {userName}!<br />
                </a>
              </div>
            </div>

            <nav className="mt-2">
              <ul
                className="nav nav-pills nav-sidebar flex-column"
                data-widget="treeview"
                role="menu"
                data-accordion="false"
              >
                {this.state.parentMenu.map((s) => {
                  var currentChildren = [];
                  for (var i in this.state.MenuPermissions) {
                    if (
                      this.state.MenuPermissions[i].groupNameEn == s &&
                      this.state.MenuPermissions[i].action == "View"
                    ) {
                      currentChildren.push(this.state.MenuPermissions[i]);
                    }
                  }
                  return (
                    <li className="nav-item has-treeview">
                      <a href="" className="nav-link">
                        <i className={currentChildren[0].iconClass} />
                        <p>
                          {s}
                          <i className="right fas fa-angle-left" />
                        </p>
                      </a>

                      {currentChildren.map((y) => {
                        const { name, id, action, pageUrl, iconClass } = y;
                        return (
                          <ul className="nav nav-treeview">
                            <li className="nav-item">
                              {/* <a
                                onClick={this.openPage(pageUrl)}
                                className="nav-link "
                              > */}

                              <Link
                                style={{ display: "flex" }}
                                to={"/" + pageUrl}
                              >
                                <i className="far fa-circle nav-icon" />
                                <p>{name}</p>
                              </Link>
                            </li>
                          </ul>
                        );
                      })}

                    </li>
                  );
                })}
                <li className="nav-item has-treeview">
                  <a href="Default" className="nav-link">
                    <i className="nav-icon  fa fa-globe" />
                    <p>Back to Web</p>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </aside>
      </div>
    );
  }
}
