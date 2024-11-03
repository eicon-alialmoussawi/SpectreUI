import React, { useState, useEffect, useMemo, useRef, Component } from "react";
import APIFunctions from "../utils/APIFunctions";
import { getLang, BindImageURL } from "../utils/common";
import { AlertError, AlertSuccess, AlertConfirm, LoadingAlert } from "./f_Alerts";
import Select from "react-select";
import { Form } from "react-bootstrap";
import { Steps } from 'rsuite';
import 'bs-stepper/dist/css/bs-stepper.min.css';
import Stepper from 'bs-stepper';
import 'bs-stepper/dist/css/bs-stepper.min.css';
import '../css/CustomStyle.css';
import $, { event } from 'jquery';
import dateFormat from "dateformat";
import { MultiSelect } from "react-multi-select-component";
import { validateEmail } from '../utils/common.js';
import { useTable, useSortBy } from "react-table";
import Modal from "react-bootstrap/Modal";


const EditPreRegistration = (props) => {


    var stepper = null;

    const _users = [];
    const myUser = {
        id: 0,
        name: '',
        email: '',
        userName: '',
        password: '',
    }

    const myPreRegistration = {
        id: 0,
        name: "",
        email: "",
        phoneNumber: "",
        companyName: "",
        message: "",
        preferredPackage: 0,
        isDeleted: false,
        isViewed: false,
        creationDate: null
    };

    const myCompany = {
        id: 0,
        name: "",
        email: "",
        phoneNumber: "",
        isDeleted: false,
        logo: ''
    };

    const myCompanyPackage = {
        id: 0,
        packageId: 0,
        companyId: 0,
        startDate: null,
        endDate: null,
        price: '',
        currency: '',
        numberOfUsers: '',
        isActive: true,
        isDeleted: false
    };

    var myPermissions =
    {
        canView: false,
        canAdd: false,
        canEdit: false,
        canDelete: false,
    }

    const [permissions, setPermissions] = useState(myPermissions);
    const [user, setUser] = useState([]);
    const [userArr, setTheArray] = useState([]);
    const [tblData, setTableDats] = useState([]);
    const [preRegistration, setPreRegistration] = useState(myPreRegistration);
    const [company, setCompany] = useState(myCompany);
    const [displayStep1, setDisplayStep1] = useState(true);
    const [resultPackage, setResultPackage] = useState([]);
    const [packagePermissions, setPackagePermissions] = useState([]);
    const [currencyResult, setCurrencyResult] = useState([]);
    const [resultCountry, emplistCountry] = useState([]);
    const [options, setoptions] = useState([]);
    const [selected, setSelected] = useState([]);
    const [companyPackage, setCompanyPackage] = useState(myCompanyPackage);
    const [userPackagePermissions, setUserPackagePermissions] = useState([]);
    const [save, setSave] = useState("Save");
    const [saveTxt, setSaveTxt] = useState("Save");
    const [isOpen, setIsOpen] = useState(false);
    const [isOpen2, setIsOpen2] = useState(false);
    const [title, setTitle] = React.useState("Users");
    const [errorUsers, setErrorUsers] = React.useState([]);

    const [image, setImage] = useState('');
    const [displayView, setDisplayView] = useState(false);

    useEffect(() => {
        stepper = new Stepper(document.querySelector('#stepper1'), {
            linear: false,
            animation: true
        });
        $('#test-l-1').removeClass('dstepper-none');
    }, []);

    useEffect(() => {
        APIFunctions.getAllCountries()
            .then((resp) => resp)
            .then((resp) => bindOptions(resp.data));
    }, []);

    const bindOptions = (data) => {
        var arr = [];
        for (var i = 0, l = data.length; i < l; i++) {
            var ob = new Object();
            ob.label = data[i].nameEn;
            ob.value = data[i].countryId;
            arr.push(ob);
        }
        setoptions(arr);
    };

        const onFileChange2 = (event) => {

        if (event.target.files.length == 0) {
            return;
        }
        LoadingAlert("Show");
        const formData = new FormData();
        formData.append(
            "file",
            event.target.files[0]
        );

        APIFunctions.uploadMedia(formData)
            .then((response) => {
                var obj = company;
                obj.logo = response.data;
                setImage(response.data);
                setDisplayView(true);
                setCompany(obj);
                LoadingAlert("hide");
            })
            .catch((e) => {
                console.log(e);
                LoadingAlert("hide");
            });
    }



    const setNumberOfUsers = (e) => {
        setCompanyPackage({ ...companyPackage, numberOfUsers: e.target.value, });

    }

    const viewResource = () => {
        var img = BindImageURL(image);
        window.open(img);
    }


    function Table({ columns, data }) {
        // Use the state and functions returned from useTable to build your UI
        const {
            getTableProps,
            getTableBodyProps,
            headerGroups,
            rows,
            prepareRow,
        } = useTable({
            columns,
            data,
        })

        // Render the UI for your table
        return (
            <table {...getTableProps()} style={{ width: "100%" }}>
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th style={{ border: "1px solid #dee2e6", padding: "5px" }} {...column.getHeaderProps()}>{column.render('Header')}</th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {rows.map((row, i) => {
                        prepareRow(row)
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map(cell => {
                                    return <td {...cell.getCellProps()} style={{ border: "1px solid #dee2e6", padding: "5px" }} >{cell.render('Cell')}</td>
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        )
    }

    useEffect(() => {
        APIFunctions.getPublicPackages()
            .then((resp) => resp)
            .then((resp) => setResultPackage(resp.data));
    }, []);

    useEffect(() => {
        APIFunctions.GetLookupsByParentId("CURRENCY")
            .then((resp) => resp)
            .then((resp) => setCurrencyResult(resp.data));
    }, []);


    const handlPackageChange = (selectedOptions) => {
        APIFunctions.getPackagePermissionsById(selectedOptions.id)
            .then((resp) => resp)
            .then((resp) => setPackagePermissions(resp.data));

        var _companyPackage = companyPackage;
        _companyPackage.packageId = selectedOptions.id;
        setCompanyPackage(_companyPackage);

        setTimeout(() => { saveClientPermissions() }, 300)
        renderPackagePermissions();

        //setPreRegistration({ ...preRegistration, preferredPackage: selectedOptions.id })
    };




    useEffect(() => {
        getUserPermissions()
    }, []);

    const getUserPermissions = async () => {
        APIFunctions.getUserPermissions("CustomerRegistrations").then((response) => {
          var _permissions = [];
          var result = response.data;
          result.map((element) => {
            if (element.pageUrl == "CustomerRegistrations") {
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
          if(props.match.params.id != 0) {
            if (edit) {
                getPreRegistration(props.match.params.id);
                setDisplayStep1(true);
            }
            else {
              AlertError(
                "You do not have the permission to edit the customer!",
                function () {
                  props.history.push("/Dashboard");
                }
              );
            }
          }
    
          if(props.match.params.id == 0) {
            if (!add) 
              AlertError(
                "You do not have the permission to add new customer!",
                function () {
                  props.history.push("/Dashboard");
                }
              );
            else 
                setDisplayStep1(false);
          }
        });
      };


    const getPreRegistration = (id) => {
        APIFunctions.getPreRegistrationDetailsWithId(id)
            .then((response) => {
                setPreRegistration(response.data);
            })
            .catch((e) => {
                console.log(e);
            });
    }


    const cancel = () => {
        props.history.push("/CustomerRegistrations");
    }

    const handleCurrencyChange = (selectedOptions) => {
        var _companyPackage = companyPackage;
        _companyPackage.currency = selectedOptions.id;
        setCompanyPackage(_companyPackage);
    }

    const saveClientPermissions = () => {

        var _clientPermissions = [];
        packagePermissions.map((val, idx) => {
            var item = new Object();
            item.id = 0;
            item.companyPackageId = 0;
            item.packagePagePermissionId = val.id;
            item.countryId = 0;
            item.isDeleted = false;

            _clientPermissions.push(item);

        });
        setUserPackagePermissions(_clientPermissions);
    }

    const openModal = (e) => {
        e.preventDefault();
        setIsOpen(true);
    }

    const hideModal = () => {
        setUser(myUser);
        setIsOpen(false);
    };

    const hideModal2 = () => {
        setIsOpen2(false);
    };

    const modalLoaded = () => {
        setTitle("Users");
    };

    const modalLoaded2 = () => {
        setTitle("Unaccepted Users");
    };


    useEffect(() => {
        setTheArray(userArr)
    }, []);


    const checkIfUserNameExists = (userName) => {
        var valid = true;
        var _users = userArr;

        _users.map((val, idx) => {
            if (val.userName == userName) {
                valid = false;
                return;
            }

        });

        return valid;
    }

    const checkIfEmailExists = (email) => {
        var valid = true;
        var _users = userArr;

        _users.map((val, idx) => {
            if (val.email == email) {
                valid = false;
                return;
            }

        });

        return valid;
    }

    const saveUser = () => {

        setSaveTxt("Saving...");
        if (user.name == "" || user.name == null
            || user.email == "" || user.email == null
            || user.userName == "" || user.userName == null
            || user.password == "" || user.password == null) {
            AlertError("Please fill required fields");
            setSaveTxt("Save");
            return;
        }

        if (!checkIfUserNameExists(user.userName)) {
            AlertError("Another user with the same username exists");
            setSaveTxt("Save");
            return;
        }

        if (!checkIfEmailExists(user.email)) {
            AlertError("Another user with the same email exists");
            setSaveTxt("Save");
            return;
        }

        if (!validateEmail(user.email)) {
            AlertError("Please enter a valid email");
            setSaveTxt("Save");
            return;
        }


        var result = userArr;
        result.push(user);
        setUser(myUser);
        setTheArray(result);
        setIsOpen(false);
        setSaveTxt("Save");
    }


    const _delete = (index) => {
        AlertConfirm('Are you sure you want to delete ?')
            .then(res => {
                if (res.value) {
                    var _result = userArr;

                    _result.splice(index, 1);

                    setTheArray([..._result]);

                }
            })
    }




    var columns = useMemo(
        () => [
            {
                Header: "Name",
                accessor: "name",
            },
            {
                Header: "Email",
                accessor: "email",
            },
            {
                Header: "Username",
                accessor: "userName",
            },
            {
                Header: "Actions",
                accessor: "actions",
                Cell: (props) => {
                    const rowIdx = props.row.id;
                    return (
                        <div>
                            <a
                                onClick={() => _delete(rowIdx)}
                                className=" btn btn-danger btn-xs"
                            >
                                <i
                                    style={{ cursor: "pointer", color: "" }}
                                    className="fas fa-trash"
                                ></i>
                            </a>
                        </div>
                    );
                },
            },
        ],
        []
    );

    const data = React.useMemo(() => userArr, [])
    const _columns = React.useMemo(() => columns, []);

    const renderHtml = () => {

        if (props.match.params.id != 0) {
            return (<div id="stepper1" class="bs-stepper">
                <div class="bs-stepper-header">
                    <div id="step1" class="step active" data-target="#test-l-1">
                        <button class="step-trigger" aria-selected='true' >
                            <span class="bs-stepper-circle">1</span>
                            <span class="bs-stepper-label">Pre-Registration Information</span>
                        </button>
                    </div>
                    <div id="step2" class="line"></div>
                    <div class="step" data-target="#test-l-2">
                        <button class="step-trigger">
                            <span class="bs-stepper-circle">2</span>
                            <span class="bs-stepper-label">Company Information</span>
                        </button>
                    </div>
                    <div class="line"></div>
                    <div class="step" data-target="#test-l-3">
                        <button class="step-trigger" aria-selected='true'>
                            <span class="bs-stepper-circle">3</span>
                            <span class="bs-stepper-label">Package Details</span>
                        </button>
                    </div>
                    <div class="line"></div>
                    <div class="step" data-target="#test-l-4">
                        <button class="step-trigger" aria-selected='true'>
                            <span class="bs-stepper-circle">4</span>
                            <span class="bs-stepper-label">Users</span>
                        </button>
                    </div>
                </div>
                <div class="bs-stepper-content">

                    <div id="test-l-1" class="card content fade dstepper-block active" style={{ padding: "10px" }}>
                        <div className="row">
                            <div className="col-6 bottommargin-sm" style={{ display: "flex!important" }}>
                                <div className="form-group">
                                    <label>Client Name</label>
                                    <input type="text"
                                        className="form-control "
                                        value={preRegistration.name}
                                        style={{ width: "100%" }}
                                        disabled="disabled"
                                    />
                                </div>
                            </div>
                            <div className="col-6 bottommargin-sm" style={{ display: "flex!important" }}>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input type="text"
                                        className="form-control"
                                        style={{ width: "100%" }}
                                        disabled="disabled"
                                        value={preRegistration.email}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                        <div className="col-6 bottommargin-sm" style={{ display: "flex!important" }}>
                                <div className="form-group">
                                    <label>Company Name</label>
                                    <input type="text"
                                        className="form-control"
                                        style={{ width: "100%" }}
                                        disabled="disabled"
                                        value={preRegistration.companyName}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-6 bottommargin-sm" style={{ display: "flex!important" }}>
                                <div className="form-group">
                                    <label>Phone Number</label>
                                    <input type="text"
                                        className="form-control "
                                        value={preRegistration.phoneNumber}
                                        style={{ width: "100%" }}
                                        disabled="disabled"
                                    />
                                </div>
                            </div>
                            <div className="col-6 bottommargin-sm" style={{ display: "flex!important" }}>
                                <div className="form-group">
                                    <label>Requested Package</label>
                                    <input type="text"
                                        className="form-control"
                                        style={{ width: "100%" }}
                                        disabled="disabled"
                                        value={preRegistration.packageName}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-6 bottommargin-sm" style={{ display: "flex!important" }}>
                                <div className="form-group">
                                    <label>Message</label>
                                    <textarea type="text"
                                        className="form-control "
                                        value={preRegistration.message}
                                        style={{
                                            width: "100%", resize: "none",
                                            height: "144px",
                                            overflowY: "scroll"
                                        }}
                                        disabled="disabled"
                                    // onChange={(e) => setCurrentPackage({ ...currentPackage, nameEn: e.target.value, })}
                                    />
                                </div>
                            </div>
                            <div className="col-6 bottommargin-sm" style={{ display: "flex!important" }}>
                                <div className="form-group">
                                    <label>Creation Date</label>
                                    <input type="text"
                                        className="form-control"
                                        style={{ width: "100%" }}
                                        disabled="disabled"
                                        value={dateFormat(preRegistration.creationDate, "yyyy-mm-dd")}
                                    // value={currentPackage.nameFr}
                                    // onChange={(e) => setCurrentPackage({ ...currentPackage, nameFr: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>                                                        {/* <button class="btn btn-primary" onClick={() => stepper.next()}>Next</button> */}

                    </div>
                    <div id="test-l-2" class="card content" style={{ padding: "10px" }}>
                        <div className="row">
                            <div className="col-6 bottommargin-sm" style={{ display: "flex!important" }}>
                                <div className="form-group">
                                    <label>Company Name<small className="text-danger">*</small></label>
                                    <input type="text"
                                        className="form-control "
                                        value={company.name}
                                        onChange={(e) => setCompany({ ...company, name: e.target.value, })}
                                    />
                                </div>
                            </div>
                            <div className="col-6 bottommargin-sm" style={{ display: "flex!important" }}>
                                <div className="form-group">
                                    <label>Company Email<small className="text-danger">*</small></label>
                                    <input type="text"
                                        className="form-control"
                                        style={{ width: "100%" }}
                                        value={company.email}
                                        onChange={(e) => setCompany({ ...company, email: e.target.value, })}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-6 bottommargin-sm" style={{ display: "flex!important" }}>
                                <div className="form-group">
                                    <label>Company Phone Number<small className="text-danger">*</small></label>
                                    <input type="number"
                                        className="form-control"
                                        style={{ width: "100%" }}
                                        value={company.phoneNumber}
                                        onChange={(e) => setCompany({ ...company, phoneNumber: e.target.value, })}
                                    />
                                </div>
                            </div>
                            <div className="col-lg-6 bottommargin-sm" style={{ padding: "15px"}} >
                        <div className="uppy">
                            <div className="uppy-wrapper">
                                <div className="uppy-Root uppy-FileInput-container">
                                    <input className="uppy-FileInput-input uppy-input-control"
                                        style={{ display: "none" }}
                                        type="file"
                                        name="files[]"
                                        id="template-contactform-upload2"
                                        onChange={onFileChange2}

                                        accept="image/*" />

                                    <label class="uppy-input-label btn btn-light-primary btn-bold" style={{ border: "1px solid", marginTop: "15px" }} for="template-contactform-upload2">Upload Logo</label>
                                    <i style={{
                                        marginLeft: "10px ",
                                        marginRight: "10px",
                                        display: displayView == true ? "" : "none"
                                    }}
                                        className="btn  fa fa-eye icon-green btn-view" aria-hidden="true" onClick={() => viewResource()}>

                                    </i>
                                </div>

                            </div>
                        </div>
                        <label>{image}</label>
                    </div>
                        </div>
                        {/* <button class="btn btn-primary" onClick={() => stepper.next()}>Next</button> */}
                    </div>
                    <div id="test-l-3" class="card content" style={{ padding: "10px" }}>
                        <div className="row">
                            <div className="col-6 bottommargin-sm" style={{ display: "flex!important" }}>
                                <div className="form-group">
                                    <label>Package<small className="text-danger">*</small></label>
                                    <Select
                                        id="ddlPackages"
                                        name="id"
                                        value={resultPackage.find((obj) => {
                                            return obj.id == companyPackage.packageId;
                                        })}
                                        getOptionLabel={(option) => option.nameEn}
                                        getOptionValue={(option) => option.id}
                                        options={resultPackage}
                                        onChange={handlPackageChange}
                                    ></Select>
                                </div>
                            </div>
                            <div className="col-6 bottommargin-sm" style={{ display: "flex!important" }}>
                                <div className="form-group">
                                    <label>Start Date<small className="text-danger">*</small></label>
                                    <input type="date"
                                        className="form-control"
                                        style={{ width: "100%" }}
                                        value={companyPackage.startDate}
                                        onChange={(e) => setCompanyPackage({ ...companyPackage, startDate: e.target.value, })}
                                    />
                                </div>
                            </div>

                        </div>
                        <div className="row">
                            <div className="col-6 bottommargin-sm" style={{ display: "flex!important" }}>
                                <div className="form-group">
                                    <label>End Date<small className="text-danger">*</small></label>
                                    <input type="date"
                                        className="form-control"
                                        style={{ width: "100%" }}
                                        value={companyPackage.endDate}
                                        onChange={(e) => setCompanyPackage({ ...companyPackage, endDate: e.target.value, })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-6 bottommargin-sm" style={{ display: "flex!important" }}>
                                <div className="form-group">
                                    <label>Price<small className="text-danger">*</small></label>
                                    <input type="number"
                                        className="form-control"
                                        style={{ width: "100%" }}
                                        min="0"
                                        value={companyPackage.price}
                                        onChange={(e) => setCompanyPackage({ ...companyPackage, price: e.target.value, })}
                                    />
                                </div>
                            </div>
                            <div className="col-6 bottommargin-sm" style={{ display: "flex!important" }}>
                                <div className="form-group">
                                    <label>Currency<small className="text-danger">*</small></label>
                                    <Select
                                        id="ddlCurrency"
                                        name="id"
                                        value={currencyResult.find((obj) => {
                                            return obj.id == companyPackage.currency;
                                        })}
                                        getOptionLabel={(option) => option.name}
                                        getOptionValue={(option) => option.id}
                                        options={currencyResult}
                                        onChange={handleCurrencyChange}
                                    ></Select>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-6 bottommargin-sm" style={{ display: "flex!important" }}>
                                <div className="form-group">
                                    <label>Number of Users<small className="text-danger">*</small></label>
                                    <input type="number"
                                        className="form-control"
                                        style={{ width: "100%" }}
                                        min="0"
                                        value={companyPackage.numberOfUsers}
                                        onChange={(e) => { setNumberOfUsers(e) }}
                                    // onChange={(e) => setCompanyPackage({ ...companyPackage, numberOfUsers: e.target.value, })}
                                    />
                                </div>
                            </div>
                            <div className="col-6 bottommargin-sm" style={{
                                display: "flex!important", margin: "auto", paddingLeft: "35px",
                                marginTop: "36px"
                            }}>
                                <div className="form-group">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        value={companyPackage.isActive}
                                        checked={companyPackage.isActive}
                                        onChange={(e) => setCompanyPackage({ ...companyPackage, isActive: e.target.checked })}
                                    ></input>
                                    <label className="form-check-label">
                                        Is Active
                                    </label>
                                </div>
                            </div>
                        </div>
                        <hr />
                        <label>Permissions</label>
                        {renderPackagePermissions()}
                        <hr />
                        {/* <button
                            type="submit"
                            className="btn btn-primary"
                            onClick={submitValues}>
                            {save}
                        </button>
                        <button
                            type="submit"
                            className="btn btn-secondary"
                            style={{ margin: "6px" }}
                            onClick={cancel}>
                            Cancel
                        </button> */}
                    </div>

                    <div id="test-l-4" class="card content" style={{ padding: "10px" }}>
                        <h5 style={{ fontWeight: "bold" }}>User Details</h5>
                        <div className="container-fluid">
                            <div className="row mb-2">
                                <div className="list row">
                                    <div className="col-md-8">
                                        <div className="input-group mb-3" style={{ gap: "10px" }}>
                                            <button className="btn btn-primary" onClick={openModal}>New</button>
                                        </div>
                                    </div>
                                    <div className="col-md-12 list">
                                        <Table columns={columns} data={userArr} />
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
                                    <div className="col-lg-6">
                                        <div className="form-group">
                                            <label>Name<small className="text-danger">*</small></label>
                                            <input type="text"
                                                className="form-control"
                                                value={user.name}
                                                style={{ width: "100%" }}
                                                onChange={(e) => { setUser({ ...user, name: e.target.value }) }}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-lg-6">
                                        <div className="form-group">
                                            <label>Email<small className="text-danger">*</small></label>
                                            <input type="text"
                                                value={user.email}
                                                className="form-control"
                                                style={{ width: "100%" }}
                                                onChange={(e) => { setUser({ ...user, email: e.target.value }) }}

                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-lg-6">
                                        <div className="form-group">
                                            <label>Username<small className="text-danger">*</small></label>
                                            <input type="text"
                                                value={user.userName}
                                                className="form-control"
                                                style={{ width: "100%" }}
                                                onChange={(e) => { setUser({ ...user, userName: e.target.value }) }}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-lg-6">
                                        <div className="form-group">
                                            <label>Password<small className="text-danger">*</small></label>
                                            <input type="password"
                                                className="form-control"
                                                value={user.password}
                                                style={{ width: "100%" }}
                                                onChange={(e) => { setUser({ ...user, password: e.target.value }) }}
                                            />
                                        </div>
                                    </div>
                                </div>


                            </Modal.Body>
                            <Modal.Footer>
                                <button className="btn btn-secondary" onClick={hideModal}>
                                    Cancel
                                </button>
                                <button className="btn btn-primary" onClick={saveUser}>
                                    {saveTxt}
                                </button>
                            </Modal.Footer>
                        </Modal>
                        <hr />
                        <button
                            type="submit"
                            className="btn btn-primary"
                            onClick={submitValues}>
                            {save}
                        </button>
                        <button
                            type="submit"
                            className="btn btn-secondary"
                            style={{ margin: "6px" }}
                            onClick={cancel}>
                            Cancel
                        </button>
                    </div>
                </div>
            </div>);
        }
        else {
            return (<div id="stepper1" class="bs-stepper">
                <div class="bs-stepper-header" style={{margin: "auto" }}>
                    <div id="step1" class="step active" data-target="#test-l-1">
                        <button class="step-trigger" aria-selected='true' >
                            <span class="bs-stepper-circle">1</span>
                            <span class="bs-stepper-label">Company Information</span>
                        </button>
                    </div>
                    <div id="step2" class="line"></div>
                    <div id="step2" class="step" data-target="#test-l-2">
                        <button class="step-trigger">
                            <span class="bs-stepper-circle">2</span>
                            <span class="bs-stepper-label">Package Details</span>
                        </button>
                    </div>
                    <div class="line"></div>
                    <div class="step" data-target="#test-l-3">
                        <button class="step-trigger" aria-selected='true'>
                            <span class="bs-stepper-circle">3</span>
                            <span class="bs-stepper-label">Users</span>
                        </button>
                    </div>
                </div>
                <div class="bs-stepper-content">

                    <div id="test-l-1" class="card content fade dstepper-block active" style={{ padding: "10px" }}>
                        <div className="row">
                            <div className="col-6 bottommargin-sm" style={{ display: "flex!important" }}>
                                <div className="form-group">
                                    <label>Company Name<small className="text-danger">*</small></label>
                                    <input type="text"
                                        className="form-control "
                                        value={company.name}
                                        onChange={(e) => setCompany({ ...company, name: e.target.value, })}
                                    />
                                </div>
                            </div>
                            <div className="col-6 bottommargin-sm" style={{ display: "flex!important" }}>
                                <div className="form-group">
                                    <label>Company Email<small className="text-danger">*</small></label>
                                    <input type="text"
                                        className="form-control"
                                        style={{ width: "100%" }}
                                        value={company.email}
                                        onChange={(e) => setCompany({ ...company, email: e.target.value, })}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-6 bottommargin-sm" style={{ display: "flex!important" }}>
                                <div className="form-group">
                                    <label>Company Phone Number<small className="text-danger">*</small></label>
                                    <input type="number"
                                        className="form-control"
                                        style={{ width: "100%" }}
                                        value={company.phoneNumber}
                                        onChange={(e) => setCompany({ ...company, phoneNumber: e.target.value, })}
                                    />
                                </div>
                            </div>
                            <div className="col-lg-6 bottommargin-sm" style={{ padding: "15px"}} >
                        <div className="uppy">
                            <div className="uppy-wrapper">
                                <div className="uppy-Root uppy-FileInput-container">
                                    <input className="uppy-FileInput-input uppy-input-control"
                                        style={{ display: "none" }}
                                        type="file"
                                        name="files[]"
                                        id="template-contactform-upload2"
                                        onChange={onFileChange2}

                                        accept="image/*" />

                                    <label class="uppy-input-label btn btn-light-primary btn-bold" style={{ border: "1px solid", marginTop: "15px" }} for="template-contactform-upload2">Upload Logo</label>
                                    <i style={{
                                        marginLeft: "10px ",
                                        marginRight: "10px",
                                        display: displayView == true ? "" : "none"
                                    }}
                                        className="btn  fa fa-eye icon-green btn-view" aria-hidden="true" onClick={() => viewResource()}>

                                    </i>
                                </div>

                            </div>
                        </div>
                        <label>{image}</label>
                    </div>
                        </div>
                        {/* <button class="btn btn-primary" onClick={() => stepper.next()}>Next</button> */}

                    </div>
                    <div id="test-l-2" class="card content" style={{ padding: "10px" }}>
                        <div className="row">
                            <div className="col-6 bottommargin-sm" style={{ display: "flex!important" }}>
                                <div className="form-group">
                                    <label>Package<small className="text-danger">*</small></label>
                                    <Select
                                        id="ddlPackages"
                                        name="id"
                                        value={resultPackage.find((obj) => {
                                            return obj.id == companyPackage.packageId;
                                        })}
                                        getOptionLabel={(option) => option.nameEn}
                                        getOptionValue={(option) => option.id}
                                        options={resultPackage}
                                        onChange={handlPackageChange}
                                    ></Select>
                                </div>
                            </div>
                            <div className="col-6 bottommargin-sm" style={{ display: "flex!important" }}>
                                <div className="form-group">
                                    <label>Start Date<small className="text-danger">*</small></label>
                                    <input type="date"
                                        className="form-control"
                                        style={{ width: "100%" }}
                                        value={companyPackage.startDate}
                                        onChange={(e) => setCompanyPackage({ ...companyPackage, startDate: e.target.value, })}
                                    />
                                </div>
                            </div>

                        </div>
                        <div className="row">
                            <div className="col-6 bottommargin-sm" style={{ display: "flex!important" }}>
                                <div className="form-group">
                                    <label>End Date<small className="text-danger">*</small></label>
                                    <input type="date"
                                        className="form-control"
                                        style={{ width: "100%" }}
                                        value={companyPackage.endDate}
                                        onChange={(e) => setCompanyPackage({ ...companyPackage, endDate: e.target.value, })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-6 bottommargin-sm" style={{ display: "flex!important" }}>
                                <div className="form-group">
                                    <label>Price<small className="text-danger">*</small></label>
                                    <input type="number"
                                        className="form-control"
                                        style={{ width: "100%" }}
                                        min="0"
                                        value={companyPackage.price}
                                        onChange={(e) => setCompanyPackage({ ...companyPackage, price: e.target.value, })}
                                    />
                                </div>
                            </div>
                            <div className="col-6 bottommargin-sm" style={{ display: "flex!important" }}>
                                <div className="form-group">
                                    <label>Currency<small className="text-danger">*</small></label>
                                    <Select
                                        id="ddlCurrency"
                                        name="id"
                                        value={currencyResult.find((obj) => {
                                            return obj.id == companyPackage.currency;
                                        })}
                                        getOptionLabel={(option) => option.name}
                                        getOptionValue={(option) => option.id}
                                        options={currencyResult}
                                        onChange={handleCurrencyChange}
                                    ></Select>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-6 bottommargin-sm" style={{ display: "flex!important" }}>
                                <div className="form-group">
                                    <label>Number of Users<small className="text-danger">*</small></label>
                                    <input type="number"
                                        className="form-control"
                                        style={{ width: "100%" }}
                                        min="0"
                                        value={companyPackage.numberOfUsers}
                                        onChange={(e) => setCompanyPackage({ ...companyPackage, numberOfUsers: e.target.value, })}
                                    />
                                </div>
                            </div>
                            <div className="col-6 bottommargin-sm" style={{
                                display: "flex!important", margin: "auto", paddingLeft: "35px",
                                marginTop: "36px"
                            }}>
                                <div className="form-group">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        value={companyPackage.isActive}
                                        checked={companyPackage.isActive}
                                        onChange={(e) => setCompanyPackage({ ...companyPackage, isActive: e.target.checked })}
                                    ></input>
                                    <label className="form-check-label">
                                        Is Active
                                    </label>
                                </div>
                            </div>
                        </div>
                        <hr />
                        <label>Permissions</label>
                        {renderPackagePermissions()}
                        {/* <button
                            type="submit"
                            className="btn btn-primary"
                            onClick={submitValues}>
                            Save
                        </button> */}
                    </div>
                    <div id="test-l-3" class="card content" style={{ padding: "10px" }}>
                        <h5 style={{ fontWeight: "bold" }}>User Details</h5>
                        <div className="container-fluid">
                            <div className="row mb-2">
                                <div className="list row">
                                    <div className="col-md-8">
                                        <div className="input-group mb-3" style={{ gap: "10px" }}>
                                            <button className="btn btn-primary" onClick={openModal}>New</button>
                                        </div>
                                    </div>
                                    <div className="col-md-12 list">
                                        <Table columns={columns} data={userArr} />
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
                                    <div className="col-lg-6">
                                        <div className="form-group">
                                            <label>Name<small className="text-danger">*</small></label>
                                            <input type="text"
                                                className="form-control"
                                                value={user.name}
                                                style={{ width: "100%" }}
                                                onChange={(e) => { setUser({ ...user, name: e.target.value }) }}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-lg-6">
                                        <div className="form-group">
                                            <label>Email<small className="text-danger">*</small></label>
                                            <input type="text"
                                                value={user.email}
                                                className="form-control"
                                                style={{ width: "100%" }}
                                                onChange={(e) => { setUser({ ...user, email: e.target.value }) }}

                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-lg-6">
                                        <div className="form-group">
                                            <label>Username<small className="text-danger">*</small></label>
                                            <input type="text"
                                                value={user.userName}
                                                className="form-control"
                                                style={{ width: "100%" }}
                                                onChange={(e) => { setUser({ ...user, userName: e.target.value }) }}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-lg-6">
                                        <div className="form-group">
                                            <label>Password<small className="text-danger">*</small></label>
                                            <input type="password"
                                                className="form-control"
                                                value={user.password}
                                                style={{ width: "100%" }}
                                                onChange={(e) => { setUser({ ...user, password: e.target.value }) }}
                                            />
                                        </div>
                                    </div>
                                </div>


                            </Modal.Body>
                            <Modal.Footer>
                                <button className="btn btn-secondary" onClick={hideModal}>
                                    Cancel
                                </button>
                                <button className="btn btn-primary" onClick={saveUser}>
                                    {saveTxt}
                                </button>
                            </Modal.Footer>
                        </Modal>
                        <hr />
                        <button
                            type="submit"
                            className="btn btn-primary"
                            onClick={submitValues}>
                            {save}
                        </button>
                        <button
                            type="submit"
                            className="btn btn-secondary"
                            style={{ margin: "6px" }}
                            onClick={cancel}>
                            Cancel
                        </button>
                    </div>
                </div>

            </div>);
        }
    }



    const submitValues = (e) => {


        var errorMessage = 'Please enter: ';
        e.preventDefault();

        var valid = true;

        if (company.name == "" || company.name == null) {
            errorMessage = errorMessage + ' company name,'
            valid = false;
        }
        if (company.email == "" || company.email == null) {
            errorMessage = errorMessage + ' company email,'
            valid = false;
        }
        if (company.phoneNumber == "" || company.phoneNumber == null) {
            errorMessage = errorMessage + ' company phone number,'
            valid = false;
        }
        if (companyPackage.packageId == 0) {
            errorMessage = errorMessage + ' package,'
            valid = false;
        }
        if (companyPackage.startDate == 0) {
            errorMessage = errorMessage + ' package start date,'
            valid = false;
        }
        if (companyPackage.endDate == null) {
            errorMessage = errorMessage + ' package end date,'
            valid = false;
        }
        if (companyPackage.price == '' || companyPackage.price == null) {
            errorMessage = errorMessage + ' package price,'
            valid = false;
        }
        if (companyPackage.currency == '' || companyPackage.currency == null) {
            errorMessage = errorMessage + ' package price currency,'
            valid = false;
        }
        if (companyPackage.numberOfUsers == '' || companyPackage.numberOfUsers == null) {
            errorMessage = errorMessage + ' number of Users,'
            valid = false;
        }



        errorMessage = errorMessage.substring(0, errorMessage.length - 1);
        if (!valid) {
            AlertError(errorMessage)
            return;
        }
        if (!validateEmail(company.email)) {
            AlertError("Please enter a valid email");
            return;
        }

        var _startDate = new Date(companyPackage.startDate);
        var _endDate = new Date(companyPackage.endDate);

        _startDate=dateFormat(_startDate,'yyyy-mm-dd');
        _endDate=dateFormat(_endDate,'yyyy-mm-dd');

        console.log("start date: "+_startDate)
        console.log("end date: "+_endDate)

        if (_startDate > _endDate) {
            AlertError("Start date must be greater than to date");
            return;
        }

        var today = new Date();
        today=dateFormat(today,'yyyy-mm-dd');

        console.log("today's date: "+today)

        if (today > _startDate) {
            AlertError("Start date must be greater than or equal today's date");
            return;
        }
        if (parseInt(companyPackage.numberOfUsers) != userArr.length) {
            AlertError("Number of users must be equal to user accounts inserted");
            return;
        }




        setSave("Saving...");
        var data =
        {
            PreRegistrationId: parseInt(props.match.params.id),
            company: company,
            Id: 0,
            PackageId: companyPackage.packageId,
            CompanyId: 0,
            CreationDate: companyPackage.creationDate,
            StartDate: dateFormat(companyPackage.startDate, 'yyyy-mm-dd'),
            EndDate: dateFormat(companyPackage.endDate, 'yyyy-mm-dd'),
            Price: parseFloat(companyPackage.price),
            Currency: parseInt(companyPackage.currency),
            NumberOfUsers: parseInt(companyPackage.numberOfUsers),
            IsActive: companyPackage.isActive,
            IsDeleted: false,
            companyPackageDetails: userPackagePermissions,
            users: userArr
        }


        APIFunctions.saveCompanyPackage(data)
            .then((response) => {

                if (response.data.success) {
                    AlertSuccess("Operation done successfully");
                    setSave("Save");
                    setTimeout(() => { props.history.push("/CustomerRegistrations") }, 500);
                }
                else {
                    setIsOpen2(true);
                    setErrorUsers(response.data.users);
                    //renderErrorMessage(response.data.users)
                    setSave("Save");
                    return;
                }

            })
            .catch((e) => {
                console.log(e);
            });

    }

    const renderErrorMessage = () => {
        var item = errorUsers;
        if (item != null || item != undefined) {
            {
                return (<ul className="list-group">{item.map((val, idx) => (
                    <li className="list-group-item"><strong>{val.type + ": "}</strong> {val.value + " " + val.message}</li>
                ))}</ul>);
            }
        }
    }

    const setCountryLimit = (evt, id) => {
        var Ids = [];
        evt.map((val, idx) => {
            Ids.push(val.value);
        });

        Ids = Ids.join(',');
        var data = userPackagePermissions;

        data = data.filter((item) => item.packagePagePermissionId != id);

        data.push({
            id: 0, companyPackageId: 0, packagePagePermissionId: id,
            countryId: Ids, isDeleted: false
        });

        setUserPackagePermissions(data);

    }

    const getCountryName = (id) => {
        var data = options;
        data = data.filter((item) => item.value == id);

        if (data.length > 0)
            return data[0].label;
        return '';

    }

    const getValueByPackageId = (id) => {
        var data = userPackagePermissions;
        data = userPackagePermissions.filter((item) => item.packagePagePermissionId == id);

        var arr = [];
        if (data != null && data.length > 0 && data != "") {
            if (data[0].countryId != 0) {
                var countryIds = data[0].countryId.split(',');
                countryIds.map((val, idx) => {
                    var item = new Object();
                    item.value = val;
                    item.label = getCountryName(val);
                    arr.push(item);
                });
            }
            return arr;
        }
        else {
            return [];
        }

    }

    const renderPackagePermissions = () => {
        {
            return (<div className="justify-content-center">
                {packagePermissions.map((val, idx) => (
                    <div id={val.id}>
                        <div className="row mb-1" style={{
                            backgroundColor: "#fbfafa",
                            border: "1px solid #e3e3e3",
                            width: "95%",
                            padding: "7px",
                            margin: "auto"
                        }}>
                            <div className="col-lg-6">
                                <label>Page Name</label>
                                <label
                                    type="text"
                                    class="form-control">{val.pageName}</label>
                            </div>
                            <div className="col-lg-6" style={{ display: val.hasCountryLimit ? "" : "none" }}>
                                <label>Choose Country</label>
                                <MultiSelect
                                    getOptionValue={(option) => option.countryId}
                                    options={options}
                                    value={getValueByPackageId(val.id)}
                                    onChange={(e) => { setCountryLimit(e, val.id) }}
                                    labelledBy="Select"
                                />
                            </div>
                        </div>
                    </div>
                ))
                }
            </div >);
        }
    }



    return (

        <div className="content-wrapper">
            <div className="content-header">
                <div className="container-fluid">
                    <div className="row">
                        <div >
                            <Form>
                                <div className="card" >
                                    <div>
                                        {renderHtml()}
                                    </div>
                                </div>
                            </Form>

                        </div>
                    </div>
                </div>
            </div>
            <Modal
                size="lg"
                show={isOpen2}
                onHide={hideModal2}
                onEntered={modalLoaded2}>
                <Modal.Header closeButton>
                    <Modal.Title>Unaccepted Users</Modal.Title>
                    {/* <button type="button" className="btn-close" aria-label="Close"></button> */}
                </Modal.Header>
                <Modal.Body>
                    {isOpen2 && renderErrorMessage()}

                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-secondary" onClick={hideModal2}>
                        Cancel
                    </button>
                </Modal.Footer>
            </Modal>
        </div >

    );
};

export default EditPreRegistration;
