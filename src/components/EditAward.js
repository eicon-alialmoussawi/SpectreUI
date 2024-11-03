import React, { useState, useEffect, useMemo, useRef } from "react";
import APIFunctions from "../utils/APIFunctions";
import dateFormat from "dateformat";
import { useTable } from "react-table";
import { MultiSelect } from "react-multi-select-component";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Alert, AlertError, AlertSuccess, AlertConfirm } from "./f_Alerts";

const EditAward = (props) => {
  const initialAwardState = {
    id: 0,
    year: "",
    month: "",
    countryId: "",
    operatorId: "",
    pricePaid: 0,
    terms: "",
    isDeleted: "",
    bandPaired: "",
    bandUnPaired: "",
    blockPaired: "",
    blockUnPaired: "",
    regionalLicense: false,
    pop: 0,
    reservePrice: null,
  };

  var myPermissions = {
    canAdd: false,
    canEdit: false,
    canDelete: false,
  };

  const [permissions, setPermissions] = useState(myPermissions);
  const [startDate, setStartDate] = useState(new Date());
  const [startDate2, setStartDate2] = useState(null);
  const [resultCountry, emplistCountry] = useState([]);
  const [resultOperators, emplistOperators] = useState([]);
  const [countryId, setCountryId] = useState("");
  const [checked, setChecked] = React.useState(false);
  const [singleBand, setSingleBandChecked] = React.useState(false);
  const [multiBand, setMultiBandChecked] = React.useState(false);
  const [currentAward, setCurrentAward] = useState(initialAwardState);
  const [operatorId, setOperatorId] = useState("");
  const [bandOptionsList, setSelectedBandsOptions] = useState([]);
  const [SelectedBands, setSelectedBands] = useState([]);
  const [selectedBandUnpaired, setSelectedBandUnpaired] = useState([]);
  const [showDelete, setShowDelete] = useState(false);

  const handleChange = () => {
    setChecked(!checked);
  };
  const handleSingleChange = () => {
    setSingleBandChecked(!singleBand);
    if (!singleBand) setMultiBandChecked(singleBand);
  };
  const handleMultiChange = () => {
    setMultiBandChecked(!multiBand);
    if (!multiBand) setSingleBandChecked(multiBand);
  };
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCurrentAward({ ...currentAward, [name]: value });
  };
  const handleChangeOperator = (selectedOptions) => {
    setOperatorId(selectedOptions.id);
  };
  const handleChangeCountry = (selectedOptions) => {
    setCountryId(selectedOptions.countryId);
  };
  useEffect(() => {
    getUserPermissions();
  }, []);
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

  // useEffect(() => {
  //   if (props.match.params.id != 0) {
  //     getAward(props.match.params.id);
  //     setShowDelete(true);
  //   }
  // }, [props.match.params.id]);

  const retrieveAwardDetails = (canDelete) => {
    if (props.match.params.id != 0) {
      getAward(props.match.params.id);
      if(canDelete)
        setShowDelete(true);
    }
  }

  const getUserPermissions = async () => {
    APIFunctions.getUserPermissions("Awards").then((response) => {
      var _permissions = [];
      var result = response.data;
      result.map((element) => {
        if (element.pageUrl == "Awards") {
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
        if (edit) retrieveAwardDetails(_delete);
        else {
          AlertError(
            "You do not have the permission to edit the award!",
            function () {
              props.history.push("/Dashboard");
            }
          );
        }
      }

      if(props.match.params.id == 0) {
        if (!add) 
          AlertError(
            "You do not have the permission to add new award!",
            function () {
              props.history.push("/Dashboard");
            }
          );
      }
    });
  };


  const getBandsUnpaired = (data) => {
    if (data.length == 0) {
      return;
    }
    var _bands = data.split("-");
    var list = [];
    for (var i = 0, l = _bands.length; i < l; i++) {
      var item = new Object();
      item.value = _bands[i];
      item.label = _bands[i];
      list.push(item);
    }
    setSelectedBandUnpaired(list);
  }

  const getBandsPaired = (data) => {
    if (data.length == 0) {
      return;
    }
    var _bands = data.split("-");
    var list = [];
    for (var i = 0, l = _bands.length; i < l; i++) {
      var item = new Object();
      item.value = _bands[i];
      item.label = _bands[i];
      list.push(item);
    }
    setSelectedBands(list);
  }

  const getAward = (id) => {
    APIFunctions.getAwardById(id)
      .then((response) => {
        console.log(response.data);
        setCurrentAward(response.data);
        setCountryId(response.data.countryId);
        setOperatorId(response.data.operatorId);
        setChecked(response.data.regionalLicense);
        setMultiBandChecked((response.data.singleOrmultiBand == "M" || response.data.singleOrmultiBand == "m") ? true : false);
        setSingleBandChecked((response.data.singleOrmultiBand == "S" || response.data.singleOrmultiBand == "s") ? true : false);
        var issueDt = new Date();
        issueDt.setFullYear(response.data.year, response.data.month, 0);
        if (response.data.year != 0 && response.data.month != 0) {
          setStartDate(issueDt);
        } else {
          setStartDate(null);
        }

        getBandsPaired(response.data.bandPaired);
        getBandsUnpaired(response.data.bandUnPaired);

        if (response.data.auctionDateYear == null || response.data.auctionDateMonth == null
          || response.data.auctionDateYear == 0 || response.data.auctionDateMonth == 0) {
          setStartDate2(null);
        }
        else {
          var auctionDate = new Date();
          auctionDate.setFullYear(response.data.auctionDateYear, response.data.auctionDateMonth, 0);
          if (response.data.auctionDateYear != 0 && response.data.auctionDateMonth != 0) {
            setStartDate2(auctionDate);
          }
          else {
            setStartDate2(null);
          }
        }


      })

      .catch((e) => {
        console.log(e);
      });
  };
  const updateAward = () => {

    if (startDate == "" || startDate == null
      || countryId == "" || countryId == null
      || currentAward.operator == "" || currentAward.operator == null) {
      AlertError("Please fill required fields");
      return;
    }

    console.log(currentAward.pop)
    if ((currentAward.pop == 0 || currentAward.pop == "" || currentAward.pop == null) && checked == true) {
      AlertError("Regional licnese must not be selected");
      return;
    }

    if (currentAward.pop > 0 && checked == false) {
      AlertError("Regional licnese must be checked");
      return;
    }
    if (!singleBand && !multiBand) {
      AlertError("You must choose either Multi/Single Band");
      return;
    }

    currentAward.countryId = countryId;
    currentAward.operatorId = operatorId;
    if (startDate != null) {
      currentAward.year = startDate.getFullYear();
      currentAward.month = (startDate.getMonth() + 1);
    }
    if (startDate2 != null) {
      currentAward.auctionDateYear = startDate2.getFullYear();
      currentAward.auctionDateMonth = (startDate2.getMonth() + 1);
    }
    if (currentAward.id == 0) {
      currentAward.isDeleted = false;
    }

    if (!checkBandState()) {
      AlertError("Invalid Band Combination");
      return;
    }


    currentAward.regionalLicense = checked;
    currentAward.singleOrmultiBand = singleBand == false ? "M" : "S";

    var bandsArray = [];
    for (var i = 0, l = SelectedBands.length; i < l; i++) {
      bandsArray.push(SelectedBands[i].value);
    }

    var bandsUnPairedArray = [];
    for (var i = 0, l = selectedBandUnpaired.length; i < l; i++) {
      bandsUnPairedArray.push(selectedBandUnpaired[i].value);
    }

    currentAward.bandPaired = bandsArray.join("-");
    currentAward.bandUnPaired = bandsUnPairedArray.join("-");
    currentAward.operatorId = null;

    console.log(currentAward);


    APIFunctions.saveAward(currentAward.id, currentAward)
      .then((response) => {
        if (response.data != null) {
          AlertSuccess("Operation done successfully");
          setTimeout(() => { props.history.push("/Awards") }, 500);
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
    props.history.push("/Awards");
  };
  const deleteAward = () => {
    AlertConfirm('Are you sure you want to delete ?')
      .then(res => {
        if (res.value) {
          APIFunctions.removeAward(currentAward.id)
            .then((response) => {
              props.history.push("/Awards");
            })
            .catch((e) => {
              console.log(e);
            });
        }
      });
  };


  const checkBandState = () => {
    var valid = true;
    if (SelectedBands.length == 1 && selectedBandUnpaired.length == 0 && singleBand == false) {
      valid = false;
    }
    else if (SelectedBands.length == 0 && selectedBandUnpaired.length == 1 && singleBand == false) {
      valid = false;
    }
    else if (SelectedBands.length == 0 && selectedBandUnpaired.length > 1 && multiBand == false) {
      valid = false;
    }
    else if (SelectedBands.length > 1 && selectedBandUnpaired.length == 0 && multiBand == false) {
      valid = false;
    }
    else if (SelectedBands.length != 0 && SelectedBands.length == selectedBandUnpaired.length
      && checkIfContained(SelectedBands, selectedBandUnpaired) && singleBand == false) {
      valid = false;
    }
    else if (SelectedBands.length != 0 && SelectedBands.length == selectedBandUnpaired.length
      && !checkIfContained(SelectedBands, selectedBandUnpaired) && singleBand == false) {
      valid = false;
    }

    else if (SelectedBands.length > 1 && selectedBandUnpaired.length > 0 && multiBand == false) {
      valid = false;
    }
    else if (SelectedBands.length > 0 && selectedBandUnpaired.length > 1 && multiBand == false) {
      valid = false;
    }

    return valid;
  }

  useEffect(() => {
    APIFunctions.getAllBands()
      .then((resp) => resp)
      .then((resp) => bindOptionsBand(resp.data));
  }, []);


  const bindOptionsBand = (data) => {
    var arr = [];
    for (var i = 0, l = data.length; i < l; i++) {
      var ob = new Object();
      ob.label = data[i].value.toString();
      ob.value = data[i].value.toString();
      arr.push(ob);
    }
    setSelectedBandsOptions(arr);
  };

  const updatePop = (evt) => {
    var value = evt.target.value;
    if (value == "" || value == 0) {
      setCurrentAward({ ...currentAward, pop: value == "" ? null : 0 })
      setChecked(false);
    }
    else {
      setCurrentAward({ ...currentAward, pop: parseFloat(value) });
      setChecked(true);
    }
  }

  const checkPairedBands = (evt) => {

    setSelectedBands(evt);
    if (evt.length == 1 && selectedBandUnpaired.length == 0) {
      setSingleBandChecked(true);
      setMultiBandChecked(false);
    }
    else if (evt.length == 0 && selectedBandUnpaired.length == 1) {
      setSingleBandChecked(true);
      setMultiBandChecked(false);
    }
    else if (evt.length == 0 && selectedBandUnpaired.length > 1) {
      setSingleBandChecked(false);
      setMultiBandChecked(true);
    }
    else if (evt.length > 1 && selectedBandUnpaired.length == 0) {
      setSingleBandChecked(false);
      setMultiBandChecked(true);
    }
    else if (evt.length > 1 && selectedBandUnpaired.length > 0) {
      setSingleBandChecked(false);
      setMultiBandChecked(true);
    }
    else if (evt.length != 0 && evt.length == selectedBandUnpaired.length && checkIfContained(evt, selectedBandUnpaired)) {
      setSingleBandChecked(true);
      setMultiBandChecked(false);
    }
    else if (evt.length != 0 && evt.length == selectedBandUnpaired.length && !checkIfContained(evt, selectedBandUnpaired)) {
      setSingleBandChecked(false);
      setMultiBandChecked(true);
    }

    else if (evt.length > 1 && selectedBandUnpaired.length > 0) {
      setSingleBandChecked(false);
      setMultiBandChecked(true);
    }
    else if (evt.length > 0 && selectedBandUnpaired.length > 1) {
      setSingleBandChecked(false);
      setMultiBandChecked(true);
    }
    else {
      setSingleBandChecked(false);
      setMultiBandChecked(false);
    }
  }

  const checkIfContained = (bandsPaired, bandsUnpaired) => {
    return !bandsPaired.some(function (item) {
      return bandsUnpaired.indexOf(item) === -1;
    });
  }

  const checkUnPairedBands = (evt) => {
    setSelectedBandUnpaired(evt);
    if (evt.length == 1 && SelectedBands.length == 0) {
      setSingleBandChecked(true);
      setMultiBandChecked(false);
    }
    else if (evt.length == 0 && SelectedBands.length == 1) {
      setSingleBandChecked(true);
      setMultiBandChecked(false);
    }
    else if (evt.length == 0 && SelectedBands.length > 1) {
      setSingleBandChecked(false);
      setMultiBandChecked(true);
    }
    else if (evt.length > 1 && SelectedBands.length == 0) {
      setSingleBandChecked(false);
      setMultiBandChecked(true);
    }
    else if (evt.length > 1 && SelectedBands.length > 0) {
      setSingleBandChecked(false);
      setMultiBandChecked(true);
    }
    else if (evt.length > 0 && SelectedBands.length > 1) {
      setSingleBandChecked(false);
      setMultiBandChecked(true);
    }
    else if (evt.length != 0 && evt.length == SelectedBands.length && checkIfContained(evt, SelectedBands)) {
      setSingleBandChecked(true);
      setMultiBandChecked(false);
    }
    else if (evt.length != 0 && evt.length == SelectedBands.length && !checkIfContained(evt, SelectedBands)) {
      setSingleBandChecked(false);
      setMultiBandChecked(true);
    }
    else {
      setSingleBandChecked(false);
      setMultiBandChecked(false);
    }
  }

  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <div class="card">
            <div className="card-header">
              <h5>Awards</h5>
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
                          <label htmlFor="txtUsername">Auction Date</label>
                          <small className="text-danger"> * </small>
                          <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            dateFormat="MMMM yyyy"
                            showMonthYearPicker
                            className="form-control Datepicker pa2"
                            placeholderText="Select a date"
                            calendarClassName="rasta-stripes"
                            popperModifiers={{
                              offset: {
                                enabled: true,
                                offset: "0px, 0px",
                              },
                              preventOverflow: {
                                enabled: true,
                                escapeWithReference: false,
                                boundariesElement: "scrollParent",
                              },
                            }}
                          />
                        </div>

                        <div className="form-group col-4">
                          <label htmlFor="txtUsername">Start Date</label>
                          <DatePicker
                            selected={startDate2}
                            onChange={(date) => setStartDate2(date)}
                            dateFormat="MMMM yyyy"
                            showMonthYearPicker
                            className="form-control Datepicker pa2"
                            placeholderText="Select a date"
                            calendarClassName="rasta-stripes"
                            popperModifiers={{
                              offset: {
                                enabled: true,
                                offset: "0px, 0px",
                              },
                              preventOverflow: {
                                enabled: true,
                                escapeWithReference: false,
                                boundariesElement: "scrollParent",
                              },
                            }}
                          />
                        </div>
                        <div className="form-group col-4">
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

                      <div className="row">
                        <div className="form-group col-4">
                          <label htmlFor="value">Regional POP</label>
                          <input
                            type="number"
                            className="form-control"
                            id="txtPOP"
                            name="pop"
                            value={currentAward.pop}
                            onChange={(e) => updatePop(e)}
                          // onChange={(e) => { setCurrentAward({ ...currentAward, pop: parseFloat(e.target.value) }) }}
                          />
                        </div>
                        <div className="form-group col-4"
                          style={{ display: "none" }}>
                          <label htmlFor="description">Operator</label>
                          <small className="text-danger"> * </small>
                          <div className="col-md-6">
                            <Select
                              id="ddlCountries"
                              name="countryId"
                              value={resultOperators.find((obj) => {
                                return obj.id === operatorId;
                              })}
                              getOptionLabel={(option) => option.name}
                              getOptionValue={(option) => option.id}
                              options={resultOperators}
                              onChange={handleChangeOperator}
                            ></Select>
                          </div>
                        </div>
                        <div className="form-group col-4">
                          <label htmlFor="txtTerms">Operator</label>
                          <small className="text-danger"> * </small>
                          <input
                            type="text"
                            className="form-control"
                            id="txtTerms"
                            name="operator"
                            value={currentAward.operator}
                            onChange={handleInputChange}
                          />
                        </div>


                        <div className="form-group col-4">
                          <label htmlFor="txtTerms">Term</label>
                          <input
                            type="number"
                            className="form-control"
                            id="txtTerms"
                            name="terms"
                            value={currentAward.terms}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="form-group col-4">
                          <label htmlFor="value">Band Paired</label>
                          <MultiSelect
                            id="ddlBands"
                            name="bandId"
                            getOptionValue={(option) => option.value}
                            options={bandOptionsList}
                            value={SelectedBands}
                            onChange={(e) => checkPairedBands(e)}
                          ></MultiSelect>
                        </div>
                        <div className="form-group col-4">
                          <label htmlFor="value">Band Un-Paired</label>
                          <MultiSelect
                            id="ddlBands"
                            name="bandId"
                            getOptionValue={(option) => option.value}
                            options={bandOptionsList}
                            value={selectedBandUnpaired}
                            onChange={(e) => checkUnPairedBands(e)}
                          // onChange={setSelectedBandUnpaired}
                          ></MultiSelect>
                        </div>
                        <div className="form-group col-4">
                          <label htmlFor="value">Block Paired</label>
                          <input
                            type="text"
                            className="form-control"
                            id="txtblockPaired"
                            name="blockPaired"
                            value={currentAward.blockPaired}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>

                      <div className="row">

                        <div className="form-group col-4">
                          <label htmlFor="value">Block Un-Paired</label>
                          <input
                            type="text"
                            className="form-control"
                            id="txtblockUnPaired"
                            name="blockUnPaired"
                            value={currentAward.blockUnPaired}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="form-group col-4">
                          <label htmlFor="txtPricePaid">Annual Fees</label>
                          <input
                            type="number"
                            className="form-control"
                            id="txtPricePaid"
                            name="annualFees"
                            value={currentAward.annualFees}
                            onChange={(e) => { setCurrentAward({ ...currentAward, annualFees: parseFloat(e.target.value) }) }}
                          />
                        </div>
                        <div className="form-group col-4">
                          <label htmlFor="txtPricePaid">Upfront Fees</label>
                          <input
                            type="number"
                            className="form-control"
                            id="txtPricePaid"
                            name="upFrontFees"
                            value={currentAward.upFrontFees}
                            onChange={(e) => { setCurrentAward({ ...currentAward, upFrontFees: parseFloat(e.target.value) }) }}
                          />
                        </div>
                      </div>

                      <div className="row">
                        <div className="form-group col-4">
                          <label htmlFor="txtPricePaid">Reserve Price</label>
                          <input
                            type="number"
                            className="form-control"
                            id="txtPricePaid"
                            name="annualFees"
                            value={currentAward.reservePrice}
                            onChange={(e) => { setCurrentAward({ ...currentAward, reservePrice: parseFloat(e.target.value) }) }}
                          />
                        </div>
                      </div>

                      <div className="row">
                        <div className="form-group col-2">
                          <label htmlFor="chkIsLicense">Regional License</label>
                          <input
                            type="checkbox"
                            id="chkIsLicense"
                            name="regionalLicense"
                            checked={checked}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="form-group col-2">
                          <label htmlFor="chkIsLicense">Multi Band</label>
                          <input
                            type="checkbox"
                            id="chkIsLicense"
                            name="regionalLicense"
                            checked={multiBand}
                            onChange={handleMultiChange}
                          />
                        </div>

                        <div className="form-group col-2">
                          <label htmlFor="chkIsLicense">Single Band</label>
                          <input
                            type="checkbox"
                            id="chkIsLicense"
                            name="regionalLicense"
                            checked={singleBand}
                            onChange={handleSingleChange}
                          />
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

export default EditAward;
