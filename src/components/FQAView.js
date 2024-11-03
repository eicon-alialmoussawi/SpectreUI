import React, { useState, useEffect, useMemo, useRef, Component } from "react";
import APIFunctions from "../utils/APIFunctions";
import { useTable, useSortBy, usePagination } from "react-table";
import "react-datepicker/dist/react-datepicker.css";
import { getValue } from "../Assets/Language/Entries";
import { BindImageURL, validateEmail, getLang } from "../utils/common";
import { Alert, LoadingAlert, AlertError } from "../components/f_Alerts";



const FQAView = (props) => {

    
    const [data, setData] = useState([]);

    useEffect(() => {
        getGettingStartedView();
    }, []);

    const getGettingStartedView = () => {
        APIFunctions.getAllFQA()
        .then((response) => {
            setData(response.data);
        })
        .catch((e) => {
            console.log(e);
        });
    }

    const renderFQAs = () => {
        console.log(data);
        if (data != null && data.length > 0){
            {
                return (data.map((val, idx) => {
                    return (
                    <div class="card">
                        <div class="card-header d-flex justify-content-between activestate">
                            <a role="button" data-toggle="collapse" href={"#collapse_1" + val.id} aria-expanded="true">{getLang()=="en" ?
                            val.questionEn : getLang()== "ar" ? val.questionAr : val.questionFr}</a>
                        </div>
                        <div id={"collapse_1" + val.id} class="collapse" data-parent="#accordion_2" role="tabpanel">
                            <div class="card-body pa-15 text-align-start">{getLang()=="en" ?
                            val.answerEn : getLang()== "ar" ? val.answerAr : val.answerFr}</div>
                        </div>
                    </div>
                    )
                    
                }
                ));
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
                                                    <h1 className="text-blue-d text-bold" style={{ margin: 0, fontSize: 24 }}>{getValue("FAQ", getLang())}</h1>
                                                </div>
                                            </div>
                                            <hr style={{ margin: "5px 0" }} />
                                            <div class="" style={{margin: "10px"}}>
                <div class="row">
                    <div class="col-lg-12">
                        <div class="card card-lg-12">
                          
                            <div class="accordion accordion-type-2 accordion-flush" id="accordion_2">
                                {renderFQAs()}
                            
                            </div>

                        </div>
                    </div>
                </div>
            </div>
                                        </div>
                                    </div>
                                    <br />
                                    {/* <div className="row">
                                        <div className="col-12 text-left">
                                            <div className="row">
                                                <div className="col-12 text-left d-flex justify-content-between">
                                                    <h2 className="text-blue-d text-bold" style={{ margin: 0, fontSize: 20 }}>Awards Menu</h2>
                                                </div>
                                            </div>
                                            <hr style={{ margin: "5px 0" }} />
                                            <img src="../public_pages/images/getting-started-2.jpg" style={{ borderRadius: 15, marginBottom: 15, marginTop: 15 }} />
                                            <ol style={{ margin: "15px 0 0 15px" }}>
                                                <li>A list of parameters. This will set the criteria on which awards to include. Refer to section "Glossary" for a clear definition on each</li>
                                                <li>Additional conditions can be added on awards included by setting the max and min GDPc and even specifying the time period of awards.</li>
                                                <li>Country selection can help the user select awards in specific countries as needed</li>
                                                <li>A list of all IMT bands available for user to select from. Multiple selections can be done.</li>
                                                <li>Press the key "show " to run the selected scenario</li>
                                                <li>The list of awards is shown as per selection:
                                                    Country: specifies country of award
                                                    PoP,M: population of country at date of award
                                                    GDPc:  the gross domestic product per capita at date of award, presented in US$
                                                    Operator: the name of operator who won the licenses
                                                    Date: date in which license was awarded
                                                    Price,$M: the upfront fees paid by operator at award date, presented in US$, and converted from local currency using 	the WB exchange
                                                    Term: is the license duration
                                                    Bands:
                                                    Paring: the offered license pairing, "p" for paired, "u" for unpaired, "b" for paired+ unpaired, and "Multi-band" is 	award includes several bands
                                                    Total MHz:
                                                    Coverage:</li>
                                                <li>You can export your results into an excel or a pdf format (full detailed report)</li>
                                            </ol>
                                        </div>
                                    </div> */}
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

export default FQAView;
