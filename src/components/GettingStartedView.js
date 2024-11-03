import React, { useState, useEffect, useMemo, useRef, Component } from "react";
import APIFunctions from "../utils/APIFunctions";
import { useTable, useSortBy, usePagination } from "react-table";
import "react-datepicker/dist/react-datepicker.css";
import { getValue } from "../Assets/Language/Entries";
import { BindImageURL, validateEmail, getLang } from "../utils/common";
import { Alert, LoadingAlert, AlertError } from "../components/f_Alerts";
import { useLocation } from "react-router-dom";

const GettingStartedView = (props) => {

    const myData = {
        id: 0,
        titleEn: '',
        titleFr: '',
        titleAr: '',
        descriptionEn: '',
        descriptionFr: '',
        descriptionAr: '',
        imageUrl: '',
        isDeleted: false
    }
    const [data, setData] = useState(myData);
    const location = useLocation();

    useEffect(() => {
        getGettingStartedView();
    }, [location]);

    const getGettingStartedView = () => {
        APIFunctions.getAllHelpUsing()
        .then((response) => {
            var Id = props.match.params.id;
            var result = response.data;

            var _val = result.filter((item) => item.id == Id);
            if (_val.length > 0)
                setData(_val[0]);
            console.log(response.data);
        })
        .catch((e) => {
            console.log(e);
        });
    }

    const renderAboutDesc = () => {
        {
            var val = getLang() == "en" ?  data.descriptionEn :
            getLang() == "ar" ? data.descriptionAr : data.descriptionFr;
            var desc = val.split("\n");
            {
                return (desc.map((val, idx) => {
                    if (val.length > 0) {
                        return (
                            <p className="text-align-start"> {val} </p>
                        )
                    }
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
                                        <div className="col-12 text-align-start">
                                            <div className="row">
                                                <div className="col-12 text-left d-flex justify-content-between">
                                                    <h1 className="text-blue-d text-bold" style={{ margin: 0, fontSize: 24 }}>{getLang() == "en" ?
                                                    data.titleEn : getLang() == "ar" ? data.titleAr : data.titleFr}</h1>
                                                </div>
                                            </div>
                                            <hr style={{ margin: "5px 0" }} />
                                            <img src={BindImageURL(data.imageUrl)} style={{ borderRadius: 15, marginBottom: 15, marginTop: 15, display: data.imageUrl === "" ? "none" : "" }} alt="Not found" />
                                             {renderAboutDesc()}
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

export default GettingStartedView;
