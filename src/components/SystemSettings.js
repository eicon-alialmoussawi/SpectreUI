import React, { useState, useEffect, useMemo, useRef } from "react";
import APIFunctions from "../utils/APIFunctions";

import dateFormat from "dateformat";
import { useTable, useSortBy } from "react-table";

const SystemSettings = (props) => {
  const [news, setNews] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");
  const newsRef = useRef();

  newsRef.current = news;

  useEffect(() => {
    retrieveNews();
  }, []);

  const onChangeSearchTitle = (e) => {
    const searchTitle = e.target.value;
    setSearchTitle(searchTitle);
  };

  const retrieveNews = () => {
    APIFunctions.getAllSystemSettings()
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
        refreshList();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const findByTitle = () => {
    APIFunctions.findByTitle(searchTitle)
      .then((response) => {
        setNews(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const newnew = () => {
    props.history.push("/EditSystemSettings/0");
  };

  const opennew = (rowIndex) => {
    const id = newsRef.current[rowIndex].id;

    props.history.push("/EditSystemSettings/" + id);
  };

  const deletenew = (rowIndex) => {
    const id = newsRef.current[rowIndex].id;

    APIFunctions.deleteLatestNews(id)
      .then((response) => {
        let newnews = [...newsRef.current];
        newnews.splice(rowIndex, 1);

        setNews(newnews);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const columns = useMemo(
    () => [
      {
        Header: "Address",
        accessor: "address",
      },
      {
        Header: "Phone Number",
        accessor: "phoneNumber",
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Creation Date",
        accessor: "creationDate",
        Cell: (props) => {
          return dateFormat(props.creationDate, "mmmm dS, yyyy");
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
                onClick={() => opennew(rowIdx)}
                className=" btn btn-primary btn-xs"
              >
                <i
                  style={{ cursor: "pointer", color: "" }}
                  className="fas fa-pencil-alt"
                ></i>
              </a>
              <a
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
          <div className="row mb-2">
            <div className="list row">
              <div className="col-md-8">
                <div className="input-group mb-3" style={{ gap: "10px" }}>
                  <input
                    type="text"
                    className="form-control col-6"
                    placeholder="Search by title"
                    value={searchTitle}
                    onChange={onChangeSearchTitle}
                  />
                  <div className=" ">
                    <button
                      className="btn btn-secondary"
                      type="button"
                      onClick={findByTitle}
                    >
                      Search
                    </button>
                  </div>
                  <div className=""></div>
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
  );
};

export default SystemSettings;
