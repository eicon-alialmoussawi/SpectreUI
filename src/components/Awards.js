import React, { useState, useEffect, useMemo, useRef } from "react";
import APIFunctions from "../utils/APIFunctions";
import dateFormat from "dateformat";
import { usePagination, useTable, useSortBy } from "react-table";
import { ReactExcel, readFile, generateObjects } from "@ramonak/react-excel";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MultiSelect } from "react-multi-select-component";
import {
  AlertConfirm,
  AlertError,
  AlertSuccess,
  LoadingAlert,
} from "./f_Alerts";
import "../css/CustomStyle.css";
import { continueStatement } from "@babel/types";
import Modal from "react-bootstrap/Modal";

const Awards = (props) => {

  var myPermissions = {
    canView: false,
    canAdd: false,
    canEdit: false,
    canDelete: false,
  };

  const [permissions, setPermissions] = useState(myPermissions);
  const [awards, setAwards] = useState([]);
  const awardsRef = useRef();
  const [startDate, setStartDate] = useState("");
  const [initialData, setInitialData] = useState(undefined);
  const [options, setoptions] = useState([]);
  const [selected, setSelected] = useState([]);
  const [selectedBandsTypes, setSelectedBandsTypes] = useState([]);
  const [operator, setOperator] = useState("");
  const [SelectedBands, setSelectedBands] = useState([]);
  const [selectedBandUnpaired, setSelectedBandUnpaired] = useState([]);
  const [bandOptionsList, setSelectedBandsOptions] = useState([]);
  const [isOpen2, setIsOpen2] = useState(false);
  const [title, setTitle] = React.useState("Failed Import");
  const [errorResult, setErrorResult] = useState([]);

  awardsRef.current = awards;

  useEffect(() => {
    getUserPermissions();
  }, []);

  const getUserPermissions = async () => {
    APIFunctions.getUserPermissions("Awards").then((response) => {
      var _permissions = [];
      var result = response.data;
      result.map((element) => {
        if (element.pageUrl == "Awards") {
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
      obj.canAdd = add;
      obj.canEdit = edit;
      obj.canDelete = _delete;
      setPermissions(obj);
      if(view) retrieveAwards();
      else {
        AlertError(
          "You do not have the permission to view this page!",
          function () {
            props.history.push("/Dashboard");
          }
        );
      }
    });
  };
  useEffect(() => {
    APIFunctions.getUserCountries("AwardsMenuTest")
      .then((resp) => resp)
      .then((resp) => bindOptions(resp.data));
  }, []);
  const [currentSheet, setCurrentSheet] = useState({});
  const handleUpload = (event) => {
    const file = event.target.files[0];
    //read excel file
    readFile(file)
      .then((readedData) => setInitialData(readedData))
      .then()
      .catch((error) => console.error(error));

    // saveImportResult();
  };

  useEffect(() => {
    if (
      localStorage.getItem("OperatorName") != null &&
      localStorage.getItem("OperatorName") != ""
    )
      setOperator(localStorage.getItem("OperatorName"));
    if (
      localStorage.getItem("IssueDate") != null &&
      localStorage.getItem("IssueDate") != "" &&
      localStorage.getItem("IssueDate") != "null"
    ) {
      var _date = new Date(localStorage.getItem("IssueDate"));
      setStartDate(_date);
    }

    if (
      localStorage.getItem("AwardCountries") != null &&
      localStorage.getItem("AwardCountries") != ""
    )
      setSelected(JSON.parse(localStorage.getItem("AwardCountries")));

    if (
      localStorage.getItem("AwardPairedBands") != null &&
      localStorage.getItem("AwardPairedBands") != "[]" &&
      localStorage.getItem("AwardPairedBands") != ""
    ) {
      setSelectedBands(JSON.parse(localStorage.getItem("AwardPairedBands")));
    }

    if (
      localStorage.getItem("unPairedBands") != null &&
      localStorage.getItem("unPairedBands") != "[]" &&
      localStorage.getItem("unPairedBands") != ""
    ) {
      setSelectedBandUnpaired(
        JSON.parse(localStorage.getItem("unPairedBands"))
      );
    }

    var name = localStorage.getItem("OperatorName");
    var date = null;
    var date =
      localStorage.getItem("IssueDate") == "" ||
      localStorage.getItem("IssueDate") == null ||
      localStorage.getItem("IssueDate") == "null"
        ? null
        : new Date(localStorage.getItem("IssueDate"));
    var _bands = JSON.parse(localStorage.getItem("AwardPairedBands"));
    var _unPaired = JSON.parse(localStorage.getItem("unPairedBands"));
    var _countries = JSON.parse(localStorage.getItem("AwardCountries"));

    filter2(name, date, _bands, _unPaired, _countries);
  }, []);

  const filter2 = (name, date, _bands, _unPaired, _countries) => {
    var value = [];

    try {
      if (_countries != null || _countries != "null") {
        for (var i = 0, l = _countries.length; i < l; i++) {
          value.push(_countries[i].value);
        }
      }

      var bandsArray = [];
      if (_bands != null || _bands != "null") {
        for (var i = 0, l = _bands.length; i < l; i++) {
          bandsArray.push(_bands[i].value);
        }
      }

      var bandsUnPairedArray = [];
      if (_unPaired != null || _unPaired != "null") {
        for (var i = 0, l = _unPaired.length; i < l; i++) {
          bandsUnPairedArray.push(_unPaired[i].value);
        }
      }
      var filteredView = {
        CountryIds: value.join(","),
        BandTypes: bandsArray.join("-"),
        BandUnPaired: bandsUnPairedArray.join("-"),
        OperatorName: name == "" ? "" : name.trim(),
        Year: date == "" || date == null ? 0 : parseInt(date.getFullYear()),
        Month: date == "" || date == null ? 0 : parseInt(date.getMonth() + 1),
      };

      var pairedBands = JSON.stringify(SelectedBands);
      var JsonCountries = JSON.stringify(selected);
      var unPairedBands = JSON.stringify(selectedBandUnpaired);

      APIFunctions.getFilterAwards(filteredView)
        .then((response) => {
          setAwards(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    } catch (ex) {
      console.log(ex);
    }
  };

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

  const saveImportResult = () => {
    LoadingAlert("Show");
    var result = generateObjects(currentSheet);
    result = result.filter(function (obj) {
      return obj.year != "" && obj.Iso != "";
    });
    result.forEach(function (award) {
      award.BandPaired = award.BandPaired.toString();
      award.BandUnPaired = award.BandUnPaired.toString();
      award.BlockPaired = award.BlockPaired.toString();
      award.BlockUnPaired = award.BlockUnPaired.toString();
      award.Terms = award.Terms.toString();
      if (award.Pop == "") award.Pop = null;
      if (award.UpFrontFees == "") award.UpFrontFees = null;
      if (award.RegionalLicense == "") award.RegionalLicense = null;
      if (award.AnnualFees == "") award.AnnualFees = null;
      if (award.ReservePrice == "") award.ReservePrice = null;
      if (award.AuctionDateYear == "") award.AuctionDateYear = null;
    });

    APIFunctions.importAwards(result)
      .then((response) => {
        LoadingAlert("Hide");
        if (response.data.length == 0)
          AlertSuccess("Operation done successfully");
        else {
          LoadingAlert("Hide");
          setIsOpen2(true);
          setErrorResult(response.data);
          return;
        }
      })
      .catch((e) => {
        LoadingAlert("Hide");
        console.log(e);
      });
  };
  const retrieveAwards = () => {
    APIFunctions.getAllAwards()
      .then((response) => {
        setAwards(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const openAward = (rowIndex) => {
    const id = awardsRef.current[rowIndex].id;

    props.history.push("/EditAward/" + id);
  };

  const bindOptions = (data) => {
    var arr = [];
    for (var i = 0, l = data.length; i < l; i++) {
      var ob = new Object();
      ob.label = data[i].nameEn;
      ob.value = data[i].countryId;
      arr.push(ob);
    }
    setoptions(arr);
  };

  const deleteAward = (rowIndex) => {
    AlertConfirm("Are you sure you want to delete ?").then((res) => {
      if (res.value) {
        const id = awardsRef.current[rowIndex].id;

        APIFunctions.removeAward(id)
          .then((response) => {
            AlertSuccess("Operation done successfully");
            let newAwards = [...awardsRef.current];
            newAwards.splice(rowIndex, 1);
            setAwards(newAwards);
          })
          .catch((e) => {
            console.log(e);
          });
      }
    });
  };
  const refreshList = () => {
    retrieveAwards();
  };
  const newItem = () => {
    props.history.push("/EditAward/0");
  };

  const hideModal2 = () => {
    setIsOpen2(false);
  };

  const modalLoaded2 = () => {
    setTitle("Unaccepted Users");
  };

  const filter = () => {
    var value = [];
    for (var i = 0, l = selected.length; i < l; i++) {
      value.push(selected[i].value);
    }

    var bandsArray = [];
    for (var i = 0, l = SelectedBands.length; i < l; i++) {
      bandsArray.push(SelectedBands[i].value);
    }

    var bandsUnPairedArray = [];
    for (var i = 0, l = selectedBandUnpaired.length; i < l; i++) {
      bandsUnPairedArray.push(selectedBandUnpaired[i].value);
    }

    var filteredView = {
      CountryIds: value.join(","),
      BandTypes: bandsArray.join("-"),
      BandUnPaired: bandsUnPairedArray.join("-"),
      OperatorName: operator == "" ? "" : operator.trim(),
      Year:
        startDate == "" || startDate == null
          ? 0
          : parseInt(startDate.getFullYear()),
      Month: 0,
    };

    var pairedBands = JSON.stringify(SelectedBands);
    var JsonCountries = JSON.stringify(selected);
    var unPairedBands = JSON.stringify(selectedBandUnpaired);

    APIFunctions.getFilterAwards(filteredView)
      .then((response) => {
        setAwards(response.data);
      })
      .catch((e) => {
        console.log(e);
      });

    localStorage.setItem("AwardCountries", JsonCountries);
    localStorage.setItem("AwardPairedBands", pairedBands);
    localStorage.setItem("unPairedBands", unPairedBands);
    localStorage.setItem("OperatorName", operator);
    localStorage.setItem("IssueDate", startDate);
  };

  const removeAllAwards = () => {
    AlertConfirm("Are you sure you want to remove all awards ?").then((res) => {
      if (res.value) {
        APIFunctions.removeAllAwards()
          .then((response) => {
            AlertSuccess("Operation done successfully");
            refreshList();
          })
          .catch((e) => {
            console.log(e);
          });
      }
    });
  };
  const columns = useMemo(
    () => [
      {
        Header: "Year",
        accessor: "year",
      },
      {
        Header: "Country",
        accessor: "countryName",
      },
      {
        Header: "Operator Name",
        accessor: "operatorName",
      },
      {
        Header: "Band Paired",
        accessor: "bandPaired",
      },
      {
        Header: "Band UnPaired",
        accessor: "bandUnPaired",
      },

      {
        Header: "Actions",
        accessor: "actions",
        Cell: (props) => {
          const rowIdx = props.row.id;
          return (
            <div>
              <a
                style={{ display: permissions.canEdit == true ? "" : "none" }}
                onClick={() => openAward(rowIdx)}
                className=" btn btn-primary btn-xs"
              >
                <i
                  style={{ cursor: "pointer", color: "" }}
                  className="fas fa-pencil-alt"
                ></i>
              </a>
              {/* <Link to={`/EditAward/${awardsRef.current[rowIdx].id}`}>
                <i className="btn btn-primary fas fa-pencil-alt" aria-hidden="true"></i>
              </Link> */}

              <a
                style={{ display: permissions.canDelete == true ? "" : "none" }}
                onClick={() => deleteAward(rowIdx)}
                className="btn btn-danger btn-xs"
              >
                <i
                  style={{ cursor: "pointer", color: "" }}
                  className="fas fa-trash action"
                ></i>
              </a>
            </div>
          );
        },
      },
    ],
    []
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    gotoPage,
    pageCount,
    setPageSize,
    state,
    prepareRow,
  } = useTable(
    {
      columns,
      data: awards,
      initialState: {
        hiddenColumns: columns.map((column) => {
          if (column.show === false) return column.accessor || column.id;
        }),
      },
    },
    useSortBy,
    usePagination
  );

  const { pageIndex } = state;

  const renderErrorMessage = () => {
    var item = errorResult;
    console.log(item);
    if (item != null || item != undefined) {
      {
        return (
          <ul className="list-group">
            {item.map((val, idx) => (
              <li className="list-group-item">
                <strong>Awards for Country {val.country + ": "}</strong>{" "}
                {val.month + " " + String(val.year)}
              </li>
            ))}
          </ul>
        );
      }
    }
  };

  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <div class="card">
            <div className="card-header">
              <div className="row">
                <div className="col-lg-10">
                  <h5>Awards</h5>
                </div>
                <div
                  className="col-lg-1"
                  style={{ display: permissions.canAdd == true ? "" : "none" }}
                >
                  <Link to={`/EditAward/0`}>
                    {" "}
                    <button
                      type="submit"
                      className="btn btn-primary background-color-2"
                    >
                      <i className="fas fa-plus" />
                    </button>
                  </Link>
                </div>
                <div className="col-lg-1"></div>
              </div>
            </div>

            <div class="card-body">
              <div className="row mb-3">
                <div className="col-lg-4">
                  <label>Country</label>
                  <MultiSelect
                    getOptionValue={(option) => option.countryId}
                    options={options}
                    value={selected}
                    onChange={setSelected}
                    labelledBy="Select"
                  />
                </div>
                <div className="col-lg-4">
                  <label>Operator Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={operator}
                    onChange={(e) => {
                      setOperator(e.target.value);
                    }}
                  ></input>
                </div>
                <div className="col-lg-4">
                  <label>Band Paired</label>
                  <MultiSelect
                    getOptionValue={(option) => option.value}
                    options={bandOptionsList}
                    value={SelectedBands}
                    onChange={setSelectedBands}
                    labelledBy="Select"
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-lg-4">
                  <label>Band UnPaired</label>
                  <MultiSelect
                    getOptionValue={(option) => option.value}
                    options={bandOptionsList}
                    value={selectedBandUnpaired}
                    onChange={setSelectedBandUnpaired}
                    labelledBy="Select"
                  />
                </div>
                <div className="col-lg-4">
                  <label>Auction Date</label>
                  <DatePicker
                    className="form-control"
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    showYearPicker
                    value={startDate}
                    dateFormat="yyyy"
                  />
                </div>
                <div
                  className="col-lg-4"
                  style={{ float: "right", margin: "auto", marginTop: "3%" }}
                >
                  <button
                    type="submit"
                    className="btn btn-primary"
                    onClick={() => filter()}
                  >
                    Filter
                  </button>
                </div>
              </div>
              <hr />
              <div className="list row">
                <div className="col-md-12">
                  <div className="input-group mb-3" style={{ gap: "10px" }}>
                    <div className="input-group-append" style={{ gap: "10px" }}>
                      {/* <Link to={`/EditAward/0`}>
                        <button type="submit" className="btn btn-primary">
                          New
                        </button>
                      </Link> */}

                      <div style={{ display: "none" }}>
                        <ReactExcel
                          initialData={initialData}
                          onSheetUpdate={(currentSheet) =>
                            setCurrentSheet(currentSheet)
                          }
                          activeSheetClassName="active-sheet"
                          reactExcelClassName="react-excel "
                        />{" "}
                      </div>
                      <input
                        type="file"
                        accept=".xlsx"
                        onChange={handleUpload}
                      />
                      <button
                        className="btn btn-success"
                        onClick={saveImportResult}
                        style={{ zIndex: "unset" }}
                      >
                        Import Excel
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-md-12 list">
                  <table
                    className="table table-striped table-bordered"
                    {...getTableProps()}
                  >
                    <thead>
                      {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                          {headerGroup.headers.map((column) => (
                            <th {...column.getHeaderProps()}>
                              {column.render("Header")}
                            </th>
                          ))}
                        </tr>
                      ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                      {page.map((row, i) => {
                        prepareRow(row);
                        return (
                          <tr {...row.getRowProps()}>
                            {row.cells.map((cell) => {
                              return (
                                <td {...cell.getCellProps()}>
                                  {cell.render("Cell")}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="col-6 text-align-right">
                  <button
                    className="btn inner-btn-secondary px-5px py-0 mr-1"
                    onClick={() => gotoPage(0)}
                    disabled={!canPreviousPage}
                  >
                    {"<<"}
                  </button>
                  <button
                    className="btn inner-btn-secondary px-5px py-0 mr-1"
                    onClick={() => previousPage()}
                    disabled={!canPreviousPage}
                  >
                    Previous
                  </button>
                  <button
                    className="btn inner-btn-secondary px-5px py-0 mr-1"
                    onClick={() => nextPage()}
                    disabled={!canNextPage}
                  >
                    Next{" "}
                  </button>
                  <button
                    className="btn inner-btn-secondary px-5px py-0"
                    onClick={() => gotoPage(pageCount - 1)}
                  >
                    {">>"}
                  </button>
                </div>

                <div className="col-md-8">
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={removeAllAwards}
                  >
                    Remove All
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        size="lg"
        show={isOpen2}
        onHide={hideModal2}
        onEntered={modalLoaded2}
      >
        <Modal.Header closeButton>
          <Modal.Title>Un-Inserted Awards</Modal.Title>
          {/* <button type="button" className="btn-close" aria-label="Close"></button> */}
        </Modal.Header>
        <Modal.Body>{isOpen2 && renderErrorMessage()}</Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={hideModal2}>
            Cancel
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Awards;
