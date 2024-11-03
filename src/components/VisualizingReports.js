import React, { useState, useEffect, useMemo, useRef } from "react";
import APIFunctions from "../utils/APIFunctions";
import Modal from "react-bootstrap/Modal";
import { useTable, useSortBy } from "react-table";
import { param } from "jquery";
import { AlertError, AlertSuccess } from "./f_Alerts";
import { checkToken } from "../utils/common";

const VisualizingReports = (props) => {

    const myVisualize = {
        id: 0,
        titleEn: '',
        titleFr: '',
        titleAr: '',
        descriptionEn: '',
        descriptionFr: '',
        descriptionAr: '',
    }


    var myPermissions =
    {
        canView: false,
        canEdit: false,
    }

    const [permissions, setPermissions] = useState(myPermissions);
    const [visualizeReports, setVisualizeReport] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = React.useState("Visualizing Reports");
    const [edited, setEdited] = useState(myVisualize);
    const [saveTxt, setSaveTxt] = useState("Save");

    const visualizeRef = useRef();

    visualizeRef.current = visualizeReports;



    useEffect(() => {
        getUserPermissions();
    }, []);


    const getUserPermissions = async () => {
        APIFunctions.getUserPermissions("VisualizingReports")
            .then((response) => {
                var _permissions = [];
                var result = response.data;
                result.map((element) => {
                    if (element.pageUrl == "VisualizingReports") {
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
                obj.canView = view;
                obj.canAdd = add;
                obj.canEdit = edit;
                obj.canDelete = _delete;
                setPermissions(obj);
                if (view) getData();
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

    const getData = () => {
        APIFunctions.getVisualizing()
            .then((response) => {
                setVisualizeReport(response.data);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    // const refreshList = () => {
    //     getData();
    // };


    const edit = (id) => {
        if(!checkToken()) window.location.href = "/";

        if (permissions.canEdit) {
            var data = visualizeRef.current;
            var elem = data.map((val, x) => {
                if (val.id === id)
                    return val;
            });

            if (elem.length > 0) {
                setEdited(elem[0]);
            }
            setIsOpen(true);
        }

    }

    const hideModal = () => {
        setIsOpen(false);
    };

    const modalLoaded = () => {
        setTitle("Visualizing Reports");
    };

    const save = () => {
        if (edited.titleEn == "" || edited.titleEn == null
            || edited.titleAr == "" || edited.titleAr == null
            || edited.titleFr == "" || edited.titleFr == null
            || edited.descriptionEn == "" || edited.descriptionEn == null
            || edited.descriptionFr == "" || edited.descriptionFr == null
            || edited.descriptionAr == "" || edited.descriptionAr == null) {
            AlertError("Please enter required fields");
            return;
        }

        setSaveTxt("Saving...")
        APIFunctions.updateVisualizing(edited)
            .then((response) => {
                if (!response.data) {
                    AlertError("Something went wrong");
                    setSaveTxt("Save");
                    return;
                }
                else {
                    AlertSuccess("Operation done successfully");
                    setSaveTxt("Save");
                    getData();
                    setTimeout(() => { setIsOpen(false); }, 300);
                }

            })
            .catch((e) => {
                console.log(e);
            });
    }


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
                data: visualizeReports,
            },
            useSortBy
        );

    return (
        <div className="content-wrapper">
            <div className="content-header">
                <div className="container-fluid">
                    <div class="card">
                        <div className="card-header">
                            <h2>Visualizing Reports</h2>
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
                            <label for="template-contactform-name">Title In English<small className="text-danger">*</small></label>
                            <input
                                type="text"
                                id="txtNameEn"
                                name="template-contactform-name"
                                value={edited.titleEn}
                                onChange={(e) => { setEdited({ ...edited, titleEn: e.target.value }) }}
                                class="form-control required"
                            />
                        </div>
                        <div class="col-6 bottommargin-sm">
                            <label for="template-contactform-name">Title In Arabic<small className="text-danger">*</small></label>
                            <input
                                type="text"
                                id="txtNameEn"
                                name="template-contactform-name"
                                value={edited.titleAr}
                                onChange={(e) => { setEdited({ ...edited, titleAr: e.target.value }) }}
                                class="form-control required"
                            />
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div class="col-6 bottommargin-sm">
                            <label for="template-contactform-name">Title In French<small className="text-danger">*</small></label>
                            <input
                                type="text"
                                id="txtNameEn"
                                name="template-contactform-name"
                                value={edited.titleFr}
                                class="form-control required"
                                onChange={(e) => { setEdited({ ...edited, titleFr: e.target.value }) }}

                            />
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div class="col-6 bottommargin-sm">
                            <label for="template-contactform-name">Description In English<small className="text-danger">*</small></label>
                            <textarea
                                type="text"
                                id="txtNameEn"
                                name="template-contactform-name"
                                style={{ resize: "none", height: "200px" }}
                                value={edited.descriptionEn}
                                onChange={(e) => { setEdited({ ...edited, descriptionEn: e.target.value }) }}
                                class="form-control required"
                            />
                        </div>
                        <div class="col-6 bottommargin-sm">
                            <label for="template-contactform-name">Description In Arabic<small className="text-danger">*</small></label>
                            <textarea
                                type="text"
                                id="txtNameEn"
                                name="template-contactform-name"
                                style={{ resize: "none", height: "200px" }}
                                value={edited.descriptionAr}
                                onChange={(e) => { setEdited({ ...edited, descriptionAr: e.target.value }) }}
                                class="form-control required"
                            />
                        </div>
                    </div>

                    <div class="col-12 bottommargin-sm">
                        <label for="template-contactform-name">Description In French<small className="text-danger">*</small></label>
                        <textarea
                            type="text"
                            id="txtNameEn"
                            name="template-contactform-name"
                            style={{ resize: "none", height: "150px" }}
                            value={edited.descriptionFr}
                            onChange={(e) => { setEdited({ ...edited, descriptionFr: e.target.value }) }}
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

export default VisualizingReports;
