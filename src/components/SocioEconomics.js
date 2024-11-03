import React, { useState, useEffect, useMemo, useRef } from "react";
import APIFunctions from "../utils/APIFunctions";
import { withSwalInstance } from "sweetalert2-react";
import swal from "sweetalert";
import dateFormat from "dateformat";
import { useTable } from "react-table";
import { ReactExcel, readFile, generateObjects } from "@ramonak/react-excel";

import Select from "react-select";
import { AlertConfirm } from "../components/f_Alerts";
const SocioEconomics = (props) => {
  const [SocioEconomics, setSocioEconomics] = useState([]);
  const SocioEconomicsRef = useRef();
  const [selectedFile, setSelectedFile] = useState(null);
  const SweetAlert = withSwalInstance(swal);

  const [resultSources, emplistSources] = useState([]);
  const [sourceId, setSourceId] = useState("");
  const [currentItemToDelete, setItemToDelete] = useState(null);
  const [alertStatus, setAlertStatus] = React.useState(false);
  const [initialData, setInitialData] = useState(undefined);
  const [currentSheet, setCurrentSheet] = useState({});
  const handleUpload = (event) => {
    const file = event.target.files[0];
    //read excel file
    readFile(file)
      .then((readedData) => setInitialData(readedData))
      .then(console.log(currentSheet))
      .catch((error) => console.error(error));

    // saveImportResult();
  };
  useEffect(() => {
    APIFunctions.GetLookupsByParentId("SOC_SRC")
      .then((resp) => resp)
      .then((resp) => emplistSources(resp.data));
  }, []);
  const saveImportResult = () => {
    const result = generateObjects(currentSheet);
    var FinalArray = [];
    console.log(result);
    for (var i = 0, l = result.length; i < l; i++) {
      var CurrentKeys = Object.keys(result[i]);
      for (var k = 0; k < CurrentKeys.length; k++) {
        if (CurrentKeys[k] != "CountryName" && CurrentKeys[k] != "Iso") {
          var ob = new Object();
          ob.Year = parseInt(CurrentKeys[k]);
          if (
            result[i][CurrentKeys[k]] != null &&
            result[i][CurrentKeys[k]] != ""
          )
            ob.Value = parseFloat(result[i][CurrentKeys[k]]);
          else ob.Value = 0;
          ob.Iso = result[i]["Iso"];
          ob.sourceId = sourceId;
          FinalArray.push(ob);
        }
      }
    }
    console.log(FinalArray);

    APIFunctions.importSocioEconomics(FinalArray)
      .then((response) => {
        alert("The SocioEconomic details are imported successfully!");
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
  };
  SocioEconomicsRef.current = SocioEconomics;
  useEffect(() => {
    retrieveSocioEconomics();
  }, []);

  const retrieveSocioEconomics = () => {
    APIFunctions.getAllSocioEconomicsForView()
      .then((response) => {
        setSocioEconomics(response.data);
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleChangeSource = (selectedOptions) => {
    setSourceId(selectedOptions.id);
  };
  const newItem = () => {
    props.history.push("/EditSocioEconomics/0");
  };
  const openSocioEconomic = (rowIndex) => {
    const id = SocioEconomicsRef.current[rowIndex].id;

    props.history.push("/EditSocioEconomics/" + id);
  };
  const handleChangeInAlert = (rowIndex) => {
    setAlertStatus(true);
    console.log(rowIndex);
    setItemToDelete(rowIndex);
  };
  const deleteSocioEconomic = (row) => {
    const id = SocioEconomicsRef.current[row].id;
    AlertConfirm("Are you sure you want to delete ?").then((res) => {
      if (res.value) {
        console.log(id);
        APIFunctions.removeSocioEconomic(id)
          .then((response) => {
            let newSocioEconomics = [...SocioEconomicsRef.current];
            newSocioEconomics.splice(row, 1);

            setSocioEconomics(newSocioEconomics);
          })
          .catch((e) => {
            console.log(e);
          });
      }
    });
  };
  const refreshList = () => {
    retrieveSocioEconomics();
  };

  const removeAllSocioEconomics = () => {
    APIFunctions.removeAll()
      .then((response) => {
        refreshList();
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const columns = useMemo(
    () => [
      {
        Header: "Year",
        accessor: "year",
      },
      {
        Header: "Country",
        accessor: "countryName",
      },
      {
        Header: "Source",
        accessor: "source",
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
                onClick={() => openSocioEconomic(rowIdx)}
                className=" btn btn-primary btn-xs"
              >
                <i
                  style={{ cursor: "pointer", color: "" }}
                  className="fas fa-pencil-alt"
                ></i>
              </a>
              <a
                onClick={() => {
                  deleteSocioEconomic(rowIdx);
                }}
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
    useTable({
      columns,
      data: SocioEconomics,
    });

  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <div className=" row">
            <div className="col-2 row">
              <button
                type="submit"
                className="btn btn-primary"
                onClick={() => newItem()}
              >
                New
              </button>
            </div>
            <input
              className="col-2"
              type="file"
              accept=".xlsx"
              onChange={handleUpload}
            />
            <div style={{ display: "none" }}>
              <ReactExcel
                initialData={initialData}
                onSheetUpdate={(currentSheet) => setCurrentSheet(currentSheet)}
                activeSheetClassName="active-sheet"
                reactExcelClassName="react-excel "
              />{" "}
            </div>
            <button
              className="btn btn-success col-2"
              onClick={saveImportResult}
            >
              Import Excel
            </button>{" "}
            <div className="form-group col-3">
              <label htmlFor="description">Source</label>
              <div className="col-md-12">
                <Select
                  id="ddlSource"
                  name="sourceId"
                  value={resultSources.find((obj) => {
                    return obj.id === sourceId;
                  })}
                  getOptionLabel={(option) => option.name}
                  getOptionValue={(option) => option.id}
                  options={resultSources}
                  onChange={handleChangeSource}
                ></Select>
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
                          {column.render("Header")}
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
            <div className="col-md-8"></div>
          </div>
        </div>
      </div>{" "}
      <div>
        <SweetAlert
          show={alertStatus}
          title="!"
          showCancelButton
          cancelButtonClass="btn btn-danger btn-xs"
          confirmButtonText='<i class="btn-danger"></i> Yes'
          text="Are You Sure you want to delete?"
          onConfirm={(e) => {
            console.log("confirm");
            setAlertStatus(false);
          }}
          onCancel={() => {
            console.log("cancel");
          }}
          confirmButtonColor="#3085d6"
        />
      </div>
    </div>
  );
};

export default SocioEconomics;
