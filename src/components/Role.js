import React, { useState, useEffect, useMemo, useRef } from "react";
import APIFunctions from "../utils/APIFunctions";
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTable } from "react-table";
import { AlertConfirm, AlertError, AlertSuccess } from "../components/f_Alerts";
import { checkToken } from "../utils/common";

const Role = (props) => {
  var myPermissions = {
    canView: false,
    canAdd: false,
    canEdit: false,
    canDelete: false,
  };

  const [checkAll, setCheckAll] = React.useState(false);
  const [users, setUsers] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");
  const usersRef = useRef();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = React.useState("Transitioning...");
  const [currentUserPermissions, setCurrentUserPermissions] = useState([]);
  const [userPermissions, setUserPermissions] = useState(myPermissions);
  const [permissions, setPermissions] = useState([]);
  const [lstOfPermissions, setlstOfPermissions] = useState([]);
  const [copylstOfPermissions, setCopylstOfPermissions] = useState([]);
  const [checkedState, setCheckedState] = useState([]);
  const [saveTxt, setSaveTxt] = useState("Save");
  const [currentRole, setRole] = useState("");
  const [roleName, setRoleName] = useState("");


  const [myCheckedPermissions, setMyCheckedPermission] = useState([]);

  const handleOnChange = (position) => {
    const updatedCheckedState = checkedState.map((item, index) =>
      index == position ? !item : item
    );
    const count = updatedCheckedState.filter(Boolean).length;
    setCheckAll(count == permissions.length ? true : false);
    setCheckedState(updatedCheckedState);



  };


  useEffect(() => {
    _getPermissions();
  }, []);

  const _getPermissions = () => {
    APIFunctions.getPermissions().then((response) => {
      setPermissions(response.data);
      {
        response.data.map((x) => {
          var name = x.name;
          if (name != null)
            if (lstOfPermissions.indexOf(name) == -1)
              lstOfPermissions.push(name);
        });
      }
      setlstOfPermissions(lstOfPermissions);

      var arr = [];
      response.data.map((val, index) => {
        var item = new Object();
        item.name = val.name;
        item.id = val.id;
        item.checked = false;
        item.action = val.action;
        arr.push(item);
      });


      setMyCheckedPermission(arr);
      setCopylstOfPermissions(lstOfPermissions);
    });
  }

  const updatedMyPermissions = (arr, allData) => {
    var _items = [];
    allData.map((val, index) => {
      var exists = arr.filter((item) => parseInt(item) == parseInt(val.id));
      var item = new Object();
      item.name = val.name;
      item.id = val.id;
      item.checked = exists.length > 0 ? true : false;
      item.action = val.action;
      _items.push(item);
    });


    setMyCheckedPermission(_items);
    var lstChecked = _items.filter((x) => x.checked == true).length;
    var lst = myCheckedPermissions.length;
    var value = lstChecked == lst ? true : false;
    setCheckAll(value);
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setRoleName(event.target.value);
  };
  const newRole = () => {
    setCheckAll(false);
    var arr = myCheckedPermissions;
    for (var i = 0; i < arr.length; i++) {
      arr[i].checked = false;
    }
    setMyCheckedPermission(arr)
    setIsOpen(true);
    setRole(null);
    setRoleName("");

  };

  const handleOnChange2 = (isChecked) => {
    setCheckAll(isChecked);
    var updatedPermissions = myCheckedPermissions;
    updatedPermissions.map((row, i) => {
      row.checked = isChecked;
    })
    setMyCheckedPermission(updatedPermissions);

    console.log(myCheckedPermissions);
  };

  const showModal = (rowId) => {
    if(!checkToken()) window.location.href = "/";
    setCheckedState([]);
    var count = 0;
    var max = 0;
    APIFunctions.getPermissions()
      .then((response) => {
        setPermissions(response.data);
        count = response.data.length;
        max = count + 2;
        console.log(count);
        {
          response.data.map((x) => {
            var name = x.name;
            if (name != null)
              if (lstOfPermissions.indexOf(name) == -1)
                lstOfPermissions.push(name);
          });
        }
        setlstOfPermissions(lstOfPermissions);

        var allPermissions = response.data;
        setCopylstOfPermissions(lstOfPermissions);
        var RoleId = usersRef.current[rowId].id;
        setRole(RoleId);
        APIFunctions.getRoleById(RoleId)
          .then((response) => {
            var arr = response.data.permissions.split(",");
            setRoleName(response.data.roleName);
            updatedMyPermissions(arr, allPermissions);

          })
          .catch((e) => {
            console.log(e);
          });

        setIsOpen(true);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const save = () => {

    var lstPermissionsUpdated = [];
    var data = myCheckedPermissions;
    data.map((val, idx) => {
      if (val.checked) {
        lstPermissionsUpdated.push(val.id);
      }
    });


    var RoleDate = {
      id: currentRole,
      roleName: roleName,
      permissions: lstPermissionsUpdated.join(","),
    };

    setSaveTxt("Saving...");

    console.log(lstPermissionsUpdated);
    APIFunctions.createRole(RoleDate)
      .then((response) => {
        AlertSuccess("The Role details was updated successfully!")
        setIsOpen(false);
        setSaveTxt("Save");
        retrieveRoles();
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const hideModal = () => {
    setIsOpen(false);
    setTitle("Transitioning...");
  };

  const modalLoaded = () => {
    setTitle("Role Details");
  };
  usersRef.current = users;

  const getUserPermissions = async () => {
    APIFunctions.getUserPermissions("Role").then((response) => {
      var _permissions = [];
      var result = response.data;
      result.map((element) => {
        if (element.pageUrl == "Role") {
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
      if (view) retrieveRoles();
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

  const onChangeSearchTitle = (event) => {
    const searchTitle = event.target.value;
    setSearchTitle(searchTitle);

    var arrFiltered = copylstOfPermissions.filter((s) =>
      s.toUpperCase().includes(searchTitle.toUpperCase())
    );

    console.log(arrFiltered.length);
    setlstOfPermissions(arrFiltered);
    if (arrFiltered.length == 0 && (searchTitle == "" || searchTitle == null)) {
      setlstOfPermissions(copylstOfPermissions);
      alert("o");
    }
  };

  const retrieveRoles = () => {
    APIFunctions.getAllRoles()
      .then((response) => {
        setUsers(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const refreshList = () => {
    retrieveRoles();
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

  const findByTitle = () => {
    APIFunctions.findByTitle(searchTitle)
      .then((response) => {
        setUsers(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const deleteRole = (rowIndex) => {
    if(!checkToken()) window.location.href = "/";
    AlertConfirm("Are you sure you want to delete ?").then((res) => {
      if (res.value) {
        const id = usersRef.current[rowIndex].id;

        APIFunctions.deleteRole(id)
          .then((response) => {
            if (response.data.success) {
              AlertSuccess("Operation done successfully");
              let newUsers = [...usersRef.current];
              newUsers.splice(rowIndex, 1);
              setUsers(newUsers);
              return;
            }
            else {
              AlertError(response.data.messageEn);
            }

          })
          .catch((e) => {
            console.log(e);
          });
      }
    });
  };

  const getCheckedPermission = (id) => {
    var checked = false;
    var allData = myCheckedPermissions;
    if (allData.length > 0) {
      var obj = allData.filter((item) => {
        if (item.id == id) {
          return item;
        }
      });

      checked = obj[0].checked;
    }
    return checked;
  }

  const renderPermissions = (data) => {
    {
      return (data.map((val, idx) => (
        <div className="col-2">
          <input
            id={"cb" + val.id}
            className="form-check-input"
            type="checkbox"
            value={getCheckedPermission(val.id)}
            checked={getCheckedPermission(val.id)}
            onChange={(e) => setIsChecked(val.id, e.target.checked)}

          ></input>
          <label className="form-check-label">
            {" "}
            {val.action}
          </label>
        </div>
      )));
    }
  }

  const setIsChecked = (id, isChecked) => {
    var data = myCheckedPermissions;
    var item = data.filter((item) => item.id == id);
    var itemIndex = data.indexOf(item[0]);
    data = data.filter((item) => item.id != id);
    data.splice(itemIndex, 0, { id: id, checked: isChecked, name: item[0].name, action: item[0].action });
    setMyCheckedPermission(data);
    var lstChecked = data.filter((x) => x.checked == true).length;
    var lst = myCheckedPermissions.length;
    var value = lstChecked == lst ? true : false;
    setCheckAll(value)
  }



  const columns = useMemo(
    () => [
      {
        Header: "Role",
        accessor: "name",
      },

      {
        Header: "Actions",
        accessor: "actions",
        width: 1,
        Cell: (props) => {
          const rowIdx = props.row.id;
          return (
            <div>
              <a
                style={{ display: permissions.canEdit ? "" : "none" }}
                onClick={() => showModal(rowIdx)}
                className=" btn btn-primary btn-xs"
              >
                <i
                  style={{ cursor: "pointer", color: "" }}
                  className="fas fa-pencil-alt"
                ></i>
              </a>
              <a
                style={{ display: permissions.canDelete ? "" : "none" }}
                onClick={() => deleteRole(rowIdx)}
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
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data: users,
    });

  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">

          <div class="card">
            <div className="card-header">
              <div className="row">
                <div className="col-lg-11">
                  <h5>Roles</h5>
                </div>
                <div className="col-lg-1">
                  <button
                style={{ display: permissions.canAdd ? "" : "none" }} type="submit" className="btn btn-primary background-color-2" onClick={newRole}>
                    <i className="fas fa-plus" />
                  </button>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="row mb-2">
                <div className="list row">
                  {/* <button onClick={showModal}>Role Details</button> */}
                  <Modal
                    size="lg"
                    show={isOpen}
                    onHide={hideModal}
                    onEntered={modalLoaded}
                  >
                    <Modal.Header closeButton>
                      <Modal.Title>{title}</Modal.Title>
                      {/* <button type="button" className="btn-close" aria-label="Close"></button> */}
                    </Modal.Header>
                    <Modal.Body>
                      <div className="row">
                        <div className="form-group col-12">
                          <label htmlFor="txtRoleName">Role Name</label>
                          <small className="text-danger">*</small>
                          <input
                            type="text"
                            className="form-control"
                            id="txtRoleName"
                            name="roleName"
                            value={roleName}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>{" "}
                      <hr />
                      <div className="row">
                        <div className="form-group col-12">
                          <input
                            placeholder="Search.."
                            type="text"
                            className="form-control"
                            id="txtSearchRole"
                            value={searchTitle}
                            onChange={onChangeSearchTitle}
                            name="searchRole"
                          />
                        </div>
                      </div>{" "}
                      <div className="row">
                        <div className="form-group col-12">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="cbSelectAll"
                              name="template-contactform-checkbox[]"
                              onChange={(e) => handleOnChange2(e.target.checked)}
                              checked={checkAll}
                            ></input>
                            <label
                              className="form-check-label"
                              for="template-contactform-mobile"
                            >
                              Check All
                            </label>
                          </div>
                        </div>
                      </div>
                      <div>
                        {lstOfPermissions.map((x) => {
                          var CurrentPermission = [];
                          myCheckedPermissions.map((row, i) => {
                            if (row.name == x) {
                              CurrentPermission.push(row);
                            }
                          })
                          return (
                            <div className="row">
                              <label className="col-xl-3 col-lg-3 col-form-label">
                                {" "}
                                {x}
                              </label>
                              {renderPermissions(CurrentPermission)}
                            </div>
                          );
                        })}
                      </div>
                    </Modal.Body>
                    <Modal.Footer>
                      <button className="btn btn-secondary" onClick={hideModal}>
                        Cancel
                      </button>
                      <button className="btn btn-primary" onClick={save}>
                        {saveTxt}
                      </button>
                    </Modal.Footer>
                  </Modal>
                  <div className="col-md-8">
                    <div className="input-group mb-3" style={{ gap: "10px" }}>
                      {/* <button
                        type="submit"
                        className="btn btn-primary"
                        onClick={() => newRole()}
                      >
                        New
                      </button> */}
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
                              <th
                                {...column.getHeaderProps({
                                  style: {
                                    minWidth: column.minWidth,
                                    width: column.width,
                                  },
                                })}
                              >
                                {column.render("Header")}
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
                                  <td
                                    {...cell.getCellProps({
                                      style: {
                                        minWidth: cell.column.minWidth,
                                        width: cell.column.width,
                                      },
                                    })}
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

                  <div className="col-md-8">
                    {/* <button
                  className="btn btn-sm btn-danger"
                  onClick={removeAllUsers}
                >
                  Remove All
                </button> */}
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

export default Role;
