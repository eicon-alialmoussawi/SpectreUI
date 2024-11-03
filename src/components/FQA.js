import React, { useState, useEffect, useMemo, useRef } from "react";
import APIFunctions from "../utils/APIFunctions";
import Modal from "react-bootstrap/Modal";
import '../css/CustomStyle.css';
import { useTable, useSortBy } from "react-table";
import { param } from "jquery";
import { checkToken } from "../utils/common";
import { AlertError, AlertSuccess, AlertConfirm, LoadingAlert  } from "./f_Alerts";
import { BindImageURL } from "../utils/common";

const FQA = (props) => {

    const myService = {
        id: 0,
        questionEn: '',
        questionFr: '',
        questionAr: '',
        answerEn: '',
        answerFr: '',
        answerAr: '',
        isDeleted:  false,
    }
    var myPermissions =
    {
        canView: false,
      canAdd: false,
      canEdit: false,
      canDelete: false,
    }

    const [permissions, setPermissions] = useState(myPermissions);
    const [saveTxt, setSaveTxt] = useState("Save");
    const [arrServices, setArrServices] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = React.useState("FAQs");
    const [edited, setEdited] = useState(myService);
    const serviceRef = useRef();

    serviceRef.current = arrServices;


    useEffect(() => {
        getUserPermissions();
    }, []);
    

    const getUserPermissions = async () => {
        APIFunctions.getUserPermissions("FQA")
            .then((response) => {
                var _permissions = [];
                var result = response.data;
                result.map((element) => {
                    if (element.pageUrl == "FQA") {
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
                if (view) getServices();
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

    const getServices = () => {
        APIFunctions.getAllFQA()
            .then((response) => {
                setArrServices(response.data);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const edit = (id) => {
        if(!checkToken()) window.location.href = "/";
            var data = serviceRef.current;
            var obj = new Object();
            data.map((val, x) => {
                if (val.id == id)
                    obj = val;
            });

            //console.log(obj);
            if (obj != null) {
                setEdited(obj);
                setIsOpen(true);
            }
    }

    const remove = (rowIndex) => {
        if(!checkToken()) window.location.href = "/";
   
    AlertConfirm('Are you sure you want to delete ?')
      .then(res => {
          
        if (res.value) {
          const id = serviceRef.current[rowIndex].id;

          LoadingAlert("Show");
          APIFunctions.deleteFQA(id)
            .then((response) => {
             
              LoadingAlert("Hide");
              AlertSuccess("Operation done successfully");
              let obj = [...serviceRef.current];
              obj.splice(rowIndex, 1);

              setArrServices(obj);
            })
            .catch((e) => {
              console.log(e);
            });
        }
      })

    }

    const hideModal = () => {
        setIsOpen(false);
    };

    const modalLoaded = () => {
        setTitle("FAQ");
    };

    const addNew = () => {
        setEdited(myService);
        setIsOpen(true);
    }

    const save = () => {

        setSaveTxt("Saving...");

        if (edited.questionEn == "" || edited.questionEn == null
            || edited.questionAr == "" || edited.questionAr == null
            || edited.questionFr == "" || edited.questionFr == null
            || edited.answerEn == "" || edited.answerEn == null
            || edited.answerFr == "" || edited.answerFr == null
            || edited.answerAr == "" || edited.answerAr == null) {
            AlertError("Please enter required fields");
            setSaveTxt("Save");
            return;
        }

        APIFunctions.saveFQA(edited)
            .then((response) => {
                if (!response.data) {
                    AlertError("Something went wrong");
                    setSaveTxt("Save");
                    return;
                }
                else {
                    AlertSuccess("Operation done successfully");
                    getServices();
                    setTimeout(() => { setIsOpen(false); }, 300);
                    setSaveTxt("Save");
                }

            })
            .catch((e) => {
                console.log(e);
            });
    }


    const columns = useMemo(
        () => [
            {
                Header: "Question In English",
                accessor: "questionEn",
            },
            {
                Header: "Question In Arabic",
                accessor: "questionAr",
            },
            {
                Header: "Question In French",
                accessor: "questionFr",
            },
            {
                Header: "Answer In English",
                accessor: "answerEn",
            },
            {
                Header: "Answer In Arabic",
                accessor: "answerAr",
            },
            {
                Header: "Answer In French",
                accessor: "answerFr",
            },
            {
                Header: "Actions",
                accessor: "actions",
                Cell: (props) => {
                    const rowIdx = props.row.id;

                    return (
                        <div>
                            <a style={{ display: (permissions.canEdit == true ? "" : "none") }}
                                onClick={() => edit(props.row.original.id)}
                                className=" btn btn-primary btn-xs">
                                <i
                                    style={{ cursor: "pointer", color: "" }}
                                    className="fas fa-edit"
                                ></i>
                            </a>

                            <a style={{ display: (permissions.canDelete == true ? "" : "none") }}
                                onClick={() => remove(rowIdx)}
                                className=" btn btn-danger btn-xs">
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
                                <h5>FAQa</h5>
                            </div>
                        <div className="col-lg-1" style={{ display: (permissions.canAdd == true ? "" : "none") }}>
                        <button type="submit" className="btn btn-primary background-color-2" onClick={addNew}>
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

                                        </div>
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
                        <div class="col-6 bottommargin-sm">
                            <label for="template-contactform-name">Question In English<small className="text-danger">*</small></label>
                            <input
                                type="text"
                                id="txtNameEn"
                                name="template-contactform-name"
                                value={edited.questionEn}
                                onChange={(e) => { setEdited({ ...edited, questionEn: e.target.value }) }}
                                class="form-control required"
                            />
                        </div>
                        <div class="col-6 bottommargin-sm">
                            <label for="template-contactform-name">Question In Arabic<small className="text-danger">*</small></label>
                            <input
                                type="text"
                                id="txtNameEn"
                                name="template-contactform-name"
                                value={edited.questionAr}
                                onChange={(e) => { setEdited({ ...edited, questionAr: e.target.value }) }}
                                class="form-control required"
                            />
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div class="col-6 bottommargin-sm">
                            <label for="template-contactform-name">Question In French<small className="text-danger">*</small></label>
                            <input
                                type="text"
                                id="txtNameEn"
                                name="template-contactform-name"
                                value={edited.questionFr}
                                class="form-control required"
                                onChange={(e) => { setEdited({ ...edited, questionFr: e.target.value }) }}

                            />
                        </div>
                    </div>


                    <div class="col-12 bottommargin-sm">
                        <label for="template-contactform-name">Answer In English<small className="text-danger">*</small></label>
                        <textarea
                            type="text"
                            id="txtNameEn"
                            name="template-contactform-name"
                            style={{ resize: "none" }}
                            value={edited.answerEn}
                            onChange={(e) => { setEdited({ ...edited, answerEn: e.target.value }) }}
                            class="form-control required"
                        />
                    </div>
                    <div class="col-12 bottommargin-sm">
                        <label for="template-contactform-name">Answer In Arabic<small className="text-danger">*</small></label>
                        <textarea
                            type="text"
                            id="txtNameEn"
                            name="template-contactform-name"
                            style={{ resize: "none" }}
                            value={edited.answerAr}
                            onChange={(e) => { setEdited({ ...edited, answerAr: e.target.value }) }}
                            class="form-control required"
                        />
                    </div>
                    <div class="col-12 bottommargin-sm">
                        <label for="template-contactform-name">Answer In French<small className="text-danger">*</small></label>
                        <textarea
                            type="text"
                            id="txtNameEn"
                            name="template-contactform-name"
                            style={{ resize: "none" }}
                            value={edited.answerFr}
                            onChange={(e) => { setEdited({ ...edited, answerFr: e.target.value }) }}
                            class="form-control required"
                        />
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

export default FQA;
