import React, { useState, useEffect, useMemo, useRef } from "react";
import APIFunctions from "../utils/APIFunctions";
import Modal from "react-bootstrap/Modal";
import "../css/CustomStyle.css";
import { useTable, useSortBy } from "react-table";
import { param } from "jquery";
import {
  AlertError,
  AlertSuccess,
  AlertConfirm,
  LoadingAlert,
} from "./f_Alerts";
import {
  BindImageURL,
  getLang,
  setIMF,
  setPPP,
  getIMF,
  getPPP,
  setLanguage,
} from "../utils/common";

import { getValue } from "../Assets/Language/Entries";
import dateFormat from "dateformat";
import $, { isNumeric } from "jquery";

const Account = () => {
  // const myPackage = {
  //     companyPackages: [],
  //     companyPreRegistrations: [],
  //     descriptionEn: "",
  //     descriptionFr: "",
  //     descriptionSpa: "",
  //     fromYearLimit: "",
  //     id: "",
  //     imageUrl: "",
  //     isDeleted: false,
  //     isDemoPackage: false,
  //     isVisible: false,
  //     nameEn: "",
  //     nameFr: "",
  //     nameSpa: "",
  //     order: null,
  //     packagePagePermissions: [],
  //     toYearLimit: null

  // }
  const user = {
    name: "",
    email: "",
    companyName: "",
    packageId: null,
    startDate: null,
    endDate: null,
  };

  const [arrNotifications, setArrNotifications] = useState([]);
  const [arrUserFeatures, setUserFeatures] = useState([]);
  const [arrPackages, setArrPackages] = useState([]);
  const [userInfo, setuserInfo] = useState(user);
  const [imf, setIMF2] = useState(false);
  const [isPPP, setIsPP] = useState(false);
  const [isEnglish, setEnglish] = useState(true);
  const [isArabic, setArabic] = useState(false);
  const [isFrench, setFrench] = useState(false);

  useEffect(() => {
    $(".menuItems").removeClass("active");
    $("#Account_page").addClass("active");
  });

  useEffect(() => {
    var isIMF = getIMF();
    setIMF2(isIMF == "true" ? true : false);

    var isPPP = getPPP();
    setIsPP(isPPP == "true" ? true : false);

    var lang = getLang();
    if (lang == "en") {
      setEnglish(true);
      setArabic(false);
      setFrench(false);
    } else if (lang == "ar") {
      setEnglish(false);
      setArabic(true);
      setFrench(false);
    } else {
      setEnglish(false);
      setArabic(false);
      setFrench(true);
    }

    getUserFeatures();
    getUserInfo();
    getUserNotifications();
    getPackages();
    updateSeenNotifications();
  }, []);

  const updateSeenNotifications = () => {
    APIFunctions.setUserNotificationAsSeen()
      .then((response) => {})
      .catch((e) => {
        console.log(e);
      });
  };

  const getAvailableFeatures = (pageURL) => {
    var allData = arrUserFeatures;
    var obj = allData.filter((item) => {
      if (item.pageUrl == pageURL) {
        return item;
      }
    });

    if (obj.length > 0) {
      if (obj[0].hasLimit) {
        return <td>{obj[0].restriction}</td>;
      } else {
        return <i className="spectre-check-disc"></i>;
      }
    } else {
      return <i className="fa fa-times"></i>;
    }
  };

  const getUserFeatures = () => {
    var lang = getLang();
    APIFunctions.getUserFeatures(lang)
      .then((response) => {
        setUserFeatures(response.data);

        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const getUserInfo = () => {
    APIFunctions.getUserInfo()
      .then((response) => {
        var obj = new Object();
        obj.name = response.data.name;
        obj.email = response.data.email;
        obj.companyName = response.data.companyName;
        obj.packageId = response.data.packageId;
        obj.startDate = response.data.startDate;
        obj.endDate = response.data.endDate;

        setuserInfo(obj);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const setIsIMF = (source, target) => {
    var data = [];
    var obj = new Object();
    if (target == "IMF") {
      setIMF2(true);
      setIMF("true");
      obj.Id = 0;
      obj.PageUrl = null;
      obj.Field = "IMF";
      obj.Value = "true";
      obj.UserId = 0;
    } else {
      setIMF2(false);
      setIMF("false");
      obj.Id = 0;
      obj.PageUrl = null;
      obj.Field = "IMF";
      obj.Value = "false";
      obj.UserId = 0;
    }

    data.push(obj);
    APIFunctions.saveUserFilters(data)
      .then((response) => {
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const setIfPPP = (source, target) => {
    var data = [];
    var obj = new Object();
    if (target == "PPP") {
      setIsPP(true);
      setPPP("true");
      obj.Id = 0;
      obj.PageUrl = null;
      obj.Field = "PPP";
      obj.Value = "true";
      obj.UserId = 0;
    } else {
      setIsPP(false);
      setPPP("false");
      obj.Id = 0;
      obj.PageUrl = null;
      obj.Field = "PPP";
      obj.Value = "false";
      obj.UserId = 0;
    }

    data.push(obj);
    APIFunctions.saveUserFilters(data)
      .then((response) => {
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const updateLangauge = (value) => {
    if (value == "en") {
      setEnglish(true);
      setArabic(false);
      setFrench(false);
      setLanguage(value);
      window.location.reload(false);
    } else if (value == "ar") {
      setEnglish(false);
      setArabic(true);
      setFrench(false);
      setLanguage(value);
      window.location.reload(false);
    } else {
      setEnglish(false);
      setArabic(false);
      setFrench(true);
      setLanguage(value);
      window.location.reload(false);
    }
  };

  const getPackages = () => {
    APIFunctions.getAllPackages()
      .then((response) => {
        setArrPackages(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const getUserNotifications = () => {
    APIFunctions.getUserNotifications("Top")
      .then((response) => {
        setArrNotifications(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const renderNotifications = () => {
    var data = arrNotifications;
    var lang = getLang();
    {
      return data.map((val, idx) => {
        return (
          <li className="new">
            {lang == "en" ? val.textEn : lang == "ar" ? val.textAr : val.textFr}
          </li>
        );
      });
    }
  };

  const renderPackages = () => {
    var data = arrPackages;
    var lang = getLang();
    {
      return data.map((val, idx) => {
        return (
          <div
            className={
              "package" +
              " " +
              (userInfo.packageId == val.id ? "subscribed" : "")
            }
          >
            {lang == "en"
              ? val.nameEn
              : lang == "fr"
              ? val.nameFr
              : val.nameSpa}
          </div>
        );
      });
    }
  };
  return (
    <div id="Wrapper">
      <div id="Content" class="inner-content">
        <div
          className="content_wrapper clearfix"
          style={{ paddingTop: 110, paddingBottom: 60 }}
        >
          <div className="sections_group">
            <div className="section_wrapper mcb-section-inner">
              <div className="wrap mcb-wrap one valign-top clearfix">
                <div
                  id="dashboard"
                  class="text-dark"
                  style={{
                    width: "90%",
                    margin: "auto",
                  }}
                >
                  <section id="user">
                    <div id="profile-pic">
                      {/* <img src="" alt="user" /> */}
                    </div>
                    <section>
                      <div className="section-title text-light">
                        {getValue("Name", getLang())}
                      </div>
                      {userInfo.name}
                    </section>
                    <section>
                      <div className="section-title text-light">
                        {getValue("Email", getLang())}
                      </div>
                      {userInfo.email}
                    </section>
                    <section>
                      <div className="section-title text-light">
                        {getValue("CompanyName", getLang())}
                      </div>
                      {userInfo.companyName}
                    </section>
                  </section>
                  <section id="packages">
                    <h2 className="section-title">
                      {getValue("SUBSCRIBEDPACKAGE", getLang())}
                    </h2>
                    <div className="packages-wrap">{renderPackages()}</div>
                  </section>
                  <section id="license-start">
                    <span className="text-light">
                      {getValue("LicenseStartDate", getLang())}:
                    </span>{" "}
                    <span>
                      {" "}
                      {userInfo.startDate == null
                        ? "N/A"
                        : dateFormat(userInfo.startDate, "yyyy-mm-dd")}
                    </span>
                  </section>
                  <section id="license-end">
                    <span className="text-light">
                      {getValue("LicenseEndDate", getLang())}:
                    </span>{" "}
                    <span>
                      {" "}
                      {userInfo.endDate == null
                        ? "N/A"
                        : dateFormat(userInfo.endDate, "yyyy-mm-dd")}
                    </span>
                  </section>
                  <section id="notifications">
                    <h2 className="section-title">
                      {getValue("Notifications", getLang())}
                    </h2>
                    <ul>{renderNotifications()}</ul>
                  </section>
                  <section id="settings">
                    <h2 className="section-title">
                      {getValue("Settings", getLang())}
                    </h2>
                    <section>
                      <h3 className="section-title text-light">
                        {getValue("SocioEconomicDataSource", getLang())}
                      </h3>
                      <label className="chk-wrap">
                        <input
                          type="radio"
                          name="radio-group-1"
                          checked={imf}
                          onChange={(e) => {
                            setIsIMF(e, "IMF");
                          }}
                          value={imf}
                        />{" "}
                        {getValue("IMFWord", getLang())}
                      </label>
                      <label className="chk-wrap">
                        <input
                          type="radio"
                          name="radio-group-1"
                          checked={!imf}
                          onChange={(e) => {
                            setIsIMF(e, "WB");
                          }}
                          value={!imf}
                        />{" "}
                        {getValue("WBWord", getLang())}
                      </label>
                    </section>
                    <section>
                      <h3 className="section-title text-light">
                        {getValue("GDPUsed", getLang())}
                      </h3>
                      <label className="chk-wrap">
                        <input
                          type="radio"
                          name="radio-group-2"
                          checked={!isPPP}
                          onChange={(e) => {
                            setIfPPP(e, "Nominal");
                          }}
                          value={!isPPP}
                        />{" "}
                        Nominal
                      </label>
                      <label className="chk-wrap">
                        <input
                          type="radio"
                          name="radio-group-2"
                          checked={isPPP}
                          onChange={(e) => {
                            setIfPPP(e, "PPP");
                          }}
                          value={isPPP}
                        />{" "}
                        PPP
                      </label>
                    </section>
                    <section>
                      <h3 className="section-title text-light">
                        {getValue("Language", getLang())}
                      </h3>
                      <label className="chk-wrap">
                        <input
                          type="radio"
                          name="radio-group-3"
                          value={isEnglish}
                          checked={isEnglish}
                          onChange={(e) => {
                            updateLangauge("en");
                          }}
                        />{" "}
                        {getValue("English", getLang())}
                      </label>
                      <label className="chk-wrap">
                        <input
                          type="radio"
                          name="radio-group-3"
                          value={isArabic}
                          checked={isArabic}
                          onChange={(e) => {
                            updateLangauge("ar");
                          }}
                        />{" "}
                        {getValue("Arabic", getLang())}
                      </label>
                      <label className="chk-wrap">
                        <input
                          type="radio"
                          name="radio-group-3"
                          value={isFrench}
                          checked={isFrench}
                          onChange={(e) => {
                            updateLangauge("fr");
                          }}
                        />{" "}
                        {getValue("French", getLang())}
                      </label>
                    </section>
                  </section>
                  <section id="features">
                    <h3 className="section-title">Available Features</h3>
                    <table border="1">
                      <tr>
                        <td style={{ width: 160 }}>
                          {" "}
                          {getValue("Awards", getLang())}
                        </td>
                        <td>{getAvailableFeatures("AwardsMenuTest")}</td>
                      </tr>
                      <tr>
                        <td>{getValue("Pricing", getLang())}</td>
                        <td>{getAvailableFeatures("PricingTest")}</td>
                      </tr>
                      <tr>
                        <td>{getValue("Valuation", getLang())}</td>
                        <td>{getAvailableFeatures("Valuations")}</td>
                      </tr>
                      <tr>
                        <td>{getValue("Benchmarks", getLang())}</td>
                        <td>{getAvailableFeatures("Benchmark")}</td>
                      </tr>
                      <tr>
                        <td>{getValue("Trends", getLang())}</td>
                        <td>{getAvailableFeatures("Trends")}</td>
                      </tr>
                      <tr>
                        <td>{getValue("SocialData", getLang())}</td>
                        <td>{getAvailableFeatures("PublicSocioEconomics")}</td>
                      </tr>
                    </table>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* side menu */}
    </div>
  );
};

export default Account;
