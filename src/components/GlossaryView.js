import React, { useState, useEffect, useMemo, useRef, Component } from "react";
import APIFunctions from "../utils/APIFunctions";
import dateFormat from "dateformat";
import Select from "react-select";
import { ReactExcel, readFile, generateObjects } from "@ramonak/react-excel";
import { useTable, useSortBy, usePagination } from "react-table";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MultiSelect } from "react-multi-select-component";
import { trackPromise } from "react-promise-tracker";
import { Loader } from "react-loader-spinner";
import { getValue } from "../Assets/Language/Entries";
import { BindImageURL, validateEmail, getLang } from "../utils/common";
import { Alert, LoadingAlert, AlertError } from "../components/f_Alerts";
import { get } from "jquery";
import Modal from "react-bootstrap/Modal";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import Swal from "sweetalert2";
import $ from 'jquery';

const GlossaryView = (props) => {

    const [data, setData] = useState([]);

    useEffect(() => {
        getGlossary();
    }, []);

    const getGlossary = () => {
        APIFunctions.getAllGlossary()
            .then((response) => {
                setData(response.data);
            })
            .catch((e) => {
                console.log(e);
            });
    }



    const renderGlossary = () => {
        if (data != null && data.length > 0){
            {
                return (data.map((val, idx) => (
                    <dl>
                          <dt>{(getLang() == "en" ? val.nameEn : getLang() == "ar" ? val.nameAr : val.nameFr)}</dt>
                           <dd>{(getLang() == "en" ? val.descriptionEn : getLang() == "ar" ? val.descriptionAr : val.descriptionFr)}</dd>
                    </dl>
               
                    )));
            }
        }
    }



    return (
        <div id="Wrapper">

            <div id="Content" className="inner-content mt-3">
                <div className="content_wrapper clearfix" style={{ paddingTop: 140, paddingBottom: 60 }}>
                    <div className="sections_group">
                        <div className="section_wrapper mcb-section-inner">
                            <div className="wrap mcb-wrap one valign-top clearfix">
                                <div style={{ borderRadius: "10px" }} className="entry-content inner-entry-content px-4 py-3">
                                    <div className="row">
                                        <div className="col-12 text-left">
                                            <div className="row">
                                                <div className="col-12 text-left d-flex justify-content-between">
                                                    <h4 className="text-blue-d text-bold" style={{ margin: 0 }}> {getValue("Glossary", getLang())}</h4>
                                                </div>
                                            </div>
                                            <hr style={{ margin: "5px 0" }} />
                                        </div>
                                    </div>
                                    <dl>
                                        {renderGlossary()}
                                    
                                    </dl>
                                </div>
                                <br></br>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default GlossaryView;
