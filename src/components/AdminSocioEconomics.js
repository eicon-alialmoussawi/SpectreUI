import React, { useState, useEffect, useMemo, useRef } from "react";
import APIFunctions from "../utils/APIFunctions";
import { withSwalInstance } from "sweetalert2-react";
import swal from "sweetalert";
import dateFormat from "dateformat";
import { useTable, useSortBy, usePagination } from "react-table";
import { ReactExcel, readFile, generateObjects } from "@ramonak/react-excel";
import { trackPromise } from "react-promise-tracker";
import { MultiSelect } from "react-multi-select-component";
import Select from "react-select";
import { AlertConfirm, AlertError, AlertSuccess, LoadingAlert } from "../components/f_Alerts";
import '../css/CustomStyle.css';
import { BindNotifications, UpdateBindNotificatimport } from "../utils/Globals";

const AdminSocioEconomics = (props) => {

  var myPermissions =
  {
      canView: false,
      canAdd: false,
      canEdit: false,
      canDelete: false,
  }

  const [permissions, setPermissions] = useState(myPermissions);
  const [SocioEconomics, setSocioEconomics] = useState([]);
  const SocioEconomicsRef = useRef();
  const [selectedFile, setSelectedFile] = useState(null);
  const SweetAlert = withSwalInstance(swal);

  const [resultSources, emplistSources] = useState([]);
  const [sourceId, setSourceId] = useState();
  const [sourceIdSearch, setSourceIdSearch] = useState("");
  const [currentItemToDelete, setItemToDelete] = useState(null);
  const [alertStatus, setAlertStatus] = React.useState(false);
  const [initialData, setInitialData] = useState(undefined);
  const [currentSheet, setCurrentSheet] = useState({});
  const [awards, setAwards] = useState([]);
  const [selected, setSelected] = useState([]);
  const [columns, setColumns] = useState([]);
  const [options, setoptions] = useState([]);
  const clmns = [
    {
      id: 0,
      Header: "Country",
      accessor: "countryName",
    },
  ];

  const handleUpload = (event) => {
    const file = event.target.files[0];
    //read excel file
    readFile(file)
      .then((readedData) => setInitialData(readedData))
      .then(console.log(currentSheet))
      .catch((error) => console.error(error));

    // saveImportResult();
  };
  useEffect(() => {
    APIFunctions.GetLookupsByParentId("SOC_SRC")
      .then((resp) => resp)
      .then((resp) => emplistSources(resp.data));
  }, []);


  useEffect(() => {
    if (localStorage.getItem("SourceId") != null && localStorage.getItem("SourceId") != "")
      setSourceIdSearch(localStorage.getItem("SourceId"));

    console.log(localStorage.getItem("CountryIds"))
    if (localStorage.getItem("CountryIds") != null && localStorage.getItem("CountryIds") != "[]"
      && localStorage.getItem("CountryIds") != "") {
      setSelected(JSON.parse(localStorage.getItem("CountryIds")));
    }

    if (localStorage.getItem("SourceId") != null
      && localStorage.getItem("SourceId") != ""
      && localStorage.getItem("CountryIds") != "[]"
      && localStorage.getItem("CountryIds") != null
      && localStorage.getItem("CountryIds") != "") {
      filterSocioEconomicsAfterLoad(JSON.parse(localStorage.getItem("CountryIds")), localStorage.getItem("SourceId"));
    }
  }, []);

  useEffect(() => {
    getUserPermissions();
    }, []);

    const getUserPermissions = async () => {
      APIFunctions.getUserPermissions("AdminSocioEconomics")
          .then((response) => {
              var _permissions = [];
              var result = response.data;
              result.map((element) => {
                  if (element.pageUrl == "AdminSocioEconomics") {
                      _permissions.push(element);
                  }
              })


              var view =
                _permissions.find((element) => {
                  return element.action == "View";
                }) === undefined
                  ? false
                  : true;
              var add = (_permissions.find((element) => { return element.action == "Add" })) === undefined ? false : true;
              var edit = (_permissions.find((element) => { return element.action == "Edit" })) === undefined ? false : true;
              var _delete = (_permissions.find((element) => { return element.action == "Delete" })) === undefined ? false : true;




              var obj = permissions;
              obj.canAdd = add;
              obj.canEdit = edit;
              obj.canDelete = _delete;
              setPermissions(obj);
              if(!view) {
                AlertError(
                  "You do not have the permission to view this page!",
                  function () {
                    props.history.push("/Dashboard");
                  }
                );
              }

          })

  }

  const filterAwardsByYear = () => {
    var Year = parseInt(2015);
    APIFunctions.filterSocioEconimcsByYear(Year)
    .then((resp) => resp)
    .then((resp) => bindOptions(resp.data));
  }


  useEffect(() => {
    APIFunctions.getAllCountries()
      .then((resp) => resp)
      .then((resp) => bindOptions(resp.data));
  }, []);

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

  const saveImportResult = () => {

    UpdateBindNotificatimport(false);
    if (currentSheet.length != 0) {
      const result = generateObjects(currentSheet);
      var FinalArray = [];
      console.log(result);
      for (var i = 0, l = result.length; i < l; i++) {
        var CurrentKeys = Object.keys(result[i]);
        for (var k = 0; k < CurrentKeys.length; k++) {
          if (CurrentKeys[k] != "CountryName" && CurrentKeys[k] != "Iso") {
            var ob = new Object();
            ob.Year = parseInt(CurrentKeys[k]);
            if (
              result[i][CurrentKeys[k]] != null &&
              result[i][CurrentKeys[k]] != ""
            )
              ob.Value = parseFloat(result[i][CurrentKeys[k]]);
            else ob.Value = 0;

            ob.Iso = result[i]["Iso"];
            ob.sourceId = sourceId;
            FinalArray.push(ob);
          }
        }
      }

    }
    console.log(FinalArray);

    LoadingAlert("Show");
    APIFunctions.importSocioEconomics(FinalArray)
      .then((response) => {
        LoadingAlert("hide");
        AlertSuccess("The SocioEconomic details are imported successfully!")
        UpdateBindNotificatimport(true);
      })
      .catch((e) => {
        UpdateBindNotificatimport(true);
        console.log(e);
      });
  };
  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
  };
  SocioEconomicsRef.current = SocioEconomics;
  const retrieveSocioEconomics = () => {
    filterSocioEconomics();
  };

  const edit = (id) => {
    AlertConfirm("Are you sure you want to edit ?").then((res) => {
      if (res.value) {
        props.history.push("/EditSocioEconomics/" + id);
      }
    });
  }

  const removeAll = () => {
    AlertConfirm("Are you sure you want to remove all ?").then((res) => {
      if (res.value) {
        APIFunctions.deleteAllSocioEcnomic()
          .then((response) => {
            AlertSuccess("Operation done successfully");
            setAwards([]);
            //refreshList();
          })
          .catch((e) => {
            console.log(e);
          });
      }
    });
  }

  const filterSocioEconomics = () => {
    var countryids = [];
    for (var i = 0, l = selected.length; i < l; i++) {
      countryids.push(selected[i].value);
    }
    countryids = countryids.join(",");

    console.log(sourceIdSearch);
    console.log(countryids);

    var sourceid = sourceIdSearch;
    var JsonCountries = JSON.stringify(selected);

    trackPromise(
      APIFunctions.getFilterSocioEconomics(countryids, sourceid)
        .then((response) => {
          const fromYear = response.data.fromYear;
          const toYear = response.data.toYear;
          const items = response.data.items;
          const length = response.data.items.length;

          for (var i = fromYear; i <= toYear; i++) {
            clmns.push({
              id: i,
              Header: i,
              accessor: `value_${i}`,
              Cell: (props) => {
                const rowIdx = props.row.id;
                var _value = props.cell.value;
                var label = '';
                var id = 0;
                const value = _value != null ? _value.split('/') : _value;
                if (_value == null)
                  label = '';
                else {
                  label = value[0] == 'null' ? '0' : value[0];
                  id = value[1];
                }
                return (
                  <div style={{ display: (permissions.canEdit == true ? "" : "none") }}>
                    <a onClick={() => edit(id)}
                      style={{ display: label == '' ? "none" : "" }}
                      className=" btn btn-xs btnEdit">
                      {label}
                    </a>

                  </div>
                );
              },
            });
          }

          const allitems = [];
          setColumns(clmns);

          var ob = [];
          let year = 0;
          let value = 0;
          let id = 0;
          var j = 0;
          for (var i = 0; i < length; i++) {
            var obj = new Object();
            for (j = 0; j < items[i].items.length; j++) {
              year = items[i].items[j].year;
              value = items[i].items[j].value;
              id = items[i].items[j].id;

              obj[`value_${year}`] = (value + "/" + id);

              //obj[columnId] = items[i].items[j];
            }
            // ob.push({
            //   countryName: items[i].countryName
            // });
            obj["countryName"] = items[i].countryName;
            ob.push(obj);
          }
          setAwards(ob);
        })
        .catch((e) => {
          console.log(e);
        })
    );

    localStorage.setItem("CountryIds", JsonCountries);
    localStorage.setItem("SourceId", sourceid);

  };

  const filterSocioEconomicsAfterLoad = (selectedCountries, sourceid) => {
    var countryids = [];
    for (var i = 0, l = selectedCountries.length; i < l; i++) {
      countryids.push(selectedCountries[i].value);
    }
    countryids = countryids.join(",");

    console.log(sourceIdSearch);
    console.log(countryids);


    var JsonCountries = JSON.stringify(selectedCountries);

    trackPromise(
      APIFunctions.getFilterSocioEconomics(countryids, sourceid)
        .then((response) => {
          const fromYear = response.data.fromYear;
          const toYear = response.data.toYear;
          const items = response.data.items;
          const length = response.data.items.length;

          for (var i = fromYear; i <= toYear; i++) {
            clmns.push({
              id: i,
              Header: i,
              accessor: `value_${i}`,
              Cell: (props) => {
                const rowIdx = props.row.id;
                var _value = props.cell.value;
                var label = '';
                var id = 0;
                const value = _value != null ? _value.split('-') : _value;
                if (_value == null)
                  label = '';
                else {
                  label = value[0] == 'null' ? '0' : value[0];
                  id = value[1];
                }
                return (
                  <div>
                    <a onClick={() => edit(id)}
                      style={{ display: label == '' ? "none" : "" }}
                      className=" btn btn-xs btnEdit">
                      {label}
                    </a>

                  </div>
                );
              },
            });
          }

          const allitems = [];
          setColumns(clmns);

          var ob = [];
          let year = 0;
          let value = 0;
          let id = 0;
          var j = 0;
          for (var i = 0; i < length; i++) {
            var obj = new Object();
            for (j = 0; j < items[i].items.length; j++) {
              year = items[i].items[j].year;
              value = items[i].items[j].value;
              id = items[i].items[j].id;

              obj[`value_${year}`] = (value + "-" + id);

              //obj[columnId] = items[i].items[j];
            }
            // ob.push({
            //   countryName: items[i].countryName
            // });
            obj["countryName"] = items[i].countryName;
            ob.push(obj);
          }
          setAwards(ob);
        })
        .catch((e) => {
          console.log(e);
        })
    );

    localStorage.setItem("CountryIds", JsonCountries);
    localStorage.setItem("SourceId", sourceid);

  };

  const handleChangeSource = (selectedOptions) => {
    setSourceId(selectedOptions.id);
  };
  const handleChangeSourceSearch = (selectedOptions) => {
    setSourceIdSearch(selectedOptions.id);
  };
  const newItem = () => {
    props.history.push("/EditSocioEconomics/0");
  };
  const openSocioEconomic = (rowIndex) => {
    const id = SocioEconomicsRef.current[rowIndex].id;

    props.history.push("/EditSocioEconomics/" + id);
  };
  const handleChangeInAlert = (rowIndex) => {
    setAlertStatus(true);
    console.log(rowIndex);
    setItemToDelete(rowIndex);
  };
  const deleteSocioEconomic = (row) => {
    const id = SocioEconomicsRef.current[row].id;
    AlertConfirm("Are you sure you want to delete ?").then((res) => {
      if (res.value) {
        console.log(id);
        APIFunctions.removeSocioEconomic(id)
          .then((response) => {
            let newSocioEconomics = [...SocioEconomicsRef.current];
            newSocioEconomics.splice(row, 1);

            setSocioEconomics(newSocioEconomics);
          })
          .catch((e) => {
            console.log(e);
          });
      }
    });
  };
  const refreshList = () => {
    retrieveSocioEconomics();
  };

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

  const { pageIndex, pageSize } = state;
  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <div class="card">
            <div className="card-header">
              <div className="row">
                <div className="col-lg-11">
                  <h5>Socio-Economic Data</h5>
                </div>
                <div className="col-lg-1" style={{ display: (permissions.canAdd == true ? "" : "none") }}>
                  <button type="submit" className="btn btn-primary background-color-2" onClick={() => newItem()}>
                    <i className="fas fa-plus" />
                  </button>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className=" row">

                <div class="col-3">
                  <input
                    className="form-control w-100"
                    type="file"
                    accept=".xlsx"
                    onChange={handleUpload}
                  />
                </div>{" "}
                <div className="form-group col-3 cstm-select row">
                  <div className="col-md-12">
                    <Select
                      id="ddlSource"
                      name="sourceId"
                      placeholder="Select Source"
                      value={resultSources.find((obj) => {
                        return obj.id === sourceId;
                      })}
                      getOptionLabel={(option) => option.lookupCode}
                      getOptionValue={(option) => option.id}
                      options={resultSources}
                      onChange={handleChangeSource}
                    ></Select>
                  </div>
                </div>
                <div style={{ display: "none" }}>
                  <ReactExcel
                    initialData={initialData}
                    onSheetUpdate={(currentSheet) => setCurrentSheet(currentSheet)}
                    activeSheetClassName="active-sheet"
                    reactExcelClassName="react-excel "
                  />{" "}
                </div>
                <div className="col-3">
                  <button
                    className="btn btn-success w-100"
                    onClick={saveImportResult}
                  >
                    Import Excel
                  </button>{" "}
                </div>
                <div className="row">
                  <div className="form-group col-5 cstm-select">
                    <label className="" htmlFor="descriptiion">
                      Indicator Source
                    </label>
                    <Select
                      id="ddlSource"
                      name="sourceIdSearch"
                      value={resultSources.find((obj) => {
                        return obj.id === parseInt(sourceIdSearch);
                      })}
                      getOptionLabel={(option) => option.lookupCode}
                      getOptionValue={(option) => option.id}
                      options={resultSources}
                      onChange={handleChangeSourceSearch}
                    ></Select>
                  </div>

                  <div className="form-group col-5">
                    <label className="" htmlFor="description">
                      Choose Country
                    </label>

                    <MultiSelect
                      getOptionValue={(option) => option.countryId}
                      options={options}
                      value={selected}
                      onChange={setSelected}
                      labelledBy="Select"
                    />
                  </div>
                  <div className="form-group col-2 align-self-end">
                    <button
                      type="submit"
                      className="btn btn-primary w-100"
                      onClick={() => filterSocioEconomics()}
                    >
                      Search
                    </button>{" "}
                  </div>
                </div>
                <div
                  className="col-md-12 list mb-3 admin-custom-scrollbar"
                  style={{ overflowX: "scroll", maxWidth: "100%" }}
                >
                  <table
                    className="table table-striped admin-socio-economic-table"
                    {...getTableProps()}
                  >
                    <thead>
                      {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                          {headerGroup.headers.map((column) => (
                            <th
                              className="text-black vertical-align-middle"
                              {...column.getHeaderProps(
                                column.getSortByToggleProps()
                              )}
                            >
                              {column.render("Header")}{" "}
                              <span>
                                {" "}
                                {column.isSorted
                                  ? column.isSortedDesc
                                    ? " 🔽"
                                    : " 🔼"
                                  : ""}{" "}
                              </span>
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
                                <td
                                  className="text-black vertical-align-middle"
                                  {...cell.getCellProps()}
                                >
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
                <div className="col-md-12 list">
                  <div className="row">
                    <div className="col-md-6">
                      <span className="">
                        Page{" "}
                        <strong>
                          {pageIndex + 1} of {pageOptions.length}
                        </strong>{" "}
                      </span>
                      <span className="ml-1 mr-1">
                        | Go to page:
                        <input
                          className="text-black ml-1"
                          type="number"
                          min="1"
                          max={pageOptions.length}
                          defaultValue={pageIndex + 1}
                          onChange={(e) => {
                            const pageNumber = e.target.value
                              ? Number(e.target.value) - 1
                              : 0;
                            gotoPage(pageNumber);
                          }}
                          style={{ width: "50px" }}
                        />
                      </span>
                      <span>
                        <select
                          className="text-black"
                          style={{ width: "100px" }}
                          value={pageSize}
                          onChange={(e) => setPageSize(Number(e.target.value))}
                        >
                          {[10, 25, 50].map((pageSize) => (
                            <option key={pageSize} value={pageSize}>
                              Show {pageSize}
                            </option>
                          ))}
                        </select>
                      </span>
                    </div>
                    <div className="col-md-6 text-align-right">
                      <button
                        className="btn btn-primary mr-1"
                        onClick={() => gotoPage(0)}
                        disabled={!canPreviousPage}
                      >
                        {"<<"}
                      </button>
                      <button
                        className="btn btn-primary mr-1"
                        onClick={() => previousPage()}
                        disabled={!canPreviousPage}
                      >
                        Previous
                      </button>
                      <button
                        className="btn btn-primary mr-1"
                        onClick={() => nextPage()}
                        disabled={!canNextPage}
                      >
                        Next
                      </button>
                      <button
                        className="btn btn-primary"
                        onClick={() => gotoPage(pageCount - 1)}
                        disabled={!canNextPage}
                      >
                        {">>"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <hr />
              <div className="col-md-8">
                <button
                  className="btn btn-sm btn-danger"
                  onClick={removeAll}
                >
                  Remove All
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>{" "}
      <div>
        <SweetAlert
          show={alertStatus}
          title="!"
          showCancelButton
          cancelButtonClass="btn btn-danger btn-xs"
          confirmButtonText='<i class="btn-danger"></i> Yes'
          text="Are You Sure you want to delete?"
          onConfirm={(e) => {
            console.log("confirm");
            setAlertStatus(false);
          }}
          onCancel={() => {
            console.log("cancel");
          }}
          confirmButtonColor="#3085d6"
        />
      </div>
    </div>
  );
};

export default AdminSocioEconomics;
