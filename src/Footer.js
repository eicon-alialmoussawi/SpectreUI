import React, { Component } from "react";

export default class Footer extends Component {
  render() {
    const thisYear = new Date().getFullYear();

    return (
      <div>
        <footer className="main-footer">
          <strong>
            Copyright © {thisYear}{" "}
            <a href="http://spectre-me.com" rel="noreferrer" target="_blank">
              Spectre
            </a>
            .
          </strong>
          All rights reserved.
          <div className="float-right d-none d-sm-inline-block">
            <b>Version</b> 1.0.0
          </div>
        </footer>
      </div>
    );
  }
}
