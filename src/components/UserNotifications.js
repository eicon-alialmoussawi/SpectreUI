import React, { useState, useEffect, useMemo, useRef } from "react";
import APIFunctions from "../utils/APIFunctions";

import { useTable, useSortBy } from "react-table";
import { param } from "jquery";
import { AlertError, AlertSuccess } from "./f_Alerts";

const UserNotifications = (props) => {


    const [notifications, setNotifications] = useState([]);

    const notRef = useRef();

    notRef.current = notifications;

    useEffect(() => {
        retrieveParams();
    }, []);

    const retrieveParams = () => {
        APIFunctions.getUserNotifications("")
            .then((response) => {
                console.log(response.data)
                setNotifications(response.data);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const refreshList = () => {
        retrieveParams();
    };

    const goToUrl = (pageUrl, id) => {
        APIFunctions.setNotificationAsViewed(id)
        .then((response) => {
  
        })
        .catch((e) => {
          console.log(e);
        });
        
        props.history.push(pageUrl);
    }

    const columns = useMemo(
        () => [
            {
                Header: "Text",
                accessor: "textEn",
            },
            {
                Header: "Description",
                accessor: "descriptionEn",
            },
            {
                Header: "Actions",
                accessor: "actions",
                Cell: (props) => {
                    return (
                        <div>
                            <a className=" btn btn-view btn-xs"
                                style={{ display: props.row.original.url == "" ? "none" : "" }}
                                onClick={() => { goToUrl(props.row.original.url, props.row.original.id) }}>
                                <i style={{ cursor: "pointer", color: "" }}
                                    className="fas fa-eye"></i>
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
                data: notifications,
            },
            useSortBy
        );

    return (
        <div className="content-wrapper">
            <div className="content-header">
                <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="list row">
                            <div className="col-md-12">
                                <div className="input-group mb-3" style={{ gap: "10px" }}>

                                </div>
                                <div className="col-md-12">
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
    );
};

export default UserNotifications;
