import React, { useState, useEffect, useMemo, useRef } from "react";
import APIFunctions from "../utils/APIFunctions";
import Modal from "react-bootstrap/Modal";
import "../css/CustomStyle.css";
import { useTable, useSortBy } from "react-table";
import { param } from "jquery";
import { AlertError, AlertSuccess } from "./f_Alerts";
import { BindImageURL } from "../utils/common";
import { checkToken } from "../utils/common";

const Features = (props) => {
  const myFeature = {
    id: 0,
    titleEn: "",
    titleFr: "",
    titleAr: "",
    descriptionEn: "",
    descriptionFr: "",
    descriptionAr: "",
    icon: "",
  };

  var myPermissions = {
    canView: false,
    canEdit: false,
  };

  const [permissions, setPermissions] = useState(myPermissions);
  const [saveTxt, setSaveTxt] = useState("Save");
  const [arrFeatures, setArrFeatures] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = React.useState("Feature Details");
  const [edited, setEdited] = useState(myFeature);
  const [image, setImage] = useState("");
  const featureRef = useRef();

  featureRef.current = arrFeatures;

  useEffect(() => {
    getUserPermissions();
  }, []);

  const getUserPermissions = async () => {
    APIFunctions.getUserPermissions("Features").then((response) => {
      var _permissions = [];
      var result = response.data;
      result.map((element) => {
        if (element.pageUrl == "Features") {
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

      var obj = permissions;
      obj.canView = view;
      obj.canEdit = edit;
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
    APIFunctions.getServices()
      .then((response) => {
        setArrFeatures(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  // const refreshList = () => {
  //     getServices();
  // };

  const edit = (id) => {
    if(!checkToken()) window.location.href = "/";
    if (permissions.canEdit) {
      var data = featureRef.current;
      var obj = new Object();
      data.map((val, x) => {
        if (val.id == id) obj = val;
      });

      //console.log(obj);
      if (obj != null) {
        setImage(obj.icon);
        setEdited(obj);
        setIsOpen(true);
      }
    }
  };

  const hideModal = () => {
    setIsOpen(false);
  };

  const modalLoaded = () => {
    setTitle("Feature Details");
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
        setEdited(obj);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const viewResource = () => {
    var image = BindImageURL(edited.icon);
    window.open(image);
  };

  const save = () => {
    setSaveTxt("Saving...");

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
      edited.descriptionAr == null
    ) {
      AlertError("Please enter required fields");
      setSaveTxt("Save");
      return;
    }

    APIFunctions.updateService(edited)
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
        data: arrFeatures,
      },
      useSortBy
    );

  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <div class="card">
            <div className="card-header">
              <h2>Features</h2>
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
              <div className="uppy">
                <div className="uppy-wrapper">
                  <div className="uppy-Root uppy-FileInput-container">
                    <input
                      className="uppy-FileInput-input uppy-input-control"
                      style={{ display: "none" }}
                      type="file"
                      name="files[]"
                      id="template-contactform-upload2"
                      onChange={onFileChange2}
                      accept="image/*"
                    />

                    <label
                      class="uppy-input-label btn btn-light-primary btn-bold"
                      style={{ border: "1px solid", marginTop: "15px" }}
                      for="template-contactform-upload2"
                    >
                      Upload Resource
                    </label>
                    <i
                      style={{
                        marginLeft: "10px ",
                        marginRight: "10px",
                      }}
                      className="btn  fa fa-eye icon-green btn-view"
                      aria-hidden="true"
                      onClick={() => viewResource()}
                    ></i>
                  </div>
                </div>
              </div>
              <label>{image}</label>
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

export default Features;
