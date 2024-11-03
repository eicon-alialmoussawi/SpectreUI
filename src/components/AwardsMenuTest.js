import React, { useState, useEffect, useMemo, useRef } from "react";
import APIFunctions from "../utils/APIFunctions";
import { useTable, useSortBy, usePagination } from "react-table";
import "react-datepicker/dist/react-datepicker.css";
import { trackPromise } from "react-promise-tracker";
import { getValue } from "../Assets/Language/Entries";
import { getLang, getIMF, getPPP, displayPop } from "../utils/common";
import { Alert, LoadingAlert, AlertError } from "../components/f_Alerts";
import Modal from "react-bootstrap/Modal";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import $ from 'jquery';
import Awards2 from "./Awards2";

const AwardsMenuTest = (props) => {

    const [filters, setFilters] = useState();
    const [checkAll, setCheckAll] = React.useState(false);
    const [singleBand, setSingleBand] = useState(true);
    const [multiBand, setMultiBand] = useState(false);
    const [includeRegional, setIncludeRegional] = useState(false);
    const [paired, setPaired] = useState(true);
    const [unPaired, setUnPaired] = useState(false);
    const [pairedUnpaired, setPairedUnPaired] = useState(false);
    const [minGDP, setMinGDP] = useState();
    const [maxGDP, setMaxGDP] = useState();
    const [fromDate, setFromDate] = useState();
    const [toDate, setToDate] = useState();
    const [bandOptionsList, setSelectedBandsOptions] = useState([]);
    const [options, setoptions] = useState([]);
    const [awards, setAwards] = useState([]);
    const [showDisplay, setShowDisplay2] = useState(true);
    const [iconClass, setIconClass] = useState("spectre-angle-up btn btn-primary background-color-2 color-white mr-2");
    const [showTxt, setShowTxt] = useState(getValue("ShowLess", getLang()));
    const [numberOfAwards, setNumberOfAwards] = useState(0);
    const [isIMF, setIsIMF] = useState(false);
    const [isPPP, setIsPPP] = useState(true);
    const optionsRef = useRef();
    const bandOptionsListRef = useRef();
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = React.useState("Transitioning...");
    const [isExportPDF, setisExportPDF] = useState(false);

    const [isOpen3, setIsOpen3] = useState(false);


    const [checkAllBands, setCheckAllBands] = useState(false);

    var _exportedFilters;
    //const tableRef = useRef(null);

    useEffect(() => {
        APIFunctions.getUserCountries("AwardsMenuTest")
            .then((resp) => resp)
            .then((resp) => bindOptions(resp.data))
            .then((resp) => getUserFilters());
    }, []);

    useEffect(() => {
        APIFunctions.getAllBands()
            .then((resp) => resp)
            .then((resp) => bindOptionsBand(resp.data));
    }, []);

    useEffect(() => {
        $('.menuItems').removeClass("active");
        $('#AwardsMenuTest_page').addClass("active");
    })

    const bindOptions = (data) => {
        var arr = [];
        for (var i = 0, l = data.length; i < l; i++) {
            var ob = new Object();
            ob.label = data[i].nameEn;
            ob.labelAr = data[i].nameAr;
            // ob.label = getLang() == "ar" ? data[i].nameAr : data[i].nameEn;
            ob.value = data[i].countryId;
            ob.isChecked = true;
            ob.regionId = data[i].regionId;
            arr.push(ob);
        }

        setoptions(arr);
    };
    const bindOptionsBand = (data) => {
        var arr = [];
        for (var i = 0, l = data.length; i < l; i++) {
            var ob = new Object();
            ob.label = data[i].value;
            ob.value = data[i].value;
            data[i].value == 700 ? ob.isChecked = true : ob.isChecked = false;
            arr.push(ob);
        }
        setSelectedBandsOptions(arr);
    };

    optionsRef.current = options;
    bandOptionsListRef.current = bandOptionsList;
    const setDisplay = () => {
        setShowDisplay2(!showDisplay);
        setIconClass(!showDisplay == true ? "spectre-angle-up btn btn-primary background-color-2 color-white mr-2"
            : "spectre-angle-down btn btn-primary background-color-2 color-white mr-2");
        setShowTxt(!showDisplay == true ? getValue("ShowLess", getLang()) : getValue("ShowMore", getLang()))
    }

    const setCountryChecked = (id, isChecked, region) => {
        var data = optionsRef.current;
        var item = data.filter((item) => item.value == id);
        var itemIndex = data.indexOf(item[0]);
        
        if(region === -1) {
            if(item[0]) {
                data = data.filter((item) => item.value != id);
                data.splice(itemIndex, 0, { value: id, isChecked: isChecked, label: item[0].label, labelAr: item[0].labelAr, regionId: item[0].regionId });

                data.map((item) => {
                    if(item.regionId === id) {
                        return item.isChecked = isChecked;
                    } else {
                        return 1;
                    }
                });
            }
        } else {
            data = data.filter((item) => item.value != id);
            data.splice(itemIndex, 0, { value: id, isChecked: isChecked, label: item[0].label, labelAr: item[0].labelAr, regionId: item[0].regionId });
        }

        if(region !== -1) {
            var regionChecked = data.filter((x) => x.isChecked == true && x.regionId == region).length;
            var regionLength = data.filter((x) => x.regionId == region).length;
    
            if(regionChecked === regionLength) {
                data.map((item) => {
                    if(item.value === region) {
                        return item.isChecked = true;
                    } else {
                        return 1;
                    }
                });
            } else {
                data.map((item) => {
                    if(item.value === region) {
                        return item.isChecked = false;
                    } else {
                        return 1;
                    }
                })
            }
        }
        
        setoptions(data);

        var lstChecked = data.filter((x) => x.isChecked == true).length;
        var lst = options.length;

        if (lstChecked == lst)
            setCheckAll(true);
        else
            setCheckAll(false);
    }

    const getCheckedCountry = (id) => {
        var checked = false;
        var allData = options;
        if (allData.length > 0) {
            var obj = allData.filter((item) => {
                if (item.value == id) {
                    return item;
                }
            });

            checked = obj[0].isChecked;
        }
        return checked;
    }

    const renderCountries = () => {
        var countries = options;
        if(getLang() == "ar") 
            countries.sort((a, b) => (a.labelAr > b.labelAr) ? 1 : ((b.labelAr > a.labelAr) ? -1 : 0));
        else 
            countries.sort((a, b) => (a.labelEn > b.labelEn) ? 1 : ((b.labelEn > a.labelEn) ? -1 : 0));
        if (countries != null && countries.length > 0) {
            {
                return (countries.map((val, idx) => (
                    <div className="form-group">
                        <label className="chk-wrap">
                            <input type="checkbox"
                                data-country={val.value}
                                checked={getCheckedCountry(val.value)}
                                value={getCheckedCountry(val.value)}
                                data-region={val.regionId}
                                onChange={(e) => setCountryChecked(val.value, e.target.checked, val.regionId)} /> {
                                getLang() == "ar" ? val.labelAr : val.label}
                        </label>
                    </div>
                )));
            }
        }
    }

    const renderCountries2 = () => {
        var countries = options;
        if (getLang() == "ar")
          countries.sort((a, b) =>
            a.labelAr > b.labelAr ? 1 : b.labelAr > a.labelAr ? -1 : 0
          );
        else
          countries.sort((a, b) =>
            a.labelEn > b.labelEn ? 1 : b.labelEn > a.labelEn ? -1 : 0
          );
        if (countries != null && countries.length > 0) {
          {
            return countries.map((val, idx) => (
              <div className="form-group">
                <label className="chk-wrap" style={{ display: "flex" }}>
                  <input
                    type="checkbox"
                    data-country={val.value}
                    style={{ margin: "4px" }}
                    checked={getCheckedCountry(val.value)}
                    value={getCheckedCountry(val.value)}
                    data-region={val.regionId}
                    onChange={(e) => setCountryChecked(val.value, e.target.checked, val.regionId)}
                  />{" "}
                  {getLang() == "ar" ? val.labelAr : val.label}
                </label>
              </div>
            ));
          }
        }
      };
    

    const getCheckedBand = (id) => {
        var checked = false;
        var allData = bandOptionsList;
        if (allData.length > 0) {
            var obj = allData.filter((item) => {
                if (item.value == id) {
                    return item;
                }
            });

            checked = obj[0].isChecked;
        }
        return checked;
    }

    const setCheckBand = (id, isChecked) => {
        var data = bandOptionsListRef.current;
        var item = data.filter((item) => item.value == id);
        if (item.length > 0) {
            var itemIndex = data.indexOf(item[0]);
            data = data.filter((item) => item.value != id);
            data.splice(itemIndex, 0, { value: id, isChecked: isChecked, label: item[0].label });
        }
        setSelectedBandsOptions(data);
    }


    const handleCheckAll = (isChecked) => {
        setCheckAll(isChecked);
        var updatedSelectedCountries = options;
        updatedSelectedCountries.map((row, i) => {
            row.isChecked = isChecked;
        })
        setoptions(updatedSelectedCountries);

    };

    const renderBands = () => {
        var bands = bandOptionsList;
        if (bands != null && bands.length > 0) {
            {
                return (bands.map((val, idx) => (
                    <div className="form-group">
                        <label>{val.value}
                            <input type="checkbox"
                                checked={getCheckedBand(val.value)}
                                value={getCheckedBand(val.value)}
                                onChange={(e) => setCheckBand(val.value, e.target.checked)} />
                        </label>
                    </div>
                )));
            }
        }
    }

    const exportToPDF = () => {

        var AwardFilter = new Object();
        AwardFilter.Lang = getLang();
        AwardFilter.FromYear = parseInt(fromDate);
        AwardFilter.ToYear = parseInt(toDate);
        AwardFilter.IsPPP = getPPP() == "true" ? true : false;
        AwardFilter.IsIMF = getIMF() == "true" ? true : false;
        //  AwardFilter.CountryIds = selectedCountries.join(",");
        AwardFilter.IsSingle = singleBand;
        AwardFilter.IsMultiple = multiBand;
        AwardFilter.IsPairedAndUnPaired = pairedUnpaired;
        AwardFilter.IsPaired = paired;
        AwardFilter.IsUnPaired = unPaired;
        AwardFilter.RegionalLicense = includeRegional;
        AwardFilter.MaxGDP = parseInt(maxGDP);
        AwardFilter.MinGDP = parseInt(minGDP);
        AwardFilter.MinGDP = parseInt(minGDP);

        // AwardFilter.Band = selectedBands.join(",");

        setFilters(AwardFilter);
        _exportedFilters = AwardFilter;


        console.log(_exportedFilters);


        LoadingAlert("Show");
        setisExportPDF(true);

        setTimeout(() => {
            setisExportPDF(false);
        }, 300);
    }


    const checkIfCanSearch = () => {
        APIFunctions.checkIfCanView("AwardsMenuTest")
            .then((response) => {
                if (response.data) {
                    filterAwards();
                }
                else {
                    setNumberOfAwards(0);
                    Alert(getValue("FeatureNotAvailable", getLang()));
                    return;
                }
            })
            .catch((e) => {
                console.log(e);
            });
    }

    const selectAllBands = (evt) => {

        if (evt == "bandSelection") {
            var updatedSelectedCountries = bandOptionsList;
            updatedSelectedCountries.map((row, i) => {
                row.isChecked = !checkAllBands;
            })

            setCheckAllBands(!checkAllBands);
            setSelectedBandsOptions(bandOptionsList);
        }
    }
    const filterAwards = () => {
        var selectedCountries = [];
        var selectedBands = [];

        // Validations Begin

        var valid = true;

        if ((minGDP == "" || minGDP == null) && minGDP != "0") {
            valid = false;
        }
        if (maxGDP == null || maxGDP == ""
            || fromDate == null || fromDate == "" || toDate == null || toDate == "") {
            valid = false;

        }
        if (!valid) {
            AlertError(getValue("PleaseFillMissingFields", getLang()));
            return;
        }

        var regions = options.filter((country) => {
            return country.regionId === -1
        });
        console.log("countries: ", options, "\nregions:", regions);
        for (var i = 0, l = options.length; i < l; i++) {
            if (options[i].isChecked) {
                selectedCountries.push(options[i].value);
            }
        }
        for (var i = 0, l = bandOptionsList.length; i < l; i++) {
            if (bandOptionsList[i].isChecked) {
                selectedBands.push(bandOptionsList[i].value);
            }
        }

        if (selectedCountries.length == 0) {
            AlertError(getValue("ChooseOneCountry", getLang()));
            return;
        }
        if (selectedBands.length == 0) {
            AlertError(getValue("ChooseOneBand", getLang()));
            return;
        }
        if (parseInt(minGDP) < 0) {
            AlertError(getValue("MinGDPValidation", getLang()));
            return;
        }
        if (parseInt(minGDP) > 200000) {
            AlertError(getValue("MaxGDPValidation", getLang()));
            return;
        }
        if (parseInt(maxGDP) < 0) {
            AlertError(getValue("MinGDPValidation", getLang()));
            return;
        }
        if (parseInt(maxGDP) > 200000) {
            AlertError(getValue("MaxGDPValidation", getLang()));
            return;
        }
        if (parseInt(minGDP) > parseInt(maxGDP)) {
            AlertError(getValue("GDPValidation", getLang()));
            return;
        }
        if (parseInt(fromDate) > parseInt(toDate)) {
            AlertError(getValue("DateValidation", getLang()));
            return;
        }
        if (fromDate.length > 4 || fromDate.length < 4) {
            AlertError(getValue("ValidToDate", getLang()));
            return;
        }
        if (toDate.length > 4 || toDate.length < 4) {
            AlertError(getValue("ValidFromDate", getLang()));
            return;
        }
        if (parseInt(fromDate) < 1985) {
            AlertError(getValue("MinimumFromDate", getLang()));
            return;
        }
        if (parseInt(fromDate) > new Date().getFullYear()) {
            AlertError(getValue("MaximumFromDate", getLang()) + new Date().getFullYear());
            return;
        }
        if (parseInt(toDate) < 1985) {
            AlertError(getValue("MinimumToDate", getLang()));
            return;
        }
        if (parseInt(toDate) > new Date().getFullYear()) {
            AlertError(getValue("MaximumToDate", getLang()) + new Date().getFullYear());
            return;
        }

        if (!(singleBand || multiBand)) {
            AlertError(getValue("SingleValidation", getLang()));
            return;
        }

        if (!(paired || unPaired || pairedUnpaired)) {
            AlertError(getValue("SelectPairing", getLang()));
            return;
        }

        // Validations End

        var AwardFilter = new Object();
        AwardFilter.Lang = getLang();
        AwardFilter.FromYear = parseInt(fromDate);
        AwardFilter.ToYear = parseInt(toDate);
        AwardFilter.IsPPP = getPPP() == "true" ? true : false;
        AwardFilter.IsIMF = getIMF() == "true" ? true : false;
        AwardFilter.CountryIds = selectedCountries.join(",");
        AwardFilter.IsSingle = singleBand;
        AwardFilter.IsMultiple = multiBand;
        AwardFilter.IsPairedAndUnPaired = pairedUnpaired;
        AwardFilter.IsPaired = paired;
        AwardFilter.IsUnPaired = unPaired;
        AwardFilter.RegionalLicense = includeRegional;
        AwardFilter.MaxGDP = parseInt(maxGDP);
        AwardFilter.MinGDP = parseInt(minGDP);
        AwardFilter.Band = selectedBands.join(",");


        var list = [];
        list.push({ id: 0, pageUrl: "AwardsMenuTest", field: "MinGDP", value: minGDP.toString(), userId: 0 },
            { id: 0, pageUrl: "AwardsMenuTest", field: "MaxGDP", value: maxGDP.toString(), userId: 0 },
            { id: 0, pageUrl: "AwardsMenuTest", field: "FromYear", value: fromDate.toString(), userId: 0 },
            { id: 0, pageUrl: "AwardsMenuTest", field: "ToYear", value: toDate.toString(), userId: 0 },
            { id: 0, pageUrl: "AwardsMenuTest", field: "RegionalLicense", value: includeRegional.toString(), userId: 0 },
            { id: 0, pageUrl: "AwardsMenuTest", field: "Paired", value: AwardFilter.IsPaired.toString(), userId: 0 },
            { id: 0, pageUrl: "AwardsMenuTest", field: "IsUnPaired", value: AwardFilter.IsUnPaired.toString(), UserId: 0 },
            { id: 0, pageUrl: "AwardsMenuTest", field: "IsPairedAndUnPaired", value: AwardFilter.IsPairedAndUnPaired.toString(), userId: 0 },
            { id: 0, pageUrl: "AwardsMenuTest", field: "IsMultiple", value: AwardFilter.IsMultiple.toString(), userId: 0 },
            { id: 0, pageUrl: "AwardsMenuTest", field: "IsSingle", value: AwardFilter.IsSingle.toString(), userId: 0 },
            { id: 0, pageUrl: "AwardsMenuTest", field: "Bands", value: JSON.stringify(bandOptionsList), userId: 0 },
            { id: 0, pageUrl: "AwardsMenuTest", field: "Country", value: JSON.stringify(options), userId: 0 })

        // console.log("List: ", list);

        // console.log("Options: ", options);

        LoadingAlert("Show");

        trackPromise(
            APIFunctions.filterAwards(AwardFilter)
                .then((response) => {
                    LoadingAlert("hide");
                    if (response.data == 0 || response.data.length < 1 || !Array.isArray(response.data)) {
                        Alert(getValue("NoDataToDisplay", getLang()));
                        setAwards([]);
                        setNumberOfAwards(0);
                        saveUserFilters(list);
                        return;
                    }
                    else {
                        setAwards(response.data);
                        setNumberOfAwards(response.data.length);
                        var element = document.getElementById("table-content");
                        element.scrollIntoView(true, {
                            block: "start",
                            inline: "nearest",
                            behavior: "smooth",
                        });
                        saveUserFilters(list);
                        return;
                    }
                })
                .catch((e) => {
                    LoadingAlert("hide");
                    console.log(e);
                })
        );



    }

    const saveUserFilters = (list) => {
        APIFunctions.saveUserFilters(list)
            .then((resp) => resp)
            .then((resp) => console.log(resp));
    };

    const getUserFilters = () => {
        // LoadingAlert("Show");
        APIFunctions.getUserFilters("AwardsMenuTest")
            .then((resp) => resp)
            .then((resp) => {
                var data = resp.data;

                if (data.length > 0) {

                    var fromYear = data.filter((item) => item.field == "FromYear");
                    var toYear = data.filter((item) => item.field == "ToYear");
                    var maxValue = data.filter((item) => item.field == "MaxGDP");
                    var minGDP = data.filter((item) => item.field == "MinGDP");
                    var regionalLicense = data.filter((item) => item.field == "RegionalLicense");
                    var unPaired = data.filter((item) => item.field == "IsUnPaired");
                    var pairedUnpaired = data.filter((item) => item.field == "IsPairedAndUnPaired");
                    var paired = data.filter((item) => item.field == "Paired");
                    var multiple = data.filter((item) => item.field == "IsMultiple");
                    var single = data.filter((item) => item.field == "IsSingle");
                    var bands = data.filter((item) => item.field == "Bands");
                    var countries = data.filter((item) => item.field == "Country");
                    setFromDate(fromYear[0].value);
                    setToDate(toYear[0].value);
                    setMinGDP(minGDP[0].value);
                    setMaxGDP(maxValue[0].value);
                    setPaired(paired[0].value == "true" ? true : false);
                    setUnPaired(unPaired[0].value == "true" ? true : false);
                    setPairedUnPaired(pairedUnpaired[0].value == "true" ? true : false);
                    setIncludeRegional(regionalLicense[0].value == "true" ? true : false);
                    setMultiBand(multiple[0].value == "true" ? true : false);
                    setSingleBand(single[0].value == "true" ? true : false);
                    var tempBands = JSON.parse(bands[0].value);
                    tempBands.map(function (val) {
                        setCheckBand(val.value, val.isChecked);
                    });
                    var tempCountries = JSON.parse(countries[0].value);
                    tempCountries.forEach(function (val) {
                        setCountryChecked(val.value, val.isChecked, val.regionId ? val.regionId : -1);
                    });
                    // setoptions(tempCountries);

                    var _data = JSON.parse(countries[0].value);
                    var lstChecked = _data.filter((x) => x.isChecked == true).length;
                    var lst = _data.length;
                    var value = lstChecked == lst ? true : false;

                    if (lstChecked.length == 0)
                        setCheckAll(false);
                    else
                        setCheckAll(value);


                    var _data2 = JSON.parse(bands[0].value);
                    var lstChecked2 = _data2.filter((x) => x.isChecked == true).length;
                    var lst2 = _data2.length;
                    var value2 = lstChecked2 == lst2 ? true : false;

                    if (lstChecked2.length == 0)
                        setCheckAllBands(false);
                    else
                        setCheckAllBands(value2);
                } else {
                    setMinGDP(0);
                    setMaxGDP(200000);
                    setFromDate(1985);
                    setToDate(new Date().getFullYear());
                }

                // LoadingAlert("Hide");
            });
    }

    const checkIfCanOpen = (target) => {
        if (target == "countrySelection") {
            setIsOpen3(true);
        }
    }

    const columns = useMemo(
        () => [
            {
                Header: getValue("Countries", getLang()),
                accessor: "countryName",
                Cell: (props) => {
                    if (props.value == null)
                        return "";
                    if (props.value.length < 16)
                        return props.value.toString();
                    else
                        return props.value.toString().substr(0, 15)
                },
            },
            {
                Header: getValue("Pop", getLang()),
                accessor: "pop",
                Cell: (props) => {
                    if (props.value == null || props.value == 0) return "";
                    if (Number.isInteger(props.value)) {
                        if (getIMF() == "true") {
                            return props.value
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        }
                        else {
                            var value = parseFloat(props.value) / 1000000;
                            return value
                                .toFixed(3)
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        }
                    }
                    else {
                        if (getIMF() == "true") {
                            return props.value
                                .toFixed(3)
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        }
                        else {

                            var value = parseFloat(props.value) / 1000000;
                            return value
                                .toFixed(3)
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        }
                    }

                },
            },
            {
                Header: "GDPc, $",
                accessor: "gdp",
                show: true,
                Cell: (props) => {
                    if (props.value != null)
                        if (props.value == 0) {
                            return '';
                        }
                        else {
                            return props.value
                                .toFixed(0)
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        }

                    else return "";
                },
            },
            {
                Header: getValue("Operator", getLang()),
                accessor: "operatorName",
            },
            {
                Header: getValue("Date", getLang()),
                accessor: "year",
            },
            {
                Header: getValue("Price$M", getLang()),
                accessor: "upFrontFees",
                Cell: (props) => {
                    if (props.value != null && props.value != "")
                        return parseFloat(props.value).toFixed(2);
                    else return "";
                },
            },
            {
                Header: getValue("Term", getLang()),
                accessor: "terms",
                Cell: (props) => {
                    if (props.value != null && props.value != "") return parseFloat(props.value).toFixed(1);
                    else return "";
                },
            },
            {
                Header: getValue("Bands", getLang()),
                accessor: "band",
            },
            {
                Header: getValue("Pairing", getLang()),
                accessor: "pairing",
            },
            {
                Header: getValue("TotalMHz", getLang()),
                accessor: "mhz",
            },
            // {
            //   Header:  getValue("ReservePrice", getLang()),
            //   accessor: "reservePrice",
            //   Cell: (props) => {
            //     if (props.value != null && props.value != "") return parseFloat(props.value).toFixed(3);
            //     else return "";
            //   },
            // },
            {
                Header: getValue("Coverage", getLang()),
                accessor: "coverage",
                Cell: (props) => {
                    console.log("props.value", props.value);

                    if (props.value.trim() == 'National') {
                        if (getLang() == 'ar')
                            return 'وطني'
                        else
                            return props.value
                    } else {
                        if (getLang() == 'ar')
                            return 'مناطقي'
                        else
                            return props.value
                    }
                },
            },
        ],
        []
    );
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        nextPage,
        previousPage,
        canNextPage,
        canPreviousPage,
        pageOptions,
        gotoPage,
        pageCount,
        setPageSize,
        state,
        prepareRow,
    } = useTable(
        {
            columns,
            data: awards,
            initialState: {
                hiddenColumns: columns.map((column) => {
                    if (column.show === false) return column.accessor || column.id;
                }),
            },
        },
        useSortBy,
        usePagination
    );

    const { pageIndex, pageSize } = state;

    function searchCountry() {
        var input, filter, found, div, label, i;
        input = document.getElementById("searchCountry");
        filter = input.value.toUpperCase();
        div = document.getElementById("countries");
        label = div.getElementsByTagName("label");
        for (i = 0; i < label.length; i++) {
            if (label[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
                found = true;
            }
            if (found) {
                label[i].style.display = "";
                found = false;
            } else {
                label[i].style.display = "none";
            }
        }
    }

    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';

    const exportToCSV = (csvData, fileName) => {


        var result = [];
        csvData.map((val, i) => {


            var imf = getIMF();
            imf = imf == "true" ? true : false;
            var item = new Object();
            item.Country = val.countryName;
            item["Pop,M"] = displayPop(val.pop, imf);
            item["GDPc, $"] = (val.gdp == 0 || val.gdp == null) ? '' : val.gdp.toFixed(0);
            item.Operator = val.operatorName;
            item.Date = val.year;
            item["Price, $M"] = val.upFrontFees;
            item["Term (Y)"] = val.terms;
            item.Band = val.band;
            item["Total MHz"] = val.mhz;
            item.Pairing = val.pairing;
            item.Coverage = val.coverage;

            result.push(item);

        });

        const ws = XLSX.utils.json_to_sheet(result);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, fileName + fileExtension);
    }

    const modalLoaded = () => {
        setTitle("Export");
    };

    const hideModal = () => {
        setIsOpen(false);
        setTitle("Export");
    };

    const hideModal3 = () => {
        setIsOpen3(false);
    };

    function inputNumberCheck(e) {
        if (e.which == 69 || e.which == 187 || e.which == 189 || e.which == 109) {
            e.preventDefault();
        }
    }



    return (
        <div id="Wrapper">
            <div id="filters-box">
                <div class="wrap" style={{ display: showDisplay == true ? "" : "none" }}>
                    <div data-title="">
                    </div>
                    <div data-title={getValue("IncludeAwards", getLang())}>
                        <div className="include-awards-grid">
                            <div className="pe-3">
                                <div className="form-group">
                                    <label className="chk-wrap">
                                        <input type="checkbox"
                                            value={singleBand}
                                            checked={singleBand}
                                            onChange={(e) => setSingleBand(e.target.checked)} />
                                        {getValue("SingleBand", getLang())}
                                    </label>
                                </div>
                                <div className="form-group">
                                    <label className="chk-wrap">
                                        <input type="checkbox"
                                            value={multiBand}
                                            checked={multiBand}
                                            onChange={(e) => setMultiBand(e.target.checked)} />
                                        {getValue("MultiBand", getLang())}
                                    </label>
                                </div>
                                <div className="form-group">
                                    <label style={{ alignItems: 'flex-start' }} className="chk-wrap">
                                        <input type="checkbox"
                                            value={includeRegional}
                                            checked={includeRegional}
                                            onChange={(e) => setIncludeRegional(e.target.checked)} />
                                        {getValue("RegionalLicenses", getLang())}
                                    </label>
                                </div>
                            </div>
                            <div className="has-border-left ps-2 pe-2">
                                <div className="form-group">
                                    <label className="chk-wrap">
                                        <input type="checkbox"
                                            value={paired}
                                            checked={paired}
                                            onChange={(e) => setPaired(e.target.checked)} />
                                        {getValue("Paired", getLang())}
                                    </label>
                                </div>
                                <div className="form-group">
                                    <label className="chk-wrap">
                                        <input type="checkbox"
                                            value={unPaired}
                                            checked={unPaired}
                                            onChange={(e) => setUnPaired(e.target.checked)} />
                                        {getValue("Unpaired", getLang())}
                                    </label>
                                </div>
                                <div className="form-group">
                                    <label style={{ alignItems: 'flex-start' }} className="chk-wrap">
                                        <input type="checkbox"
                                            value={pairedUnpaired}
                                            checked={pairedUnpaired}
                                            onChange={(e) => setPairedUnPaired(e.target.checked)} />
                                        {getValue("PairedUnpaired", getLang())}
                                    </label>
                                </div>
                            </div>
                            <div className="has-border-left ps-1">
                                <div className="form-group">
                                    <label class="lbl-icon-left">
                                        <span style={{ width: 110 }}><i class="spectre-filters-min-gdpc"></i>{getValue("MinGDPc", getLang())}</span>
                                        <input type="number" placeholder=""
                                            min="0"
                                            step="100"
                                            value={minGDP}
                                            onChange={(e) => setMinGDP(e.target.value)}
                                            onKeyDown={(e) => inputNumberCheck(e)} />
                                    </label>
                                </div>
                                <div className="form-group">
                                    <label class="lbl-icon-left">
                                        <span style={{ width: 110 }}><i class="spectre-filters-max-gdpc"></i>{getValue("MaxGDPc", getLang())}</span>
                                        <input type="number" placeholder=""
                                            value={maxGDP}
                                            step="100"
                                            onChange={(e) => setMaxGDP(e.target.value)}
                                            onKeyDown={(e) => inputNumberCheck(e)} />
                                    </label>
                                </div>
                                <div className="form-group">
                                    <label class="lbl-icon-left">
                                        <span style={{ width: 110 }}><i class="spectre-filters-awards-from"></i>{getValue("AwardsFrom", getLang())}</span>
                                        <input type="number" placeholder=""
                                            value={fromDate}
                                            onChange={(e) => setFromDate(e.target.value)} />
                                    </label>
                                </div>
                                <div className="form-group">
                                    <label class="lbl-icon-left">
                                        <span style={{ width: 110 }}><i class="spectre-filters-awards-to"></i>{getValue("AwardsTo", getLang())}</span>
                                        <input type="number" placeholder=""
                                            value={toDate}
                                            onChange={(e) => setToDate(e.target.value)} />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="countrySelection" data-title={getValue("CountrySelection", getLang())} style={{ cursor: "pointer" }} onClick={(e) => { checkIfCanOpen(e.target.id) }}>
                        <div className="form-group">
                            <label class="lbl-icon-left">
                                <span>
                                    <i class="spectre-search"></i>
                                </span>
                                <input id="searchCountry" type="text" onKeyUp={() => searchCountry()} placeholder="" />
                            </label>
                        </div>
                        <div className="form-group">
                            <label className="chk-wrap">
                                <input type="checkbox"
                                    onChange={(e) => handleCheckAll(e.target.checked)}
                                    checked={checkAll}
                                    value={checkAll} />
                                {getValue("SelectAll", getLang())}
                            </label>
                        </div>
                        <div className="scrollable bs-scrollable" style={{ height: 80 }} id="countries">
                            {renderCountries()}
                        </div>
                    </div>
                    <div id="bandSelection" data-title={getValue("BandSelection", getLang())} style={{ cursor: "pointer" }} onClick={(e) => selectAllBands(e.target.id)}>
                        <div className="scrollable bs-scrollable" style={{ height: 125 }}>
                            {renderBands()}
                        </div>
                    </div>
                    <div data-title="">

                    </div>
                    <div data-title="">

                    </div>
                </div>
                <div class="filter-actions" style={{ paddingTop: showDisplay == false ? "13px" : "" }}>
                    <a id="toggle-filters" onClick={() => setDisplay()}><i class={iconClass}></i> {showTxt}</a>
                    <button type="submit" className="btn btn-primary background-color-2 mr-2" onClick={(e) => checkIfCanSearch()}><i class="fa fa-search mr-1"></i> {getValue("Show", getLang())}</button>
                </div>
            </div>
            <div id="Content" className="inner-content mt-3">
                <div className="content_wrapper clearfix" style={{ paddingTop: 15, paddingBottom: 60 }}>
                    <div className="sections_group">
                        <div className="section_wrapper mcb-section-inner">
                            <div className="wrap mcb-wrap one valign-top clearfix">
                                <div style={{ borderRadius: "10px" }} className="entry-content inner-entry-content px-4 py-3">
                                    <div className="row">
                                        <div className="col-12 text-left">
                                            <div className="row">
                                                <div className="col-12 text-left d-flex justify-content-between">
                                                    <h4 className="text-blue-d text-bold" style={{ margin: 0 }}> {getValue("ListOfAwards", getLang())}</h4>
                                                    <div className="tbl-actions">
                                                        {/* <ReactHTMLTableToExcel
                                                      id="test-table-xls-button" className="download-table-xls-button btn btn-success mb-3"
                                                      table="table-to-xls" filename="tablexls" sheet="tablexls" buttonText="Export Data to Excel Sheet"/> */}
                                                        <button disabled class="btn"><i class="fa fa-refresh"></i></button>
                                                        <button disabled class="btn"><i class="fa fa-chart-line"></i></button>
                                                        <button disabled={!awards.length > 0} class={awards.length > 0 ? "btn chart-btn-color" : "btn"} onClick={(e) => setIsOpen(true)}><i class="fa fa-download" ></i></button>
                                                    </div>
                                                </div>
                                            </div>
                                            <hr style={{ margin: "5px 0" }} />
                                        </div>
                                    </div>
                                    <h6 className="fw-bold fs-14px" style={{ display: numberOfAwards == 0 ? "none" : "" }}>{getValue("NumberOfAwards", getLang())}: {numberOfAwards}</h6>
                                    <div
                                        id="table-content"
                                        className="col-md-12 list p-0 mb-3 custom-scrollbar"
                                    // style={{ height: numberOfAwards == 0 ? '' : '470px' }}
                                    >
                                        <table class="table table-width-auto fs-12px" role="table" id="table-to-xls">
                                            <thead>
                                                {headerGroups.map((headerGroup) => (
                                                    <tr {...headerGroup.getHeaderGroupProps()}>
                                                        {headerGroup.headers.map((column) => (
                                                            <th data-column={column.id} className={getLang() === "ar" ? "rtl" : "ltr"} {...column.getHeaderProps(column.getSortByToggleProps())}>
                                                                {/* <span>
                                  {column.isSorted ? column.isSortedDesc ? " ↓" : " ↑" : ""}{" "}
                                </span> */}
                                                                {column.render("Header")}
                                                            </th>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </thead>
                                            <tbody {...getTableBodyProps()}>
                                                {page.map((row, i) => {
                                                    prepareRow(row);
                                                    return (
                                                        <tr className="socio-economic-tr strike-through"{...row.getRowProps()}>
                                                            {row.cells.map((cell) => {
                                                                return (
                                                                    <td data-column={cell.column.id} className={getLang() === "ar" ? "rtl" : "ltr"}  {...cell.getCellProps()}>
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
                                    <div className="row" id="tableRow">
                                        <div className="col-md-6 d-flex align-items-start">
                                            <span className="text-black">
                                                {getValue("Page", getLang())}{" "}
                                                <strong>
                                                    {pageOptions.length !== 0 ? pageIndex + 1 : 0} {getValue("Of", getLang())} {pageOptions.length}
                                                </strong>{" "}
                                            </span>
                                            <span className="text-black d-flex ml-1 mr-1 align-items-start">
                                                | {getValue("GoToPage", getLang())}
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max={pageOptions.length}
                                                    defaultValue={pageIndex + 1}
                                                    onChange={(e) => {
                                                        const pageNumber = e.target.value
                                                            ? Number(e.target.value) - 1
                                                            : 0;
                                                        gotoPage(pageNumber);
                                                    }}
                                                    style={{
                                                        width: "50px",
                                                        height: "25px",
                                                        borderBottom: 0,
                                                    }}
                                                    className="cstm-input ml-1"
                                                />
                                            </span>
                                        </div>
                                        <div className="col-6 d-flex justify-content-end">
                                            <button
                                                className="btn inner-btn-secondary px-5px py-0 me-1"
                                                onClick={() => gotoPage(0)}
                                                disabled={!canPreviousPage}>{"<<"}</button>
                                            <button className="btn inner-btn-secondary px-5px py-0 me-1"
                                                onClick={() => previousPage()}
                                                disabled={!canPreviousPage}>{getValue("Previous", getLang())}
                                            </button>
                                            <button className="btn inner-btn-secondary px-5px py-0 me-1"
                                                onClick={() => nextPage()}
                                                disabled={!canNextPage}>{getValue("Next", getLang())} </button>
                                            <button
                                                className="btn inner-btn-secondary px-5px py-0 me-1"
                                                onClick={() => gotoPage(pageCount - 1)}
                                                disabled={!canNextPage}>{">>"}</button>
                                        </div>
                                    </div>
                                </div>
                                <br></br>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                show={isOpen}
                size="sm"
                onHide={hideModal}
                onEntered={modalLoaded}>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                    {/* <button type="button" className="btn-close" aria-label="Close"></button> */}
                </Modal.Header>
                <Modal.Body>
                    <ul class="list-group">
                        <li onClick={(e) => { exportToCSV(awards, "AwardsData") }} className="list-group-item" style={{ cursor: "pointer" }}> <span style={{ width: 110 }}><i
                            className="fas fa-file-excel"
                            style={{ paddingLeft: "10px", paddingRight: "10px", color: "#56ade0" }}></i>{getValue("ExportToExcel", getLang())}</span></li>
                        <li onClick={(e) => { exportToPDF() }} className="list-group-item" style={{ cursor: "pointer" }}> <span style={{ width: 110 }}><i className="fas fa-file-pdf"
                            style={{ paddingLeft: "10px", paddingRight: "10px", color: "#56ade0" }}></i>{getValue("ExportToPDF", getLang())}</span></li>
                        {isExportPDF && <Awards2 awards={awards} filters={filters} />}
                    </ul>
                </Modal.Body>
            </Modal>

            <Modal
                show={isOpen3}
                size="sm"
                onHide={hideModal3}>
                <Modal.Header closeButton>
                    <Modal.Title>{getValue("CountrySelection", getLang())}</Modal.Title>
                    {/* <button type="button" className="btn-close" aria-label="Close"></button> */}
                </Modal.Header>
                <Modal.Body>
                    <div className="scrollable" style={{ height: "350px" }}>
                        {renderCountries2()}
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default AwardsMenuTest;
