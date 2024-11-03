import React, { useState, useEffect, useMemo, useRef } from "react";
import APIFunctions from "../utils/APIFunctions";

import { useTable, useSortBy } from "react-table";
import { AlertError, AlertSuccess } from "./f_Alerts";

const Parameters = (props) => {
    var myPermissions = {
      canView: false,
    };
  
    const [permissions, setPermissions] = useState(myPermissions);
    const [params, setParams] = useState([]);

    const paramRef = useRef();

    paramRef.current = params;

    useEffect(() => {
        getUserPermissions();
    }, []);

    const getUserPermissions = async () => {
      APIFunctions.getUserPermissions("Parameters").then((response) => {
        var _permissions = [];
        var result = response.data;
        result.map((element) => {
          if (element.pageUrl == "Parameters") {
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
        if (view) retrieveParams();
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


    const retrieveParams = () => {
        APIFunctions.getAllParameters()
            .then((response) => {
                setParams(response.data);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const save = (id) => {


        var _params = paramRef.current;

        var myRow = _params.find((element) => {
            if (element.id == id)
                return element;
        })


        console.log(myRow.value)
        APIFunctions.updateParams(id, myRow.value)
            .then((response) => {
                if (response.data) {
                    AlertSuccess("Operation done successfully");
                    return;
                }
                else {
                    AlertError("Something went wrong");
                    return;
                }
            })
            .catch((e) => {
                console.log(e);
            });
    }

    const update = (value, id) => {

        var _params = paramRef.current;
        var updatedArray = _params.map((el) => {
            if (el.id == id)
                el.value = value;

            return el;
        });


        setParams(updatedArray);
    }



    const columns = useMemo(
        () => [
            {
                Header: "Name",
                accessor: "nameEn",
            },
            {
                Header: "Value",
                accessor: "value",
                Cell: (props) => {
                    return (
                        <div>
                            <input className="form-control"
                                type="number"
                                value={props.row.original.value}
                                onChange={(e) => update(e.target.value, props.row.original.id)}
                                disabled={!permissions.canEdit} />
                        </div>
                    );
                },
            },
            {
                Header: "Actions",
                accessor: "actions",
                Cell: (props) => {
                    return (
                        <div>
                            <a
                                style={{ display: permissions.canEdit ? "" : "none" }}
                                onClick={() => save(props.row.original.id)}
                                className=" btn btn-primary btn-xs"
                            >
                                <i
                                    style={{ cursor: "pointer", color: "" }}
                                    className="fas fa-save"
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
                data: params,
            },
            useSortBy
        );

    return (
        <div className="content-wrapper">
            <div className="content-header">
                <div className="container-fluid">
                    <div class="card">
                        <div className="card-header">
                            <h2>Parameters</h2>
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
        </div>

    );
};

export default Parameters;
