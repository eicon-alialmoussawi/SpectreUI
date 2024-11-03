import React, { useState, useEffect, useMemo, useRef } from "react";
import APIFunctions from "../utils/APIFunctions";
import Modal from "react-bootstrap/Modal";
import { useTable, useSortBy } from "react-table";
import { param } from "jquery";
import { AlertError, AlertSuccess } from "./f_Alerts";
import { checkToken } from "../utils/common";

const Footer = (props) => {

    const myFooter = {
        id: 0,
        titleEn: '',
        titleAr: '',
        titleFr: '',
        buildingEn: '',
        buildingAr: '',
        buildingFr: '',
        streetEn: '',
        streetAr: '',
        streetFr: '',
        cityEn: '',
        cityAr: '',
        cityFr: '',
        addressEn: '',
        addressFr: '',
        addressAr: '',
        email: '',
        phoneNumber: ''
    }


    var myPermissions =
    {
        canView: false,
        canEdit: false,
    }

    const [permissions, setPermissions] = useState(myPermissions);
    const [footerData, setFooterData] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = React.useState("Footer Data");
    const [edited, setEdited] = useState(myFooter);
    const [saveTxt, setSaveTxt] = useState("Save");

    const footerRef = useRef();

    footerRef.current = footerData;



    useEffect(() => {
        getUserPermissions()
    }, []);


    const getUserPermissions = async () => {
        APIFunctions.getUserPermissions("Footer")
            .then((response) => {
                var _permissions = [];
                var result = response.data;
                result.map((element) => {
                    if (element.pageUrl == "Footer") {
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
                obj.canView = view;
                obj.canEdit = edit;
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
        APIFunctions.getFooter()
            .then((response) => {
                setFooterData(response.data);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    // const refreshList = () => {
    //     getUserPermissions().then(() => {
    //         getData();
    //     });
    // };


    const edit = (id) => {
        if(!checkToken()) window.location.href = "/";

        if (permissions.canEdit) {
            var data = footerRef.current;
            var obj = new Object();
            data.map((val, x) => {
                if (val.id == id)
                    obj = val;
            });

            if (obj != null) {
                setEdited(obj);
                setIsOpen(true);
            }

        }

    }

    const hideModal = () => {
        setIsOpen(false);
    };

    const modalLoaded = () => {
        setTitle("Footer Details");
    };

    const save = () => {
        if (edited.titleAr == "" || edited.titleAr == null
            || edited.titleEn == "" || edited.titleEn == null
            || edited.titleFr == "" || edited.titleFr == null
            || edited.email == "" || edited.email == null
            || edited.phoneNumber == "" || edited.phoneNumber == null
            || edited.cityEn == "" || edited.cityEn == null
            || edited.cityAr == "" || edited.cityAr == null
            || edited.cityFr == "" || edited.cityFr == null
            || edited.buildingEn == "" || edited.buildingEn == null
            || edited.buildingAr == "" || edited.buildingAr == null
            || edited.buildingFr == "" || edited.buildingFr == null
            || edited.streetEn == "" || edited.streetEn == null
            || edited.streetAr == "" || edited.streetAr == null
            || edited.streetFr == "" || edited.streetFr == null) {
            AlertError("Please enter required fields");
            return;
        }

        setSaveTxt("Saving...")
        APIFunctions.updateFooter(edited)
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
                setSaveTxt("Save");
            });
    }


    const columns = useMemo(
        () => [
            {
                Header: "City",
                accessor: "cityEn",
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
                data: footerData,
            },
            useSortBy
        );

    return (
        <div className="content-wrapper">
            <div className="content-header">
                <div className="container-fluid">
                    <div class="card">
                        <div className="card-header">
                            <h2>Footer Data</h2>
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
                        <div class="col-4 bottommargin-sm">
                            <label for="template-contactform-name">Title in English<small className="text-danger">*</small></label>
                            <input
                                type="text"
                                id="txtNameEn"
                                name="template-contactform-name"
                                value={edited.titleEn}
                                onChange={(e) => { setEdited({ ...edited, titleEn: e.target.value }) }}
                                class="form-control required"
                            />
                        </div>
                        <div class="col-4 bottommargin-sm">
                            <label for="template-contactform-name">Title in Arabic<small className="text-danger">*</small></label>
                            <input
                                type="text"
                                id="txtNameEn"
                                name="template-contactform-name"
                                value={edited.titleAr}
                                onChange={(e) => { setEdited({ ...edited, titleAr: e.target.value }) }}
                                class="form-control required"
                            />
                        </div>
                        <div class="col-4 bottommargin-sm">
                            <label for="template-contactform-name">Title in French<small className="text-danger">*</small></label>
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
                        <div class="col-4 bottommargin-sm">
                            <label for="template-contactform-name">Building in English<small className="text-danger">*</small></label>
                            <input
                                type="text"
                                id="txtNameEn"
                                name="template-contactform-name"
                                value={edited.buildingEn}
                                onChange={(e) => { setEdited({ ...edited, buildingEn: e.target.value }) }}
                                class="form-control required"
                            />
                        </div>
                        <div class="col-4 bottommargin-sm">
                            <label for="template-contactform-name">Building in Arabic<small className="text-danger">*</small></label>
                            <input
                                type="text"
                                id="txtNameEn"
                                name="template-contactform-name"
                                value={edited.buildingAr}
                                onChange={(e) => { setEdited({ ...edited, buildingAr: e.target.value }) }}
                                class="form-control required"
                            />
                        </div>
                        <div class="col-4 bottommargin-sm">
                            <label for="template-contactform-name">Building in French<small className="text-danger">*</small></label>
                            <input
                                type="text"
                                id="txtNameEn"
                                name="template-contactform-name"
                                value={edited.buildingFr}
                                class="form-control required"
                                onChange={(e) => { setEdited({ ...edited, buildingFr: e.target.value }) }}

                            />
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div class="col-4 bottommargin-sm">
                            <label for="template-contactform-name">Street in English<small className="text-danger">*</small></label>
                            <input
                                type="text"
                                id="txtNameEn"
                                name="template-contactform-name"
                                value={edited.streetEn}
                                onChange={(e) => { setEdited({ ...edited, streetEn: e.target.value }) }}
                                class="form-control required"
                            />
                        </div>
                        <div class="col-4 bottommargin-sm">
                            <label for="template-contactform-name">Street in Arabic<small className="text-danger">*</small></label>
                            <input
                                type="text"
                                id="txtNameEn"
                                name="template-contactform-name"
                                value={edited.streetAr}
                                onChange={(e) => { setEdited({ ...edited, streetAr: e.target.value }) }}
                                class="form-control required"
                            />
                        </div>
                        <div class="col-4 bottommargin-sm">
                            <label for="template-contactform-name">Street in French<small className="text-danger">*</small></label>
                            <input
                                type="text"
                                id="txtNameEn"
                                name="template-contactform-name"
                                value={edited.streetFr}
                                class="form-control required"
                                onChange={(e) => { setEdited({ ...edited, streetFr: e.target.value }) }}

                            />
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div class="col-4 bottommargin-sm">
                            <label for="template-contactform-name">City in English<small className="text-danger">*</small></label>
                            <input
                                type="text"
                                id="txtNameEn"
                                name="template-contactform-name"
                                value={edited.cityEn}
                                onChange={(e) => { setEdited({ ...edited, cityEn: e.target.value }) }}
                                class="form-control required"
                            />
                        </div>
                        <div class="col-4 bottommargin-sm">
                            <label for="template-contactform-name">City in Arabic<small className="text-danger">*</small></label>
                            <input
                                type="text"
                                id="txtNameEn"
                                name="template-contactform-name"
                                value={edited.cityAr}
                                onChange={(e) => { setEdited({ ...edited, cityAr: e.target.value }) }}
                                class="form-control required"
                            />
                        </div>
                        <div class="col-4 bottommargin-sm">
                            <label for="template-contactform-name">City in French<small className="text-danger">*</small></label>
                            <input
                                type="text"
                                id="txtNameEn"
                                name="template-contactform-name"
                                value={edited.cityFr}
                                class="form-control required"
                                onChange={(e) => { setEdited({ ...edited, cityFr: e.target.value }) }}

                            />
                        </div>
                    </div>

                    <div className="row mb-3">
                    <div class="col-4 bottommargin-sm">
                            <label for="template-contactform-name">Details in English</label>
                            <input
                                type="text"
                                id="txtNameEn"
                                name="template-contactform-name"
                                value={edited.addressEn}
                                onChange={(e) => { setEdited({ ...edited, addressEn: e.target.value }) }}
                                class="form-control required"
                            />
                        </div>
                        <div class="col-4 bottommargin-sm">
                            <label for="template-contactform-name">Details in Arabic</label>
                            <input
                                type="text"
                                id="txtNameEn"
                                name="template-contactform-name"
                                value={edited.addressAr}
                                onChange={(e) => { setEdited({ ...edited, addressAr: e.target.value }) }}
                                class="form-control required"
                            />
                        </div>
                        <div class="col-4 bottommargin-sm">
                            <label for="template-contactform-name">Details in French</label>
                            <input
                                type="text"
                                id="txtNameEn"
                                name="template-contactform-name"
                                value={edited.addressFr }
                                class="form-control required"
                                onChange={(e) => { setEdited({ ...edited, addressFr: e.target.value }) }}

                            />
                        </div>                 
                    </div>

                    <div className="row mb-3">
                        <div class="col-6 bottommargin-sm">
                            <label for="template-contactform-name">Email<small className="text-danger">*</small></label>
                            <input
                                type="text"
                                id="txtNameEn"
                                name="template-contactform-name"
                                value={edited.email}
                                class="form-control required"
                                onChange={(e) => { setEdited({ ...edited, email: e.target.value }) }}

                            />
                        </div>
                        <div class="col-6 bottommargin-sm">
                            <label for="template-contactform-name">Phone Number<small className="text-danger">*</small></label>
                            <input
                                type="text"
                                id="txtNameEn"
                                name="template-contactform-name"
                                value={edited.phoneNumber}
                                class="form-control required"
                                onChange={(e) => { setEdited({ ...edited, phoneNumber: e.target.value }) }}

                            />
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

export default Footer;
