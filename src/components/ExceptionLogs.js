import React, { useState, useEffect, useMemo, useRef, Component } from "react";
import APIFunctions from "../utils/APIFunctions";
import { useTable, useSortBy, usePagination } from "react-table";
import "react-datepicker/dist/react-datepicker.css";
import { trackPromise } from "react-promise-tracker";
import { getValue } from "../Assets/Language/Entries";
import { getLang, getIMF, getPPP, displayPop } from "../utils/common";
import { AlertError } from "./f_Alerts";
import dateFormat from "dateformat";

const ExceptionLogs = (props) => {
  const [awards, setAwards] = useState([]);
  var myPermissions = {
    canView: false,
  };

  const [permissions, setPermissions] = useState(myPermissions);

  useEffect(() => {
    getUserPermissions();
  }, []);

  const getUserPermissions = async () => {
    APIFunctions.getUserPermissions("ExceptionLogs").then((response) => {
      var _permissions = [];
      var result = response.data;
      result.map((element) => {
        if (element.pageUrl == "ExceptionLogs") {
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
      if (view) retrieveExceptionLogs();
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
    getUserPermissions();
  }, []);

  const retrieveExceptionLogs = () => {
    APIFunctions.getExceptionLogs()
      .then((resp) => resp)
      .then((resp) => setAwards(resp.data));
  }

  const columns = useMemo(
    () => [
      //   {
      //     Header: "Subject",
      //     accessor: "subject",
      //   },
      {
        Header: "Details",
        accessor: "details",
      },
      {
        Header: "Inner Message",
        accessor: "innerMessage",
      },
      {
        Header: "Date",
        accessor: "exceptionDate",
        Cell: (props) => {
          return dateFormat(props.value, "mmmm dS, yyyy");
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

  const { pageIndex, pageSize } = state;

  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <div class="card">
            <div className="card-header">
              <div className="row">
                <div className="col-lg-11">
                  <h5>Exception Logs</h5>
                </div>
              </div>
              <div className="card-body">
                <div className="col-md-12 list">
                  <table className="table table-striped table-bordered">
                    <thead>
                      {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                          {headerGroup.headers.map((column) => (
                            <th
                              className={
                                getLang() === "ar" ? "rtl w-25" : "ltr w-25"
                              }
                              {...column.getHeaderProps(
                                column.getSortByToggleProps()
                              )}
                            >
                              {/* <span>
                                  {column.isSorted ? column.isSortedDesc ? " ↓" : " ↑" : ""}{" "}
                                </span> */}
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
                          <tr
                            className="socio-economic-tr strike-through"
                            {...row.getRowProps()}
                          >
                            {row.cells.map((cell) => {
                              return (
                                <td
                                  className={
                                    getLang() === "ar" ? "rtl w-25" : "ltr w-25"
                                  }
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

                <div className="row" id="tableRow">
                  <div className="col-md-6 d-flex align-items-start">
                    <span className="text-black">
                      {getValue("Page", getLang())}{" "}
                      <strong>
                        {pageOptions.length !== 0 ? pageIndex + 1 : 0}{" "}
                        {getValue("Of", getLang())} {pageOptions.length}
                      </strong>{" "}
                    </span>
                    <span className="text-black d-flex ml-1 mr-1 align-items-start">
                      | {getValue("GoToPage", getLang())}
                      <input
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
                        style={{
                          width: "50px",
                          height: "25px",
                          borderBottom: 0,
                        }}
                        className="cstm-input ml-1"
                      />
                    </span>
                  </div>
                  <div className="col-6 d-flex justify-content-end">
                    <button
                      className="btn inner-btn-secondary px-5px py-0 me-1"
                      onClick={() => gotoPage(0)}
                      disabled={!canPreviousPage}
                    >
                      {"<<"}
                    </button>
                    <button
                      className="btn inner-btn-secondary px-5px py-0 me-1"
                      onClick={() => previousPage()}
                      disabled={!canPreviousPage}
                    >
                      {getValue("Previous", getLang())}
                    </button>
                    <button
                      className="btn inner-btn-secondary px-5px py-0 me-1"
                      onClick={() => nextPage()}
                      disabled={!canNextPage}
                    >
                      {getValue("Next", getLang())}{" "}
                    </button>
                    <button
                      className="btn inner-btn-secondary px-5px py-0 me-1"
                      onClick={() => gotoPage(pageCount - 1)}
                      disabled={!canNextPage}
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
    </div>
  );
};

export default ExceptionLogs;
