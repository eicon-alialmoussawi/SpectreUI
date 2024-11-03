import React, { useState, useEffect, useMemo, useRef } from "react";
import APIFunctions from "../utils/APIFunctions";
import { usePagination, useTable, useSortBy } from "react-table";
import Select from "react-select";
import { AlertError } from "./f_Alerts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../css/CustomStyle.css";
const LoggedInLogs = (props) => {
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

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");

  awardsRef.current = awards;

  useEffect(() => {
    getUserPermissions();
    getAllExistingUsers(null, null);
  }, []);

  const getAllExistingUsers = () => {
    APIFunctions.getAll()
        .then((resp) => resp)
        .then((resp) => {
            var res = resp.data;
            res.unshift({
              userName: "None",
              id: -1
            })
            setUsers(res);
            console.log("Existing users: ", res);
        });
  }

  const getUserPermissions = async () => {
    APIFunctions.getUserPermissions("LoggedInLogs").then((response) => {
      var _permissions = [];
      var result = response.data;
      result.map((element) => {
        if (element.pageUrl == "LoggedInLogs") {
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
      if (view) retrieveAwards();
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

  const retrieveAwards = (date, userId) => {
    APIFunctions.getLoginDetails(date, userId)
      .then((response) => {
        console.log(response.data.item2);
        var res = response.data.item2;
        res.map((item) => {
          item.loginDate = item.loginDate.replace("T", " ");
        });
        setAwards(response.data.item2);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const filter = () => {
    var d = new Date(startDate);
    var d1 = d.setDate(d.getDate() + parseInt('1'));
    retrieveAwards(startDate ? new Date(d1).toISOString() : null, selectedUser.id ? selectedUser.id : null);
  };

  const columns = useMemo(
    () => [
      {
        Header: "Username",
        accessor: "userName",
      },
      {
        Header: "IP Address",
        accessor: "ipAddress",
      },
      {
        Header: "Login Date",
        accessor: "loginDate",
      }
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

  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <div class="card">
            <div className="card-header">
              <div className="row">
                <div className="col-lg-10">
                  <h5>Logged In Logs</h5>
                </div>
                <div className="col-lg-2"></div>
              </div>
            </div>

            <div class="card-body">
              <div className="row mb-3">
                <div className="col-lg-4">
                  <label>Username</label>
                  <Select
                    options={users}
                    getOptionLabel={(option) => option.userName}
                    getOptionValue={(option) => option.id}
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e)}
                    labelledBy="Select"
                  />
                </div>
                <div className="col-lg-4">
                  <label>Date</label>
                  <DatePicker
                    className="form-control"
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    value={startDate}
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

export default LoggedInLogs;
