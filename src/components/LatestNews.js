import Swal from "sweetalert2";
import React, { useState, useEffect, useMemo, useRef } from "react";
import APIFunctions from "../utils/APIFunctions";
import { AlertConfirm, AlertError, AlertSuccess } from "./f_Alerts";
import dateFormat from "dateformat";
import { checkToken } from "../utils/common";
import { useTable, useSortBy } from "react-table";

const LatestNews = (props) => {
  var myPermissions = {
    canView: false,
    canAdd: false,
    canEdit: false,
    canDelete: false,
  };

  const [permissions, setPermissions] = useState(myPermissions);
  const [news, setNews] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");
  const newsRef = useRef();

  newsRef.current = news;

  useEffect(() => {
    getUserPermissions();
  }, []);

  const getUserPermissions = async () => {
    APIFunctions.getUserPermissions("LatestNews").then((response) => {
      var _permissions = [];
      var result = response.data;
      result.map((element) => {
        if (element.pageUrl == "LatestNews") {
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
      if (view) retrieveNews();
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

  const onChangeSearchTitle = (e) => {
    const searchTitle = e.target.value;
    setSearchTitle(searchTitle);
  };

  const retrieveNews = () => {
    APIFunctions.getLatestNews()
      .then((response) => {
        setNews(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const refreshList = () => {
    retrieveNews();
  };

  const removeAllnews = () => {
    APIFunctions.removeAll()
      .then((response) => {
        AlertSuccess("Operation done successfully");
        refreshList();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const newnew = () => {
    props.history.push("/EditLatestNews/0");
  };

  const opennew = (rowIndex) => {
    const id = newsRef.current[rowIndex].id;

    props.history.push("/EditLatestNews/" + id);
  };

  const deletenew = (rowIndex) => {
    if(!checkToken()) window.location.href = "/";
    AlertConfirm("Are you sure you want to delete ?").then((res) => {
      if (res.value) {
        const id = newsRef.current[rowIndex].id;

        APIFunctions.deleteLatestNews(id)
          .then((response) => {
            AlertSuccess("Operation done successfully");
            let newnews = [...newsRef.current];
            newnews.splice(rowIndex, 1);

            setNews(newnews);
          })
          .catch((e) => {
            console.log(e);
          });
      }
    });
  };

  const columns = useMemo(
    () => [
      {
        Header: "Title",
        accessor: "titleEn",
      },
      {
        Header: "Description",
        accessor: "descriptionEn",
      },
      {
        Header: "Creation Date",
        accessor: "creationDate",
        Cell: (props) => {
          return dateFormat(props.row.values.creationDate, "mmmm dS, yyyy");
        },
      },

      {
        Header: "Added on Public Page",
        accessor: "isPublished",
        Cell: (props) => {
          console.log(props);
          return props.row.values.isPublished ? "Yes" : "No";
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
                style={{ display: permissions.canEdit ? "" : "none" }}
                onClick={() => opennew(rowIdx)}
                className=" btn btn-primary btn-xs"
              >
                <i
                  style={{ cursor: "pointer", color: "" }}
                  className="fas fa-pencil-alt"
                ></i>
              </a>
              <a
                style={{ display: permissions.canDelete ? "" : "none" }}
                onClick={() => deletenew(rowIdx)}
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
        data: news,
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
                  <h5>Latest News</h5>
                </div>
                <div className="col-lg-1">
                  <button
                    style={{
                      display: permissions.canAdd ? "" : "none",
                    }}
                    type="submit"
                    className="btn btn-primary background-color-2"
                    onClick={newnew}
                  >
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
                      <div className="">
                        {/* <button
                        type="submit"
                        className="btn btn-primary"
                        onClick={() => newnew()}
                      >
                        New
                      </button> */}
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

export default LatestNews;
