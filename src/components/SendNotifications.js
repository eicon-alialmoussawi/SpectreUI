import React, { useState, useEffect, useMemo, useRef, Component } from "react";
import APIFunctions from "../utils/APIFunctions";
import dateFormat from "dateformat";
import { useTable } from "react-table";
import Select from "react-select";
import { getLang, validateEmail } from "../utils/common";
import DatePicker from "react-datepicker";
import { AlertConfirm, AlertError, AlertSuccess, Alert } from "../components/f_Alerts";
import "react-datepicker/dist/react-datepicker.css";

const SendNotifications = (props) => {

  var myPermissions = {
    canView: false,
  };

  const [permissions, setPermissions] = useState(myPermissions);
    const [textEn, setTextEn] = useState('');
    const [textAr, setTextAr] = useState('');
    const [textFr, setTextFr] = useState('');


    useEffect(() => {
      getUserPermissions();
    }, []);
  
    const getUserPermissions = async () => {
      APIFunctions.getUserPermissions("SendNotifications").then((response) => {
        var _permissions = [];
        var result = response.data;
        result.map((element) => {
          if (element.pageUrl == "SendNotifications") {
            _permissions.push(element);
          }
        });
  
        var view =
          _permissions.find((element) => {
            return element.action == "View";
          }) === undefined
            ? false
            : true;
  
        var obj = permissions;
        obj.canView = view;
        setPermissions(obj);
        if (!view) {
          AlertError(
            "You do not have the permission to view this page!",
            function () {
              props.history.push("/Dashboard");
            }
          );
        }
      });
    };

    const send = () => {
        
        if (textEn == null || textEn == "" 
        || textAr == null || textAr == "" 
        || textFr == null || textFr == "") {
            AlertError("Please enter required fields");
            return;
        }
        APIFunctions.sendNotification(textEn, textAr, textFr)
        .then((response) => {
            if (!response.data) {
                AlertError("Something went wrong");
                return;
            }
            else {
                AlertSuccess("Operation done successfully");
                setTextAr("");
                setTextEn("");
                setTextFr("");
            }

        })
        .catch((e) => {
            console.log(e);
        });
    }
  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="card">
              <div className="container">
                <div className="row"></div>
              </div>
                <div className="edit-form">
                  <div className="card-header">
                    <h4 style={{ margin: "auto" }}>Announcment Details</h4>
                  </div>
                  <form style={{ marginTop: "10px" }}>
                    <div className="row mb-3">
                      <div className="form-group col-6">
                        <label htmlFor="txtUsername">Message in English</label>
                        <small className="text-danger">*</small>
                        <input
                          type="text"
                          className="form-control"
                          value={textEn}
                          onChange={(e) => {setTextEn(e.target.value)}}
                        />
                      </div>
                      <div className="form-group col-6">
                        <label htmlFor="txtEmail">Message in Arabic</label>
                        <small className="text-danger">*</small>
                        <input
                          type="text"
                          className="form-control"
                          id="txtEmail"
                          name="email"
                          value={textAr}
                          onChange={(e) => {setTextAr(e.target.value)}}
                        />
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="form-group col-6">
                        <label htmlFor="txtPhone">Message in French</label>
                        <small className="text-danger">*</small>
                        <input
                          type="text"
                          className="form-control"
                          id="txtPhone"
                          name="phoneNumber"
                          value={textFr}
                          onChange={(e) => {setTextFr(e.target.value)}}
                        />
                      </div>
                    </div>
                  </form>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    onClick={send}
                    style={{ margin: "3px" }}>

                    Send
                  </button>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendNotifications;
