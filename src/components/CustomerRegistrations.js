import React, { useState, useEffect, useMemo, useRef } from "react";
import '../css/PreRegistration.css';
import APIFunctions from "../utils/APIFunctions";
import { useTable, useSortBy } from "react-table";
import { Link } from "react-router-dom";
import { AlertConfirm, AlertError, AlertSuccess } from "./f_Alerts";
import 'react-telephone-input/css/default.css';
import { checkToken } from "../utils/common";

const CustomerRegistrations = (props) => {

    var myPermissions =
    {
        canView: false,
        canAdd: false,
        canEdit: false,
        canDelete: false,
    }

    const [permissions, setPermissions] = useState(myPermissions);
    const [registrations, setPreRegistrations] = useState([]);

    const registrationRef = useRef();

    registrationRef.current = registrations;


    useEffect(() => {
        getUserPermissions();
    }, []);



    // useEffect(() => {
    //     getRegistrations();
    // }, []);


    const setAsViewed = (id) => {
        AlertConfirm('Are you sure you want to set as viewed ?')
            .then(res => {
                if (res.value) {
                    APIFunctions.setPreRegistrationAdViewed(id)
                        .then((response) => {
                            if (response.data) {
                                AlertSuccess("Operation done successfulyy");
                                getRegistrations();
                            }
                        });
                }
            });
    }

    const getUserPermissions = async () => {
        APIFunctions.getUserPermissions("CustomerRegistrations")
            .then((response) => {
                var _permissions = [];
                var result = response.data;
                result.map((element) => {
                    if (element.pageUrl == "CustomerRegistrations") {
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
                if (view) getRegistrations();
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



    const getRegistrations = () => {
        APIFunctions.getPreRegistrationWithDetails()
            .then((response) => {
                setPreRegistrations(response.data);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    // const refreshList = () => {
    //     getRegistrations();
    //     getUserPermissions();
    // };

    const openRegistration = (id) => {
        if (permissions.canEdit) {
            props.history.push("/EditPreRegistration/" + id);
        }
    }
    const deleteRegistration = (id, rowIndex) => {
        if(!checkToken()) window.location.href = "/";

        if (permissions.canDelete) {
            AlertConfirm('Are you sure you want to delete ?')
                .then(res => {
                    if (res.value) {
                        APIFunctions.deletePreRegistration(id)
                            .then((response) => {
                                if (response) {
                                    let newPackage = [...registrationRef.current];
                                    newPackage.splice(rowIndex, 1);
                                    setPreRegistrations(newPackage);
                                    AlertSuccess("Deleted Successfully");
                                }

                            })
                            .catch((e) => {
                                console.log(e);
                            });
                    }
                })
        }


    };

    const columns = useMemo(
        () => [
            {
                Header: "Name",
                width: 30,
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
                Header: "Requested Package",
                accessor: "packageName",
            },
            // {
            //     Header: "Has been Contacted",
            //     Cell: (props) => {
            //         return props.row.original.isViewed ? "Yes" : "No";
            //     },
            // },
            {
                Header: (
                    <div style={{ width: "85px", textAlign: "center", margin: "auto" }}>
                        Marked As Viewed
                    </div>
                ),
                accessor: "viewed",
                Cell: (props) => {
                    const rowIdx = props.row.id;
                    if (props.row.original.isViewed == null || props.row.original.isViewed == false) {
                        return (
                            <div style={{ textAlign: "center" }}>
                                <a
                                    // style={{ display: (canEdit == true ? "" : "none") }}
                                    onClick={() => setAsViewed(props.row.original.id)}
                                    className=" btn btn-dark-blue btn-xs"
                                >
                                    <i
                                        style={{ cursor: "pointer", color: "" }}
                                        className="fas fa-eye"
                                    ></i>
                                </a>
                            </div>
                        );
                    }
                    else {
                        return ('')
                    }
                },
                width: 10,
            },
            {
                Header: "Actions",
                accessor: "actions",
                Cell: (props) => {
                    const rowIdx = props.row.id;
                    return (
                        <div>
                            <a
                                style={{ display: (permissions.canEdit == true ? "" : "none") }}
                                onClick={() => openRegistration(props.row.original.id)}
                                className=" btn btn-primary btn-xs"
                            >
                                <i
                                    style={{ cursor: "pointer", color: "" }}
                                    className="fas fa-pencil-alt"
                                ></i>
                            </a>
                            <a
                                style={{ display: (permissions.canDelete == true ? "" : "none") }}
                                onClick={() => deleteRegistration(props.row.original.id, rowIdx)}
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
        useTable(
            {
                columns,
                data: registrations,
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
                                    <h5>Company Registrations</h5>
                                </div>
                                <div className="col-lg-1">
                                    <Link to="/EditPreRegistration/0" style={{ display: permissions.canAdd ? "" : "none" }}>
                                        <button type="submit" className="btn btn-primary background-color-2"
                                style={{ display: (permissions.canAdd == true ? "" : "none") }}>
                                            <i className="fas fa-plus" />
                                        </button></Link>
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="row mb-2">
                                <div className="list row">
                                    <div className="col-md-8">
                                        <div className="input-group mb-3" style={{ gap: "10px" }}>
                                            <div className=" ">
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
            </div>
        </div>
    );
};


export default CustomerRegistrations;