import React, { useState, useEffect, useMemo, useRef } from "react";
import APIFunctions from "../utils/APIFunctions";
import Modal from "react-bootstrap/Modal";
import { useTable, useSortBy } from "react-table";
import { param } from "jquery";
import { AlertConfirm, AlertError, AlertSuccess, LoadingAlert } from "./f_Alerts";
import { BindImageURL } from "../utils/common";
import '../css/CustomStyle.css';
import { checkToken } from "../utils/common";

const ReportSnaps = (props) => {

    const mySnap = {
        id: 0,
        referenceText: '',
        imageUrl: '',
        isDeleted: false,
    }


    var myPermissions =
    {
        canView: false,
        canAdd: false,
        canEdit: false,
        canDelete: false,
    }

    const [permissions, setPermissions] = useState(myPermissions);
    const [reportSnaps, setReportSnaps] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = React.useState("Report  Snaps");
    const [edited, setEdited] = useState(mySnap);
    const [saveTxt, setSaveTxt] = useState("Save");
    const [image, setImage] = useState('');
    const [displayView, setDisplayView] = useState(false);

    const snapRef = useRef();

    snapRef.current = reportSnaps;



    useEffect(() => {
        getUserPermissions();
    }, []);

    const getUserPermissions = async () => {
        APIFunctions.getUserPermissions("ReportSnaps")
            .then((response) => {
                var _permissions = [];
                var result = response.data;
                result.map((element) => {
                    if (element.pageUrl == "ReportSnaps") {
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
        APIFunctions.getReportSnaps()
            .then((response) => {
                setReportSnaps(response.data);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    // const refreshList = () => {
    //     getData();
    // };

    const viewResource = () => {
        var img = BindImageURL(image);
        window.open(img);
    }


    const addNew = () => {
        if (permissions.canAdd) {
            var tmp = {
                id: 0,
                referenceText: '',
                imageUrl: '',
                isDeleted: false,
            }

            setEdited(tmp);
            setDisplayView(false);
            setImage('');
            setIsOpen(true);
        }

    }
    const edit = (id) => {
        if(!checkToken()) window.location.href = "/";

        if (permissions.canEdit) {
            var data = snapRef.current;
            var obj = new Object();
            data.map((val, x) => {
                if (val.id == id)
                    obj = val;
            });

            if (obj != null) {
                setEdited(obj);
                setImage(obj.imageUrl);
                setDisplayView(true);
                setIsOpen(true);
            }
        }
    }

    const hideModal = () => {
        setIsOpen(false);
    };

    const modalLoaded = () => {
        setTitle("Report Snaps");
    };

    const save = () => {
        if (edited.referenceText == "" || edited.referenceText == null
            || edited.imageUrl == "" || edited.imageUrl == null) {
            AlertError("Please enter required fields");
            return;
        }

        if (edited.id > 0) {
            setSaveTxt("Saving...")
            APIFunctions.updateReportSnaps(edited)
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
        else {
            setSaveTxt("Saving...")
            APIFunctions.saveReportSnap(edited)
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


    }

    const onFileChange2 = (event) => {

        if (event.target.files.length == 0) {
            return;
        }
        LoadingAlert("Show");
        const formData = new FormData();
        formData.append(
            "file",
            event.target.files[0]
        );

        APIFunctions.uploadMedia(formData)
            .then((response) => {
                var obj = edited;
                obj.imageUrl = response.data;
                setImage(response.data);
                setDisplayView(true);
                setEdited(obj);
                LoadingAlert("hide");
            })
            .catch((e) => {
                console.log(e);
                LoadingAlert("hide");
            });
    }

    const view = (id) => {
        var data = snapRef.current;

        var obj = new Object();
        data.map((val, x) => {
            if (val.id == id)
                obj = val;
        });
        if (obj != null) {
            var img = BindImageURL(obj.imageUrl);
            window.open(img);
        }
    }

    const remove = (id, rowIndex) => {
        if (permissions.canDelete) {
            if(!checkToken()) window.location.href = "/";
            AlertConfirm('Are you sure you want to delete ?')
                .then(res => {
                    if (res.value) {
                        APIFunctions.deleteReportSnaps(id)
                            .then((response) => {
                                if (response) {
                                    let newReportss = [...snapRef.current];
                                    newReportss.splice(rowIndex, 1);
                                    setReportSnaps(newReportss);
                                    AlertSuccess("Deleted Successfully");
                                }
                                else {
                                    AlertError("Something went wrong");
                                }

                            })
                            .catch((e) => {
                                console.log(e);
                            });
                    }
                })
        }

    }



    const columns = useMemo(
        () => [
            {
                Header: "Referecnce Text",
                accessor: "referenceText",
            },
            {
                Header: "Actions",
                accessor: "actions",
                Cell: (props) => {
                    const rowIdx = props.row.id;
                    return (
                        <div>
                            <a style={{ margin: "3px" }}
                                onClick={() => edit(props.row.original.id)}
                                className=" btn btn-primary btn-xs">
                                <i style={{ cursor: "pointer", color: "", display: permissions.canEdit ? "" : "none" }}
                                    className="fas fa-edit"></i>
                            </a>
                            <a style={{ margin: "3px" }}
                                onClick={() => view(props.row.original.id)}
                                className=" btn btn-view btn-xs">
                                <i style={{ cursor: "pointer", color: "" }}
                                    className="fas fa-eye"
                                ></i>
                            </a>
                            <a style={{ margin: "3px" }}
                                onClick={() => remove(props.row.original.id, rowIdx)}
                                className=" btn btn-danger btn-xs">
                                <i style={{ cursor: "pointer", color: "", display: permissions.canDelete ? "" : "none" }}
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
                data: reportSnaps,
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
                                    <h5>Report Snaps</h5>
                                </div>
                                <div className="col-lg-1">
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
                        <div class="col-12 bottommargin-sm">
                            <label for="template-contactform-name">Reference Text<small className="text-danger">*</small></label>
                            <input
                                type="text"
                                id="txtNameEn"
                                name="template-contactform-name"
                                value={edited.referenceText}
                                onChange={(e) => { setEdited({ ...edited, referenceText: e.target.value }) }}
                                class="form-control required"
                            />
                        </div>
                    </div>
                    <div className="col-lg-6 bottommargin-sm" >
                        <div className="uppy">
                            <div className="uppy-wrapper">
                                <div className="uppy-Root uppy-FileInput-container">
                                    <input className="uppy-FileInput-input uppy-input-control"
                                        style={{ display: "none" }}
                                        type="file"
                                        name="files[]"
                                        id="template-contactform-upload2"
                                        onChange={onFileChange2}

                                        accept="image/*" />

                                    <label class="uppy-input-label btn btn-light-primary btn-bold" style={{ border: "1px solid", marginTop: "15px" }} for="template-contactform-upload2">Upload Resource</label>
                                    <i style={{
                                        marginLeft: "10px ",
                                        marginRight: "10px",
                                        display: displayView == true ? "" : "none"
                                    }}
                                        className="btn  fa fa-eye icon-green btn-view" aria-hidden="true" onClick={() => viewResource()}>

                                    </i>
                                </div>

                            </div>
                        </div>
                        <label>{image}</label>
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

export default ReportSnaps;
