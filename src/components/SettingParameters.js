import React, { useState, useEffect, useMemo, useRef, Component } from "react";
import APIFunctions from "../utils/APIFunctions";
import dateFormat from "dateformat";
import Select from "react-select";
import { ReactExcel, readFile, generateObjects } from "@ramonak/react-excel";
import { useTable, useSortBy } from "react-table";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MultiSelect } from "react-multi-select-component";
import { trackPromise } from "react-promise-tracker";
import { Loader } from "react-loader-spinner";
const SettingParameters = (props) => {
  const [selected, setSelected] = useState([]);
  const [SelectedBands, setSelectedBands] = useState([]);

  const [selectedPaired, setSelectedPaired] = useState([]);

  const [bands, setBands] = useState([]);
  const [bandId, setBandId] = useState("");

  const [regionalLicenseValue, setRegionalLicenseValue] = useState("");
  const [regionalLicenseValueFiltered, setRegionalLicenseValueFiltered] =
    useState("");
  const [bandTypeValue, setBandTypeValue] = useState("");
  const [bandTypeValueFiltered, setBandTypeValueForFilter] = useState("");

  const [pairedValue, setPairedValue] = useState("");

  const [awards, setAwards] = useState([]);
  const awardsRef = useRef();
  const [startDate, setStartDate] = useState(new Date());
  const [ToDate, setToDate] = useState(new Date());

  const [resultFilter, emplistFilter] = useState([]);
  const [countryId, setCountryId] = useState("");
  const [minGDPValue, setMinGDP] = useState("");
  const [maxGDPValue, setMaxGDP] = useState("");
  const [checked, setChecked] = useState("");
  const [isPPPValue, setPPPValue] = useState("");

  const [options, setoptions] = useState([]);
  const AwardFilter = {
    countryIds: "",
    sourceId: 1,
    Band: "",
    ISPPP: true,
    MaxGDP: 0,
    MinGDP: 0,
    FromYear: "",
    ToYear: "",
    RegionalLicencse: false,
    IsPairedAndUnPaired: false,
    IsPaired: false,
    IsSingle: "",
    ISIMF: false,
  };

  const bandOptions = [
    { value: "s", label: "Single Band" },
    { value: "m", label: "Multi-Band" },
  ];
  const regionalLicenseOptions = [
    { value: true, label: "Yes" },
    { value: false, label: "No" },
  ];
  const pairOptions = [
    { value: -1, label: "Paired + UnPaired" },
    { value: 1, label: "Paired " },
    { value: 0, label: "Un-Paired" },
  ];

  awardsRef.current = awards;
  useEffect(() => {
    retrieveAwards();
  }, []);
  useEffect(() => {
    APIFunctions.getAllFilters("AwardsMenu")
      .then((resp) => resp)
      .then((resp) => emplistFilter(resp.data));
  }, []);
  const retrieveAwards = () => {
    filterAwards();
  };
  const SaveFilterResult = () => {
    console.log(selected);
    var countryIds = "";

    var value = [];
    for (var i = 0, l = selected.length; i < l; i++) {
      value.push(selected[i].value);
    }
    countryIds = value.join(",");

    var arr = [];
    var dataOfCountries = {
      TemplateId: 0,
      ControlType: "Select",
      ControlValue: countryIds,
      ControlName: "Country",
      IsDeleted: false,
      CreatedBy: 0,
      CreationDate: null,
    };
    arr.push(dataOfCountries);

    APIFunctions.addFilter(arr)
      .then((response) => {
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const filterAwards = () => {
    AwardFilter.FromYear = startDate.getFullYear();
    AwardFilter.ToYear = ToDate.getFullYear();
    console.log(isPPPValue);
    AwardFilter.ISPPP = isPPPValue;
    AwardFilter.ISIMF = false;

    var value = [];
    for (var i = 0, l = selected.length; i < l; i++) {
      value.push(selected[i].value);
    }
    AwardFilter.countryIds = value.join(",");
    var bandsArray = [];
    for (var i = 0, l = bands.length; i < l; i++) {
      bandsArray.push(bands[i].value);
    }
    for (var i = 0, l = selectedPaired.length; i < l; i++) {
      if (selectedPaired[i].value == 1) {
        AwardFilter.isPaired = true;
      }
      if (selectedPaired[i].value == -1) {
        AwardFilter.isPairedAndUnPaired = true;
      }
      if (selectedPaired[i].value == 0) {
        AwardFilter.isUnPaired = true;
      }
    }
    AwardFilter.regionalLicense = regionalLicenseValueFiltered;
    AwardFilter.isSingle = bandTypeValueFiltered;
    AwardFilter.maxGDP = maxGDPValue;
    AwardFilter.MinGDP = minGDPValue;

    AwardFilter.Band = bandsArray.join(",");
    console.log(AwardFilter);
    trackPromise(
      APIFunctions.filterAwards(AwardFilter)
        .then((response) => {
          setAwards(response.data);
        })
        .catch((e) => {
          console.log(e);
        })
    );
  };

  useEffect(() => {
    APIFunctions.getAllBands()
      .then((resp) => resp)
      .then((resp) => setBands(resp.data));
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

  const GetCountryNameById = (id) => {
    return options.find((x) => x.value === id).label;
  };
  const handleMinGdpChange = (event) => {
    const { name, value } = event.target;
    setMinGDP(value);
    AwardFilter.MinGDP = value;
  };
  const handleMaxGdpChange = (event) => {
    const { name, value } = event.target;
    setMaxGDP(value);

    AwardFilter.MaxGDP = value;
  };

  const handleChangePPP = (event) => {
    setPPPValue(false);
  };
  const handleChangePPP2 = (event) => {
    setPPPValue(true);
  };
  const handleChangeBands = (selectedOptions) => {
    var value = [];
    for (var i = 0, l = selectedOptions.length; i < l; i++) {
      value.push(selectedOptions[i].value);
    }
    setSelectedBands(selectedOptions);
    console.log(selectedOptions);
    AwardFilter.Band = value.join(",");
  };
  const handleChangePaired = (selectedOptions) => {
    AwardFilter.IsPairedAndUnPaired = selectedOptions.id;
    setPairedValue(selectedOptions.id);
  };
  const handleChangeRegionalLicense = (selectedOptions) => {
    setRegionalLicenseValue(selectedOptions.id);
    setRegionalLicenseValueFiltered(selectedOptions.value);
  };

  const handleChangeFilter = (selectedOptions) => {
    APIFunctions.GetDetailsByFilterId(selectedOptions.id)
      .then((response) => {
        console.log(response.data);
        var details = response.data;
        for (var i = 0, l = details.length; i < l; i++) {
          var control = details[i].controlName;
          if (control == "Country") {
            var values = details[i].controlValue.split(",");
            var arr = [];
            for (var k = 0; k < values.length; k++) {
              var ob = new Object();
              ob.value = parseInt(values[k]);
              ob.label = GetCountryNameById(parseInt(values[k]));
              arr.push(ob);
            }
            setSelected(arr);
          } else if (control == "Band") {
            var values = details[i].controlValue.split(",");
            var arr = [];
            for (var k = 0; k < values.length; k++) {
              var ob = new Object();
              ob.value = values[k];
              ob.label = values[k];
              arr.push(ob);
            }

            setSelectedBands(arr);
          } else if (control == "MinGDP") {
            setMinGDP(parseFloat(details[i].controlValue));
          } else if (control == "MaxGDP") {
            setMaxGDP(parseFloat(details[i].controlValue));
          } else if (control == "FromYear") {
            var currentDate = new Date();
            currentDate.setYear(parseInt(details[i].controlValue));
            setStartDate(currentDate);
          } else if (control == "ToYear") {
            var currentDate = new Date();
            currentDate.setYear(parseInt(details[i].controlValue));
            setToDate(currentDate);
          } else if (control == "RegionalLicense") {
            setRegionalLicenseValue({
              value: parseInt(details[i].controlValue),
              label: regionalLicenseOptions.find(
                (x) => x.value == parseInt(details[i].controlValue)
              ).label,
            });
          } else if (control == "Paired") {
            setPairedValue({
              value: parseInt(details[i].controlValue),
              label: pairOptions.find(
                (x) => x.value == parseInt(details[i].controlValue)
              ).label,
            });
          } else if (control == "BandType") {
            setBandTypeValue({
              value: parseInt(details[i].controlValue),
              label: bandOptions.find(
                (x) => x.value == parseInt(details[i].controlValue)
              ).label,
            });
          }
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const handleChangeBandType = (selectedOptions) => {
    AwardFilter.IsSingle = selectedOptions.value;

    setBandTypeValueForFilter(selectedOptions.value);
    setBandTypeValue(selectedOptions.id);
  };
  const handleAwardType = (selectedOptions) => {
    AwardFilter.IsPaired = selectedOptions.value;
  };
  const columns = useMemo(
    () => [
      {
        Header: "Country",
        accessor: "countryName",
      },
      {
        Header: "POP",
        accessor: "pop",
      },
      {
        Header: "GDP",
        accessor: "gdp",
        show: true,
      },
      // {
      //   Header: "GDPc-PPP, k$",
      //   accessor: "gdpp",
      //   show: !checked,
      // },
      {
        Header: "Operator Name",
        accessor: "operatorName",
      },

      {
        Header: "Award Date",
        accessor: "year",
      },
      {
        Header: "Upfront Fees ($M)",
        accessor: "upFrontFees",
      },
      {
        Header: "Annual Fees ($M)",
        accessor: "annualFees",
      },
      {
        Header: "Term (Y)",
        accessor: "terms",
      },
      {
        Header: "Band",
        accessor: "band",
      },
      {
        Header: "Pairing",
        accessor: "pairing",
      },
      {
        Header: "Total MHZ",
        accessor: "mhz",
      },
      {
        Header: "Reserve price($/MHz)",
        accessor: "reservePrice",
      },
      {
        Header: "Coverage",
        accessor: "coverage",
      },
      // {
      //   Header: "Creation Date",
      //   accessor: "creationDate",
      //   Cell: (props) => {
      //     return dateFormat(props.creationDate, "mmmm dS, yyyy");
      //   },
      // },
    ],
    []
  );
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data: awards,
        initialState: {
          hiddenColumns: columns.map((column) => {
            if (column.show === false) return column.accessor || column.id;
          }),
        },
      },
      useSortBy
    );

  return (
    <div id="Wrapper">
  <div id="Header_wrapper">
    <header id="Header">
      <div id="Top_bar">
        <div className="container">
          <div className="column one">
            <div className="top_bar_left clearfix">
              <div className="logo">
                <a id="logo" href="./" title="Spectre home" data-height={60} data-padding={25}>
                <img className="logo-main scale-with-grid" src={"./public_pages/images/spectre-logo.svg"} data-retina="images/spectre-logo.svg" data-height={33} alt="Spectre Logo" />
                    <img className="logo-sticky scale-with-grid" src={"./public_pages/images/spectre-logo.svg"} data-retina="images/spectre-logo.svg" data-height={33} alt="Spectre Logo" />
                    <img className="logo-mobile scale-with-grid" src={"./public_pages/images/spectre-logo.svg"} data-retina="images/spectre-logo.svg" data-height={33} alt="Spectre Logo" />
                    <img className="logo-mobile-sticky scale-with-grid" src={"./public_pages/images/spectre-logo.svg"} data-retina="images/spectre-logo.svg" data-height={33} alt="Spectre Logo" />
                </a>
              </div>
              <div className="menu_wrapper">
                <nav id="menu">
                  <ul id="menu-main-menu" className="menu menu-main">
                    <li className="submenu current-menu-item">
                      <a href="#home-about"><span>About</span></a>
                    </li>
                    <li className="submenu">
                      <a href="#home-features"><span>Features</span></a>
                    </li>
                    <li className="submenu">
                      <a href="#home-packages"><span>Packages and Services</span></a>
                    </li>
                    <li className="submenu">
                      <a href="#home-news-slider"><span>News</span></a>
                    </li>
                    <li className="submenu">
                      <a href="#home-contact"><span>Contact Us</span></a>
                    </li>
                  </ul>
                </nav>
                <a className="responsive-menu-toggle" href="#"><i className="icon-menu-fine" /></a>
              </div>
            </div>
            <div className="top_bar_right">
              <div className="top_bar_right_wrapper">
                <a href="http://bit.ly/1M6lijQ" className="action_button" target="_blank"><i className="icon-lock" /> Login</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  </div>
  <div id="Content">
    <div className="content_wrapper clearfix" style={{paddingTop: 110, paddingBottom: 60}}>
      <div className="sections_group">
        <div className="section_wrapper mcb-section-inner">
          <div className="wrap mcb-wrap one valign-top clearfix">
            <div className="entry-content">
              <div className="section mcb-section equal-height-wrap awards-view-table-div" style={{paddingTop: 110, paddingBottom: 60}}>
                <h1>Spectrum Price Setting Parameters</h1>
                <div className="column mcb-column one column_column">
                  <div className="column_attr clearfix">
                    <hr className="no_line" style={{margin: '0 auto 15px'}} />
                    <div id="contactWrapper">
                      <hr className="setting-hr" style={{margin: '0 auto 15px'}} />
                      <div className="column one-second">
                        <h5 className="setting-title">Analysis Options</h5>
                        <div>
                          <table id="analysis-options-table" className="text-start">
                            <tbody><tr>
                                <td><label><input type="checkbox" /> <span>Adjust by PPP factor</span></label></td>
                              </tr>
                              <tr>
                                <td><label><input type="checkbox" /> <span>Normalize by GDPc (nominal)</span></label></td>
                              </tr>
                              <tr>
                                <td><label><input type="checkbox" /> <span>Adjust Inflation</span></label></td>
                              </tr>
                              <tr>
                                <td><label><input type="checkbox" /> <span>Excl. Outliers</span></label></td>
                              </tr>
                              <tr>
                                <td><label><input type="checkbox" /> <span>Show Markers</span></label></td>
                              </tr>
                              <tr>
                                <td colSpan={2}>Sum bands: paired + unpaired</td>
                              </tr>
                              <tr>
                                <td>
                                  <label>Upper percentile <input type="number" className="form-control" placeholder="Upper percentile" /></label>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <label>Lower percentile <input type="number" className="form-control" placeholder="Lower percentile" /></label>
                                </td>
                              </tr>
                            </tbody></table>
                        </div>
                      </div>
                      <div className="column one-second">
                        <h5 className="setting-title">Bands</h5>
                        <select multiple id="bands-dd" />
                      </div>
                      <div className="column one-second">
                        <h5 className="setting-title">Show Awards</h5>
                        <div>
                          <table id="show-awards-table">
                            <tbody><tr>
                                <td><label><input type="checkbox" /> Single band</label></td>
                                <td><label><input type="checkbox" /> Multi band</label></td>
                              </tr>
                              <tr>
                                <td><label><input type="checkbox" /> Paired Awards</label></td>
                                <td><label><input type="checkbox" /> Unpaired Awards</label></td>
                              </tr>
                              <tr>
                                <td><label><input type="checkbox" /> Pair + Unpair Awards</label></td>
                                <td><label><input type="checkbox" /> Regional licenses</label></td>
                              </tr>
                              <tr>
                                <td colSpan={2}><label>Max GDP/Capita (nominal) $k <input type="number" className="form-control" placeholder="Max" /></label></td>
                              </tr>
                              <tr>
                                <td colSpan={2}><label>Min GDP/capita (nominal) $k <input type="number" className="form-control" placeholder="Min" /></label></td>
                              </tr>
                              <tr>
                                <td colSpan={2}><label>Awards from <input type="number" className="form-control" placeholder="Awards from" /></label></td>
                              </tr>
                              <tr>
                                <td colSpan={2}><label>Awards to <input type="number" className="form-control" placeholder="Awards to" /></label></td>
                              </tr>
                            </tbody></table>
                        </div>
                      </div>
                      <div className="column one-second">
                        <h5 className="setting-title">License Terms</h5>
                        <div>
                          <table id="license-table">
                            <tbody><tr>
                                <td><label>Term, years <input type="text" className="form-control" placeholder="Term, years" /></label></td>
                              </tr>
                              <tr>
                                <td><label>Discount rate, % <input type="text" className="form-control" placeholder="Discount rate, %" /></label></td>
                              </tr>
                              <tr>
                                <td><label>Issue Date <input type="text" className="form-control" placeholder="Issue Date" /></label></td>
                              </tr>
                            </tbody></table>
                        </div>
                      </div>
                      <div className="column one div-select">
                        <h5 className="setting-title">Countries</h5>
                        <select id="selectCountries" multiple>
                        </select>
                        <div className="column one btn-setting">
                          <input type="button" defaultValue="Show prices" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer id="Footer" className="clearfix">
        <div className="widgets_wrapper" style={{padding: '70px 0'}}>
          <div className="container">
            <div className="column one-fourth">
              <aside className="widget_text widget widget_custom_html">
                <div className="textwidget custom-html-widget">
                  <hr className="no_line" style={{margin: '0 auto 5px'}} />
                  <ul>
                    <li style={{marginBottom: 10}}>
                      <span style={{color: '#f94203', marginRight: 10}}>→</span><a href="#">Lorem ipsum</a>
                    </li>
                    <li style={{marginBottom: 10}}>
                      <span style={{color: '#f94203', marginRight: 10}}>→</span><a href="#">Praesent pretium</a>
                    </li>
                    <li style={{marginBottom: 10}}>
                      <span style={{color: '#f94203', marginRight: 10}}>→</span><a href="#">Pellentesque</a>
                    </li>
                    <li style={{marginBottom: 10}}>
                      <span style={{color: '#f94203', marginRight: 10}}>→</span><a href="#">Aliquam</a>
                    </li>
                    <li style={{marginBottom: 10}}>
                      <span style={{color: '#f94203', marginRight: 10}}>→</span><a href="#">Lorem ipsum</a>
                    </li>
                  </ul>
                </div>
              </aside>
            </div>
            <div className="column one-fourth">
              <aside className="widget_text widget widget_custom_html">
                <div className="textwidget custom-html-widget">
                  <hr className="no_line" style={{margin: '0 auto 5px'}} />
                  <ul>
                    <li style={{marginBottom: 10}}>
                      <span style={{color: '#f94203', marginRight: 10}}>→</span><a href="#">Etiam dapibus</a>
                    </li>
                    <li style={{marginBottom: 10}}>
                      <span style={{color: '#f94203', marginRight: 10}}>→</span><a href="#">Nunc sit</a>
                    </li>
                    <li style={{marginBottom: 10}}>
                      <span style={{color: '#f94203', marginRight: 10}}>→</span><a href="#">Etiam tempor</a>
                    </li>
                    <li style={{marginBottom: 10}}>
                      <span style={{color: '#f94203', marginRight: 10}}>→</span><a href="#">Lorem ipsum</a>
                    </li>
                    <li style={{marginBottom: 10}}>
                      <span style={{color: '#f94203', marginRight: 10}}>→</span><a href="#">Nunc sit</a>
                    </li>
                  </ul>
                </div>
              </aside>
            </div>
            <div className="column one-fourth">
              <aside className="widget_text widget widget_custom_html">
                <div className="textwidget custom-html-widget">
                  <hr className="no_line" style={{margin: '0 auto 5px'}} />
                  <ul>
                    <li style={{marginBottom: 10}}>
                      <span style={{color: '#f94203', marginRight: 10}}>→</span><a href="#">Praesent pretium</a>
                    </li>
                    <li style={{marginBottom: 10}}>
                      <span style={{color: '#f94203', marginRight: 10}}>→</span><a href="#">Pellentesque</a>
                    </li>
                    <li style={{marginBottom: 10}}>
                      <span style={{color: '#f94203', marginRight: 10}}>→</span><a href="#">Aliquam</a>
                    </li>
                    <li style={{marginBottom: 10}}>
                      <span style={{color: '#f94203', marginRight: 10}}>→</span><a href="#">Etiam dapibus</a>
                    </li>
                    <li style={{marginBottom: 10}}>
                      <span style={{color: '#f94203', marginRight: 10}}>→</span><a href="#">Aliquam</a>
                    </li>
                  </ul>
                </div>
              </aside>
            </div>
            <div className="column one-fourth">
              <aside className="widget_text widget widget_custom_html">
                <div className="textwidget custom-html-widget">
                  <h5>Be Internet2</h5>
                  <p>
                    Level 13, 2 Elizabeth St,
                    <br /> Melbourne, Victoria 3000
                  </p>
                  <p>
                    <a style={{color: '#f94203'}} href="#">noreply@envato.com</a>
                    <br /> +61 (0) 3 8376 6284
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </div>
        <div className="footer_copy">
          <div className="container">
            <div className="column one">
              <a id="back_to_top" className="button button_js" href="#"><i className="icon-up-open-big" /></a>
              <div className="copyright">
                © 2018 Be Internet 2 - BeTheme. Muffin group - HTML by <a target="_blank" rel="nofollow" href="http://bit.ly/1M6lijQ">BeantownThemes</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
    {/* side menu */}
    <div id="Side_slide" className="right dark" data-width={250}>
      <div className="close-wrapper">
        <a href="#" className="close"><i className="icon-cancel-fine" /></a>
      </div>
      <div className="menu_wrapper" />
    </div>
    <div id="body_overlay" />
  </div>
</div>

  );
};

export default SettingParameters;
