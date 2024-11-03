import React, { useState, useEffect, useMemo, useRef } from "react";
import APIFunctions from "../utils/APIFunctions";
import Modal from "react-bootstrap/Modal";
import "../css/CustomStyle.css";
import { useTable, useSortBy } from "react-table";
import { param } from "jquery";
import { AlertError, AlertSuccess, AlertConfirm } from "./f_Alerts";
import { BindImageURL } from "../utils/common";
import { queryAllByDisplayValue } from "@testing-library/react";
import Select from "react-select";
import { checkToken } from "../utils/common";

const Services = (props) => {
  const myServices = {
    id: 0,
    titleEn: "",
    titleFr: "",
    titleAr: "",
    descriptionEn: "",
    descriptionFr: "",
    descriptionAr: "",
    imageUrl: "",
  };

  var myPermissions = {
    canView: false,
    canEdit: false,
    canAdd: false,
    canDelete: false,
  };

  const addNew = () => {
    if (permissions.canAdd) {
      var tmp = {
        id: 0,
        referenceText: "",
        imageUrl: "",
        isDeleted: false,
      };

      setEdited(tmp);
      setDisplayView(false);
      setImage("");
      setIsOpen(true);
    }
  };

  const [permissions, setPermissions] = useState(myPermissions);
  const [saveTxt, setSaveTxt] = useState("Save");
  const [arrServices, setArrServices] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = React.useState("Service Details");
  const [edited, setEdited] = useState(myServices);
  const [image, setImage] = useState("");
  const serviceRef = useRef();
  const [displayView, setDisplayView] = useState(false);
  const [icons, setIncon] = useState([]);

  serviceRef.current = arrServices;

  useEffect(() => {
    getUserPermissions();
  }, []);

  useEffect(() => {
    APIFunctions.getAllIcons()
      .then((resp) => resp)
      .then((resp) => setIncon(resp.data));
  }, []);

  const handlIconChange = (selectedOptions) => {
    var _edited = edited;
    _edited.imageUrl = selectedOptions.icon1;
    setEdited(_edited);
    //setCurrentPackage({ ...currentPackage, imageUrl: selectedOptions.icon1 })
    console.log(edited);
  };

  const getUserPermissions = async () => {
    APIFunctions.getUserPermissions("Services").then((response) => {
      var _permissions = [];
      var result = response.data;
      result.map((element) => {
        if (element.pageUrl == "Services") {
          _permissions.push(element);
        }
      });

      var view =
        _permissions.find((element) => {
          return element.action == "View";
        }) === undefined
          ? false
          : true;
      var edit =
        _permissions.find((element) => {
          return element.action == "Edit";
        }) === undefined
          ? false
          : true;
      var add =
        _permissions.find((element) => {
          return element.action == "Add";
        }) === undefined
          ? false
          : true;
      var remove =
        _permissions.find((element) => {
          return element.action == "Delete";
        }) === undefined
          ? false
          : true;

      var obj = permissions;
      obj.canView = view;
      obj.canEdit = edit;
      obj.canAdd = add;
      obj.canDelete = remove;
      setPermissions(obj);
      if (view) getServices();
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

  const getServices = () => {
    APIFunctions.getAllFeatures()
      .then((response) => {
        setArrServices(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const edit = (id) => {
    if (permissions.canEdit) {
      if(!checkToken()) window.location.href = "/";
      var data = serviceRef.current;
      var obj = new Object();
      data.map((val, x) => {
        if (val.id == id) obj = val;
      });

      //console.log(obj);
      if (obj != null) {
        setImage(obj.imageUrl);
        setEdited(obj);
        setDisplayView(true);
        setIsOpen(true);
      }
    }
  };

  const hideModal = () => {
    setIsOpen(false);
  };

  const modalLoaded = () => {
    setTitle("Service Details");
  };

  const onFileChange2 = (event) => {
    if (event.target.files.length == 0) {
      return;
    }
    const formData = new FormData();
    formData.append("file", event.target.files[0]);

    APIFunctions.uploadMedia(formData)
      .then((response) => {
        var obj = edited;
        obj.icon = response.data;
        setImage(response.data);
        setDisplayView(true);
        setEdited(obj);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const viewResource = () => {
    var image = BindImageURL(edited.imageUrl);
    window.open(image);
  };

  const save = () => {
    setSaveTxt("Saving...");

    console.log(edited);

    if (
      edited.titleEn == "" ||
      edited.titleEn == null ||
      edited.titleAr == "" ||
      edited.titleAr == null ||
      edited.titleFr == "" ||
      edited.titleFr == null ||
      edited.descriptionEn == "" ||
      edited.descriptionEn == null ||
      edited.descriptionFr == "" ||
      edited.descriptionFr == null ||
      edited.descriptionAr == "" ||
      edited.descriptionAr == null ||
      edited.imageUrl == ""
    ) {
      AlertError("Please enter required fields");
      setSaveTxt("Save");
      return;
    }

    APIFunctions.saveFeature(edited)
      .then((response) => {
        if (!response.data) {
          AlertError("Something went wrong");
          setSaveTxt("Save");
          return;
        } else {
          AlertSuccess("Operation done successfully");
          getServices();
          setTimeout(() => {
            setIsOpen(false);
          }, 300);
          setSaveTxt("Save");
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const remove = (rowIndex) => {
    if (permissions.canDelete) {
      if(!checkToken()) window.location.href = "/";
      AlertConfirm("Are you sure you want to delete ?").then((res) => {
        if (res.value) {
          const id = serviceRef.current[rowIndex].id;
          APIFunctions.deleteFeature(id)
            .then((response) => {
              if (response) {
                let newRes = [...serviceRef.current];
                newRes.splice(id, 1);
                setArrServices(newRes);
                AlertSuccess("Deleted Successfully");
                getServices();
              } else {
                AlertError("Something went wrong");
              }
            })
            .catch((e) => {
              console.log(e);
            });
        }
      });
    }
  };

  const columns = useMemo(
    () => [
      {
        Header: "Title In English",
        accessor: "titleEn",
      },
      {
        Header: "Title In Arabic",
        accessor: "titleAr",
      },
      {
        Header: "Title In French",
        accessor: "titleFr",
      },
      {
        Header: "Description In English",
        accessor: "descriptionEn",
      },
      {
        Header: "Description In Arabic",
        accessor: "descriptionAr",
      },
      {
        Header: "Description In French",
        accessor: "descriptionFr",
      },
      {
        Header: "Actions",
        accessor: "actions",
        Cell: (props) => {
          return (
            <div>
              <a
                style={{ display: permissions.canEdit ? "" : "none" }}
                onClick={() => edit(props.row.original.id)}
                className=" btn btn-primary btn-xs"
              >
                <i
                  style={{ cursor: "pointer", color: "" }}
                  className="fas fa-edit"
                ></i>
              </a>
              <a
                style={{ display: permissions.canDelete ? "" : "none" }}
                onClick={() => remove(props.row.id)}
                className=" btn btn-danger btn-xs"
              >
                <i
                  style={{ cursor: "pointer", color: "" }}
                  className="fas fa-trash"
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
        data: arrServices,
      },
      useSortBy
    );

  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <div class="card">
            <div className="card-header">
              <div className="row">
                <div className="col-lg-11">
                  <h5>Services</h5>
                </div>
                <div className="col-lg-1">
                  <button
                    style={{ display: permissions.canAdd ? "" : "none" }}
                    type="submit"
                    className="btn btn-primary background-color-2"
                    onClick={addNew}
                  >
                    <i className="fas fa-plus" />
                  </button>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="row mb-2">
                <div className="list row">
                  <div className="col-md-8">
                    <div
                      className="input-group mb-3"
                      style={{ gap: "10px" }}
                    ></div>
                    <div className=""></div>
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

      <Modal size="lg" show={isOpen} onHide={hideModal} onEntered={modalLoaded}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
          {/* <button type="button" className="btn-close" aria-label="Close"></button> */}
        </Modal.Header>
        <Modal.Body>
          <div className="row mb-3">
            <div class="col-6 bottommargin-sm">
              <label for="template-contactform-name">
                Title In English<small className="text-danger">*</small>
              </label>
              <input
                type="text"
                id="txtNameEn"
                name="template-contactform-name"
                value={edited.titleEn}
                onChange={(e) => {
                  setEdited({ ...edited, titleEn: e.target.value });
                }}
                class="form-control required"
              />
            </div>
            <div class="col-6 bottommargin-sm">
              <label for="template-contactform-name">
                Title In Arabic<small className="text-danger">*</small>
              </label>
              <input
                type="text"
                id="txtNameEn"
                name="template-contactform-name"
                value={edited.titleAr}
                onChange={(e) => {
                  setEdited({ ...edited, titleAr: e.target.value });
                }}
                class="form-control required"
              />
            </div>
          </div>

          <div className="row mb-3">
            <div class="col-6 bottommargin-sm">
              <label for="template-contactform-name">
                Title In French<small className="text-danger">*</small>
              </label>
              <input
                type="text"
                id="txtNameEn"
                name="template-contactform-name"
                value={edited.titleFr}
                class="form-control required"
                onChange={(e) => {
                  setEdited({ ...edited, titleFr: e.target.value });
                }}
              />
            </div>
          </div>

          <div class="col-12 bottommargin-sm">
            <label for="template-contactform-name">
              Description In English<small className="text-danger">*</small>
            </label>
            <textarea
              type="text"
              id="txtNameEn"
              name="template-contactform-name"
              style={{ resize: "none" }}
              value={edited.descriptionEn}
              onChange={(e) => {
                setEdited({ ...edited, descriptionEn: e.target.value });
              }}
              class="form-control required"
            />
          </div>
          <div class="col-12 bottommargin-sm">
            <label for="template-contactform-name">
              Description In Arabic<small className="text-danger">*</small>
            </label>
            <textarea
              type="text"
              id="txtNameEn"
              name="template-contactform-name"
              style={{ resize: "none" }}
              value={edited.descriptionAr}
              onChange={(e) => {
                setEdited({ ...edited, descriptionAr: e.target.value });
              }}
              class="form-control required"
            />
          </div>
          <div class="col-12 bottommargin-sm">
            <label for="template-contactform-name">
              Description In French<small className="text-danger">*</small>
            </label>
            <textarea
              type="text"
              id="txtNameEn"
              name="template-contactform-name"
              style={{ resize: "none" }}
              value={edited.descriptionFr}
              onChange={(e) => {
                setEdited({ ...edited, descriptionFr: e.target.value });
              }}
              class="form-control required"
            />
          </div>

          <div className="form-group">
            <div className="col-lg-6 bottommargin-sm">
              <label>Icon</label>
              <Select
                id="ddlIcons"
                name="id"
                value={icons.find((obj) => {
                  return obj.icon1 == edited.imageUrl;
                })}
                getOptionLabel={(option) => (
                  <a>
                    {" "}
                    <i class={option.icon1} /> {option.icon1}
                  </a>
                )}
                getOptionValue={(option) => option.id}
                options={icons}
                onChange={handlIconChange}
              ></Select>
            </div>
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
    </div>
  );
};

export default Services;
