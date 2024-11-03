import React, { useState, useEffect, useMemo, useRef } from "react";
import '../css/PreRegistration.css';
import { validateEmail } from '../utils/common.js';
import Path from '../Assets/Images/flags.png'
import APIFunctions from "../utils/APIFunctions";
import { useTable, useSortBy } from "react-table";
import { BrowserRouter as Router, Link } from "react-router-dom";
import { AlertConfirm, AlertError, AlertSuccess } from "./f_Alerts";
import Select from "react-select";
import { Form } from "react-bootstrap";
import { ReactTelephoneInput } from "react-telephone-input";
import 'react-telephone-input/css/default.css'

const PreRegistration = (props) => {

    const myPreRegistration = {
        id: 0,
        name: "",
        email: "",
        phoneNumber: "",
        message: "",
        preferredPackage: 0,
        isDeleted: false,
        isViewed: false,
        creationDate: null
    };

    const [resultPackage, setResultPackage] = useState([]);
    const [loadedPackage, setPackageLoad] = useState(false);
    const [packageId, setPackageId] = useState("");
    const [preRegistration, setPreRegistration] = useState(myPreRegistration);

    const handlPackageChange = (selectedOptions) => {
        setPreRegistration({ ...preRegistration, preferredPackage: selectedOptions.id })
    };


    useEffect(() => {
        APIFunctions.getPublicPackages()
            .then((resp) => resp)
            .then((resp) => setResultPackage(resp.data));
    }, []);


    const saveRegistatrion = () => {


        if (preRegistration.name == "" || preRegistration.name == null
            || preRegistration.email == "" || preRegistration.email == null
            || preRegistration.phoneNumber == "" || preRegistration.phoneNumber == null
            || preRegistration.preferredPackage == "" || preRegistration.preferredPackage == null) {
            AlertError("Please fill required fields");
            return;
        }
        if (!validateEmail(preRegistration.email)) {
            AlertError("Please enter a valid email");
            return;
        }


        APIFunctions.savePreRegistration(preRegistration)
            .then((response) => {
                if (response.data) {
                    AlertSuccess("Request sent successfully");
                    return;
                }
                else {
                    AlertError("Something went wrong");
                }

            })
            .catch((e) => {
                console.log(e);
            });

    }

    const handlePhoneChange = (telNumber, selectedCountry) => {
        setPreRegistration({ ...preRegistration, phoneNumber: telNumber })
    }
    return (
        <section className="sign-in">
            <div className="containerReg">

                <div className="signin-content">

                    <div className="signin-image">
                        <h2 className="form-title" style={{ color: "black" }}>Registration Form</h2>
                        {/* <figure><img src={Image} alt="sing up image" /></figure> */}
                        {/* <a href="#" className="signup-image-link">Create an account</a> */}
                        <div className="form-group">
                            <label>Name<small className="text-danger"> * </small></label>
                            <input className="inputHolder"
                                type="text"
                                placeholder="Name"
                                value={preRegistration.name}
                                onChange={(e) => setPreRegistration({ ...preRegistration, name: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Email<small className="text-danger"> * </small></label>
                            <input
                                className="inputHolder"
                                type="text"
                                placeholder="Email"
                                value={preRegistration.email}
                                onChange={(e) => setPreRegistration({ ...preRegistration, email: e.target.value })} />
                        </div>
                    </div>

                    <div className="signin-form">

                        <Form className="register-form" id="login-form">

                            <div className="form-group">

                                <label for="your">Phone Number<small className="text-danger"> * </small></label>
                                <ReactTelephoneInput
                                    defaultCountry="lb"
                                    flagsImagePath={Path}
                                    value={preRegistration.phoneNumber}
                                    onChange={handlePhoneChange}
                                // onChange={(e) => setPreRegistration({ ...preRegistration, phoneNumber: e.target.value })} 
                                />

                            </div>
                            <div className="form-group">
                                <label for="your">Message</label>
                                <textarea style={{ resize: "unset" }}
                                    className="inputHolder"
                                    type="text"
                                    placeholder="Message"
                                    value={preRegistration.message}
                                    onChange={(e) => setPreRegistration({ ...preRegistration, message: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label for="your">Preferred Package<small className="text-danger"> * </small></label>
                                <Select
                                    id="ddlPackages"
                                    name="id"
                                    value={resultPackage.find((obj) => {
                                        return obj.id == preRegistration.preferredPackage;
                                    })}
                                    getOptionLabel={(option) => option.nameEn}
                                    getOptionValue={(option) => option.id}
                                    options={resultPackage}
                                    onChange={handlPackageChange}
                                ></Select>
                            </div>

                            {/* <div className="form-group">
                                    <input type="checkbox" name="remember-me" id="remember-me" className="agree-term" />
                                    <label for="remember-me" className="label-agree-term"><span><span></span></span>Remember me</label>
                                </div> */}
                            <div className="form-group form-button">
                                <input
                                    name="signin"
                                    id="signin"
                                    className="btn btn-primary"
                                    value="Register"
                                    onClick={() => { saveRegistatrion() }} />
                            </div>
                        </Form>
                        {/* <div className="social-login">
                                <span className="social-label">Or login with</span>
                                <ul className="socials">
                                    <li><a href="#"><i className="display-flex-center zmdi zmdi-facebook"></i></a></li>
                                    <li><a href="#"><i className="display-flex-center zmdi zmdi-twitter"></i></a></li>
                                    <li><a href="#"><i className="display-flex-center zmdi zmdi-google"></i></a></li>
                                </ul>
                            </div> */}
                    </div>
                </div>
            </div>
        </section>

    );
};


export default PreRegistration;