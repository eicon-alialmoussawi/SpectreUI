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
import {
    AlertConfirm,
    AlertError,
    LoadingAlert,
    Alert,
} from "../components/f_Alerts";
import { getValue } from "../Assets/Language/Entries";
import { getLang, getIMF } from "../utils/common";
import $ from "jquery";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import Modal from "react-bootstrap/Modal";

// PublicSocioEconomics Backup
const PublicSocioEconomic = (props) => {
    const [selected, setSelected] = useState([]);
    const [SelectedBands, setSelectedBands] = useState([]);

    const [selectedPaired, setSelectedPaired] = useState([]);

    const [selectedBandsTypes, setSelectedBandsTypes] = useState([]);
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
    const [resultSources, emplistSources] = useState([]);
    const [resultFilters, emplistFilters] = useState([]);
    const [resultCountries, emplistCountries] = useState([]);
    const [sourceId, setSourceId] = useState("");
    const [filterId, setFilterId] = useState("");
    const [countryFilterId, setCountryFilterId] = useState("");
    const [showDisplay, setShowDisplay2] = useState(true);
    const [checkAll, setCheckAll] = React.useState(false);
    const [iconClass, setIconClass] = useState(
        "spectre-angle-up btn btn-primary background-color-2 color-white mr-2"
    );
    const [showTxt, setShowTxt] = useState(getValue("ShowLess", getLang()));
    const [filterOptionByIndicator, setFilterOptionByIndicator] = useState(false);
    const [filterOptionByCountry, setFilterOptionByCountry] = useState(false);
    const [filterOptionByYear, setFilterOptionByYear] = useState(false);
    const [indicators, setIndicators] = useState([]);
    const [isOpen3, setIsOpen3] = useState(false);
    const [isOpen4, setIsOpen4] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState(true);
    const [title, setTitle] = React.useState("Transitioning...");
    
    const optionsRef = useRef();

    const modalLoaded3 = () => {
        setTitle("Export");
    };

    const hideModal3 = () => {
        setIsOpen3(false);
        setTitle("Export");
    };

    const hideModal4 = () => {
        setIsOpen4(false);
    }

    const [options, setoptions] = useState([]);
    optionsRef.current = options;
    
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
        IsSingle: false,
        IsMultiple: false,
        IsPaired: false,
        IsSingle: "",
        ISIMF: false,
    };
    const [columns, setColumns] = useState([]);
    const clmns = [
        {
            id: 0,
            Header: getValue("Country", getLang()),
            accessor: "countryName",
        },
    ];
    const clmns_country = [
        {
            id: 0,
            Header: getValue("SourceIndicator", getLang()),
            accessor: "indicatorName",
        },
    ];
    const clmns_year = [
        {
            id: 0,
            Header: getValue("Country", getLang()),
            accessor: "countryName",
        },
    ];

    awardsRef.current = awards;
    useEffect(() => {
        APIFunctions.getAllFilters("AwardsMenu")
            .then((resp) => resp)
            .then((resp) => emplistFilter(resp.data));
    }, []);
    const retrieveSocioEconomics = () => {
        filterSocioEconomics();
    };
    const filterSocioEconomics = () => {
        LoadingAlert("Show");

        var countryids = [];
        for (var i = 0, l = options.length; i < l; i++) {
            if (options[i].isChecked) {
                countryids.push(options[i].value);
            }
        }
        countryids = countryids.join(",");

        var sourceid = $("#indicator").val();
        trackPromise(
            APIFunctions.getFilterSocioEconomics(countryids, sourceid)
                .then((response) => {
                    LoadingAlert("Hide");
                    if (
                        response.data.items == 0 ||
                        response.data.items.length < 0 ||
                        !Array.isArray(response.data.items)
                    ) {
                        Alert(getValue("NoDataToDisplay", getLang()));
                        return;
                    }
                    const fromYear = response.data.fromYear;
                    const toYear = response.data.toYear;
                    const items = response.data.items;
                    const length = response.data.items.length;
                    for (var i = fromYear; i <= toYear; i++) {
                        clmns.push({
                            id: i,
                            Header: i,
                            accessor: `value_${i}`,
                            Cell: (props) => {
                                if (props.value != null) return props.value.toString();
                                else return "";
                            },
                        });
                    }

                    const allitems = [];
                    setColumns(clmns);

                    var ob = [];
                    let year = 0;
                    let value = 0;
                    var j = 0;
                    for (var i = 0; i < length; i++) {
                        var obj = new Object();
                        for (j = 0; j < items[i].items.length; j++) {
                            // alert(items[i].items[j].year);
                            year = items[i].items[j].year;
                            value = items[i].items[j].value;
                            obj[`value_${year}`] = value == "0" ? "" : value;
                        }
                        // ob.push({
                        //   countryName: items[i].countryName
                        // });
                        obj["countryName"] = items[i].countryName;
                        ob.push(obj);
                    }
                    setAwards(ob);
                    var element = document.getElementById("table-content");
                    element.scrollIntoView(true, { block: "start", inline: "nearest" });
                })
                .catch((e) => {
                    console.log(e);
                })
        );
    };

    const checkIfCanView = () => {
        APIFunctions.checkIfCanView("PublicSocioEconomics")
            .then((response) => {
                var _method =
                    filterOptionByCountry == true
                        ? "ByCountry"
                        : filterOptionByIndicator == true
                            ? "ByIndicator"
                            : "ByYear";
                setSelectedMethod(_method);
                if (response.data) {
                    if (filterOptionByCountry == true) filterSocioEconomicsByCountry();
                    else if (filterOptionByIndicator == true) filterSocioEconomics();
                    else filterSocioEconomicsByYear();
                } else {
                    Alert(getValue("FeatureNotAvailable", getLang()));
                    return;
                }
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const filterSocioEconomicsByCountry = () => {
        LoadingAlert("Show");
        var valuatedCountryId = $("#valuatedCountry").val();
        trackPromise(
            APIFunctions.getFilterSocioEconomicsByCountry(valuatedCountryId, getIMF())
                .then((response) => {
                    LoadingAlert("Hide");
                    if (
                        response.data.items == 0 ||
                        response.data.items.length < 0 ||
                        !Array.isArray(response.data.items)
                    ) {
                        Alert(getValue("NoDataToDisplay", getLang()));
                        return;
                    }
                    var fromYear = response.data.fromYear;
                    var toYear = response.data.toYear;
                    var items = response.data.items;
                    var length = response.data.items.length;
                    for (var i = fromYear; i <= toYear; i++) {
                        clmns_country.push({
                            id: i,
                            Header: i,
                            accessor: `value_${i}`,
                            Cell: (props) => {
                                if (props.value != null) return props.value.toString();
                                else return "";
                            },
                        });
                    }

                    const allitems = [];
                    setColumns(clmns_country);
                    var ob = [];
                    let year = 0;
                    let value = 0;
                    var j = 0;
                    for (var i = 0; i < length; i++) {
                        var obj = new Object();
                        for (j = 0; j < response.data.items[i].items.length; j++) {
                            // alert(items[i].items[j].year);
                            year = response.data.items[i].items[j].year;
                            value = response.data.items[i].items[j].value;
                            obj[`value_${year}`] = value == "0" ? "" : value;
                        }
                        obj["indicatorName"] = items[i].indicatorName;
                        ob.push(obj);
                    }
                    setAwards(ob);
                    var element = document.getElementById("table-content");
                    element.scrollIntoView(true, { block: "start", inline: "nearest" });
                })
                .catch((e) => {
                    console.log(e);
                })
        );
        // alert(countryFilterId);
    };

    const filterSocioEconomicsByYear = () => {
        LoadingAlert("Show");
        var yearSelected = $("#yearSelection").val();
        var isIMF = getIMF() == "true" ? true : "false";
        trackPromise(
            APIFunctions.filterSocioEconimcsByYear(yearSelected, isIMF)
                .then((response) => {
                    LoadingAlert("Hide");
                    if (
                        response.data == 0 ||
                        response.data.length < 0 ||
                        !Array.isArray(response.data)
                    ) {
                        AlertError("No data to display");
                        return;
                    }

                    for (var i = 0; i < indicators.length; i++) {
                        const label = indicators[i].label;
                        clmns_year.push({
                            id: indicators[i].value,
                            Header: label,
                            accessor: label.includes(".") ? label.split(".")[0] : label,
                        });
                    }
                    var arr_awards = [];
                    for (var i = 0; i < options.length; i++) {
                        if (getLang() == "ar") {
                            var temp = response.data.filter(function (el) {
                                return el.countryNameAr == options[i].label;
                            });
                        } else {
                            var temp = response.data.filter(function (el) {
                                return el.countryName == options[i].label;
                            });
                        }
                        var ob = new Object();

                        for (var j = 0; j < temp.length; j++) {
                            if (j == 0) {
                                ob.countryName =
                                    getLang() == "ar"
                                        ? temp[j].countryNameAr
                                        : temp[j].countryName;
                            }
                            if (getLang() == "ar") {
                                const accessor = temp[j].lookupAr.toString();
                                var lookup = accessor.includes(".") ? accessor.split(".")[0] : accessor;
                                ob[lookup] = temp[j].value == "0" ? "" : temp[j].value;
                            } else {
                                const accessor = temp[j].lookup.toString();
                                var lookup = accessor.includes(".") ? accessor.split(".")[0] : accessor;
                                ob[lookup] = temp[j].value == "0" ? "" : temp[j].value;
                            }
                        }
                        if (Object.keys(ob).length > 0) arr_awards.push(ob);
                    }

                    console.log("clmns_year: ", clmns_year);
                    console.log("arr_awards: ", arr_awards);
                    setColumns(clmns_year);
                    setAwards(arr_awards);
                })
                .catch((e) => {
                    console.log(e);
                })
        );
    };

    useEffect(() => {
        APIFunctions.GetLookupsByParentId("SOC_SRC")
            .then((resp) => resp)
            .then((resp) => emplistSources(resp.data));
    }, []);

    useEffect(() => {
        var arr = [];
        arr[0] = {
            id: 0,
            name: "Filter by Indicator",
        };
        arr[1] = {
            id: 1,
            name: "Filter by Country",
        };
        arr[2] = {
            id: 2,
            name: "Filter by Year",
        };
        emplistFilters(arr);
    }, []);

    useEffect(() => {
        APIFunctions.getUserCountries("PublicSocioEconomics")
            .then((resp) => resp)
            .then((resp) => emplistCountries(resp.data));
    }, []);

    useEffect(() => {
        APIFunctions.getUserCountries("PublicSocioEconomics")
            .then((resp) => resp)
            .then((resp) => bindOptions(resp.data));
    }, []);

    useEffect(() => {
        $(".menuItems").removeClass("active");
        $("#PublicSocioEconomics_page").addClass("active");
    });

    const bindOptions = (data) => {
        var arr = [];
        for (var i = 0, l = data.length; i < l; i++) {
            var ob = new Object();
            ob.label = getLang() == "ar" ? data[i].nameAr : data[i].nameEn;
            ob.value = data[i].countryId;
            ob.isChecked = true;
            ob.regionId = data[i].regionId;
            arr.push(ob);
        }
        setCheckAll(true);
        setoptions(arr);
    };

    const GetCountryNameById = (id) => {
        return options.find((x) => x.value === id).label;
    };

    const handleChangeBands = (selectedOptions) => {
        var value = [];
        for (var i = 0, l = selectedOptions.length; i < l; i++) {
            value.push(selectedOptions[i].value);
        }
        setSelectedBands(selectedOptions);
        AwardFilter.Band = value.join(",");
    };

    const handleChangeSource = (selectedOptions) => {
        setSourceId(selectedOptions.id);
    };

    const handleChangeCountry = (selectedOptions) => {
        setCountryFilterId(selectedOptions.countryId);
    };

    const handleChangeFilter = (selectedOptions) => {
        setFilterId(selectedOptions.id);

        setColumns([]);
        setAwards([]);

        // Filter by Indicator
        if (selectedOptions.id == 0) {
            // filter by indicator filters
            var source_indicator_filters = document.getElementsByClassName(
                "source-indicator-filter"
            );
            for (var i = 0; i < source_indicator_filters.length; i++) {
                source_indicator_filters[i].style.display = "flex";
            }

            // filter by country filters
            var filter_by_indicator =
                document.getElementsByClassName("filter-by-country");
            for (var i = 0; i < filter_by_indicator.length; i++) {
                filter_by_indicator[i].style.display = "none";
            }

            // datatable
            document.getElementById("data-table-div").style.display = "contents";
        } else {
            // Filter by Country
            if (selectedOptions.id == 1) {
                // filter by indicator filters
                var source_indicator_filters = document.getElementsByClassName(
                    "source-indicator-filter"
                );
                for (var i = 0; i < source_indicator_filters.length; i++) {
                    source_indicator_filters[i].style.display = "none";
                }

                // filter by country filters
                var filter_by_indicator =
                    document.getElementsByClassName("filter-by-country");
                for (var i = 0; i < filter_by_indicator.length; i++) {
                    filter_by_indicator[i].style.display = "flex";
                }

                // datatable
                document.getElementById("data-table-div").style.display = "contents";
            } else {
                // Filter by Year
                // filter by indicator filters
                var source_indicator_filters = document.getElementsByClassName(
                    "source-indicator-filter"
                );
                for (var i = 0; i < source_indicator_filters.length; i++) {
                    source_indicator_filters[i].style.display = "none";
                }

                // filter by country filters
                var filter_by_indicator =
                    document.getElementsByClassName("filter-by-country");
                for (var i = 0; i < filter_by_indicator.length; i++) {
                    filter_by_indicator[i].style.display = "none";
                }

                // datatable
                document.getElementById("data-table-div").style.display = "contents";
            }
        }
    };

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

    useEffect(() => {
        APIFunctions.GetLookupsByParentId("SOC_SRC")
            .then((resp) => resp)
            .then((resp) => bindIndicators(resp.data));
    }, []);

    const bindIndicators = (data) => {
        var arr = [];
        console.log(data);
        for (var i = 0, l = data.length; i < l; i++) {
            var ob = new Object();
            if (data[i].lookupCode == "SOC_EXC_RT") {
                ob.value = data[i].id;
                ob.label = getLang() == "ar" ? data[i].nameAr : data[i].name;
                arr.push(ob);
            } else if (getIMF() == "true") {
                if (
                    data[i].lookupCode == "SOC_INF_IMF" ||
                    data[i].lookupCode == "SOC_SRC_POP_IMF" ||
                    data[i].lookupCode == "SOC_SRC_GDP_PPP_IMF" ||
                    data[i].lookupCode == "SOC_SRC_GDP_NOM_IMF" ||
                    data[i].lookupCode == "SOC_GDPC_IMF" ||
                    data[i].lookupCode == "PPP_EX_IMF"
                ) {
                    ob.value = data[i].id;
                    ob.label = getLang() == "ar" ? data[i].nameAr : data[i].name;
                    arr.push(ob);
                }
            } else {
                if (
                    data[i].lookupCode == "SOC_SRC_POP_WB" ||
                    data[i].lookupCode == "SOC_SRC_GDP_PPP_WB" ||
                    data[i].lookupCode == "SOC_SRC_GDP_NOM_WB" ||
                    data[i].lookupCode == "SOC_GDPC_WB" ||
                    data[i].lookupCode == "SOC_INF_WB" ||
                    data[i].lookupCode == "PPP_EX_WB"
                ) {
                    ob.value = data[i].id;
                    ob.label = getLang() == "ar" ? data[i].nameAr : data[i].name;
                    arr.push(ob);
                }
            }
        }
        setIndicators(arr);
    };

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

    const handleCheckAll = (isChecked) => {
        setCheckAll(isChecked);
        var updatedSelectedCountries = options;
        updatedSelectedCountries.map((row, i) => {
            row.isChecked = isChecked;
        });
        setoptions(updatedSelectedCountries);
    };

    const fileType =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";

    const exportToCSV = (csvData, fileName) => {
        if (selectedMethod == "ByCountry") {
            var arr = [];
            var arr2 = [];
            var headers = [];

            var headers2 = [];
            awards.forEach((element1) => {
                var obj = new Object();
                obj["Indicator"] = String(element1["indicatorName"]);

                if (headers.indexOf("Indicator") < 0) headers.push("Indicator");

                columns.forEach((element) => {
                    if (element.accessor != "indicatorName") {
                        obj[String(element.Header)] =
                            element1["value_" + String(element.Header)];
                        // if (headers.indexOf(element.Header) < 0)
                        //   headers.push(element.Header)
                    }
                });

                arr.push(obj);
            });

            const ws = XLSX.utils.json_to_sheet(arr, { header: headers });
            const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
            const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
            const data = new Blob([excelBuffer], { type: fileType });
            FileSaver.saveAs(data, "Social Data By Country" + fileExtension);
        } else if (selectedMethod == "ByYear") {
            var arr = [];
            var arr2 = [];
            var headers = [];

            var headers2 = [];
            awards.forEach((element1) => {
                var obj = new Object();
                obj["Country"] = String(element1["countryName"]);

                if (headers.indexOf("Country") < 0) headers.push("Country");

                columns.forEach((element) => {
                    if (element.accessor != "countryName") {
                        obj[String(element.Header)] = element1[element.accessor];
                        if (headers.indexOf(element.Header) < 0)
                            headers.push(element.Header);
                    }
                });

                arr.push(obj);
            });

            const ws = XLSX.utils.json_to_sheet(arr, { header: headers });
            const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
            const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
            const data = new Blob([excelBuffer], { type: fileType });
            FileSaver.saveAs(data, "Social Data By Year" + fileExtension);
        } else {
            var arr = [];
            var arr2 = [];
            var headers = [];

            var headers2 = [];
            awards.forEach((element1) => {
                console.log(element1);
                var obj = new Object();
                obj["Country"] = String(element1["countryName"]);

                if (headers.indexOf("Country") < 0) headers.push("Country");

                columns.forEach((element) => {
                    if (element.accessor != "countryName") {
                        obj[String(element.Header)] =
                            element1["value_" + String(element.Header)];
                    }
                });

                arr.push(obj);
            });

            const ws = XLSX.utils.json_to_sheet(arr, { header: headers, origin: "A2" });
            const wb = { Sheets: { data: ws }, SheetNames: ["data"] };

            const firstSheet = wb.Sheets[wb.SheetNames[0]];
            firstSheet['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: headers.length - 1 } }];

            firstSheet['A1'] = { t: "s", v: `${$("#indicator option:selected").text()}, ${getIMF() == "true" ? "IMF" : "WB"}` };

            const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
            const data = new Blob([excelBuffer], { type: fileType });
            FileSaver.saveAs(data, "Social Data By Indicator" + fileExtension);
        }
    };

    const renderCountries = () => {
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
                        <label className="chk-wrap">
                            <input
                                type="checkbox"
                                data-country={val.value}
                                checked={getCheckedCountry(val.value)}
                                value={getCheckedCountry(val.value)}
                                data-region={val.regionId}
                                onChange={(e) => setCountryChecked(val.value, e.target.checked, val.regionId)}
                            />{" "}
                            {val.label}
                        </label>
                    </div>
                ));
            }
        }
    };

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
    };

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

    const setDisplay = () => {
        setShowDisplay2(!showDisplay);
        setIconClass(
            !showDisplay == true
                ? "spectre-angle-up btn btn-primary background-color-2 color-white mr-2"
                : "spectre-angle-down btn btn-primary background-color-2 color-white mr-2"
        );
        setShowTxt(
            !showDisplay == true
                ? getValue("ShowLess", getLang())
                : getValue("ShowMore", getLang())
        );
    };

    const setFilterOption = (val) => {
        setColumns([]);
        setAwards([]);
        document.getElementById("data-table-div").style.display = "contents";
        if (val == 1) {
            setFilterOptionByIndicator(true);
            setFilterOptionByCountry(false);
            setFilterOptionByYear(false);
        } else {
            if (val == 2) {
                setFilterOptionByIndicator(false);
                setFilterOptionByCountry(true);
                setFilterOptionByYear(false);
            } else {
                setFilterOptionByIndicator(false);
                setFilterOptionByCountry(false);
                setFilterOptionByYear(true);
            }
        }
    };

    const renderIndicators = () => {
        if (indicators != null && indicators.length > 0) {
            {
                return indicators.map((val, idx) => (
                    <option value={val.value}>{val.label}</option>
                ));
            }
        }
    };

    const renderValuatedCountries = () => {
        var countries = options;
        if (countries != null && countries.length > 0) {
            {
                return countries.map((val, idx) => (
                    <option value={val.value}>{val.label}</option>
                ));
            }
        }
    };

    const renderCountries2 = () => {
        var countries = options;
        if(getLang() == "ar") 
            countries.sort((a, b) => (a.labelAr > b.labelAr) ? 1 : ((b.labelAr > a.labelAr) ? -1 : 0));
        else 
            countries.sort((a, b) => (a.labelEn > b.labelEn) ? 1 : ((b.labelEn > a.labelEn) ? -1 : 0));
        if (countries != null && countries.length > 0) {
            {
                return (countries.map((val, idx) => (
                    <div className="form-group">
                        <label className="chk-wrap" style={{ display: "flex" }}>
                            <input type="checkbox"
                                style={{ margin: "4px" }}
                                data-country={val.value}
                                checked={getCheckedCountry(val.value)}
                                value={getCheckedCountry(val.value)}
                                data-region={val.regionId}
                                onChange={(e) => setCountryChecked(val.value, e.target.checked, val.regionId)} /> {val.label}
                        </label>
                    </div>
                )));
            }
        }
    }

    const checkIfCanOpen = (target) => {
        if (target == "countrySelection" && filterOptionByIndicator) {
            setIsOpen4(true);
        }
    }

    function renderDate() {
        var now = new Date().getFullYear();
        var arr_years = [];
        for (var i = now + 3; i >= 1985; i--) {
            arr_years.push(i);
        }
        return arr_years.map((val, idx) => <option value={val}>{val}</option>);
    }

    return (
        <div id="Wrapper">
            <div id="filters-box">
                <div
                    class="wrap"
                    style={{
                        height: "188px",
                        display: showDisplay == true ? "" : "none",
                        gridTemplate: "auto/230px 435px auto 125px 180px 250px",
                    }}
                >
                    {/* Filtering */}
                    <div data-title={getValue("Filtering", getLang())}>
                        <div className="form-group">
                            <label className="chk-wrap">
                                <input
                                    type="radio"
                                    name="filter-option"
                                    value="1"
                                    onChange={(e) => setFilterOption(e.target.value)}
                                />
                                {getValue("FilterByIndicator", getLang())}
                            </label>
                        </div>
                        <div className="form-group">
                            <label className="chk-wrap">
                                <input
                                    type="radio"
                                    name="filter-option"
                                    value="2"
                                    onChange={(e) => setFilterOption(e.target.value)}
                                />
                                {getValue("FilterByCountry", getLang())}
                            </label>
                        </div>
                        <div className="form-group">
                            <label className="chk-wrap">
                                <input
                                    type="radio"
                                    name="filter-option"
                                    value="3"
                                    onChange={(e) => setFilterOption(e.target.value)}
                                />
                                {getValue("FilterByYear", getLang())}
                            </label>
                        </div>
                    </div>
                    <div data-title=""></div>
                    {/* Country Selection */}
                    <div id="countrySelection" data-title={getValue("CountrySelection", getLang())} style={{ cursor: "pointer" }} onClick={(e) => { checkIfCanOpen(e.target.id) }}>
                        <div
                            className="form-group"
                            style={{ display: filterOptionByIndicator ? "" : "none" }}
                        >
                            <label class="lbl-icon-left">
                                <span>
                                    <i class="spectre-search"></i>
                                </span>
                                <input
                                    id="searchCountry"
                                    type="text"
                                    onKeyUp={() => searchCountry()}
                                    placeholder=""
                                />
                            </label>
                        </div>
                        <div
                            className="form-group"
                            style={{ display: filterOptionByIndicator ? "" : "none" }}
                        >
                            <label className="chk-wrap">
                                <input
                                    type="checkbox"
                                    onChange={(e) => handleCheckAll(e.target.checked)}
                                    checked={checkAll}
                                    value={checkAll}
                                />
                                {getValue("SelectAll", getLang())}
                            </label>
                        </div>
                        <div
                            id="countries"
                            className="scrollable"
                            style={{
                                display: filterOptionByIndicator ? "" : "none",
                                height: "80px",
                            }}
                        >
                            {renderCountries()}
                        </div>
                        <select
                            id="valuatedCountry"
                            disabled={!filterOptionByCountry}
                            style={{
                                display:
                                    filterOptionByCountry ||
                                        filterOptionByYear ||
                                        (!filterOptionByCountry &&
                                            !filterOptionByYear &&
                                            !filterOptionByIndicator)
                                        ? ""
                                        : "none",
                            }}
                        >
                            {renderValuatedCountries()}
                        </select>
                    </div>
                    <div data-title={getValue("Year", getLang())}>
                        <select disabled={!filterOptionByYear} id="yearSelection">
                            {renderDate()}
                        </select>
                    </div>
                    <div data-title={getValue("Indicator", getLang())}>
                        <select id="indicator" disabled={!filterOptionByIndicator}>
                            {renderIndicators()}
                        </select>
                    </div>
                    <div data-title=""></div>
                    <div data-title=""></div>
                </div>
                {/* Filter Actions */}
                <div
                    class="filter-actions"
                    style={{ paddingTop: showDisplay == false ? "13px" : "" }}
                >
                    <a id="toggle-filters" onClick={() => setDisplay()}>
                        <i class={iconClass}></i> {showTxt}
                    </a>
                    <button
                        type="submit"
                        className="btn btn-primary background-color-2 mr-2"
                        onClick={() => checkIfCanView()}
                        disabled={
                            !filterOptionByIndicator &&
                            !filterOptionByCountry &&
                            !filterOptionByYear
                        }
                    >
                        <i class="spectre-search"></i> {getValue("Show", getLang())}
                    </button>
                </div>
            </div>
            <div id="Content" class="inner-content mt-3">
                <div
                    className="content_wrapper clearfix"
                    style={{ paddingTop: 15, paddingBottom: 60 }}
                >
                    <div className="sections_group">
                        <div className="section_wrapper mcb-section-inner">
                            <div className="wrap mcb-wrap one valign-top clearfix">
                                {/* Main Table */}
                                <div
                                    style={{ borderRadius: "10px" }}
                                    className="entry-content inner-entry-content px-4 py-3"
                                >
                                    <div className="row">
                                        <div className="col-12 text-left">
                                            <div className="row">
                                                <div className="col-12 text-left d-flex justify-content-between">
                                                    <h4
                                                        className="text-blue-d text-bold"
                                                        style={{ margin: 0 }}
                                                    >
                                                        {getValue("SocialData", getLang())}
                                                    </h4>
                                                    <div
                                                        className="tbl-actions"
                                                        style={{ gridTemplate: "unset" }}
                                                    >
                                                        <button
                                                            class="btn"
                                                            onClick={(e) => setIsOpen3(true)}
                                                        >
                                                            <i class="fa fa-download"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <hr style={{ margin: "5px 0" }} />
                                            <div
                                                style={{
                                                    display:
                                                        filterOptionByIndicator && awards.length > 0
                                                            ? ""
                                                            : "none",
                                                }}
                                                className="row"
                                            >
                                                <div className="col-12 fw-bold">
                                                    {$("#indicator option:selected").text()},{" "}
                                                    {getIMF() == "true" ? "IMF" : "WB"}
                                                </div>
                                            </div>
                                            <div
                                                className="content_wrapper clearfix"
                                                style={{ paddingTop: 15, paddingBottom: 60 }}
                                            >
                                                <div className="sections_group">
                                                    <div className="section_wrapper mcb-section-inner">
                                                        <div className="wrap mcb-wrap one valign-top clearfix">
                                                            <div>
                                                                <div id="data-table-div">
                                                                    <div
                                                                        id="table-content"
                                                                        className="col-md-12 list p-0 mb-3 custom-scrollbar fixed-first-col"
                                                                        style={{
                                                                            overflowX: "auto",
                                                                            maxWidth: "100%",
                                                                            "--w": "120px",
                                                                        }}
                                                                    >
                                                                        <table
                                                                            className="table table-striped fs-12px"
                                                                            {...getTableProps()}
                                                                        >
                                                                            <thead>
                                                                                {headerGroups.map((headerGroup) => (
                                                                                    <tr
                                                                                        {...headerGroup.getHeaderGroupProps()}
                                                                                    >
                                                                                        {headerGroup.headers.map(
                                                                                            (column) => (
                                                                                                <th
                                                                                                    className="text-left"
                                                                                                    data-column={column.id}
                                                                                                    data-bands={column.className}
                                                                                                    {...column.getHeaderProps(
                                                                                                        column.getSortByToggleProps()
                                                                                                    )}
                                                                                                >
                                                                                                    {/* <span>
                                                                        {" "}
                                                                        {column.isSorted
                                                                            ? column.isSortedDesc
                                                                                ? " ↓"
                                                                                : " ↑"
                                                                            : ""}{" "}
                                                                    </span> */}
                                                                                                    {column.render("Header")}{" "}
                                                                                                </th>
                                                                                            )
                                                                                        )}
                                                                                    </tr>
                                                                                ))}
                                                                            </thead>
                                                                            <tbody {...getTableBodyProps()}>
                                                                                {page.map((row, i) => {
                                                                                    prepareRow(row);
                                                                                    return (
                                                                                        <tr
                                                                                            className="socio-economic-tr"
                                                                                            {...row.getRowProps()}
                                                                                        >
                                                                                            {row.cells.map((cell) => {
                                                                                                return (
                                                                                                    <td
                                                                                                        style={{height: "30px"}}
                                                                                                        className="text-black vertical-align-middle text-left"
                                                                                                        {...cell.getCellProps()}
                                                                                                        data-column={cell.column.id}
                                                                                                        data-bands={
                                                                                                            cell.column.className
                                                                                                        }
                                                                                                    >
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
                                                                    <div className="col-md-12 list">
                                                                        <div className="row">
                                                                            <div className="col-md-6 d-flex align-items-start">
                                                                                <span className="text-black">
                                                                                    {getValue("Page", getLang())}{" "}
                                                                                    <strong>
                                                                                        {pageOptions.length !== 0
                                                                                            ? pageIndex + 1
                                                                                            : 0}{" "}
                                                                                        {getValue("Of", getLang())}{" "}
                                                                                        {pageOptions.length}
                                                                                    </strong>{" "}
                                                                                </span>
                                                                                <span className="text-black d-flex ml-1 mr-1 align-items-start">
                                                                                    | {getValue("GoToPage", getLang())}:
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
                                                                            <div className="col-md-6 d-flex justify-content-end">
                                                                                <button
                                                                                    className="btn inner-btn-secondary px-5px py-0 me-1"
                                                                                    onClick={() => gotoPage(0)}
                                                                                    disabled={!canPreviousPage}
                                                                                >
                                                                                    {"<<"}
                                                                                </button>
                                                                                <button
                                                                                    className="btn inner-btn-secondary px-5px py-0 me-1"
                                                                                    onClick={() => previousPage()}
                                                                                    disabled={!canPreviousPage}
                                                                                >
                                                                                    {getValue("Previous", getLang())}
                                                                                </button>
                                                                                <button
                                                                                    className="btn inner-btn-secondary px-5px py-0 me-1"
                                                                                    onClick={() => nextPage()}
                                                                                    disabled={!canNextPage}
                                                                                >
                                                                                    {getValue("Next", getLang())}
                                                                                </button>
                                                                                <button
                                                                                    className="btn inner-btn-secondary px-5px py-0 me-1"
                                                                                    onClick={() =>
                                                                                        gotoPage(pageCount - 1)
                                                                                    }
                                                                                    disabled={!canNextPage}
                                                                                >
                                                                                    {">>"}
                                                                                </button>
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
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* side menu */}
            <Modal
                show={isOpen4}
                size="sm"
                onHide={hideModal4}>
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
            <Modal
                show={isOpen3}
                size="sm"
                onHide={hideModal3}
                onEntered={modalLoaded3}
            >
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                    {/* <button type="button" className="btn-close" aria-label="Close"></button> */}
                </Modal.Header>
                <Modal.Body>
                    <ul class="list-group">
                        <li
                            onClick={(e) => {
                                exportToCSV(awards, "Pricing");
                            }}
                            className="list-group-item"
                            style={{ cursor: "pointer" }}
                        >
                            {" "}
                            <span style={{ width: 110 }}>
                                <i
                                    className="fas fa-file-excel"
                                    style={{
                                        paddingLeft: "10px",
                                        paddingRight: "10px",
                                        color: "#56ade0",
                                    }}
                                ></i>
                                Export to Excel
                            </span>
                        </li>
                    </ul>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default PublicSocioEconomic;
