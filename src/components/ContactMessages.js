import React, { useState, useEffect, useMemo, useRef } from "react";
import APIFunctions from "../utils/APIFunctions";
import { AlertConfirm, AlertError, AlertSuccess } from "./f_Alerts";
import { useTable, useSortBy } from "react-table";
import Modal from "react-bootstrap/Modal";
import { checkToken } from "../utils/common";

const ContactMessages = (props) => {

  var mySelected =
  {
    id: 0,
    email: '',
    name: '',
    message: '',
    reply: ''
  }

  var myPermissions = {
    canView: false,
    canDelete: false,
  };

  const [permissions, setPermissions] = useState(myPermissions);
  const [selectedItem, setSelectedItem] = useState(mySelected);
  const [contactUs, setContactUs] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = React.useState("Reply");
  const [saveTxt, setSaveTxt] = useState("Save");
  const contactRef = useRef();

  contactRef.current = contactUs;

  useEffect(() => {
    getUserPermissions();
  }, []);

  const getUserPermissions = async () => {
    APIFunctions.getUserPermissions("ContactMessages").then((response) => {
      var _permissions = [];
      var result = response.data;
      result.map((element) => {
        if (element.pageUrl == "ContactMessages") {
          _permissions.push(element);
        }
      });

      var view =
        _permissions.find((element) => {
          return element.action == "View";
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
      obj.canDelete = _delete;
      setPermissions(obj);
      if (view) getContactUs();
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


  const getContactUs = () => {
    APIFunctions.getContactUs()
      .then((response) => {
        setContactUs(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const hideModal = () => {
    setIsOpen(false);
  };

  const modalLoaded = () => {
    setTitle("Reply");
  };

  const save = () => {

    if (selectedItem.reply == "" || selectedItem.reply == null) {
      AlertError("Please enter reply");
      return;
    }

    setSaveTxt("Saving...");

    APIFunctions.sendReply(selectedItem)
      .then((response) => {
        if (!response.data) {
          AlertError("Something went wrong");
          setSaveTxt("Save");
          return;
        }
        else {
          AlertSuccess("Operation done successfully");
          setIsOpen(false);
          setSaveTxt("Save");
        }

      })
      .catch((e) => {
        console.log(e);
      });
    console.log(selectedItem);
  }

  const openModal = (id) => {
    if(!checkToken()) window.location.href = "/";

    var selected = contactRef.current[id];

    var _item = new Object();
    _item.id = 0;
    _item.name = selected.name;
    _item.email = selected.email;
    _item.message = selected.message;
    _item.reply = '';
    setSelectedItem(_item);

    setIsOpen(true);
  }

  const deletenew = (rowIndex) => {
    if(!checkToken()) window.location.href = "/";

    AlertConfirm('Are you sure you want to delete ?')
      .then(res => {
        if (res.value) {
          const id = contactRef.current[rowIndex].id;

          APIFunctions.deleteContactUs(id)
            .then((response) => {
              AlertSuccess("Operation done successfully");
              let contactUs = [...contactRef.current];
              contactUs.splice(rowIndex, 1);

              setContactUs(contactUs);
            })
            .catch((e) => {
              console.log(e);
            });
        }
      })

  };

  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Phone Number",
        accessor: "phoneNumber",

      },
      {
        Header: "Company",
        accessor: "companyName",

      },
      {
        Header: "Message",
        accessor: "message",

      },
      {
        Header: "Country",
        accessor: "country",

      },
      {
        Header: "Actions",
        accessor: "actions",
        Cell: (props) => {
          const rowIdx = props.row.id;
          return (
            <div>
              <a
                onClick={() => deletenew(rowIdx)}
                className="btn btn-danger btn-xs"
                style={{ margin: "3px", display: permissions.canDelete ? "" : "none" }}>
                <i style={{ cursor: "pointer", color: "" }}
                  className="fas fa-trash action"></i>
              </a>
              <a onClick={() => openModal(rowIdx)}
                className="btn btn-view btn-xs">
                <i style={{ cursor: "pointer", color: "" }}
                  className="fa fa-reply action"></i>
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
        data: contactUs,
      },
      useSortBy
    );

  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <div class="card">
            <div className="card-header">
              <h2>Contact Messages</h2>
            </div>
            <div className="card-body">
              <div className="row mb-2">
                <div className="list row">
                  <div className="col-md-8">
                    <div className="input-group mb-3" style={{ gap: "10px" }}>
                      <div className="">

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
        <Modal
          size="lg"
          show={isOpen}
          onHide={hideModal}
          onEntered={modalLoaded}>
          <Modal.Header closeButton>
            <Modal.Title>{title}</Modal.Title>
            {/* <button type="button" className="btn-close" aria-label="Close"></button> */}
          </Modal.Header>
          <Modal.Body>
            <div className="row mb-3">
              <div className="col-lg-6">
                <label for="template-contactform-name">Sender's Name</label>
                <input type="text"
                  className="form-control"
                  value={selectedItem.name}
                  disabled></input>
              </div>
              <div className="col-lg-6">
                <label for="template-contactform-name">Sender's Email</label>
                <input type="text"
                  className="form-control"
                  value={selectedItem.email}
                  disabled></input>
              </div>
              <div className="col-lg-12">
                <label for="template-contactform-name">Sender's Message</label>
                <textarea type="text"
                  className="form-control"
                  value={selectedItem.message}
                  disabled style={{ resize: "none", height: "103px" }}></textarea>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-lg-12">
                <label for="template-contactform-name">Response</label>
                <textarea type="text"
                  className="form-control"
                  style={{ resize: "none" }}
                  value={selectedItem.reply}
                  onChange={(e) => { setSelectedItem({ ...selectedItem, reply: e.target.value }) }}></textarea>
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
    </div>
  );
};

export default ContactMessages;
