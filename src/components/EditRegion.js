import React, { useState, useEffect, useMemo, useRef } from "react";
import APIFunctions from "../utils/APIFunctions";
import { MultiSelect } from "react-multi-select-component";
import "react-datepicker/dist/react-datepicker.css";
import { Alert, AlertError, AlertSuccess, AlertConfirm } from "./f_Alerts";

const EditRegion = (props) => {
  const initialAwardState = {
    regionId: 0,
    nameEn: "",
    nameFr: "",
    nameAr: "",
    code: "",
    countries: ""
  };


  var myPermissions =
  {
      canView: false,
      canAdd: false,
      canEdit: false,
      canDelete: false,
  }

  const [permissions, setPermissions] = useState(myPermissions);
  const [resultCountry, emplistCountry] = useState([]);
  const [resultOperators, emplistOperators] = useState([]);
  const [currentAward, setCurrentAward] = useState(initialAwardState);
  const [showDelete, setShowDelete] = useState(false);

  const [countries, setCountries] = useState([]);
  const [initialCountries, setInitialCountries] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);

  useEffect(() => {
    APIFunctions.getAllCountries()
      .then((resp) => resp)
      .then((resp) => {
        setInitialCountries(resp.data);
        var ddl = [];
        resp.data.forEach((country) => {
          var obj = {};
          obj.label = country.nameEn;
          obj.value = country.countryId;
          ddl.push(obj);
        });
        setCountries(ddl);
      });
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCurrentAward({ ...currentAward, [name]: value });
  };
  const handleChangeCountry = (selectedOptions) => {
    console.log(selectedOptions);
    setSelectedCountries(selectedOptions);
    var c = [];
    selectedOptions.forEach((option) => {
      var obj = initialCountries.find((country) => {
        return country.countryId == option.value
      });
      c.push(obj);
    });
    setCurrentAward({ ...currentAward, ["countries"]: JSON.stringify(c)});
  };
  useEffect(() => {
    APIFunctions.getAllCountries()
      .then((resp) => resp)
      .then((resp) => emplistCountry(resp.data));
  }, []);
  useEffect(() => {
    APIFunctions.GetLookupsByParentId("AW_OPR")
      .then((resp) => resp)
      .then((resp) => emplistOperators(resp.data));
  }, []);

  useEffect(() => {
    getUserPermissions();
}, []);

const getUserPermissions = async () => {
    APIFunctions.getUserPermissions("PackageManagement").then((response) => {
      var _permissions = [];
      var result = response.data;
      result.map((element) => {
        if (element.pageUrl == "PackageManagement") {
          _permissions.push(element);
        }
      });

      var view =
        _permissions.find((element) => {
          return element.action == "View";
        }) === undefined
          ? false
          : true;
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
      obj.canView = view;
      obj.canAdd = add;
      obj.canEdit = edit;
      obj.canDelete = _delete;
      setPermissions(obj);
      if(props.match.params.id != 0) {
        if (edit) {
          getRegion(props.match.params.id);
          setShowDelete(true);
        }
        else {
          AlertError(
            "You do not have the permission to edit the region!",
            function () {
              props.history.push("/Dashboard");
            }
          );
        }
      }

      if(props.match.params.id == 0) {
        if (!add) 
          AlertError(
            "You do not have the permission to add new region!",
            function () {
              props.history.push("/Dashboard");
            }
          );
      } else {
        setShowDelete(false);
      }
    });
  };

  const getRegion = (id) => {
    APIFunctions.getRegionById(id)
      .then((response) => {
        console.log("region by id: ", response.data.item2);
        setCurrentAward(response.data.item2);
        var countriesById = JSON.parse(response.data.item2.countries);
        console.log(countriesById);
        var selectedCountriesById = [];
        countriesById.forEach((country) => {
          var o = {};
          o.label = country.NameEn;
          o.value = country.CountryId;
          selectedCountriesById.push(o);
        });
        setSelectedCountries(selectedCountriesById);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const updateAward = () => {

    console.log(currentAward);

    APIFunctions.saveRegion(currentAward.regionId, currentAward)
      .then((response) => {
        if (response.data != null) {
          AlertSuccess("Operation done successfully");
          setTimeout(() => { props.history.push("/Regions") }, 500);
        }
        else {
          AlertError("Something went wrong");
          return;
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const cancelAward = () => {
    props.history.push("/Regions");
  };
  const deleteAward = () => {
    AlertConfirm('Are you sure you want to delete ?')
      .then(res => {
        if (res.value) {
          console.log(currentAward.regionId);
          APIFunctions.removeRegion(currentAward.regionId)
            .then((response) => {
              props.history.push("/Regions");
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
          <div class="card">
            <div className="card-header">
              <h5>Regions</h5>
            </div>
            <div className="card-body">
              <div className="row mb-2">
                <div className="">
                  <div className="container">
                    <div className="row"></div>
                  </div>
                  <div className="edit-form">
                    <form>
                      <div className="row">
                        <div className="form-group col-4">
                          <label htmlFor="txtNameEn">Name En</label>
                          <input
                            type="text"
                            className="form-control"
                            id="txtNameEn"
                            name="nameEn"
                            value={currentAward.nameEn}
                            onChange={handleInputChange}
                          />
                        </div>

                        <div className="form-group col-4">
                          <label htmlFor="txtNameFr">Name Fr</label>
                          <input
                            type="text"
                            className="form-control"
                            id="txtNameFr"
                            name="nameFr"
                            value={currentAward.nameFr}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="form-group col-4">
                          <label htmlFor="txtNameAr">Name Ar</label>
                          <input
                            type="text"
                            className="form-control"
                            id="txtNameAr"
                            name="nameAr"
                            value={currentAward.nameAr}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>

                      <div className="row">
                        <div className="form-group col-4">
                          <label htmlFor="txtCode">Code</label>
                          <input
                            type="text"
                            className="form-control"
                            id="txtCode"
                            name="code"
                            value={currentAward.code}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="form-group col-4">
                          <label htmlFor="countries">Countries</label>
                          <MultiSelect
                            id="countries"
                            name="ddlCountries"
                            options={countries}
                            value={selectedCountries}
                            onChange={handleChangeCountry}
                          ></MultiSelect>
                        </div>
                      </div>
                    </form>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      onClick={updateAward}
                    >
                      Save
                    </button>{" "}
                    <button className="btn btn-danger" onClick={deleteAward}
                      style={{ display: showDelete == true ? "" : "none" }}>
                      Delete
                    </button>
                    <button className="btn btn-secondary" onClick={cancelAward}>
                      {" "}
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
};

export default EditRegion;
