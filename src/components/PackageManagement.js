import React, { useState, useEffect, useMemo, useRef } from "react";
import APIFunctions from "../utils/APIFunctions";
import { useTable, useSortBy } from "react-table";
import { BrowserRouter as Router, Link } from "react-router-dom";
import { AlertConfirm, AlertError, AlertSuccess } from "./f_Alerts";
import { unmountComponentAtNode } from "react-dom";
import { checkToken } from "../utils/common";


const PackageManagement = (props) => {

    var myPermissions =
    {
        canView: false,
        canAdd: false,
        canEdit: false,
        canDelete: false,
    }

    const [permissions, setPermissions] = useState(myPermissions);

    const [packages, setPackages] = useState([]);

    const packageRef = useRef();

    packageRef.current = packages;


    useEffect(() => {
        getUserPermissions();
    }, []);


    const getUserPermissions = async () => {
        APIFunctions.getUserPermissions("PackageManagement")
            .then((response) => {
                var _permissions = [];
                var result = response.data;
                result.map((element) => {
                    if (element.pageUrl == "PackageManagement") {
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
                if (view) getPackages();
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

    const getPackages = () => {
        APIFunctions.getAllPackages()
            .then((response) => {
                setPackages(response.data);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    // const refreshList = () => {
    //     getPackages();
    // };

    const openPackage = (id) => {
        if (permissions.canEdit) {
            props.history.push("/EditPackage/" + id);
        }

    }
    const deletePackage = (id, rowIndex) => {
        if (permissions.canDelete) {
            if(!checkToken()) window.location.href = "/";
            AlertConfirm('Are you sure you want to delete ?')
                .then(res => {
                    if (res.value) {
                        APIFunctions.deletePackage(id)
                            .then((response) => {
                                if (response) {
                                    let newPackage = [...packageRef.current];
                                    newPackage.splice(rowIndex, 1);
                                    setPackages(newPackage);
                                    AlertSuccess("Deleted Successfully");
                                }
                                else {
                                    AlertError("Package can't be deleted since it is used by users");
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
                accessor: "nameEn",
            },
            {
                Header: "Description",
                accessor: "descriptionEn",
            },
            {
                Header: "Demo Package",
                accessor: "isDemoPackage",
                Cell: (props) => {
                    return props.row.original.isDemoPackage ? "Yes" : "No";
                },
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
                                onClick={() => openPackage(props.row.original.id)}
                                className=" btn btn-primary btn-xs"
                            >
                                <i
                                    style={{ cursor: "pointer", color: "" }}
                                    className="fas fa-pencil-alt"
                                ></i>
                            </a>
                            <a
                                style={{ display: (permissions.canDelete == true ? "" : "none") }}
                                onClick={() => deletePackage(props.row.original.id, rowIdx)}
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
                data: packages,
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
                                    <h5>Packages</h5>
                                </div>
                                <div className="col-lg-1">
                                <Link to="/EditPackage/0" style={{ display: (permissions.canAdd == true ? "" : "none") }}>
                                    <button type="submit" className="btn btn-primary background-color-2">
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
                                                {/* <Link to="/EditPackage/0" style={{ display: (permissions.canAdd == true ? "" : "none") }}>
                                                    <button
                                                        type="submit"
                                                        className="btn btn-primary"
                                                    >
                                                        New
                                                    </button>
                                                </Link> */}
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

export default PackageManagement;
