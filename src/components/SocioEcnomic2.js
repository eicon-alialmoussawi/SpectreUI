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
import { AlertConfirm, AlertError } from "../components/f_Alerts";

// import "../../public_pages/css/global.css";
// import "../../public/public_pages/css/"
// import "../public_pages/css/global.css";
// import "../public_pages/css/structure.css";
// import "../public_pages/css/internet2.css";
// import "../public_pages/css/custom.css";

// PublicSocioEconomics Backup
const SocioEconomics2 = (props) => {
    // document.getElementById("social-active").className += "current-menu-item";
    // document.getElementById("pricing-active").classList.remove("current-menu-item");
    // document.getElementById("awards-active").classList.remove("current-menu-item");


    // var head = document.getElementsByTagName("head")[0];
    // var link = document.createElement("link");
    // var link1 = document.createElement("link");
    // var link2 = document.createElement("link");
    // var link3 = document.createElement("link");

    // link.id = "myCss";
    // link.rel = "stylesheet";
    // link.type = "text/css";
    // link.href = "../public_pages/css/global.css";
    // link.media = "all";
    // head.appendChild(link);

    // link1.id = "myCss1";
    // link1.rel = "stylesheet";
    // link1.type = "text/css";
    // link1.href = "../public_pages/css/internet2.css";
    // link1.media = "all";
    // head.appendChild(link1);

    // link2.id = "myCss2";
    // link2.rel = "stylesheet";
    // link2.type = "text/css";
    // link2.href = "../public_pages/css/structure.css";
    // link2.media = "all";
    // head.appendChild(link2);

    // link3.id = "myCss3";
    // link3.rel = "stylesheet";
    // link3.type = "text/css";
    // link3.href = "../public_pages/css/custom.css";
    // link3.media = "all";
    // head.appendChild(link3);
    /************************
     * Drawer Script
     ***********************/

    var drawer = function () {
        /**
         * Element.closest() polyfill
         * https://developer.mozilla.org/en-US/docs/Web/API/Element/closest#Polyfill
         */
        if (!Element.prototype.closest) {
            if (!Element.prototype.matches) {
                Element.prototype.matches =
                    Element.prototype.msMatchesSelector ||
                    Element.prototype.webkitMatchesSelector;
            }
            Element.prototype.closest = function (s) {
                var el = this;
                var ancestor = this;
                if (!document.documentElement.contains(el)) return null;
                do {
                    if (ancestor.matches(s)) return ancestor;
                    ancestor = ancestor.parentElement;
                } while (ancestor !== null);
                return null;
            };
        }

        // Trap Focus
        // https://hiddedevries.nl/en/blog/2017-01-29-using-javascript-to-trap-focus-in-an-element
        //
        function trapFocus(element) {
            var focusableEls = element.querySelectorAll(
                'a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])'
            );
            var firstFocusableEl = focusableEls[0];
            var lastFocusableEl = focusableEls[focusableEls.length - 1];
            var KEYCODE_TAB = 9;

            element.addEventListener("keydown", function (e) {
                var isTabPressed = e.key === "Tab" || e.keyCode === KEYCODE_TAB;

                if (!isTabPressed) {
                    return;
                }

                if (e.shiftKey) {
          /* shift + tab */ if (document.activeElement === firstFocusableEl) {
                        lastFocusableEl.focus();
                        e.preventDefault();
                    }
                } /* tab */ else {
                    if (document.activeElement === lastFocusableEl) {
                        firstFocusableEl.focus();
                        e.preventDefault();
                    }
                }
            });
        }

        //
        // Settings
        //
        var settings = {
            speedOpen: 50,
            speedClose: 350,
            activeClass: "is-active",
            visibleClass: "is-visible",
            selectorTarget: "[data-drawer-target]",
            selectorTrigger: "[data-drawer-trigger]",
            selectorClose: "[data-drawer-close]",
        };

        //
        // Methods
        //

        // Toggle accessibility
        var toggleAccessibility = function (event) {
            if (event.getAttribute("aria-expanded") === "true") {
                event.setAttribute("aria-expanded", false);
            } else {
                event.setAttribute("aria-expanded", true);
            }
        };

        // Open Drawer
        var openDrawer = function (trigger) {
            // Find target
            var target = document.getElementById(
                trigger.getAttribute("aria-controls")
            );

            // Make it active
            target.classList.add(settings.activeClass);

            // Make body overflow hidden so it's not scrollable
            document.documentElement.style.overflow = "hidden";

            // Toggle accessibility
            toggleAccessibility(trigger);

            // Make it visible
            setTimeout(function () {
                target.classList.add(settings.visibleClass);
                trapFocus(target);
            }, settings.speedOpen);
        };

        // Close Drawer
        var closeDrawer = function (event) {
            // Find target
            var closestParent = event.closest(settings.selectorTarget),
                childrenTrigger = document.querySelector(
                    '[aria-controls="' + closestParent.id + '"'
                );

            // Make it not visible
            closestParent.classList.remove(settings.visibleClass);

            // Remove body overflow hidden
            document.documentElement.style.overflow = "";

            // Toggle accessibility
            toggleAccessibility(childrenTrigger);

            // Make it not active
            setTimeout(function () {
                closestParent.classList.remove(settings.activeClass);
            }, settings.speedClose);
        };

        // Click Handler
        var clickHandler = function (event) {
            // Find elements
            var toggle = event.target,
                open = toggle.closest(settings.selectorTrigger),
                close = toggle.closest(settings.selectorClose);

            // Open drawer when the open button is clicked
            if (open) {
                openDrawer(open);
            }

            // Close drawer when the close button (or overlay area) is clicked
            if (close) {
                closeDrawer(close);
            }

            // Prevent default link behavior
            if (open || close) {
                event.preventDefault();
            }
        };

        // Keydown Handler, handle Escape button
        var keydownHandler = function (event) {
            if (event.key === "Escape" || event.keyCode === 27) {
                // Find all possible drawers
                var drawers = document.querySelectorAll(settings.selectorTarget),
                    i;

                // Find active drawers and close them when escape is clicked
                for (i = 0; i < drawers.length; ++i) {
                    if (drawers[i].classList.contains(settings.activeClass)) {
                        closeDrawer(drawers[i]);
                    }
                }
            }
        };

        //
        // Inits & Event Listeners
        //
        document.addEventListener("click", clickHandler, false);
        document.addEventListener("keydown", keydownHandler, false);
    };

    drawer();

    /************************
     * Drawer Script end
     ***********************/

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
            Header: "Country",
            accessor: "countryName",
        },
    ];
    const clmns_country = [
        {
            id: 0,
            Header: "Source Indicator",
            accessor: "indicatorName",
        },
    ];
    //console.log(clmns);

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
        var countryids = [];
        for (var i = 0, l = selected.length; i < l; i++) {
            countryids.push(selected[i].value);
        }
        countryids = countryids.join(",");

        var sourceid = sourceId;
        trackPromise(
            APIFunctions.getFilterSocioEconomics(countryids, sourceid)
                .then((response) => {
                    const fromYear = response.data.fromYear;
                    const toYear = response.data.toYear;
                    const items = response.data.items;
                    const length = response.data.items.length;
                    //    console.log(response.data.fromYear);
                    //    console.log(response.data.toYear);
                    //    console.log(response.data.items);
                    for (var i = fromYear; i <= toYear; i++) {
                        clmns.push({
                            id: i,
                            Header: i,
                            accessor: `value_${i}`,
                            Cell: (props) => {
                                if (props.value != null)
                                    return props.value
                                        .toFixed(0)
                                        .toString()
                                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                else return "";
                            },
                        });
                    }

                    const allitems = [];
                    // allitems['countryName'] = items[0].countryName;
                    // for(var i = fromYear, j = 0; i <= toYear; i++, j++) {
                    //     if(items[0].items[j].value == null)
                    //         allitems[i] = 0;
                    //     else
                    //         allitems[i] = items[0].items[j].value;
                    // }
                    setColumns(clmns);
                    // console.log(response.data);
                    // console.log(allitems);
                    // console.log(columns);
                    // console.log(columnstest);
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
                            obj[`value_${year}`] = value;
                        }
                        // ob.push({
                        //   countryName: items[i].countryName
                        // });
                        obj["countryName"] = items[i].countryName;
                        ob.push(obj);
                    }
                    // console.log(ob);
                    setAwards(ob);
                    var element = document.getElementById("table-content");
                    element.scrollIntoView(true, { block: "start", inline: "nearest" });
                })
                .catch((e) => {
                    console.log(e);
                })
        );
    };

    const checkIfCanView = (method) => {
        APIFunctions.checkIfCanView("PublicSocioEconomics")
            .then((response) => {
                if (response.data) {
                    if (method === "Country")
                        filterSocioEconomicsByCountry();
                    else if (method == "Ecnomics")
                        filterSocioEconomics();
                }
                else {
                    AlertError("Feature not available, please upgrade your package");
                    return;
                }

            })
            .catch((e) => {
                console.log(e);
            });
    }

    const filterSocioEconomicsByCountry = () => {
        trackPromise(
            APIFunctions.getFilterSocioEconomicsByCountry(countryFilterId)
                .then((response) => {
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
                                if (props.value != null)
                                    return props.value
                                        .toFixed(0)
                                        .toString()
                                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                else return "";
                            },
                        });
                    }

                    const allitems = [];
                    setColumns(clmns_country);
                    console.log(response.data);
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
                            obj[`value_${year}`] = value;
                        }
                        obj["indicatorName"] = items[i].indicatorName;
                        ob.push(obj);
                    }
                    // console.log(ob);
                    setAwards(ob);
                    var element = document.getElementById("table-content");
                    element.scrollIntoView(true, { block: "start", inline: "nearest" });
                })
                .catch((e) => {
                    console.log(e);
                })
        );
        // alert(countryFilterId);
    }

    useEffect(() => {
        APIFunctions.GetLookupsByParentId("SOC_SRC")
            .then((resp) => resp)
            .then((resp) => emplistSources(resp.data));
    }, []);

    useEffect(() => {
        var arr = [];
        arr[0] = {
            id: 0,
            name: "Filter by Indicator"
        };
        arr[1] = {
            id: 1,
            name: "Filter by Country"
        };
        arr[2] = {
            id: 2,
            name: "Filter by Year"
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
            var source_indicator_filters = document.getElementsByClassName("source-indicator-filter");
            for (var i = 0; i < source_indicator_filters.length; i++) {
                source_indicator_filters[i].style.display = 'flex';
            }

            // filter by country filters
            var filter_by_indicator = document.getElementsByClassName("filter-by-country");
            for (var i = 0; i < filter_by_indicator.length; i++) {
                filter_by_indicator[i].style.display = 'none';
            }

            // datatable
            document.getElementById("data-table-div").style.display = "contents";
        } else { // Filter by Country
            if (selectedOptions.id == 1) {
                // filter by indicator filters
                var source_indicator_filters = document.getElementsByClassName("source-indicator-filter");
                for (var i = 0; i < source_indicator_filters.length; i++) {
                    source_indicator_filters[i].style.display = 'none';
                }

                // filter by country filters
                var filter_by_indicator = document.getElementsByClassName("filter-by-country");
                for (var i = 0; i < filter_by_indicator.length; i++) {
                    filter_by_indicator[i].style.display = 'flex';
                }

                // datatable
                document.getElementById("data-table-div").style.display = "contents";
            } else { // Filter by Year
                // filter by indicator filters
                var source_indicator_filters = document.getElementsByClassName("source-indicator-filter");
                for (var i = 0; i < source_indicator_filters.length; i++) {
                    source_indicator_filters[i].style.display = 'none';
                }

                // filter by country filters
                var filter_by_indicator = document.getElementsByClassName("filter-by-country");
                for (var i = 0; i < filter_by_indicator.length; i++) {
                    filter_by_indicator[i].style.display = 'none';
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
                                <div style={{ borderRadius: "10px" }} className="entry-content inner-entry-content mt-5 px-5 py-4">
                                    <div className="row">
                                        <div className="col-12 text-left">
                                            <div className="row">
                                                <div className="col-12 text-left">
                                                    <h3 className="text-black text-bold">Socio Economics</h3>
                                                </div>
                                            </div>
                                            <hr />
                                            <div className="row mb-4 mt-4">
                                                <div className="form-group col-6 text-left">
                                                    <label className="text-black">
                                                        Choose Filter
                                                    </label>
                                                    <Select
                                                        id="ddlFilter"
                                                        name="filterId"
                                                        value={resultFilters.find((obj) => {
                                                            return obj.id === filterId;
                                                        })}
                                                        getOptionLabel={(option) => option.name}
                                                        getOptionValue={(option) => option.id}
                                                        options={resultFilters}
                                                        onChange={handleChangeFilter}
                                                    ></Select>
                                                </div>
                                            </div>

                                            {/* Filter by Indicator Filters */}
                                            <div style={{ display: "none" }} className="row mb-4 mt-4 source-indicator-filter">
                                                <div className="form-group col-6 text-left">
                                                    <label className="text-black" htmlFor="descriptiion">
                                                        Source Indicator
                                                    </label>
                                                    <Select
                                                        id="ddlSource"
                                                        name="sourceId"
                                                        value={resultSources.find((obj) => {
                                                            return obj.id === sourceId;
                                                        })}
                                                        getOptionLabel={(option) => option.name}
                                                        getOptionValue={(option) => option.id}
                                                        options={resultSources}
                                                        onChange={handleChangeSource}
                                                    ></Select>
                                                </div>

                                                <div className="form-group col-6 text-left">
                                                    <label className="text-black" htmlFor="description">
                                                        Choose Country
                                                    </label>
                                                    <MultiSelect
                                                        getOptionValue={(option) => option.countryId}
                                                        options={options}
                                                        value={selected}
                                                        onChange={setSelected}
                                                        labelledBy="Select"
                                                    />
                                                </div>
                                            </div>
                                            <div style={{ display: "none" }} className="row mb-4 justify-content-left source-indicator-filter">
                                                <div className="col-12">
                                                    <button
                                                        type="submit"
                                                        className="btn btn-primary background-color-2 mr-2"
                                                        // onClick={() => filterSocioEconomics()}
                                                        onClick={() => checkIfCanView("Ecnomics")}
                                                    >
                                                        <i className="fas fa-search mr-2" />
                                                        Search
                                                    </button>
                                                    <button className="btn btn-danger inner-btn-secondary" type="button">
                                                        <i className="fas fa-times mr-2" />&nbsp;&nbsp;
                                                        Clear
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Filter by Country Filters */}
                                            <div style={{ display: "none" }} className="row mb-4 mt-4 filter-by-country">
                                                <div className="form-group col-6 text-left">
                                                    <label className="text-black" htmlFor="description">
                                                        Choose Country
                                                    </label>
                                                    <Select
                                                        id="ddlCountry"
                                                        name="countryFilterId"
                                                        value={resultCountries.find((obj) => {
                                                            return obj.id === countryFilterId;
                                                        })}
                                                        getOptionLabel={(option) => option.nameEn}
                                                        getOptionValue={(option) => option.countryId}
                                                        options={resultCountries}
                                                        onChange={handleChangeCountry}
                                                    ></Select>
                                                </div>
                                            </div>
                                            <div style={{ display: "none" }} className="row mb-3 justify-content-center filter-by-country">
                                                <div className="col-12">
                                                    <button
                                                        type="submit"
                                                        className="btn btn-primary background-color-2 mr-2"
                                                        // onClick={() => filterSocioEconomicsByCountry()}
                                                        onClick={() => checkIfCanView("Country")}
                                                    >
                                                        <i className="fas fa-search mr-2" />
                                                        Search
                                                    </button>
                                                    <button className="btn btn-danger inner-btn-secondary" type="button">
                                                        <i className="fas fa-times mr-2" />
                                                        Clear
                                                    </button>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                    <div style={{ display: "none" }} id="data-table-div">
                                        <div className="mb-3">
                                            <select
                                                className="show-pages-select"
                                                value={pageSize}
                                                onChange={(e) =>
                                                    setPageSize(Number(e.target.value))
                                                }
                                            >
                                                {[10, 25, 50].map((pageSize) => (
                                                    <option key={pageSize} value={pageSize}>
                                                        Show {pageSize}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div
                                            id="table-content"
                                            className="col-md-12 list p-0 mb-3 custom-scrollbar fixed-first-col"
                                            style={{ overflowX: "scroll", maxWidth: "100%" }}
                                        >
                                            <table
                                                className="table table-striped socio-economic-table"
                                                {...getTableProps()}
                                            >
                                                <thead>
                                                    {headerGroups.map((headerGroup) => (
                                                        <tr {...headerGroup.getHeaderGroupProps()}>
                                                            {headerGroup.headers.map((column) => (
                                                                <th
                                                                    className="text-black vertical-align-middle text-left table-border-1 fixed-width-120"
                                                                    {...column.getHeaderProps(
                                                                        column.getSortByToggleProps()
                                                                    )}
                                                                >
                                                                    {column.render("Header")}{" "}
                                                                    <span>
                                                                        {" "}
                                                                        {column.isSorted
                                                                            ? column.isSortedDesc
                                                                                ? " ↓"
                                                                                : " ↑"
                                                                            : ""}{" "}
                                                                    </span>
                                                                </th>
                                                            ))}
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
                                                                            className="text-black vertical-align-middle text-left"
                                                                            {...cell.getCellProps()}
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
                                                        Page{" "}
                                                        <strong>
                                                            {pageIndex + 1} of {pageOptions.length}
                                                        </strong>{" "}
                                                    </span>
                                                    <span className="text-black d-flex ml-1 mr-1 align-items-start">
                                                        | Go to page:
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
                                                            style={{ width: "50px", height: "25px", borderBottom: 0 }}
                                                            className="cstm-input ml-1"
                                                        />
                                                    </span>
                                                </div>
                                                <div className="col-md-6 text-align-right">
                                                    <button
                                                        className="btn inner-btn-secondary mr-1"
                                                        onClick={() => gotoPage(0)}
                                                        disabled={!canPreviousPage}
                                                    >
                                                        {"<<"}
                                                    </button>
                                                    <button
                                                        className="btn inner-btn-secondary mr-1"
                                                        onClick={() => previousPage()}
                                                        disabled={!canPreviousPage}
                                                    >
                                                        Previous
                                                    </button>
                                                    <button
                                                        className="btn inner-btn-secondary mr-1"
                                                        onClick={() => nextPage()}
                                                        disabled={!canNextPage}
                                                    >
                                                        Next
                                                    </button>
                                                    <button
                                                        className="btn inner-btn-secondary"
                                                        onClick={() => gotoPage(pageCount - 1)}
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
            <a href="#" className="btn btn-primary background-color-2 btn-back-to-filters">Back to Filters</a>
            <footer id="Footer" className="clearfix">
                <div className="widgets_wrapper" style={{ padding: "70px 0" }}>
                    <div className="container">
                        <div className="column one-fourth">
                            <aside className="widget_text widget widget_custom_html">
                                <div className="textwidget custom-html-widget">
                                    <hr className="no_line" style={{ margin: "0 auto 5px" }} />
                                    <ul>
                                        <li className="mb-2">
                                            <span className="footer-arrow-right">→</span>
                                            <a href="#">Lorem ipsum</a>
                                        </li>
                                        <li className="mb-2">
                                            <span className="footer-arrow-right">→</span>
                                            <a href="#">Praesent pretium</a>
                                        </li>
                                        <li className="mb-2">
                                            <span className="footer-arrow-right">→</span>
                                            <a href="#">Pellentesque</a>
                                        </li>
                                        <li className="mb-2">
                                            <span className="footer-arrow-right">→</span>
                                            <a href="#">Aliquam</a>
                                        </li>
                                        <li className="mb-2">
                                            <span className="footer-arrow-right">→</span>
                                            <a href="#">Lorem ipsum</a>
                                        </li>
                                    </ul>
                                </div>
                            </aside>
                        </div>
                        <div className="column one-fourth">
                            <aside className="widget_text widget widget_custom_html">
                                <div className="textwidget custom-html-widget">
                                    <hr className="no_line" style={{ margin: "0 auto 5px" }} />
                                    <ul>
                                        <li className="mb-2">
                                            <span className="footer-arrow-right">→</span>
                                            <a href="#">Etiam dapibus</a>
                                        </li>
                                        <li className="mb-2">
                                            <span className="footer-arrow-right">→</span>
                                            <a href="#">Nunc sit</a>
                                        </li>
                                        <li className="mb-2">
                                            <span className="footer-arrow-right">→</span>
                                            <a href="#">Etiam tempor</a>
                                        </li>
                                        <li className="mb-2">
                                            <span className="footer-arrow-right">→</span>
                                            <a href="#">Lorem ipsum</a>
                                        </li>
                                        <li className="mb-2">
                                            <span className="footer-arrow-right">→</span>
                                            <a href="#">Nunc sit</a>
                                        </li>
                                    </ul>
                                </div>
                            </aside>
                        </div>
                        <div className="column one-fourth">
                            <aside className="widget_text widget widget_custom_html">
                                <div className="textwidget custom-html-widget">
                                    <hr className="no_line" style={{ margin: "0 auto 5px" }} />
                                    <ul>
                                        <li className="mb-2">
                                            <span className="footer-arrow-right">→</span>
                                            <a href="#">Praesent pretium</a>
                                        </li>
                                        <li className="mb-2">
                                            <span className="footer-arrow-right">→</span>
                                            <a href="#">Pellentesque</a>
                                        </li>
                                        <li className="mb-2">
                                            <span className="footer-arrow-right">→</span>
                                            <a href="#">Aliquam</a>
                                        </li>
                                        <li className="mb-2">
                                            <span className="footer-arrow-right">→</span>
                                            <a href="#">Etiam dapibus</a>
                                        </li>
                                        <li className="mb-2">
                                            <span className="footer-arrow-right">→</span>
                                            <a href="#">Aliquam</a>
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
                                        <a style={{ color: "#f94203" }} href="#">
                                            noreply@envato.com
                                        </a>
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
                            <a id="back_to_top" className="button button_js" href="#">
                                <i className="icon-up-open-big" />
                            </a>
                            <div className="copyright">
                                © 2018 Be Internet 2 - BeTheme. Muffin group - HTML by{" "}
                                <a target="_blank" rel="nofollow" href="http://bit.ly/1M6lijQ">
                                    BeantownThemes
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
            {/* side menu */}
            <div id="Side_slide" className="right dark" data-width={250}>
                <div className="close-wrapper">
                    <a href="#" className="close">
                        <i className="icon-cancel-fine" />
                    </a>
                </div>
                <div className="menu_wrapper" />
            </div>
            <div id="body_overlay" />
        </div>
    );
};

export default SocioEconomics2;
