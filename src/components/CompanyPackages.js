import React, { useState, useEffect, useMemo, useRef } from "react";
import APIFunctions from "../utils/APIFunctions";
import { AlertConfirm, AlertError, AlertSuccess } from "./f_Alerts";
import dateFormat from "dateformat";
import { useTable, useSortBy } from "react-table";
import Modal from "react-bootstrap/Modal";

const CompanyPackages = (props) => {

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
      canAdd: false,
      canEdit: false,
      canDelete: false,
    };
  
    const [permissions, setPermissions] = useState(myPermissions);
    const [selectedItem, setSelectedItem] = useState(mySelected);
    const [companyPackages, setCompanyPackages] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = React.useState("Reply");
    const [saveTxt, setSaveTxt] = useState("Save");
    const companyPackageReg = useRef();

    companyPackageReg.current = companyPackages;

    useEffect(() => {
        getUserPermissions();
    }, []);

    const getUserPermissions = async () => {
      APIFunctions.getUserPermissions("CompanyPackages").then((response) => {
        var _permissions = [];
        var result = response.data;
        result.map((element) => {
          if (element.pageUrl == "CompanyPackages") {
            _permissions.push(element);
          }
        });
  
        var view =
          _permissions.find((element) => {
            return element.action == "View";
          }) === undefined
            ? false
            : true;
        var add =
          _permissions.find((element) => {
            return element.action == "Add";
          }) === undefined
            ? false
            : true;
        var edit =
          _permissions.find((element) => {
            return element.action == "Edit";
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
        obj.canAdd = add;
        obj.canEdit = edit;
        obj.canDelete = _delete;
        setPermissions(obj);
        if (view) getCompanyPackages();
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


    const getCompanyPackages = () => {
        APIFunctions.getCompanyPackageWithDetails()
            .then((response) => {
                setCompanyPackages(response.data);
            })
            .catch((e) => {
                console.log(e);
            });
    };


    const editDetails = (id) => {
        props.history.push("/CompanyPackageDetails/" + id);
    }

    const columns = useMemo(
        () => [
            {
                Header: "Company Name",
                accessor: "companyName",
            },
            {
                Header: "Company Email",
                accessor: "companyEmail",
            },
            {
                Header: "Package",
                accessor: "packageName",

            },
            {
                Header: "Start Date",
                accessor: "startDate",
                Cell: (props) => {
                    const startDate = props.row.original.startDate;
                    return (
                        dateFormat(startDate, "mmm d, yyyy")
                    );
                },
            },
            {
                Header: "End Date",
                accessor: "endDate",
                Cell: (props) => {
                    const endDate = props.row.original.endDate;
                    return (
                        dateFormat(endDate, "mmm d, yyyy")
                    );
                },

            },
            {
                Header: "Is Active",
                accessor: "isActive",
                Cell: (props) => {
                    const isActive = props.row.original.isActive == true ? "Yes" : "No";
                    return (
                        isActive
                    );
                },

            },
            {
                Header: "Actions",
                accessor: "actions",
                Cell: (props) => {
                    const rowIdx = props.row.original.companyPackageId;
                    return (
                        <div>
                            <a
                style={{ display: permissions.canEdit ? "" : "none" }} onClick={() => { editDetails(rowIdx) }}
                                className="btn btn-primary btn-xs">
                                <i style={{ cursor: "pointer", color: "" }}
                                    className="fa fa-edit"></i>
                            </a>
                             {/* <a
                                onClick={() => deletenew(rowIdx)}
                                className="btn btn-danger btn-xs"
                                style={{ margin: "3px" }}>
                                <i style={{ cursor: "pointer", color: "" }}
                                    className="fas fa-trash action"></i>
                            </a> */}

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
                data: companyPackages,
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
                                <h5>Company Packages</h5>

                            </div>
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
            </div>
        </div>
    );
};

export default CompanyPackages;
