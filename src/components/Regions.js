import React, { useState, useEffect, useMemo, useRef } from "react";
import APIFunctions from "../utils/APIFunctions";
import { usePagination, useTable, useSortBy } from "react-table";
import { Link } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import { checkToken } from "../utils/common";
import {
  AlertConfirm,
  AlertError,
  AlertSuccess,
  LoadingAlert,
} from "./f_Alerts";
import "../css/CustomStyle.css";
const Regions = (props) => {
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
  const [operator, setOperator] = useState("");
  const [SelectedBands, setSelectedBands] = useState([]);
  const [selectedBandUnpaired, setSelectedBandUnpaired] = useState([]);
  const [bandOptionsList, setSelectedBandsOptions] = useState([]);
  const [errorResult, setErrorResult] = useState([]);

  awardsRef.current = awards;

  useEffect(() => {
    getUserPermissions();
  }, []);

  const getUserPermissions = async () => {
    APIFunctions.getUserPermissions("Regions").then((response) => {
      var _permissions = [];
      var result = response.data;
      result.map((element) => {
        if (element.pageUrl == "Regions") {
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
      if (view) retrieveRegions();
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

  const retrieveRegions = () => {
    APIFunctions.getRegions()
      .then((response) => {
        console.log("regions response: ", response.data.item2);
        setAwards(response.data.item2);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const openRegion = (rowIndex) => {
    const id = awardsRef.current[rowIndex].regionId;

    props.history.push("/EditRegion/" + id);
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

  const deleteRegion = (rowIndex) => {
    if(!checkToken()) window.location.href = "/";
    AlertConfirm("Are you sure you want to delete ?").then((res) => {
      if (res.value) {
        const id = awardsRef.current[rowIndex].regionId;
        console.log(id);

        APIFunctions.removeRegion(id)
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

  const columns = useMemo(
    () => [
      {
        Header: "Region",
        accessor: "nameEn",
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
                onClick={() => openRegion(rowIdx)}
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
                onClick={() => deleteRegion(rowIdx)}
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
                  <h5>Regions</h5>
                </div>
                <div
                  className="col-lg-1"
                  style={{ display: permissions.canAdd == true ? "" : "none" }}
                >
                  <Link to={`/EditRegion/0`}>
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
              <div className="list row">
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Regions;
