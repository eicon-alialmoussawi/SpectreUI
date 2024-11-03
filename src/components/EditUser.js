import React, { useState, useEffect, useMemo, useRef, Component } from "react";
import APIFunctions from "../utils/APIFunctions";
import dateFormat from "dateformat";
import { useTable } from "react-table";
import Select from "react-select";
import { getLang, validateEmail } from "../utils/common";
import DatePicker from "react-datepicker";
import { AlertConfirm, AlertError, AlertSuccess, Alert, LoadingAlert } from "../components/f_Alerts";
import "react-datepicker/dist/react-datepicker.css";

const EditUser = (props) => {
  useEffect(() => {
    selectCSS();
  }, []);

  const [startDate, setStartDate] = useState(new Date());
  const selectCSS = () => {
    if (getLang() === "ar") {
      //  require("../assets/CustomStyleAr.css");
      //require("../assets/resources_ar.js");
    } else {
      //require("../assets/CustomStyleEn.css");
      //require("../assets/resources_en.js");
    }
  };

  const initialUserState = {
    id: 0,
    userName: "",
    email: "",
    phoneNumber: "",
    dob: "",
    isadmin: "",
    islocked: "",
    jobTitle: "",
    password: "",
  };
  var myPermissions = {
    canView: false,
    canAdd: false,
    canEdit: false,
    canDelete: false,
  };

  const [permissions, setPermissions] = useState(myPermissions);
  const [result, emplist] = useState([]);
  const [currentUser, setcurrentUser] = useState(initialUserState);
  const [message, setMessage] = useState("");
  const [checked2, setChecked2] = React.useState(false);
  const [role, setRole] = useState("-1");
  const [country, setRoleSelected] = React.useState([]);
  const [checked, setChecked] = React.useState(false);
  const [showdelete, setShowDelete] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const handleChange = () => {
    setChecked(!checked);
  };

  const handleChange2 = () => {
    setChecked2(!checked2);
  };
  useEffect(() => {
    APIFunctions.getAllExceptClient()
      .then((resp) => resp)
      .then((resp) => emplist(resp.data));
  }, []);

  useEffect(() => {
    if (props.match.params.id != 0) {
      setShowDelete(true)
      setShowPassword(false);
    }
    else {
      setShowDelete(false);
      setShowPassword(true);
    }
  }, [props.match.params.id]);

  const getUser = (id) => {
    APIFunctions.getUserById(id)
      .then((response) => {
        setcurrentUser(response.data);
        var date = new Date(response.data.dob);

        var DateFormatted = dateFormat(date.toDateString(), "mm-dd-yyyy");

        setStartDate(new Date(DateFormatted));
        setChecked(response.data.isAdmin);
        setChecked2(response.data.isLocked);
        setRole(response.data.roleId);
      })

      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    getUserPermissions();
}, []);

  const getUserPermissions = async () => {
    APIFunctions.getUserPermissions("User").then((response) => {
      var _permissions = [];
      var result = response.data;
      result.map((element) => {
        if (element.pageUrl == "User") {
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
            getUser(props.match.params.id);
        }
        else {
          AlertError(
            "You do not have the permission to edit the user!",
            function () {
              props.history.push("/Dashboard");
            }
          );
        }
      }

      if(props.match.params.id == 0) {
        if (!add) 
          AlertError(
            "You do not have the permission to add new user!",
            function () {
              props.history.push("/Dashboard");
            }
          );
      }
    });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setcurrentUser({ ...currentUser, [name]: value });
  };
  const handleInputChange2 = (selectedOption) => {
    setRole(selectedOption.target.value);
    currentUser.roleId = selectedOption.target.value;
  };

  const updateUser = () => {

    var id = props.match.params.id;

    var valid = true;
    if (currentUser.userName == "" || currentUser.userName == null
      || currentUser.email == "" || currentUser.email == null
      || currentUser.phoneNumber == "" || currentUser.phoneNumber == null) {
      valid = false;
    }

    if (currentUser.id == 0) {
      if (currentUser.password == "" || currentUser.password == null
        || confirmPassword == "" || confirmPassword == null) {
        valid = false;
      }
    }
    if (!valid) {
      AlertError("Please fill required fields");
      return;
    }
    if (currentUser.id == 0) {
      if (currentUser.password !== confirmPassword) {
        AlertError("Passwords do not match")
      }

      var Password = currentUser.password;

      var upperCase = new RegExp('[A-Z]');
      var lowerCase = new RegExp('[a-z]');
      var numbers = new RegExp('[0-9]');

      if (!Password.match(upperCase)) {
        Alert("Password should contain uppercase letters");
        return;
      }
      if (!Password.match(lowerCase)) {
        Alert("Password should contain lowercase letters");
        return;
      }
      if (!Password.match(numbers)) {
        Alert("Password should contain numbers");
        return;
      }


    }

    if (!validateEmail(currentUser.email)) {
      AlertError("Please enter a valid email");
      return;
    }

    currentUser.isadmin = checked;
    currentUser.islocked = checked2;
    currentUser.dob = null;
    LoadingAlert("Show")
    APIFunctions.update(currentUser.id, currentUser)
      .then((response) => {
        if (response.data.success) {
          LoadingAlert("Hide")
          AlertSuccess("Operation done successfully");
          setTimeout(() => { props.history.push("/User"); }, 500)
        }
        else {
          AlertError(response.data.messageEn)
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const cancelUser = () => {
    props.history.push("/User");
  };
  const handleChangeInRole = (selectedOptions) => {
    setRoleSelected(selectedOptions);
    setRole(selectedOptions.id);
    currentUser.roleId = selectedOptions.id;
  };
  const deleteUser = () => {
    AlertConfirm("Are you sure you want to delete ?").then((res) => {
      if (res.value) {
        APIFunctions.remove(currentUser.id)
          .then((response) => {
            AlertSuccess("Operation done successfully");
            setTimeout(() => {
              props.history.push("/User");
            }, 500);
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
              {currentUser ? (
                <div className="edit-form">
                  <div className="card-header">
                    <h4 style={{ margin: "auto" }}>User Details</h4>
                  </div>
                  <form style={{ marginTop: "10px" }}>
                    <div className="row mb-3">
                      <div className="form-group col-6">
                        <label htmlFor="txtUsername">User Name</label>
                        <small className="text-danger">*</small>
                        <input
                          type="text"
                          className="form-control"
                          id="txtUsername"
                          name="userName"
                          value={currentUser.userName}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="form-group col-6">
                        <label htmlFor="txtEmail">Email</label>
                        <small className="text-danger">*</small>
                        <input
                          type="text"
                          className="form-control"
                          id="txtEmail"
                          name="email"
                          value={currentUser.email}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="row mb-3">
                      {/* <div className="form-group col-6">
                        <label htmlFor="dtDOB">Date Of Birth</label>
                        <DatePicker
                          selected={startDate}
                          onChange={(date) => setStartDate(date)}
                          value={startDate}
                          name="dob"
                          dateFormat="MM-dd-yyyy"
                          className="w-100 height-40 cstm-input form-control"
                        />
                      </div> */}
                      <div className="form-group col-6">
                        <label htmlFor="txtPhone">Phone Number</label>
                        <small className="text-danger">*</small>
                        <input
                          type="text"
                          className="form-control"
                          id="txtPhone"
                          name="phoneNumber"
                          value={currentUser.phoneNumber}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="form-group col-6">
                        <label htmlFor="description">Job Title</label>
                        <input type="text"
                          className="form-control"
                          name="jobTitle"
                          value={currentUser.jobTitle}
                          onChange={handleInputChange}>
                        </input>
                      </div>
                      <div className="form-group col-6">
                        <label htmlFor="description">Role</label>
                        <Select
                          id="ddlCountries"
                          name="countryId"
                          value={result.find((obj) => {
                            return obj.id === role;
                          })}
                          getOptionLabel={(option) => option.name}
                          getOptionValue={(option) => option.id}
                          options={result}
                          onChange={handleChangeInRole}
                        ></Select>
                      </div>
                    </div>
                    <div className="row" style={{ display: showPassword == true ? "" : "none" }}>
                      <div className="form-group col-6" >
                        <label htmlFor="description">Password</label>
                        <input
                          className="form-control"
                          type="password"
                          id="password"
                          value={currentUser.password}
                          onChange={(e) => setcurrentUser({ ...currentUser, password: e.target.value })}
                        ></input>
                      </div>
                      <div className="form-group col-6" >
                        <label htmlFor="description">Confirm Password</label>
                        <input
                          className="form-control"
                          type="password"
                          id="confirmPassword"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        ></input>
                      </div>


                    </div>
                    <div className="row">
                      <div className="form-group col-2" >
                        <input
                          type="checkbox"
                          id={checked}
                          checked={checked}
                          value={checked}
                          onChange={(e) => { setChecked(e.target.checked) }}
                        />
                        <label style={{ margin: "5px" }}>Admin Page Access </label>
                      </div>{" "}
                      <div className="form-group col-2">
                        <input
                          type="checkbox"
                          id={checked2}
                          checked={checked2}
                          value={checked2}
                          onChange={(e) => { setChecked2(e.target.checked) }}
                        />
                        <label style={{ margin: "5px" }}>Locked</label>
                      </div>
                    </div>
                  </form>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    onClick={updateUser}
                    style={{ margin: "3px" }}>

                    Save
                  </button>
                  <button className="btn btn-danger"
                    onClick={deleteUser}
                    style={{ display: showdelete == true ? "" : "none", margin: "3px" }}>
                    Delete
                  </button>
                  <button className="btn btn-secondary" onClick={cancelUser} style={{ margin: "3px" }}>
                    {" "}
                    Cancel
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

export default EditUser;
