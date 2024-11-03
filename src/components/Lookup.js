import React, { useState, useEffect, useMemo, useRef } from "react";
import APIFunctions from "../utils/APIFunctions";
import dateFormat from "dateformat";
import Modal from "react-bootstrap/Modal";
import { useTable } from "react-table";
import Select from "react-select";
import { checkToken } from "../utils/common";
import { AlertError, AlertSuccess } from "./f_Alerts";

const User = (props) => {
  var myPermissions =
  {
      canEdit: false,
  }

  const [tutorials, setTutorials] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");
  const tutorialsRef = useRef();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = React.useState("Transitioning...");
  const [name, setName] = React.useState("");
  const [nameAr, setNameAr] = React.useState("");
  const [Code, setCode] = React.useState("");
  const [parent, setParent] = React.useState("");
  const [currentLookup, setCurrentLookup] = React.useState("");
  const [permissions, setPermissions] = useState(myPermissions);

  const [resultParents, emplistParents] = useState([]);
  tutorialsRef.current = tutorials;

    useEffect(() => {
        getUserPermissions()
    }, []);

    const getUserPermissions = async () => {
      APIFunctions.getUserPermissions("Lookup")
          .then((response) => {
              var _permissions = [];
              var result = response.data;
              result.map((element) => {
                  if (element.pageUrl == "Lookup") {
                      _permissions.push(element);
                  }
              })

              var view =
                _permissions.find((element) => {
                  return element.action == "View";
                }) === undefined
                  ? false
                  : true;
              var edit = (_permissions.find((element) => { return element.action == "Edit" })) === undefined ? false : true;

              var obj = permissions;
              obj.canEdit = edit;
              setPermissions(obj);
              if(view)
                retrieveTutorials();
              else {
                AlertError(
                  "You do not have the permission to view this page!",
                  function () {
                    props.history.push("/Dashboard");
                  }
                );
              }
          })

  }


  const handleChangeInRole = (selectedOptions) => {
    // setRoleSelected(selectedOptions);
    setParent(selectedOptions.id);
    currentLookup.parentId = selectedOptions.id;
  };
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setName(event.target.value);
  };

  const handleInputChangeNameAr = (event) => {
    const { name, value } = event.target;
    setNameAr(event.target.value);
    currentLookup.nameAr = event.target.value;
  };
  const getParentName = (parentId) => {
    var ParentName;
    console.log(resultParents);
    console.log(tutorials);
    for (var i = 0; i < resultParents.length; i++) {
      console.log(resultParents[i]);
      if (resultParents[i].id == parentId) {
        ParentName = resultParents[i];
        break;
      }
    }
    return "test";
  };
  const onChangeSearchTitle = (e) => {
    const searchTitle = e.target.value;
    setSearchTitle(searchTitle);
  };
  const hideModal = () => {
    setIsOpen(false);
    setTitle("Transitioning...");
  };

  const save = () => {
    //saveLookup

    APIFunctions.saveLookup(currentLookup)
      .then((response) => {

        AlertSuccess("The Lookup details was updated successfully!");
        setIsOpen(false);
        retrieveTutorials();
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const modalLoaded = () => {
    setTitle("Lookup Details");
  };
  const retrieveTutorials = () => {
    APIFunctions.getAllLookups()
      .then((response) => {
        console.log(response.data);
        var parents = [];
        for (var i = 0; i < response.data.length; i++) {
          if (response.data[i].parentId == null) parents.push(response.data[i]);
        }
        emplistParents(parents);

        setTutorials(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const refreshList = () => {
    retrieveTutorials();
  };

  const removeAllTutorials = () => {
    APIFunctions.removeAll()
      .then((response) => {
        console.log(response.data);
        refreshList();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const findByTitle = () => {
    APIFunctions.findByTitle(searchTitle)
      .then((response) => {
        setTutorials(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const editLookup = (rowIndex) => {
    if(!checkToken()) window.location.href = "/";

    if (permissions.canEdit) {
      const id = tutorialsRef.current[rowIndex].id;
      APIFunctions.getLookupById(id)
        .then((response) => {
          setCurrentLookup(response.data);
          setName(response.data.name);
          setNameAr(response.data.nameAr);
          setCode(response.data.lookupCode);
          setParent(response.data.parentId);
        })
        .catch((e) => {
          console.log(e);
        });
      setIsOpen(true);
    }
  };

  const deleteTutorial = (rowIndex) => {
    const id = tutorialsRef.current[rowIndex].id;

    APIFunctions.remove(id)
      .then((response) => {
        // props.history.push("/tutorials");

        let newTutorials = [...tutorialsRef.current];
        newTutorials.splice(rowIndex, 1);

        setTutorials(newTutorials);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "valueEn",
      },
      {
        Header: "Parent Name",
        accessor: "parentName.name",
      },
      {
        Header: "Creation Date",
        accessor: "creationDate",
        Cell: (props) => {
          return dateFormat(props.row.values.creationDate, "mmmm dS, yyyy");
        },
      },

      // {
      //   Header: "Code",
      //   accessor: "code",
      // },
      // {
      //   Header: "Parent",
      //   accessor: "parentId",
      // },
      {
        Header: "Actions",
        accessor: "actions",
        Cell: (props) => {
          const rowIdx = props.row.id;
          return (
            <div>
              <a   
                style={{ display: permissions.canEdit ? "" : "none" }}
                onClick={() => editLookup(rowIdx)}
                className=" btn btn-primary btn-xs"
              >
                <i
                  style={{ cursor: "pointer", color: "" }}
                  className="fas fa-pencil-alt"
                ></i>
              </a>
              {/* <a
                onClick={() => deleteTutorial(rowIdx)}
                className="btn btn-danger btn-xs"
              >
                <i
                  style={{ cursor: "pointer", color: "" }}
                  className="fas fa-trash action"
                ></i>
              </a> */}
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
      data: tutorials,
    });

  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <div class="card">
            <div className="card-header">
              <h2>Lookups</h2>
            </div>
            <div className="card-body">
              <div className="list row">
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
                    <div class="col-12 bottommargin-sm">
                      <label for="template-contactform-name">English Name </label>
                      <input
                        type="text"
                        id="txtNameEn"
                        name="template-contactform-name"
                        value={currentLookup.name}
                        class="form-control required"
                        onChange={(e) => { setCurrentLookup({ ...currentLookup, name: e.target.value }) }}
                      // onChange={handleInputChange}
                      />
                    </div>
                    <div class="col-12 bottommargin-sm">
                      <label for="template-contactform-name">
                        Arabic Name<small class="text-danger">*</small>
                      </label>
                      <input
                        type="text"
                        id="txtNameAr"
                        name="template-contactform-name"
                        value={currentLookup.nameAr}
                        class="form-control required"
                        onChange={(e) => { setCurrentLookup({ ...currentLookup, nameAr: e.target.value }) }}
                      // onChange={handleInputChangeNameAr}
                      />
                    </div>
                    <div class="col-12 bottommargin-sm">
                      <label for="template-contactform-name">
                        Code<small class="text-danger">*</small>
                      </label>
                      <input
                        type="text"
                        id="txtCode"
                        value={Code}
                        class="form-control required"
                        disabled
                      />
                    </div>
                    <div class="col-12 bottommargin-sm">
                      <label for="template-contactform-default-select">
                        Parent{" "}
                      </label>

                      <Select
                        isDisabled
                        id="ddlParent"
                        name="parentId"
                        value={resultParents.find((obj) => {
                          return obj.id === parent;
                        })}
                        getOptionLabel={(option) => option.valueEn}
                        getOptionValue={(option) => option.id}
                        options={resultParents}
                        onChange={handleChangeInRole}
                      ></Select>
                    </div>
                    <div>
                    </div>
                  </Modal.Body>
                  <Modal.Footer>
                    <button className="btn btn-secondary" onClick={hideModal}>
                      Cancel
                    </button>
                    <button className="btn btn-primary" onClick={save}>
                      Save
                    </button>
                  </Modal.Footer>
                </Modal>


                <div className="col-md-8">
                  <div className="input-group mb-3">
                    {/* <input
                  type="text"
                  className="form-control col-6"
                  placeholder="Search by title"
                  value={searchTitle}
                  onChange={onChangeSearchTitle}
                /> */}
                    {/* <div className="input-group-append">
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={findByTitle}
                  >
                    Search
                  </button>
                </div> */}
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

                <div className="col-md-8">
                  {/* <button
                className="btn btn-sm btn-danger"
                onClick={removeAllTutorials}
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
  );
};

export default User;
