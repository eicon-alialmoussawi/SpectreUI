import React, { useState, useEffect, useMemo, useRef, Component } from "react";
import APIFunctions from "../utils/APIFunctions";

import dateFormat from "dateformat";
import { useTable } from "react-table";
import Select from "react-select";
import { getLang } from "../utils/common";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { AlertError, AlertSuccess, AlertConfirm } from "./f_Alerts";

const EditSocioEconomics = (props) => {
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

  const initialSocioEconomicState = {
    id: 0,
    year: "",
    month: "",
    countryId: "",
    sourceId: "",
    typeId: null,
    value: "",
    isDeleted: "",
  };

  var myPermissions = {
    canAdd: false,
    canEdit: false,
    canDelete: false,
  };

  const [permissions, setPermissions] = useState(myPermissions);
  const [selectedFile, setSelectedFile] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [result, emplist] = useState([]);
  const [resultCountry, emplistCountry] = useState([]);
  const [resultSources, emplistSources] = useState([]);
  const [resultTypes, emplistTypes] = useState([]);
  const [currentSocioEconomic, setCurrentSocioEconomic] = useState(
    initialSocioEconomicState
  );
  const [message, setMessage] = useState("");
  const [checked, setChecked] = React.useState(false);
  const [checked2, setChecked2] = React.useState(false);
  const [role, setRole] = useState(-1);

  const [countryId, setCountryId] = useState("");
  const [sourceId, setSourceId] = useState("");
  const [typeId, setTypeId] = useState("");
  const [value, setValue] = useState("");
  const [isNew, setIsNew] = useState(true);

  const handleChange = () => {
    setChecked(!checked);
  };
  const handleChangeCountry = (selectedOptions) => {
    setCountryId(selectedOptions.countryId);
  };
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCurrentSocioEconomic({ ...currentSocioEconomic, [name]: value });
  };

  const handleChangeSource = (selectedOptions) => {
    setSourceId(selectedOptions.id);
  };
  const handleChangeType = (selectedOptions) => {
    setTypeId(selectedOptions.id);
  };

  const handleChange2 = () => {
    setChecked2(!checked2);
  };
  useEffect(() => {
    APIFunctions.getAllCountries()
      .then((resp) => resp)
      .then((resp) => emplistCountry(resp.data));
  }, []);
  useEffect(() => {
    APIFunctions.GetLookupsByParentId("SOC_SRC")
      .then((resp) => resp)
      .then((resp) => emplistSources(resp.data));
  }, []);
  useEffect(() => {
    APIFunctions.GetLookupsByParentId("SOC_TYP")
      .then((resp) => resp)
      .then((resp) => emplistTypes(resp.data));
  }, []);
  useEffect(() => {
    APIFunctions.getAllRoles()
      .then((resp) => resp)
      .then((resp) => emplist(resp.data));
  }, []);

  useEffect(() => {
    getUserPermissions()
  }, []);

  const retrieveSocioDetails = (canDelete) => {
    if (props.match.params.id != 0) {
      getData(props.match.params.id);
      setIsNew(!canDelete);
    }
  }

  const getUserPermissions = async () => {
    APIFunctions.getUserPermissions("AdminSocioEconomics").then((response) => {
      var _permissions = [];
      var result = response.data;
      result.map((element) => {
        if (element.pageUrl == "AdminSocioEconomics") {
          _permissions.push(element);
        }
      });

      var add =
        _permissions.find((element) => {
          return element.action == "Add";
        }) === undefined
          ? false
          : true;
      var edit =
        _permissions.find((element) => {
          return element.action == "Edit";
        }) === undefined
          ? false
          : true;
      var _delete =
        _permissions.find((element) => {
          return element.action == "Delete";
        }) === undefined
          ? false
          : true;

      var obj = permissions;
      obj.canAdd = add;
      obj.canEdit = edit;
      obj.canDelete = _delete;
      setPermissions(obj);
      if(props.match.params.id != 0) {
        if (edit) retrieveSocioDetails(_delete);
        else {
          AlertError(
            "You do not have the permission to edit social data!",
            function () {
              props.history.push("/Dashboard");
            }
          );
        }
      }

      if(props.match.params.id == 0) {
        if (!add) 
          AlertError(
            "You do not have the permission to add new social data!",
            function () {
              props.history.push("/Dashboard");
            }
          );
      }
    });
  };

  const getData = (id) => {
    APIFunctions.getSocioEconomicById(id)
      .then((response) => {
        setCurrentSocioEconomic(response.data);

        setCountryId(response.data.countryId);
        setSourceId(response.data.sourceId);
        setTypeId(response.data.typeId);
        var issueDt = new Date();
        issueDt.setFullYear(response.data.year, response.data.month + 1, 0);
        if (response.data.year != 0) {
          setStartDate(issueDt);
        } else {
          setStartDate(null);
        }
      })

      .catch((e) => {
        console.log(e);
      });
  };

  const updateSocioEconomic = () => {


    if (countryId == ""
      || sourceId == "" || currentSocioEconomic.value == ""
      || startDate == null) {
      AlertError("Please fill required fields");
      return;
    }

    currentSocioEconomic.countryId = countryId;
    currentSocioEconomic.sourceId = sourceId;
    currentSocioEconomic.typeId = null;
    if (startDate != null) {
      currentSocioEconomic.year = startDate.getFullYear();
      currentSocioEconomic.month = null;
    }
    if (currentSocioEconomic.id == 0) {
      currentSocioEconomic.isDeleted = false;
    }


    APIFunctions.saveSocioEconomic(
      currentSocioEconomic.id,
      currentSocioEconomic
    )
      .then((response) => {
        if (response.data) {
          AlertSuccess("Operation Done Successfully");
          setTimeout(() => { props.history.push("/AdminSocioEconomics") }, 500);
        }
        else {
          AlertError("Something went wrong");
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const cancelSocioEconomic = () => {
    props.history.push("/AdminSocioEconomics");
  };

  const deleteSocioEconomic = () => {
    AlertConfirm('Are you sure you want to delete ?')
      .then(res => {
        if (res.value) {
          APIFunctions.removeSocioEconomic(currentSocioEconomic.id)
            .then((response) => {
              AlertSuccess("Operation Done Successfully");
              setTimeout(() => { props.history.push("/AdminSocioEconomics") }, 500);
            })
            .catch((e) => {
              console.log(e);
            });
        }
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
              {currentSocioEconomic ? (
                <div className="edit-form">
                  <div className="card-header">
                    <h4 style={{ margin: "auto" }}>Socio Economic Details</h4>
                  </div>
                  <form style={{ marginTop: "10px" }}>
                    <div className="row mb-3">
                      {" "}
                      <div className="form-group col-6">
                        <label htmlFor="txtUsername">Year</label>
                        <small className="text-danger"> * </small>
                        <DatePicker
                          className="form-control"
                          selected={startDate}
                          onChange={(date) => setStartDate(date)}
                          showYearPicker
                          value={startDate}
                          dateFormat="yyyy"
                        />
                      </div>
                      <div className="form-group col-6">
                        <label htmlFor="description">Country</label>
                        <small className="text-danger"> * </small>
                        <Select
                          id="ddlCountries"
                          name="countryId"
                          value={resultCountry.find((obj) => {
                            return obj.countryId === countryId;
                          })}
                          getOptionLabel={(option) => option.nameEn}
                          getOptionValue={(option) => option.countryId}
                          options={resultCountry}
                          onChange={handleChangeCountry}
                        ></Select>
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="form-group col-6">
                        <label htmlFor="description">Indicator</label>
                        <small className="text-danger"> * </small>

                        <Select
                          id="ddlSource"
                          name="sourceId"
                          value={resultSources.find((obj) => {
                            return obj.id === sourceId;
                          })}
                          getOptionLabel={(option) => option.name}
                          getOptionValue={(option) => option.id}
                          options={resultSources}
                          onChange={handleChangeSource}
                        ></Select>
                      </div>{" "}
                      <div className="form-group col-6">
                        <label htmlFor="value">Value</label>
                        <small className="text-danger"> * </small>
                        <input
                          type="number"
                          className="form-control"
                          id="txtValue"
                          name="value"
                          value={currentSocioEconomic.value}
                          onChange={(e) => { setCurrentSocioEconomic({ ...currentSocioEconomic, value: parseFloat(e.target.value) }) }}
                        />
                      </div>
                    </div>
                  </form>
                  <hr />
                  <button
                    type="submit"
                    className="btn btn-primary"
                    onClick={updateSocioEconomic}>
                    Save
                  </button>{" "}
                  <button
                    className="btn btn-danger"
                    style={{ margin: "3px", display: isNew == true ? "none" : "" }}

                    onClick={deleteSocioEconomic}>
                    Delete
                  </button>
                  <button
                    className="btn btn-secondary"
                    style={{ margin: "3px" }}
                    onClick={cancelSocioEconomic}>
                    {" "}
                    Cancel
                  </button>
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

export default EditSocioEconomics;
