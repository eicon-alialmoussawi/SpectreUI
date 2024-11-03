import React, { useState, useEffect, useMemo, useRef, Component } from "react";
import APIFunctions from "../utils/APIFunctions";

import dateFormat from "dateformat";
import { useTable } from "react-table";
import Select from "react-select";
import { getLang } from "../utils/common";

const EditSystemSettings = (props) => {
  useEffect(() => {
    selectCSS();
  }, []);

  const selectCSS = () => {
    if (getLang() === "ar") {
      //  require("../assets/CustomStyleAr.css");
      //require("../assets/resources_ar.js");
    } else {
      //require("../assets/CustomStyleEn.css");
      //require("../assets/resources_en.js");
    }
  };

  const initialLatestNew = {
    id: 0,
    titleEn: "",
    titleAr: "",
    descriptionAr: "",
    descriptionEn: "",
    isPublished: false,
    isDeleted: false,
    imageURL: "",
    uRL: "",
  };
  const [result, emplist] = useState([]);
  const [currentSystemSettings, setcurrentSystemSettings] = useState(initialLatestNew);
  const [message, setMessage] = useState("");
  const [checked, setChecked] = React.useState(false);
  const [checked2, setChecked2] = React.useState(false);
  const [role, setRole] = useState("-1");

  const [country, setRoleSelected] = React.useState([]);
  const handleChange = () => {
    setChecked(!checked);
  };

  const handleChange2 = () => {
    setChecked2(!checked2);
  };
  useEffect(() => {
    APIFunctions.getAllRoles()
      .then((resp) => resp)
      .then((resp) => emplist(resp.data));
  }, []);

  useEffect(() => {
    if (props.match.params.id != 0) getLatesNews(props.match.params.id);
  }, [props.match.params.id]);

  const getLatesNews = (id) => {
    APIFunctions.getSystemSettingById(id)
      .then((response) => {
        setcurrentSystemSettings(response.data);

        setChecked(response.data.isAdmin);
        setChecked2(response.data.isLocked);
        setRole(response.data.roleId);
      })

      .catch((e) => {
        console.log(e);
      });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setcurrentSystemSettings({ ...currentSystemSettings, [name]: value });
  };
  const handleInputChange2 = (selectedOption) => {
    setRole(selectedOption.target.value);
    currentSystemSettings.roleId = selectedOption.target.value;
  };

  const update = () => {
    if (currentSystemSettings.id == 0) {
      currentSystemSettings.isDeleted = false;
    }
    APIFunctions.saveSystemSettings(currentSystemSettings.id, currentSystemSettings)
      .then((response) => {
        console.log(response.data);
        setMessage("The System Settings details was updated successfully!");
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const cancel = () => {
    props.history.push("/SystemSettings");
  };
  const handleChangeInRole = (selectedOptions) => {
    setRoleSelected(selectedOptions);
    setRole(selectedOptions.id);
    currentSystemSettings.roleId = selectedOptions.id;
  };
  const deleteUser = () => {
    APIFunctions.remove(currentSystemSettings.id)
      .then((response) => {
        console.log(response.data);
        props.history.push("/SystemSettings");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="card">
              <div className="container">
                <div className="row"></div>
              </div>
              {currentSystemSettings ? (
                <div className="edit-form">
                  <div className="card-header">
                    <h4>System Settings Details</h4>
                  </div>
                  <form className="p-3">
                    <div className="row">
                      <div className="form-group col-6">
                        <label htmlFor="txtTitle">Address in English</label>
                        <small className="text-danger">*</small>
                        <input
                          type="text"
                          className="form-control"
                          id="txtAddressEn"
                          name="address"
                          value={currentSystemSettings.address}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="form-group col-6">
                        <label htmlFor="txtTitleEn">Address in Arabic</label>
                        <small className="text-danger">*</small>
                        <input
                          type="text"
                          className="form-control"
                          id="txtAddressAr"
                          name="addressAr"
                          value={currentSystemSettings.addressAr}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="form-group col-6">
                        <label htmlFor="txtAboutEn">About in English</label>
                        <small className="text-danger">*</small>
                        <input
                          type="text"
                          className="form-control"
                          id="txtAboutEn"
                          name="aboutEn"
                          value={currentSystemSettings.aboutEn}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="form-group col-6">
                        <label htmlFor="txtAboutAr">About in Arabic</label>
                        <small className="text-danger">*</small>
                        <input
                          type="text"
                          className="form-control"
                          id="txtAboutAr"
                          name="aboutAr"
                          value={currentSystemSettings.aboutAr}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="row">
                      <div className="form-group col-6">
                        <label htmlFor="txtEmail">Email</label>
                        <small className="text-danger">*</small>
                        <input
                          type="email"
                          className="form-control"
                          id="txtEmail"
                          name="email"
                          value={currentSystemSettings.email}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="form-group col-6">
                        <label htmlFor="txtDescriptionEn">Phone Number</label>
                        <small className="text-danger">*</small>
                        <input
                          type="text"
                          className="form-control"
                          id="txtPhoneNumber"
                          name="phoneNumber"
                          value={currentSystemSettings.phoneNumber}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="row">
                      <div className="form-group col-6">
                        <label htmlFor="txtWelcomeMessage">
                          Welcome Message
                        </label>
                        <small className="text-danger">*</small>
                        <input
                          type="text"
                          className="form-control"
                          id="txtWelcomeMessage"
                          name="welcomeMessage"
                          value={currentSystemSettings.welcomeMessage}
                          onChange={handleInputChange}
                        />
                      </div>{" "}
                      <div className="form-group col-6">
                        <label htmlFor="txtFAX">FAX</label>
                        <small className="text-danger">*</small>
                        <input
                          type="text"
                          className="form-control"
                          id="txtFAX"
                          name="fax"
                          value={currentSystemSettings.fax}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>
                        <strong>Status:</strong>
                      </label>
                      {currentSystemSettings.published ? "Published" : "Pending"}
                    </div>
                  </form>

                  <button className="btn btn-secondary" onClick={cancel}>
                    {" "}
                    Cancel
                  </button>

                  <button className="btn btn-danger" onClick={deleteUser}>
                    Delete
                  </button>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    onClick={update}
                  >
                    Save
                  </button>
                  <p>{message}</p>
                </div>
              ) : (
                <div>
                  <br />
                  <p>Please click on a User...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditSystemSettings;
