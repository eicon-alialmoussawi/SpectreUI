import React, { useState, useEffect, useMemo, useRef, Component } from "react";
import APIFunctions from "../utils/APIFunctions";
import { useTable, useSortBy, usePagination } from "react-table";
import "react-datepicker/dist/react-datepicker.css";
import { getValue } from "../Assets/Language/Entries";
import { BindImageURL, validateEmail, getLang } from "../utils/common";
import { Alert, LoadingAlert, AlertError } from "../components/f_Alerts";

const AboutView = (props) => {
  const myReadMore = {
    id: 0,
    titleEn: "",
    titleFr: "",
    titleAr: "",
    descriptionEn: "",
    descriptionFr: "",
    descriptionAr: "",
    icon: "",
  };

  const [data, setData] = useState([]);
  const [aboutUs, setAboutUs] = useState([]);
  const [readMoreTxt, setReadMoreTxt] = useState(myReadMore);

  const dataRef = useRef();
  dataRef.current = data;

  useEffect(() => {
    getAboutSpectre();
    getAboutView();
  }, []);

  const getAboutSpectre = () => {
    APIFunctions.getHelpAbout()
      .then((response) => {
        setAboutUs(response.data);
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const getAboutView = () => {
    APIFunctions.getAllHelpServices()
      .then((response) => {
        setData(response.data);
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const renderAboutDesc = () => {
    if (aboutUs != null && aboutUs.length > 0) {
      var val =
        getLang() == "en"
          ? aboutUs[0].descriptionEn
          : getLang() == "ar"
          ? aboutUs[0].descriptionAr
          : aboutUs[0].descriptionFr;
      var desc = val.split("\n");
      {
        return desc.map((val, idx) => {
          if (val.length > 0) {
            return <p> {val} </p>;
          }
        });
      }
    }
  };

  const readMore = (id) => {
    var _data = dataRef.current;
    var obj = new Object();
    _data.map((val, x) => {
      if (val.id == id) obj = val;
    });
    if (obj != null) {
      setReadMoreTxt(obj);
    }
  };

  const renderDesc = (desc) => {
    if (desc.length < 80) return desc;
    else return desc.substring(0, 80) + "...";
  };

  const renderReadMoreTXT = () => {
    {
      if (readMoreTxt != null) {
        var val =
          getLang() == "en"
            ? readMoreTxt.readMoreEn
            : getLang() == "ar"
            ? readMoreTxt.readMoreAr
            : readMoreTxt.readMoreFr;
        if (val != null && val != "") {
          var desc = val.split("\n");
          {
            return desc.map((val, idx) => {
              if (val.length > 0) {
                return <p> {val} </p>;
              }
            });
          }
        }
      }
    }
  };

  const renderServices = () => {
    if (data != null && data.length > 0) {
      {
        return data.map((val, idx) => {
          return (
            <div class="item">
              <i class={val.icon}></i>
              <div class="title">
                {getLang() == "en"
                  ? val.titleEn
                  : getLang() == "ar"
                  ? val.titleAr
                  : val.titleFr}
              </div>
              <div class="description">
                {getLang() == "en"
                  ? renderDesc(val.descriptionEn)
                  : getLang() == "ar"
                  ? renderDesc(val.descriptionAr)
                  : renderDesc(val.descriptionFr)}
              </div>
              <a
                onClick={(e) => {
                  readMore(val.id);
                }}
              >
                {getValue("ReadMore", getLang())}
              </a>
            </div>
          );
        });
      }
    }
  };

  return (
    <div id="Wrapper">
      <div id="Content" className="inner-content mt-3">
        <div
          className="content_wrapper clearfix"
          style={{ paddingTop: 55, paddingBottom: 60 }}
        >
          <div className="sections_group">
            <div className="section_wrapper mcb-section-inner">
              <div className="wrap mcb-wrap one valign-top clearfix">
                <div
                  style={{ borderRadius: "10px" }}
                  className="entry-content inner-entry-content px-4 py-3"
                >
                  <div className="row">
                    <div className="col-12">
                      <div className="row">
                        <div className="col-12 d-flex justify-content-between">
                          <h4
                            className="text-blue-d text-bold"
                            style={{ margin: 0 }}
                          >
                            {getValue("AboutUs", getLang())}
                          </h4>
                        </div>
                      </div>
                      <hr style={{ margin: "5px 0" }} />
                      {renderAboutDesc()}
                    </div>
                  </div>
                  <br />
                  <div className="row">
                    <div className="col-12">
                      <div className="row">
                        <div className="col-12 d-flex justify-content-between">
                          <h4
                            className="text-blue-d text-bold"
                            style={{ margin: 0 }}
                          >
                            {getValue("SpectreOffers", getLang())}
                          </h4>
                        </div>
                      </div>
                      <hr style={{ margin: "5px 0" }} />
                      <div id="help-features-grid">{renderServices()}</div>
                      <hr style={{ margin: "5px 0" }} />
                      <div id="help-features-read-more">
                        <div class="title">
                          {getLang() == "en"
                            ? readMoreTxt.titleEn
                            : getLang() == "ar"
                            ? readMoreTxt.titleAr
                            : readMoreTxt.titleFr}
                        </div>
                        {renderReadMoreTXT()}
                        {/* {getLang() == "en"
                          ? readMoreTxt.readMoreEn
                          : getLang() == "ar"
                          ? readMoreTxt.readMoreAr
                          : readMoreTxt.readMoreFr} */}
                      </div>
                    </div>
                  </div>
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

export default AboutView;
