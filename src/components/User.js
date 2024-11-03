import React, { useState, useEffect, useMemo, useRef } from "react";
import APIFunctions from "../utils/APIFunctions";
import { AlertConfirm, AlertError, AlertSuccess } from "../components/f_Alerts";
import { useTable, useSortBy } from "react-table";
import { checkToken } from "../utils/common";

import Modal from "react-bootstrap/Modal";
const User = (props) => {
  var myPermissions = {
    canView: false,
    canAdd: false,
    canEdit: false,
    canDelete: false,
  };

  const [permissions, setPermissions] = useState(myPermissions);
  const [users, setUsers] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [isOpen3, setIsOpen3] = useState(false);
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [userName, setUserName] = React.useState("");
  
  const usersRef = useRef();


  usersRef.current = users;

  useEffect(() => {
    getUserPermissions();
  }, []);

  const onChangeSearchTitle = (e) => {
    const searchTitle = e.target.value;
    setSearchTitle(searchTitle);
  };

  const retrieveUsers = () => {
    APIFunctions.getAll()
      .then((response) => {
        setUsers(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

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
      if (view) retrieveUsers();
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

  const refreshList = () => {
    retrieveUsers();
  };

  const removeAllUsers = () => {
    APIFunctions.removeAll()
      .then((response) => {
        refreshList();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const _resetPassword = (rowIndex) => {
    if(!checkToken()) window.location.href = "/";

    const id = usersRef.current[rowIndex].id;
    var user = usersRef.current;
    user = user.filter((item) => item.id == id);

    setUserName(user[0].userName);
    setIsOpen3(true);
    setNewPassword("");
    setConfirmPassword("");
  }

  const resetPassword = (index) => {
    if (newPassword == "" || newPassword == null
    || confirmPassword == "" || confirmPassword == null) {
    AlertError("Please fill required fields");
    return;
}
if (newPassword !== confirmPassword) {
    AlertError("Passwords do not match");
    return;
}

var NewPass = btoa(newPassword);

  APIFunctions.changePassword(userName, NewPass)
    .then((response) => {
        if (response.data.success) {
            AlertSuccess(response.data.messageEn);
            setTimeout(() => { setIsOpen3(false) }, 500);
        }
        else {
            AlertError(response.data.messageEn);
        }
        console.log(response)
    })
    .catch((e) => {
        console.log(e);
    });
  }
  const findByTitle = () => {
    APIFunctions.findByTitle(searchTitle)
      .then((response) => {
        setUsers(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const newUser = () => {
    props.history.push("/EditUser/0");
  };

  const openUser = (rowIndex) => {
    const id = usersRef.current[rowIndex].id;

    props.history.push("/EditUser/" + id);
  };

  
 

  const hideModal3 = () => {
    setIsOpen3(false);
  };



  const deleteUser = (rowIndex) => {
    if(!checkToken()) window.location.href = "/";

    AlertConfirm("Are you sure you want to delete ?").then((res) => {
      if (res.value) {
        const id = usersRef.current[rowIndex].id;
        APIFunctions.deleteUsers(id)
          .then((response) => {
            AlertSuccess("Operation done successfully");
            let newUsers = [...usersRef.current];
            newUsers.splice(rowIndex, 1);

            setUsers(newUsers);
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
        Header: "UserName",
        accessor: "userName",
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Active",
        accessor: "isLocked",
        Cell: (props) => {
          return props.isLocked ? "Locked" : "Active";
        },
      },
      {
        Header: "Actions",
        accessor: "actions",
        Cell: (props) => {
          const rowIdx = props.row.id;
          return (
            <div>
              <a
                style={{ display: permissions.canEdit ? "" : "none" }}
                onClick={() => openUser(rowIdx)}
                className=" btn btn-primary btn-xs"
              >
                <i
                  style={{ cursor: "pointer", color: "" }}
                  className="fas fa-pencil-alt"
                ></i>
              </a>
              <a
                style={{ display: permissions.canDelete ? "" : "none" }}
                onClick={() => deleteUser(rowIdx)}
                className="btn btn-danger btn-xs"
              >
                <i
                  style={{ cursor: "pointer", color: "" }}
                  className="fas fa-trash action"
                ></i>
              </a>
              <a
                style={{ display: permissions.canEdit ? "" : "none" }}
                onClick={() => _resetPassword(rowIdx)}
                className="btn btn-secondary btn-xs"
              >
                <i
                  style={{ cursor: "pointer", color: "" }}
                  className="fas fa-lock action"
                ></i>
              </a>
            </div>
          );
        },
      },
    ],
    []
  );
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data: users,
      },
      useSortBy
    );

  return (
    <>
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div class="card">
              <div className="card-header">
                <div className="row">
                  <div className="col-lg-11">
                    <h5>Users</h5>
                  </div>
                  <div className="col-lg-1">
                    <button type="submit" style={{ display: permissions.canAdd ? "" : "none" }} className="btn btn-primary background-color-2" onClick={newUser}>
                      <i className="fas fa-plus" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <div className="row mb-2">
                  <div className="list row">
                    <div className="col-md-8">
                      <div className="input-group mb-3" style={{ gap: "10px" }}>

                        <div className="">
                          {/* <button
                          type="submit"
                          className="btn btn-primary"
                          onClick={() => newUser()}
                        >
                          New
                        </button> */}
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
                                  {column.render("Header")}{" "}
                                  <span>
                                    {column.isSorted
                                      ? column.isSortedDesc
                                        ? " 🔽"
                                        : " 🔼"
                                      : ""}
                                  </span>
                                </th>
                              ))}
                            </tr>
                          ))}
                        </thead>
                        <tbody {...getTableBodyProps()}>
                          {rows.map((row, i) => {
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
                <Modal
                        size="lg"
                        show={isOpen3}
                        onHide={hideModal3}>
                        <Modal.Header closeButton>
                            <Modal.Title>Reset Password</Modal.Title>
                            {/* <button type="button" className="btn-close" aria-label="Close"></button> */}
                        </Modal.Header>
                        <Modal.Body>
                            <div className="row mb-3">
                                <div className="col-lg-12">
                                    <div className="form-group">
                                        <label>New Password<small className="text-danger">*</small></label>
                                        <input type="password"
                                            value={newPassword}
                                            className="form-control"
                                            style={{ width: "100%" }}
                                            onChange={(e) => { setNewPassword(e.target.value) }}
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-12">
                                    <div className="form-group">
                                        <label>Confirm New Password<small className="text-danger">*</small></label>
                                        <input type="password"
                                            value={confirmPassword}
                                            className="form-control"
                                            style={{ width: "100%" }}
                                            onChange={(e) => { setConfirmPassword(e.target.value) }}
                                        />
                                    </div>
                                </div>
                            </div>

                        </Modal.Body>
                        <Modal.Footer>
                            <button className="btn btn-secondary" onClick={hideModal3}>
                                Cancel
                            </button>
                            <button className="btn btn-primary" onClick={resetPassword}>
                                Save
                            </button>
                        </Modal.Footer>
                    </Modal>
    </>
  );
};

export default User;
