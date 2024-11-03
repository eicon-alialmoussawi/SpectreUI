import React, { useState, useEffect, useMemo, useRef } from "react";
import APIFunctions from "../utils/APIFunctions";
import Modal from "react-bootstrap/Modal";
import '../css/CustomStyle.css';
import { useTable, useSortBy } from "react-table";
import { param } from "jquery";
import { checkToken } from "../utils/common";
import { AlertError, AlertSuccess } from "./f_Alerts";
import { BindImageURL } from "../utils/common";
import Select from "react-select";

const HelpService = (props) => {

    const myService = {
        id: 0,
        titleEn: '',
        titleFr: '',
        titleAr: '',
        descriptionEn: '',
        descriptionFr: '',
        descriptionAr: '',
        readMoreEn: '', 
        readMoreAr: '', 
        readMoreFr: '',
        icon: '',
    }
    var myPermissions =
    {
        view: false,
      canAdd: false,
      canEdit: false,
      canDelete: false,
    }

    const [permissions, setPermissions] = useState(myPermissions);
    const [saveTxt, setSaveTxt] = useState("Save");
    const [arrServices, setArrServices] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = React.useState("Feature Details");
    const [edited, setEdited] = useState(myService);

    const [icons, setIncon] = useState([]);
    const [image, setImage] = useState('');
    const serviceRef = useRef();
    

    serviceRef.current = arrServices;

    
   
    useEffect(() => {
        getUserPermissions();
    }, []);
    
    const getUserPermissions = async () => {
          APIFunctions.getUserPermissions("HelpService")
              .then((response) => {
                  var _permissions = [];
                  var result = response.data;
                  result.map((element) => {
                      if (element.pageUrl == "HelpService") {
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
                  obj.canAdd = add;
                  obj.canEdit = edit;
                  obj.canDelete = _delete; 

                  setPermissions(obj);
                  if (view) getServices();
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

    useEffect(() => {
        APIFunctions.getAllIcons()
            .then((resp) => resp)
            .then((resp) => setIncon(resp.data));
    }, []);


    const getServices = () => {
        APIFunctions.getAllHelpServices()
            .then((response) => {
                setArrServices(response.data);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    // const refreshList = () => {
    //     getServices();
    // };


    const edit = (id) => {
        if(!checkToken()) window.location.href = "/";
            var data = serviceRef.current;
            var obj = new Object();
            data.map((val, x) => {
                if (val.id == id)
                    obj = val;
            });

            //console.log(obj);
            if (obj != null) {
                setImage(obj.icon);
                setEdited(obj);
                setIsOpen(true);
            }

    }

    const hideModal = () => {
        setIsOpen(false);
    };

    const modalLoaded = () => {
        setTitle("Service Details");
    };


    const handlIconChange = (selectedOptions) => {
        var _edited = edited;
        _edited.icon = selectedOptions.icon1;
        setEdited(_edited)
        //setCurrentPackage({ ...currentPackage, imageUrl: selectedOptions.icon1 })
        console.log(edited);

    };

    const viewResource = () => {
        var image = BindImageURL(edited.icon);
        window.open(image);
    }

    const save = () => {

        setSaveTxt("Saving...");

        if (edited.titleEn == "" || edited.titleEn == null
            || edited.titleAr == "" || edited.titleAr == null
            || edited.titleFr == "" || edited.titleFr == null
            || edited.descriptionEn == "" || edited.descriptionEn == null
            || edited.descriptionFr == "" || edited.descriptionFr == null
            || edited.descriptionAr == "" || edited.descriptionAr == null
            || edited.readMoreEn == "" || edited.readMoreEn == null
            || edited.readMoreFr == "" || edited.readMoreFr == null
            || edited.readMoreAr == "" || edited.readMoreAr == null) {
            AlertError("Please enter required fields");
            setSaveTxt("Save");
            return;
        }

        APIFunctions.saveHelpServices(edited)
            .then((response) => {
                if (!response.data) {
                    AlertError("Something went wrong");
                    setSaveTxt("Save");
                    return;
                }
                else {
                    AlertSuccess("Operation done successfully");
                    getServices();
                    setTimeout(() => { setIsOpen(false); }, 300);
                    setSaveTxt("Save");
                }

            })
            .catch((e) => {
                console.log(e);
            });
    }


    const columns = useMemo(
        () => [
            {
                Header: "Title In English",
                accessor: "titleEn",
            },
            {
                Header: "Title In Arabic",
                accessor: "titleAr",
            },
            {
                Header: "Title In French",
                accessor: "titleFr",
            },
            {
                Header: "Description In English",
                accessor: "descriptionEn",
            },
            {
                Header: "Description In Arabic",
                accessor: "descriptionAr",
            },
            {
                Header: "Description In French",
                accessor: "descriptionFr",
            },
            {
                Header: "Actions",
                accessor: "actions",
                Cell: (props) => {
                    return (
                        <div>
                            <a style={{ display: (permissions.canEdit == true ? "" : "none") }} onClick={() => edit(props.row.original.id)}
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
                data: arrServices,
            },
            useSortBy
        );

    return (
        <div className="content-wrapper">
            <div className="content-header">
                <div className="container-fluid">
                    <div class="card">
                        <div className="card-header">
                            <h2>Help Services</h2>
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
                        <div class="col-6 bottommargin-sm">
                            <label for="template-contactform-name">Title In English<small className="text-danger">*</small></label>
                            <input
                                type="text"
                                id="txtNameEn"
                                name="template-contactform-name"
                                value={edited.titleEn}
                                onChange={(e) => { setEdited({ ...edited, titleEn: e.target.value }) }}
                                class="form-control required"
                            />
                        </div>
                        <div class="col-6 bottommargin-sm">
                            <label for="template-contactform-name">Title In Arabic<small className="text-danger">*</small></label>
                            <input
                                type="text"
                                id="txtNameEn"
                                name="template-contactform-name"
                                value={edited.titleAr}
                                onChange={(e) => { setEdited({ ...edited, titleAr: e.target.value }) }}
                                class="form-control required"
                            />
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div class="col-6 bottommargin-sm">
                            <label for="template-contactform-name">Title In French<small className="text-danger">*</small></label>
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


                    <div class="col-12 bottommargin-sm">
                        <label for="template-contactform-name">Description In English<small className="text-danger">*</small></label>
                        <textarea
                            type="text"
                            id="txtNameEn"
                            name="template-contactform-name"
                            style={{ resize: "none" }}
                            value={edited.descriptionEn}
                            onChange={(e) => { setEdited({ ...edited, descriptionEn: e.target.value }) }}
                            class="form-control required"
                        />
                    </div>
                    <div class="col-12 bottommargin-sm">
                        <label for="template-contactform-name">Description In Arabic<small className="text-danger">*</small></label>
                        <textarea
                            type="text"
                            id="txtNameEn"
                            name="template-contactform-name"
                            style={{ resize: "none" }}
                            value={edited.descriptionAr}
                            onChange={(e) => { setEdited({ ...edited, descriptionAr: e.target.value }) }}
                            class="form-control required"
                        />
                    </div>
                    <div class="col-12 bottommargin-sm">
                        <label for="template-contactform-name">Description In French<small className="text-danger">*</small></label>
                        <textarea
                            type="text"
                            id="txtNameEn"
                            name="template-contactform-name"
                            style={{ resize: "none" }}
                            value={edited.descriptionFr}
                            onChange={(e) => { setEdited({ ...edited, descriptionFr: e.target.value }) }}
                            class="form-control required"
                        />
                    </div>

                    <div class="col-12 bottommargin-sm">
                        <label for="template-contactform-name">Read More In English<small className="text-danger">*</small></label>
                        <textarea
                            type="text"
                            id="txtNameEn"
                            name="template-contactform-name"
                            style={{ resize: "none" }}
                            value={edited.readMoreEn}
                            onChange={(e) => { setEdited({ ...edited, readMoreEn: e.target.value }) }}
                            class="form-control required"
                        />
                    </div>
                    <div class="col-12 bottommargin-sm">
                        <label for="template-contactform-name">Read More In Arabic<small className="text-danger">*</small></label>
                        <textarea
                            type="text"
                            id="txtNameEn"
                            name="template-contactform-name"
                            style={{ resize: "none" }}
                            value={edited.readMoreAr}
                            onChange={(e) => { setEdited({ ...edited, readMoreAr: e.target.value }) }}
                            class="form-control required"
                        />
                    </div>
                    <div class="col-12 bottommargin-sm">
                        <label for="template-contactform-name">Read More In French<small className="text-danger">*</small></label>
                        <textarea
                            type="text"
                            id="txtNameEn"
                            name="template-contactform-name"
                            style={{ resize: "none" }}
                            value={edited.readMoreFr}
                            onChange={(e) => { setEdited({ ...edited, readMoreFr: e.target.value }) }}
                            class="form-control required"
                        />
                    </div>
                    <div className="form-group">
                        <div className="col-lg-6 bottommargin-sm" >
                        <label>Icon</label>
                            <Select
                                id="ddlIcons"
                                name="id"
                                value={icons.find((obj) => {
                                    return obj.icon1 == edited.icon;
                                })}
                                getOptionLabel={(option) => <a> <i class={option.icon1} />  {option.icon1}</a>}
                                getOptionValue={(option) => option.id}
                                options={icons}
                                onChange={handlIconChange}
                                ></Select>
                           
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

export default HelpService;
