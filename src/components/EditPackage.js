import React, { useState, useEffect, useMemo, useRef, Component } from "react";
import APIFunctions from "../utils/APIFunctions";
import { getLang, BindImageURL } from "../utils/common";
import { AlertError, AlertSuccess } from "./f_Alerts";
import Select from "react-select";
import { parse } from "@babel/core";

const EditPackage = (props) => {
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

    const errors = {
        nameEn: true,
        nameSpa: true,
        nameFr: true,
        descriptionEn: true,
        descriptionSpa: true,
        descriptionFr: true,
        imageURL: true
    }

    const myPackage = {
        id: 0,
        nameEn: "",
        nameSpa: "",
        nameFr: "",
        descriptionEn: "",
        descriptionSpa: "",
        descriptionFr: "",
        imageUrl: "",
        isDemoPackage: false,
        isVisible: false,
        isDeleted: false,
        fromYearLimit: null,
        toYearLimit: null,
        pagePermissions: [], 
        order: null
    };

    var myPermissions =
    {
        canView: false,
        canAdd: false,
        canEdit: false,
        canDelete: false,
    }

    const [permissions, setPermissions] = useState(myPermissions);
    const [myErrors, setErrors] = useState(errors);
    const [currentPackage, setCurrentPackage] = useState(myPackage);
    const [pages, setPages] = useState([]);
    const [showImageURL, setShowIImageURL] = useState(false);
    const [icons, setIncon] = useState([]);
    const [displayeYear, setDisplayYear] = useState(false);

    useEffect(() => {
        getPages();
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
                getPackage(props.match.params.id);
            }
            else {
              AlertError(
                "You do not have the permission to edit the package!",
                function () {
                  props.history.push("/Dashboard");
                }
              );
            }
          }
    
          if(props.match.params.id == 0) {
            if (!add) 
              AlertError(
                "You do not have the permission to add new package!",
                function () {
                  props.history.push("/Dashboard");
                }
              );
          }
        });
      };

    const getPackage = (id) => {
        APIFunctions.getPackageById(id)
            .then((response) => {
                setCurrentPackage(response.data);
                console.log(response);
                if (response.data.isDemoPackage)
                    setDisplayYear(true)
                setShowIImageURL(true);

            })
            .catch((e) => {
                console.log(e);
            });
    };


    const getPages = (id) => {
        APIFunctions.getPages(id)
            .then((response) => {
                setPages(response.data);
            })
            .catch((e) => {
                console.log(e);
            });
    };


    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setCurrentPackage({ ...currentPackage, [name]: value });
    };

    const handleErrorChange = (input, valid) => {
        var tempError = errors;
        tempError[input] = valid;
        setErrors(tempError);
    }

    // handlIconChange
    const handlIconChange = (selectedOptions) => {
        var _currentPackage = currentPackage;
        _currentPackage.imageUrl = selectedOptions.icon1;
        setCurrentPackage(_currentPackage)
        //setCurrentPackage({ ...currentPackage, imageUrl: selectedOptions.icon1 })
        console.log(currentPackage);

    };

    useEffect(() => {
        APIFunctions.getAllIcons()
            .then((resp) => resp)
            .then((resp) => setIncon(resp.data));
    }, []);


    const savePackage = () => {
        var valid = true;
        if (currentPackage.nameEn == "" || currentPackage.nameEn == null) {
            handleErrorChange("nameEn", false);
            valid = false;
        }
        if (currentPackage.nameSpa == "" || currentPackage.nameSpa == null) {
            handleErrorChange("nameSpa", false);
            valid = false;
        }
        if (currentPackage.nameFr == "" || currentPackage.nameFr == null) {
            handleErrorChange("nameFr", false);
            valid = false;
        }
        if (currentPackage.descriptionEn == "" || currentPackage.descriptionEn == null) {
            handleErrorChange("descriptionEn", false);
            valid = false;
        }
        if (currentPackage.descriptionFr == "" || currentPackage.descriptionFr == null) {
            handleErrorChange("descriptionFr", false);
            valid = false;
        }
        if (currentPackage.descriptionSpa == "" || currentPackage.descriptionSpa == null) {
            handleErrorChange("descriptionSpa", false);
            valid = false;
        }
        if (currentPackage.order == "" || currentPackage.order == null) {
            valid = false;
        }

        if (currentPackage.pagePermissions.length == 0) {
            AlertError("Please choose at least one permission");
            return;
        }

        if (currentPackage.isDemoPackage) {
            if (currentPackage.fromYearLimit == "" || currentPackage.fromYearLimit == null) {
                handleErrorChange("fromYearLimit", false);
                valid = false;
            }


            if (currentPackage.toYearLimit == "" || currentPackage.toYearLimit == null) {
                handleErrorChange("toYearLimit", false);
                valid = false;
            }


            if (currentPackage.fromYearLimit.toString().length != 4 || currentPackage.toYearLimit.toString().length != 4) {
                AlertError("Please enter a valid year format");
                return;
            }

            if (currentPackage.fromYearLimit > currentPackage.toYearLimit) {
                AlertError("From year must be less than to year");
                return;
            }
            if (currentPackage.fromYearLimit < 1500 || currentPackage.toYearLimit < 1500) {
                AlertError("Enter valid Year");
                return;
            }
        }

        if (!valid) {
            AlertError("Please fill required fields");
            return;
        }



        if (currentPackage.pagePermissions.length == 0) {
            AlertError("Please choose at least one permission");
            return;
        }


        APIFunctions.savePackage(currentPackage)
            .then((response) => {
                if (!response.data.success) {
                    console.log(response.data);
                    AlertError(response.data.messageEn);
                    return;
                }
                else {
                    AlertSuccess("Operation done successfully");
                    setTimeout(() => { props.history.push("/PackageManagement"); }, 300);
                }

            })
            .catch((e) => {
                console.log(e);
            });
    }

    const cancelPackage = () => {
        props.history.push("/PackageManagement");
    };

    const checkIfPermissionExists = (pageURL) => {

        var valid = false;
        var data = currentPackage.pagePermissions;
        data.find((element) => {
            if ((element.pageUrl == pageURL && element.isDeleted == false)) {
                valid = true;
                return;
            }
        })
        return valid;
    }

    const hasCountryLimit = (pageURL) => {
        var valid = false;
        var data = currentPackage.pagePermissions;

        data.find((element) => {
            if ((element.pageUrl == pageURL)) {
                valid = element.hasCountryLimit;
                return;
            }
        })
        return valid;
    }

    const addPermission = (pageURL, checked) => {

        if (checked) {
            var data = currentPackage.pagePermissions;
            data = currentPackage.pagePermissions.filter((item) => item.pageUrl != pageURL);
            data.push({
                id: 0, packageId: parseInt(props.match.params.id), pageUrl: pageURL,
                hasCountryLimit: false, isDeleted: false
            });
            setCurrentPackage({ ...currentPackage, pagePermissions: data })
        }
        else {
            var data = currentPackage.pagePermissions;
            data = currentPackage.pagePermissions.filter((item) => item.pageUrl != pageURL);
            setCurrentPackage({ ...currentPackage, pagePermissions: data })
        }

    }

    const setPermissionCountryLimit = (pageURL, checked) => {
        var data = currentPackage.pagePermissions;
        data = currentPackage.pagePermissions.filter((item) => item.pageUrl != pageURL);
        data.push({
            id: 0, packageId: parseInt(props.match.params.id), pageUrl: pageURL,
            hasCountryLimit: checked, isDeleted: false
        });
        setCurrentPackage({ ...currentPackage, pagePermissions: data });
    }

    const setIsDemo = (evt) => {
        setCurrentPackage({ ...currentPackage, isDemoPackage: evt.target.checked });
        setDisplayYear(evt.target.checked);

    }



    const renderPermissions = () => {
        {
            return (<div className="justify-content-center">
                {pages.map((val, idx) => (
                    <div id={val.id}>
                        <div className="row mb-1" style={{
                            backgroundColor: "#fbfafa",
                            border: "1px solid #e3e3e3",
                            width: "95%",
                            padding: "7px",
                            margin: "auto"
                        }}>
                            <div className="col-lg-6">
                                <label
                                    type="text"
                                    name={val.pageUrl}
                                    data-id={val.pageUrl}
                                    class="form-control"
                                    id={val.pageUrl}>{val.name}</label>
                            </div>
                            <div className="col-lg-3">
                                <input
                                    type="checkbox"
                                    id={val.pageUrl}
                                    checked={checkIfPermissionExists(val.pageUrl)}
                                    onChange={(e) => { addPermission(val.pageUrl, e.target.checked) }}
                                />
                                <label style={{ padding: "6px" }}>Include In Package</label>
                            </div>
                            <div className="col-lg-3">
                                <input
                                    type="checkbox"
                                    id={val.hasCountryLimit}
                                    checked={(hasCountryLimit(val.pageUrl) && checkIfPermissionExists(val.pageUrl))}
                                    disabled={!checkIfPermissionExists(val.pageUrl)}
                                    onChange={(e) => { setPermissionCountryLimit(val.pageUrl, e.target.checked) }}
                                />
                                <label style={{ padding: "6px" }}>Has Country Limit</label>
                            </div>
                        </div>
                    </div>
                ))
                }
            </div >);
        }
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
                            {myPackage ? (
                                <div className="edit-form">
                                    <div className="card-header">
                                        <h4>Package Details</h4>
                                    </div>
                                    <form>
                                        <div className="row">
                                            <div className="col-6 bottommargin-sm" style={{ display: "flex!important" }}>
                                                <div className="form-group">
                                                    <label>Package Name In English  <small className="text-danger">*</small></label>
                                                    <input type="text"
                                                        className={"form-control " + (errors.nameEn == false ? "border-danger" : "")}
                                                        value={currentPackage.nameEn}
                                                        style={{ width: "100%" }}
                                                        onChange={(e) => setCurrentPackage({ ...currentPackage, nameEn: e.target.value, })} />
                                                </div>
                                            </div>
                                            <div className="col-6 bottommargin-sm" style={{ display: "flex!important" }}>
                                                <div className="form-group">
                                                    <label>Package Name In French  <small className="text-danger">*</small></label>
                                                    <input type="text"
                                                        className={"form-control " + (errors.nameFr == false ? "border-danger" : "")}
                                                        style={{ width: "100%" }}
                                                        value={currentPackage.nameFr}
                                                        onChange={(e) => setCurrentPackage({ ...currentPackage, nameFr: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-6 bottommargin-sm" style={{ display: "flex!important" }}>
                                                <div className="form-group">
                                                    <label>Package Name In Arabic  <small className="text-danger">*</small></label>
                                                    <input type="text"
                                                        className={"form-control " + (errors.nameSpa == false ? "border-danger" : "")}
                                                        style={{ width: "100%" }}
                                                        value={currentPackage.nameSpa}
                                                        onChange={(e) => setCurrentPackage({ ...currentPackage, nameSpa: e.target.value })} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-6 bottommargin-sm" style={{ display: "flex!important" }}>
                                                <div className="form-group">
                                                    <label>Description in English  <small className="text-danger">*</small></label>
                                                    <textarea
                                                        className={"form-control " + (errors.descriptionEn == false ? "border-danger" : "")}
                                                        value={currentPackage.descriptionEn}
                                                        style={{ resize: "unset", height: "100px" }}
                                                        onChange={(e) => setCurrentPackage({ ...currentPackage, descriptionEn: e.target.value })} />
                                                </div>
                                            </div>
                                            <div className="col-6 bottommargin-sm" style={{ display: "flex!important" }}>
                                                <div className="form-group">
                                                    <label>Description in French  <small className="text-danger">*</small></label>
                                                    <textarea
                                                        className={"form-control " + (errors.descriptionFr == false ? "border-danger" : "")}
                                                        value={currentPackage.descriptionFr}
                                                        style={{ resize: "unset", height: "100px" }}

                                                        onChange={(e) => setCurrentPackage({ ...currentPackage, descriptionFr: e.target.value })} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-6 bottommargin-sm" style={{ display: "flex!important" }}>
                                                <div className="form-group">
                                                    <label>Description in Arabic<small className="text-danger">*</small></label>
                                                    <textarea
                                                        className={"form-control " + (errors.descriptionSpa == false ? "border-danger" : "")}
                                                        style={{ resize: "unset", height: "100px" }}
                                                        value={currentPackage.descriptionSpa}
                                                        onChange={(e) => setCurrentPackage({ ...currentPackage, descriptionSpa: e.target.value })} />
                                                </div>
                                            </div>
                                            <div className="col-3 bottommargin-sm" style={{ display: "flex!important", margin: "auto", paddingLeft: "35px" }}>
                                                <div className="form-group">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        value={currentPackage.isVisible}
                                                        checked={currentPackage.isVisible}
                                                        onChange={(e) => setCurrentPackage({ ...currentPackage, isVisible: e.target.checked })}
                                                    ></input>
                                                    <label className="form-check-label">
                                                        Is Visible
                                                    </label>
                                                    {/* <label>Is Visible</label>
                                                    <input
                                                        type="checkbox"
                                                        className="form-control"
                                                        value={currentPackage.isVisible}
                                                        checked={currentPackage.isVisible}
                                                        onChange={(e) => setCurrentPackage({ ...currentPackage, isVisible: e.target.checked })} /> */}
                                                </div>
                                            </div>
                                            <div className="col-3 bottommargin-sm" style={{ display: "flex!important", margin: "auto" }}>
                                                <div className="form-group">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        value={currentPackage.isDemoPackage}
                                                        checked={currentPackage.isDemoPackage}
                                                        // onChange={(e) => setCurrentPackage({ ...currentPackage, isDemoPackage: e.target.checked })}
                                                        onChange={(e) => setIsDemo(e)}
                                                    ></input>
                                                    <label className="form-check-label">
                                                        Used for Demo
                                                    </label>
                                                    {/* <label>Used for Demo</label>
                                                    <input
                                                        type="checkbox"
                                                        className="form-control"
                                                        value={currentPackage.isDemoPackage}
                                                        checked={currentPackage.isDemoPackage}
                                                        onChange={(e) => setCurrentPackage({ ...currentPackage, isDemoPackage: e.target.checked })} /> */}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row mb-3" style={{ display: displayeYear == true ? "" : "none" }}>
                                            <div className="col-6 bottommargin-sm" style={{ display: "flex!important" }}>
                                                <div className="form-group">
                                                    <label>From Year<small className="text-danger">*</small></label>
                                                    <input type="number"
                                                        className={"form-control " + (errors.fromYearLimit == false ? "border-danger" : "")}
                                                        style={{ width: "100%" }}
                                                        value={currentPackage.fromYearLimit}
                                                        onChange={(e) => setCurrentPackage({ ...currentPackage, fromYearLimit: parseInt(e.target.value) })} />
                                                </div>
                                            </div>
                                            <div className="col-6 bottommargin-sm" style={{ display: "flex!important" }}>
                                                <div className="form-group">
                                                    <label>To Year<small className="text-danger">*</small></label>
                                                    <input type="number"
                                                        className={"form-control " + (errors.toYearLimit == false ? "border-danger" : "")}
                                                        style={{ width: "100%" }}
                                                        value={currentPackage.toYearLimit}
                                                        onChange={(e) => setCurrentPackage({ ...currentPackage, toYearLimit: parseInt(e.target.value) })} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row mb-3">
                                            <div className="col-lg-6 bottommargin-sm">
                                                <div className="form-group">
                                                    <label>Icon</label>
                                                    <Select
                                                        id="ddlIcons"
                                                        name="id"
                                                        value={icons.find((obj) => {
                                                            return obj.icon1 == currentPackage.imageUrl;
                                                        })}
                                                        getOptionLabel={(option) => <a> <i class={option.icon1} />  {option.icon1}</a>}
                                                        getOptionValue={(option) => option.id}
                                                        options={icons}
                                                        onChange={handlIconChange}
                                                    ></Select>
                                                </div>
                                            </div>
                                            <div className="col-lg-6 bottommargin-sm">
                                                <div className="form-group">
                                                    <label>Order <small className="text-danger">*</small></label>
                                                    <input type="number"
                                                        className="form-control"
                                                        style={{ width: "100%" }}
                                                        value={currentPackage.order}
                                                        onChange={(e) => setCurrentPackage({ ...currentPackage, order: parseInt(e.target.value) })} />
                                                </div>
                                            </div>
                                        </div>
                                        <hr />
                                        {

                                            renderPermissions()
                                        }

                                        <hr />
                                    </form>

                                    <button className="btn btn-secondary" onClick={cancelPackage}>
                                        {" "}
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        onClick={savePackage}>
                                        Save
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <br />

                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditPackage;
