import React, { useState, useEffect, useMemo, useRef } from "react";
import APIFunctions from "../utils/APIFunctions";
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTable } from "react-table";
import { checkToken } from "../utils/common";
import dateFormat from "dateformat";
import { AlertSuccess, AlertConfirm, AlertError } from "./f_Alerts";




const Bands = (props) => {
  var myPermissions =
  {
      canView: false,
      canAdd: false,
      canEdit: false,
      canDelete: false,
  }

  const [permissions, setPermissions] = useState(myPermissions);
  const [bands, setBands] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");
  const bandsRef = useRef();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = React.useState("Transitioning...");

  const [lstOfPermissions, setlstOfPermissions] = useState([]);
  const [checkedState] = useState([]);

  const [currentBand, setBand] = useState("");
  const [roleName, setBandName] = useState("");

  const [checked, setChecked] = React.useState(false);
  const [titleAr, setTitleAr] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [value, setValue] = useState("");

    useEffect(() => {
    getUserPermissions();
    }, []);

    const getUserPermissions = async () => {
      APIFunctions.getUserPermissions("Bands")
          .then((response) => {
              var _permissions = [];
              var result = response.data;
              result.map((element) => {
                  if (element.pageUrl == "Bands") {
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
              if(view) retrievebands();
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

  const handleChange = () => {
    setChecked(!checked);
  };

  const handleOnChange = (position) => {
    const updatedCheckedState = checkedState.map((item, index) =>
      index == position ? !item : item
    );
  };

  const handleInputChange = (event) => {
    setTitleAr(event.target.value);
  };

  const handleInputChangeTitleEn = (event) => {
    setTitleEn(event.target.value);
  };

  const handleInputChangeValue = (event) => {
    setValue(event.target.value);
  };
  const newBand = () => {
    setIsOpen(true);
    setBand(null);
    setTitleAr("");
    setTitleEn("");
    setChecked(false);

    setValue("");
  };

  const openModal = (rowId) => {
    if(!checkToken()) window.location.href = "/";

    var BandId = bandsRef.current[rowId].id;
    setBand(BandId);

    APIFunctions.getBandById(BandId)
      .then((response) => {
        console.log(response.data);
        setChecked(response.data.isSelected);
        setTitleAr(response.data.titleAr);
        setTitleEn(response.data.titleEn);
        setValue(response.data.value);
      })
      .catch((e) => {
        console.log(e);
      });

    setIsOpen(true);
  };
  const save = () => {


    var Band = {
      id: currentBand == null ? 0 : currentBand,
      titleAr: titleAr,
      titleEn: titleEn,
      isSelected: checked,
      value: parseInt(value),
      isDeleted: false,
    };
    APIFunctions.saveBands(Band)
      .then((response) => {
        if (response.data) {
          AlertSuccess("The Band details was updated successfully!");
          setTimeout(() => { setIsOpen(false); }, 300)
          retrievebands();
        }
        else {
          AlertError("Another band with the same value exists");
        }

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
    setTitle("Band Details");
  };
  bandsRef.current = bands;

  // useEffect(() => {
  //   retrievebands();
  // }, []);

  const onChangeSearchTitle = (e) => {
    const searchTitle = e.target.value;
    setSearchTitle(searchTitle);
  };

  const retrievebands = () => {
    APIFunctions.getAllBands()
      .then((response) => {
        setBands(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const refreshList = () => {
    retrievebands();
  };

  const removeAllbands = () => {
    AlertConfirm('Are you sure you want to remove all bands ?')
      .then(res => {
        if (res.value) {
          APIFunctions.removeAllBands()
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

  const findByTitle = () => {
    APIFunctions.findByTitle(searchTitle)
      .then((response) => {
        setBands(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const deleteBand = (rowIndex) => {
    if(!checkToken()) window.location.href = "/";

    AlertConfirm('Are you sure you want to delete ?')
      .then(res => {
        if (res.value) {
          //LoadingAlert("Show");
          const id = bandsRef.current[rowIndex].id;
          APIFunctions.deleteBand(id)
            .then((response) => {
              //   LoadingAlert("Hide");
              AlertSuccess("Operation done successfully");
              let newbands = [...bandsRef.current];
              newbands.splice(rowIndex, 1);

              setBands(newbands);
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
        Header: "Value",
        accessor: "value",
      },
      {
        Header: "Creation Date",
        accessor: "creationDate",
        Cell: (props) => {
          return dateFormat(props.row.values.creationDate, "mmmm dS, yyyy");
        },
      },
      {
        Header: "Actions",
        accessor: "actions",
        width: 1,
        Cell: (props) => {
          const rowIdx = props.row.id;
          return (
            <div>
              <a style={{ display: (permissions.canEdit == true ? "" : "none") }}
                onClick={() => openModal(rowIdx)}
                className=" btn btn-primary btn-xs"
              >
                <i
                  style={{ cursor: "pointer", color: "" }}
                  className="fas fa-pencil-alt"
                ></i>
              </a>
              <a  style={{ display: (permissions.canDelete == true ? "" : "none") }}
                onClick={() => deleteBand(rowIdx)}
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
      data: bands,
    });

  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <div class="card">
            <div className="card-header">
              <div className="row">
                <div className="col-lg-11">
                  <h5>Bands</h5>
                </div>
                <div className="col-lg-1" style={{ display: (permissions.canAdd == true ? "" : "none") }}>
                  <button type="submit" className="btn btn-primary background-color-2" onClick={newBand}>
                    <i className="fas fa-plus" />
                  </button>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="row mb-2">
                <div className="list row">
                  {/* <button onClick={openModal}>Role Details</button> */}
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
                          <label htmlFor="txtValue">Value</label>
                          <small className="text-danger">*</small>
                          <input
                            type="number"
                            className="form-control"
                            id="txtValue"
                            name="value"
                            value={value}
                            onChange={handleInputChangeValue}
                          />
                        </div>
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
                    <div className="input-group mb-3" style={{ gap: "10px" }}>
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
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={removeAllbands}
                    >
                      Remove All
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

export default Bands;
