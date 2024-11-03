import React, { useState, useEffect, useMemo, useRef, Component } from "react";
import APIFunctions from "../utils/APIFunctions";
import { useTable, useSortBy, usePagination } from "react-table";
import "react-datepicker/dist/react-datepicker.css";
import "../css/CustomStyle.css";
import { Alert, LoadingAlert, AlertError } from "../components/f_Alerts";
import Modal from "react-bootstrap/Modal";
import { getValue } from "../Assets/Language/Entries";
import { getLang, getIMF, getPPP, displayPop } from "../utils/common";
import $ from 'jquery';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import Pricing2 from "./Pricing2";
import {
    Chart, Series, Legend, ValueAxis, ConstantLine, Point, ZoomAndPan,
    CommonSeriesSettings, Border, CommonPaneSettings, Title, Tooltip, ArgumentAxis, Grid, Label, Export, VisualRange, Tick, Font
} from 'devextreme-react/chart';
import { Size } from "devextreme-react/bar-gauge";


const PricingTest = (props) => {

    const [plotMean, setPlotMean] = React.useState(null);
    const [plotMedian, setPlotMedian] = React.useState(null);
    const [upperPlot, setPlotUpper] = React.useState(null);
    const [lowerPlot, setPlotLower] = React.useState(null);

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
    const [adjustByInflation, setAdjustByInflation] = useState(false);
    const [adjustByPPPFactor, setAdjustByPPPFactor] = useState(false);
    const [addAnnualPayment, setAddAnnualPayment] = useState(false);
    const [normalizeByGDPc, setNormalizeByGDPc] = useState(false);
    const [annualizePrices, setAnnualizePrices] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = React.useState("Transitioning...");
    const [showDisplay, setShowDisplay2] = useState(true);
    const [regressionVisibilityValue, setRegressionVisibilityValue] = useState("none");
    const [quartileVisibiltyValue, setquatileVisibiltyValue] = useState("none");
    const [standardDeviationValue, setstandardDeviationValue] = useState("none");
    const [upperPercentileValue, setUpperPercentileValue] = useState("none");
    const [lowerPercentileValue, setLowerPercentileValue] = useState("none");
    const [hasPercentileValue, setHasPercentileValue] = useState(false);
    const [awards, setAwards] = useState([]);
    const [awardsNew, setAwardsNew] = useState([]);
    const awardsRef = useRef();
    const awardsNewRef = useRef();
    const optionsRef = useRef();
    const bandOptionsListRef = useRef();
    const [iconClass, setIconClass] = useState("spectre-angle-up btn btn-primary background-color-2 color-white mr-2");
    const [showTxt, setShowTxt] = useState(getValue("ShowLess", getLang()));
    const [discountRateValue, setDiscountRate] = useState();
    const [termValue, setTermValue] = useState();
    const [hasRegressionValue, setHasRegressionValue] = useState(false);
    const [regressionValue, setRegressionValue] = useState();
    const [upperPercentileValueSelected, setUpperPercentileValueSelected] = useState();
    const [lowerPercentileValueSelected, setLowerPercentileValueSelected] = useState();
    const [hasQuartileValue, setHasQuartileValue] = useState(false);
    const [quartileValue, setQuartileValue] = useState();
    const [hasStandardDeviation, sethasStandardDeviation] = useState(false);
    const [hasAutoFiltering, setHasAutoFiltering] = useState(false);
    const [standardDeviationValueAdded, setstandardDeviationValueAdded] = useState();
    const [bandOptionsList, setSelectedBandsOptions] = useState([]);
    const [options, setoptions] = useState([]);
    const [arrayOfBandCountries, setArrayOfBandCountries] = useState([]);
    const [columns, setColumns] = useState([]);
    const [columnsNew, setColumnsNew] = useState([]);
    const [chartSeries, setChartSeries] = useState([]);
    const [deSelectChecked, setDeseltectChecked] = useState(false);
    const [numberOfAwards, setNumberOfAwards] = useState(0);
    const [awardsWithMarkers, setAwardsWithMar] = useState(false);
    const [deselectedIndicator, setDeselectedIndicator] = useState(true);
    const [btnShowClicked, setBtnShowClicked] = useState(false);

    const [filters, setFilters] = useState();
    const [isOpen3, setIsOpen3] = useState(false);
    const [isOpen5, setIsOpen5] = useState(false);
    const [myHeader, setMyHeader] = useState("");
    const [checkAllBands, setCheckAllBands] = useState(false);
    const [awardsForChart, setAwardsForCharts] = useState([]);
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const [svg, setSVG] = useState("");

    const [isExportPDF, setisExportPDF] = useState(false);
    const [hiddenAwards, setHiddenAwards] = useState([]);
    const [plotMinVal, setPlotMinVal] = useState(null);
    const [plotMaxVal, setPlotMaxVal] = useState(null);
    const [plotMinValErr, setPlotMinValErr] = useState(false);
    const [plotMaxValErr, setPlotMaxValErr] = useState(false);

    const [width, setWidth] = useState(window.innerWidth*0.7);
    
    var _exportedFilters;
    const chartRef = useRef(null);




    awardsRef.current = awards;
    awardsNewRef.current = awardsNew;
    optionsRef.current = options;
    bandOptionsListRef.current = bandOptionsList;


    const ShowPlot = () => {

        setPlotMinVal(null);
        setPlotMaxVal(null);
        setPlotMinValErr(false);
        setPlotMaxValErr(false);
        var data = [];
        let _awardsForChart = [...awards];
        _awardsForChart = _awardsForChart.sort((a, b) => (parseFloat(a.price) < parseFloat(b.price)) ? 1 : -1);
        let sum = 0;
        var arr = [];
        for (var i = 0; i < _awardsForChart.length; i++) {
            sum += _awardsForChart[i].price;
        }
        var arr_prices = _awardsForChart.map(function (val) {
            return val.price == null ? 0 : val.price.toFixed(3);
        });
        let lengthBeforeHidden = _awardsForChart.length;
        for (var i = 0; i < hiddenAwards.length; i++) {
            _awardsForChart.push(hiddenAwards[i]);
        }
        _awardsForChart = _awardsForChart.sort((a, b) => (parseFloat(a.price) < parseFloat(b.price)) ? 1 : -1);

        var lowerValue = null;
        var upperValue = null;

        // console.log("custom header: ", myHeader);
        let multiplier = parseInt(myHeader.split("x")[1].trim());
        // console.log("multiplier = ", multiplier);

        _awardsForChart.map((val, i) => {
            var item = new Object();
            item.index = i.toString();
            item.bandCountry = val.bandCountry;
            item.price = parseFloat(val.price.toFixed(3));
            item.mean = calculateMean(sum, _awardsForChart.length);
            item.median = calculateMedian(arr_prices);
            item.upperValue = val.upperValue == null ? null : normalizeByGDPc ? (val.upperValue * multiplier).toFixed(3) : val.upperValue.toFixed(3);
            item.lowerValue = val.lowerValue == null ? null : normalizeByGDPc ? (val.lowerValue * multiplier).toFixed(3) : val.lowerValue.toFixed(3);
            lowerValue = val.lowerValue == null ? null : normalizeByGDPc ? (val.lowerValue * multiplier).toFixed(3) : val.lowerValue.toFixed(3);
            upperValue = val.upperValue == null ? null : normalizeByGDPc ? (val.upperValue * multiplier).toFixed(3) : val.upperValue.toFixed(3);
            arr.push(item);
        });
        // console.log("awards for chart: ", arr);
        setAwardsForCharts(arr);
        // console.log("upper and lower values: ", upperValue, lowerValue);

        setPlotMean(calculateMean(sum, lengthBeforeHidden));;
        setPlotMedian(calculateMedian(arr_prices));
        setPlotUpper(upperValue);
        setPlotLower(lowerValue);

        setTimeout(() => {
            var _svg = chartRef.current.instance.svg();
            setSVG(_svg);
        }, 3000);


        setIsOpen(true);


        return;
    };


    function prepareMarkup(chartSvg, markup) {
        var svg = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="820px" height="420px">'
            + `${markup}<g transform="translate(305,12)">${chartSvg}</g></svg>`;

        console.log('svg')
        console.log(svg)
    }

    const hideModal = () => {
        setIsOpen(false);
        setTitle("Transitioning...");
    };

    const modalLoaded = () => {
        setTitle("Pricing Plot");
    };

    const modalLoaded3 = () => {
        setTitle("Export");
    };

    const hideModal3 = () => {
        setIsOpen3(false);
        setTitle("Export");
    };


    const exportToPDF = () => {

        LoadingAlert("Show");

        var AwardFilter = new Object();
        AwardFilter.FromYear = parseInt(fromDate);
        AwardFilter.Lang = getLang();
        AwardFilter.ToYear = parseInt(toDate);
        AwardFilter.IsPPP = getPPP() == "true" ? true : false;
        AwardFilter.IsIMF = getIMF() == "true" ? true : false;
        //AwardFilter.CountryIds = selectedCountries.join(",");
        AwardFilter.IsSingle = singleBand;
        AwardFilter.IsMultiple = multiBand;
        AwardFilter.IsPairedAndUnPaired = pairedUnpaired;
        AwardFilter.IsPaired = paired;
        AwardFilter.IsUnPaired = unPaired;
        AwardFilter.RegionalLicense = includeRegional;
        AwardFilter.minGDPValue = parseInt(minGDP);
        AwardFilter.maxGDPValue = parseInt(maxGDP);
        AwardFilter.MaxGDP = parseInt(maxGDP);
        AwardFilter.MinGDP = parseInt(minGDP);
        //AwardFilter.Band = selectedBands.join(",");
        AwardFilter.issueDate = parseInt($("#issueDate").val());
        var awardTypeSelectedValue = $("#showResults").val();
        if (awardTypeSelectedValue == -1) AwardFilter.AverageSumPricesAndMHZ = true;
        else AwardFilter.AverageSumPricesAndMHZ = false;
        if (awardTypeSelectedValue == 1) AwardFilter.averageAwards = true;
        else AwardFilter.averageAwards = false;
        if (awardTypeSelectedValue == 0) AwardFilter.uniqueAwards = true;
        else AwardFilter.uniqueAwards = false;
        AwardFilter.discountRate = discountRateValue;
        AwardFilter.term = termValue;
        AwardFilter.AdjustByInflationFactor = adjustByInflation;
        AwardFilter.AdjustByGDPFactor = normalizeByGDPc;
        AwardFilter.AdjustByPPPFactor = adjustByPPPFactor;
        AwardFilter.AnnualizePrice = annualizePrices;
        AwardFilter.IsIncludeAnnual = addAnnualPayment;
        AwardFilter.hasRegression = hasRegressionValue;
        AwardFilter.regression = regressionValue;
        AwardFilter.HasPercentile = hasPercentileValue;
        AwardFilter.UpperPercentile = upperPercentileValueSelected;
        AwardFilter.LowerPercentile = lowerPercentileValueSelected;
        AwardFilter.HasQuartile = hasQuartileValue;
        AwardFilter.KValue = parseFloat(quartileValue);
        AwardFilter.HasStandardDeviation = hasStandardDeviation;
        AwardFilter.StandardDeviationValue = standardDeviationValueAdded;
        AwardFilter.AutoFiltering = hasAutoFiltering;
        AwardFilter.sumBand = $("#sumBands").val();
        AwardFilter.ShowMarkers = $('#showMarkers').val() == "1" ? true : false;
        AwardFilter.outliers = $('#ddlOutliers').val();

        AwardFilter.Header = myHeader;
        setFilters(AwardFilter);
        _exportedFilters = AwardFilter;
        ShowPlot();

        setTimeout(() => {
            var _svg = chartRef.current.instance.svg();
            setSVG(_svg);
            setisExportPDF(true);
            setTimeout(() => {
                setIsOpen(false);
                setisExportPDF(false);
            }, 300)
        }, 3000);

    }

    const hideModal5 = () => {
        setIsOpen5(false);
    };


    const exportToCSV = (csvData, fileName) => {

        console.log(csvData);



        var result = [];
        if ($('#showResults').val() == "0") {
            csvData.map((val, i) => {
                var item = new Object();
                item.Country = val.countryName;
                item["Pop,M"] = displayPop(val.pop, getIMF());
                item["GDPc, $"] = (val.gdp == 0 || val.gdp == null) ? '' : val.gdp.toFixed(0);
                item.Operator = val.operatorName;
                item.Date = val.year;
                item["Price, $M	"] = val.upFrontFees;
                item["Term (Y)"] = val.terms;
                item.Band = val.band;
                item[myHeader] = val.price;



                result.push(item);
            });
        }
        else {
            csvData.map((val, i) => {
                var item = new Object();
                item.Country = val.countryName;
                item["Pop,M"] = displayPop(val.pop, getIMF());
                item["GDPc, $"] = (val.gdp == 0 || val.gdp == null) ? '' : val.gdp.toFixed(0);
                item.Date = val.year;
                item["Term (Y)"] = val.terms;
                item.Band = val.band;
                item[myHeader] = val.price;
                result.push(item);
            });
        }


        const ws = XLSX.utils.json_to_sheet(result);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, fileName + fileExtension);
    }



    const checkIfCanView = () => {
        APIFunctions.checkIfCanView("PricingTest")
            .then((response) => {
                if (response.data) {
                    filterAwards();
                } else {
                    setNumberOfAwards(0);
                    document.getElementById("numberOfAwards").innerHTML = "0";
                    document.getElementById("meanValueContainer").innerHTML = `${getValue("Mean", getLang())}: 0`;
                    Alert(getValue("FeatureNotAvailable", getLang()));
                    return;
                }
            })
            .catch((e) => {
                console.log(e);
            });
    };

    // useEffect(()=> {
    //   console.log(awards);
    // })
    const filterAwards = () => {

        setBtnShowClicked(true);

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
            AlertError(getValue("ValidFromDate", getLang()));
            return;
        }
        if (toDate.length > 4 || toDate.length < 4) {
            AlertError(getValue("ValidFromDate", getLang()));
            return;
        }
        if (termValue == "" || termValue == null || termValue <= 0) {
            AlertError(getValue("MinTermValue", getLang()));
            return;
        }
        if (termValue > 40) {
            AlertError(getValue("MaxTermValue", getLang()));
            return;
        }
        if (discountRateValue == "" || discountRateValue == null || discountRateValue < 0) {
            AlertError(getValue("MinDiscountRate", getLang()));
            return;
        }
        if (discountRateValue > 100) {
            AlertError(getValue("MaxDiscountRate", getLang()));
            return;
        }
        if (parseInt($("#issueDate").val()) < parseInt(toDate)) {
            AlertError(getValue("IssueDateValidation", getLang()));
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

        if ($("#ddlOutliers").val() == 0) {
            if (upperPercentileValueSelected == '' || lowerPercentileValueSelected == '') {
                AlertError(getValue("UpperLowerPercentileEmpty", getLang()));
                return;
            }
            if (+upperPercentileValueSelected < 0) {
                AlertError(getValue("UpperPercentileMinValidation", getLang()));
                return;
            }
            if (+upperPercentileValueSelected > 100) {
                AlertError(getValue("UpperPercentileMaxValidation", getLang()));
                return;
            } if (+lowerPercentileValueSelected < 0) {
                AlertError(getValue("LowerPercentileMinValidation", getLang()));
                return;
            }
            if (+lowerPercentileValueSelected > 100) {
                AlertError(getValue("LowerPercentileMaxValidation", getLang()));
                return;
            }
            if (+upperPercentileValueSelected < +lowerPercentileValueSelected) {
                AlertError(getValue("LowePerLessThan", getLang()));
                return;
            }
        }
        if ($("#ddlOutliers").val() == 1) {
            if (regressionValue.trim() == '') {
                AlertError(getValue("RegressionValueEmpty", getLang()));
                return;
            }
            if (regressionValue < 0) {
                AlertError(getValue("Min%", getLang()));
                return;
            }
            if (regressionValue > 100) {
                AlertError(getValue("Max%", getLang()));
                return;
            }
        }
        if ($("#ddlOutliers").val() == 2) {
            if (quartileValue.trim() == '') {
                AlertError(getValue("KValueEmpty", getLang()));
                return;
            }
            if (quartileValue < 0) {
                AlertError(getValue("MinKValue", getLang()));
                return;
            }
            if (quartileValue > 3) {
                AlertError(getValue("MaxKValue", getLang()));
                return;
            }
        }
        if ($("#ddlOutliers").val() == 3) {
            if (standardDeviationValueAdded.trim() == '') {
                AlertError(getValue("SDValueEmpty", getLang()));
                return;
            }
            if (standardDeviationValueAdded < 1) {
                AlertError(getValue("MinSD", getLang()));
                return;
            }
            if (standardDeviationValueAdded > 3) {
                AlertError(getValue("MaxSD", getLang()));
                return;
            }
        }

        // Validations End

        var AwardFilter = new Object();
        AwardFilter.FromYear = parseInt(fromDate);
        AwardFilter.Lang = getLang();
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
        AwardFilter.minGDPValue = parseInt(minGDP);
        AwardFilter.maxGDPValue = parseInt(maxGDP);
        AwardFilter.MaxGDP = parseInt(maxGDP);
        AwardFilter.MinGDP = parseInt(minGDP);
        AwardFilter.Band = selectedBands.join(",");
        AwardFilter.issueDate = parseInt($("#issueDate").val());
        var awardTypeSelectedValue = $("#showResults").val();
        if (awardTypeSelectedValue == -1) AwardFilter.AverageSumPricesAndMHZ = true;
        else AwardFilter.AverageSumPricesAndMHZ = false;
        if (awardTypeSelectedValue == 1) AwardFilter.averageAwards = true;
        else AwardFilter.averageAwards = false;
        if (awardTypeSelectedValue == 0) AwardFilter.uniqueAwards = true;
        else AwardFilter.uniqueAwards = false;
        AwardFilter.discountRate = discountRateValue;
        AwardFilter.term = termValue;
        AwardFilter.AdjustByInflationFactor = adjustByInflation;
        AwardFilter.AdjustByGDPFactor = normalizeByGDPc;
        AwardFilter.AdjustByPPPFactor = adjustByPPPFactor;
        AwardFilter.AnnualizePrice = annualizePrices;
        AwardFilter.IsIncludeAnnual = addAnnualPayment;
        AwardFilter.hasRegression = hasRegressionValue;
        AwardFilter.regression = regressionValue;
        AwardFilter.HasPercentile = hasPercentileValue;
        AwardFilter.UpperPercentile = upperPercentileValueSelected === '' ? 0 : upperPercentileValueSelected;
        AwardFilter.LowerPercentile = lowerPercentileValueSelected === '' ? 0 : lowerPercentileValueSelected;
        AwardFilter.HasQuartile = hasQuartileValue;
        AwardFilter.KValue = parseFloat(quartileValue);
        AwardFilter.HasStandardDeviation = hasStandardDeviation;
        AwardFilter.StandardDeviationValue = standardDeviationValueAdded;
        AwardFilter.AutoFiltering = hasAutoFiltering;
        AwardFilter.sumBand = $("#sumBands").val();
        AwardFilter.ShowMarkers = $('#showMarkers').val() == "1" ? true : false;

        console.log(AwardFilter);
        var list = [];
        list.push(
            { id: 0, pageUrl: "PricingTest", field: "FromYear", value: fromDate.toString(), userId: 0 },
            { id: 0, pageUrl: "PricingTest", field: "ToYear", value: toDate.toString(), userId: 0 },
            { id: 0, pageUrl: "PricingTest", field: "IssueDate", value: $("#issueDate").val(), userId: 0 },
            { id: 0, pageUrl: "PricingTest", field: "awardTypeSelectedValue", value: $("#showResults").val(), userId: 0 },
            { id: 0, pageUrl: "PricingTest", field: "discountRate", value: discountRateValue.toString(), userId: 0 },
            { id: 0, pageUrl: "PricingTest", field: "term", value: termValue.toString(), userId: 0 },
            { id: 0, pageUrl: "PricingTest", field: "AdjustByInflationFactor", value: adjustByInflation.toString(), userId: 0 },
            { id: 0, pageUrl: "PricingTest", field: "AdjustByGDPFactor", value: normalizeByGDPc.toString(), userId: 0 },
            { id: 0, pageUrl: "PricingTest", field: "AdjustByPPPFactor", value: adjustByPPPFactor.toString(), userId: 0 },
            { id: 0, pageUrl: "PricingTest", field: "AnnualizePrice", value: annualizePrices.toString(), userId: 0 },
            { id: 0, pageUrl: "PricingTest", field: "IsIncludeAnnual", value: addAnnualPayment.toString(), userId: 0 },
            { id: 0, pageUrl: "PricingTest", field: "regression", value: regressionValue.toString(), userId: 0 },
            { id: 0, pageUrl: "PricingTest", field: "UpperPercentile", value: upperPercentileValueSelected.toString(), userId: 0 },
            { id: 0, pageUrl: "PricingTest", field: "LowerPercentile", value: lowerPercentileValueSelected.toString(), userId: 0 },
            { id: 0, pageUrl: "PricingTest", field: "KValue", value: quartileValue.toString(), userId: 0 },
            { id: 0, pageUrl: "PricingTest", field: "StandardDeviationValue", value: standardDeviationValueAdded.toString(), userId: 0 },
            { id: 0, pageUrl: "PricingTest", field: "ddlOutliers", value: $("#ddlOutliers").val(), userId: 0 },
            { id: 0, pageUrl: "PricingTest", field: "sumBand", value: $("#sumBands").val(), userId: 0 },
            { id: 0, pageUrl: "PricingTest", field: "showMarkers", value: $("#showMarkers").val(), userId: 0 },
            { id: 0, pageUrl: "PricingTest", field: "MinGDP", value: minGDP.toString(), userId: 0 },
            { id: 0, pageUrl: "PricingTest", field: "MaxGDP", value: maxGDP.toString(), userId: 0 },
            { id: 0, pageUrl: "PricingTest", field: "RegionalLicense", value: includeRegional.toString(), userId: 0 },
            { id: 0, pageUrl: "PricingTest", field: "Paired", value: AwardFilter.IsPaired.toString(), userId: 0 },
            { id: 0, pageUrl: "PricingTest", field: "IsUnPaired", value: AwardFilter.IsUnPaired.toString(), UserId: 0 },
            { id: 0, pageUrl: "PricingTest", field: "IsPairedAndUnPaired", value: AwardFilter.IsPairedAndUnPaired.toString(), userId: 0 },
            { id: 0, pageUrl: "PricingTest", field: "IsMultiple", value: AwardFilter.IsMultiple.toString(), userId: 0 },
            { id: 0, pageUrl: "PricingTest", field: "IsSingle", value: AwardFilter.IsSingle.toString(), userId: 0 },
            { id: 0, pageUrl: "PricingTest", field: "Bands", value: JSON.stringify(bandOptionsList), userId: 0 },
            { id: 0, pageUrl: "PricingTest", field: "Country", value: JSON.stringify(options), userId: 0 })

        console.log(list);
        LoadingAlert("Show");
        APIFunctions.FilterPricing(AwardFilter)
            .then((response) => {
                console.log(response.data);
                LoadingAlert("Hide");
                if (response.data == 0 || response.data.length < 1 || !Array.isArray(response.data)) {
                    Alert(getValue("NoDataToDisplay", getLang()));
                    setAwards([]);
                    setNumberOfAwards(0);
                    var numberOfAwardsContainer = document.getElementById("numberOfAwards");
                    if (typeof (numberOfAwardsContainer) != 'undefined' && numberOfAwardsContainer != null)
                        document.getElementById("numberOfAwards").innerHTML = 0;
                    var meanContainer = document.getElementById("meanValueContainer");
                    if (typeof (meanContainer) != 'undefined' && meanContainer != null)
                        meanContainer.innerHTML = `${getValue("Mean", getLang())}: 0`;
                    saveUserFilters(list);
                    return;
                } else {

                    var data = response.data;
                    var hiddenData = data.filter((item) => item.isHidden);
                    // console.log("hidden data: ", hiddenData);
                    setHiddenAwards(hiddenData);
                    data = data.filter((item) => item.isHidden == null || item.isHidden == false);

                    var min = Number.MAX_VALUE;
                    for (var i = 0, l = data.length; i < l; i++) {
                        min = Math.min(min, data[i].price);
                    }

                    var count = 0;
                    if (min != 0) {
                        while (min < 0.001) {
                            min *= 10;
                            count++;
                            console.log(min)
                        }
                    }

                    var CustomPriceHeader = "$/M/P";
                    if (annualizePrices) {
                        CustomPriceHeader += "/Y"
                    }

                    if (normalizeByGDPc) {
                        CustomPriceHeader += "/GDPc x " + Math.pow(10, count);
                        for (var i = 0, l = response.data.length; i < l; i++) {
                            response.data[i].price *= Math.pow(10, count);
                        }
                    }
                    else {
                        CustomPriceHeader += " x 1";
                    }


                    setMyHeader(CustomPriceHeader);
                    var nbr_of_awards = data.length;
                    setNumberOfAwards(data.length);
                    $("#numberOfAwards").html(data.length);
                    var mean = 0;
                    var sum = 0;
                    var count = data.length;
                    for (var i = 0; i < data.length; i++) {
                        sum += data[i].price;
                    }

                    mean = calculateMean(sum, count);

                    console.log('Filtered Data');
                    console.log(data);
                    setAwards(data);
                    console.log(awards);

                    setAwardsWithMar(response.data);

                    var arr_band_countries = [];
                    for (var k = 0; k < data.length; k++) {
                        arr_band_countries.push(data[k].bandCountry);
                    }
                    console.log(arr_band_countries);
                    setArrayOfBandCountries(arr_band_countries);
                    var arr = data.map(function (val) {
                        return val.price == null ? 0 : val.price.toFixed(3);
                    });

                    console.log(response.data)
                    var arr2 = data.map(function (val) {
                        return (
                            val.band +
                            "-" +
                            val.countryName +
                            "-" +
                            val.year +
                            "-" +
                            val.operatorName +
                            " Price=" +
                            val.price +
                            " $/M/P x1"
                        );
                    });

                    console.log('680')
                    var arr3 = data.map(function (val) {
                        return val.price;
                    });

                    var min = 0;
                    if (awardTypeSelectedValue == 0) {
                        const columnsAdded = [
                            {
                                Header: () => <div id="numberOfAwardsContainer" className="text-black fw-600" style={{ justifyContent: "start", display: "flex" }}>{getValue("NumberOfAwards", getLang())}:&nbsp; <span id="numberOfAwards">{nbr_of_awards}</span></div>,
                                accessor: "numberOfAwards",
                                disableSortBy: true,
                                columns: [
                                    {
                                        id: "checkBox",
                                        Header: "",
                                        Cell: (props) => {
                                            const rowId = props.row.id;
                                            return (
                                                <div>
                                                    <input
                                                        type="checkbox"
                                                        className="deselect"
                                                        checked={deSelectChecked}
                                                        onChange={() => handleCheckbox(rowId)}
                                                    />
                                                </div>
                                            );
                                        },
                                    },
                                    {
                                        Header: getValue("Country", getLang()),
                                        accessor: "countryName",
                                    },
                                    {
                                        Header: getValue("Pop", getLang()),
                                        accessor: "pop",
                                        Cell: (props) => {
                                            if (props.value == null) return "";
                                            if (Number.isInteger(props.value))
                                                return props.value
                                                    .toString()
                                                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                            else
                                                return props.value
                                                    .toFixed(3)
                                                    .toString()
                                                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                        },
                                    },
                                ],
                            },
                            {
                                Header: "GDPc, $",
                                accessor: "gdp",
                                show: true,
                                Cell: (props) => {
                                    if (props.value != null)
                                        return props.value
                                            .toFixed(0)
                                            .toString()
                                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                    else return "";
                                },
                            },
                            {
                                Header: getValue("Operator", getLang()),
                                accessor: "operatorName",
                            },
                            {
                                Header: getValue("AwardDate", getLang()),
                                accessor: "year",
                            },
                            {
                                Header: "Price, $M",
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
                                    if (props.value != null && props.value != "")
                                        return parseFloat(props.value).toFixed(1);
                                    else return "";
                                },
                            },
                            {
                                Header: getValue("Bands", getLang()),
                                accessor: "band",
                            },
                            {
                                Header: () => <div id="meanValueContainer" style={{ justifyContent: "end", display: "flex" }}>{getValue("Mean", getLang())}: {mean}</div>,
                                accessor: getValue("Mean", getLang()),
                                disableSortBy: true,
                                columns: [
                                    {
                                        Header: CustomPriceHeader,
                                        accessor: "price",
                                        sortType: (rowA, rowB) => {
                                            if (rowA.original.price > rowB.original.price) return -1;
                                            if (rowB.original.price > rowA.original.price) return 1;
                                        },
                                        Cell: (props) => {
                                            if (props.value != null && props.value != "")
                                                return parseFloat(props.value).toFixed(3);
                                            else return "";
                                        },
                                    },
                                ],
                            },
                        ];
                        const columnsNew = [
                            {
                                id: "checkBox",
                                Header: "",
                                Cell: (props) => {
                                    const rowId = props.row.id;
                                    return (
                                        <div>
                                            <input
                                                type="checkbox"
                                                className="deselect"
                                                checked={deSelectChecked}
                                                onChange={() => handleCheckboxDeselect(rowId)}
                                            />
                                        </div>
                                    );
                                },
                            },
                            {
                                Header: getValue("Country", getLang()),
                                accessor: "countryName",
                            },
                            {
                                Header: getValue("Pop", getLang()),
                                accessor: "pop",
                                Cell: (props) => {
                                    if (props.value == null) return "";
                                    if (Number.isInteger(props.value))
                                        return props.value
                                            .toString()
                                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                    else
                                        return props.value
                                            .toFixed(3)
                                            .toString()
                                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                },
                            },
                            {
                                Header: "GDPc, $",
                                accessor: "gdp",
                                show: true,
                                Cell: (props) => {
                                    if (props.value != null)
                                        return props.value
                                            .toFixed(0)
                                            .toString()
                                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                    else return "";
                                },
                            },
                            {
                                Header: getValue("Operator", getLang()),
                                accessor: "operatorName",
                            },
                            {
                                Header: getValue("AwardDate", getLang()),
                                accessor: "year",
                            },

                            {
                                Header: "Price, $M",
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
                                    if (props.value != null && props.value != "")
                                        return parseFloat(props.value).toFixed(1);
                                    else return "";
                                },
                            },
                            {
                                Header: getValue("Bands", getLang()),
                                accessor: "band",
                            },
                            {
                                Header: CustomPriceHeader,
                                accessor: "price",
                                sortType: (rowA, rowB) => {
                                    if (rowA.original.price > rowB.original.price) return -1;
                                    if (rowB.original.price > rowA.original.price) return 1;
                                },
                                Cell: (props) => {
                                    if (props.value != null && props.value != "")
                                        return parseFloat(props.value).toFixed(3);
                                    else return "";
                                },
                            },
                        ];
                        setColumns(columnsAdded);
                        setColumnsNew(columnsNew);
                    } else {
                        const columnsAdded = [
                            {
                                Header: () => <div id="numberOfAwardsContainer" className="text-black fw-600" style={{ justifyContent: "start", display: "flex" }}>{getValue("NumberOfAwards", getLang())}:&nbsp; <span id="numberOfAwards">{nbr_of_awards}</span></div>,
                                accessor: "numberOfAwards",
                                disableSortBy: true,
                                columns: [
                                    {
                                        id: "checkBox",
                                        Header: "",
                                        Cell: (props) => {
                                            const rowId = props.row.id;
                                            return (
                                                <div>
                                                    <input
                                                        type="checkbox"
                                                        className="deselect"
                                                        checked={deSelectChecked}
                                                        onChange={() => handleCheckbox(rowId)}
                                                    />
                                                </div>
                                            );
                                        },
                                    },
                                    {
                                        Header: getValue("Country", getLang()),
                                        accessor: "countryName",
                                    },
                                    {
                                        Header: "POP, M",
                                        accessor: "pop",
                                        Cell: (props) => {
                                            if (props.value == null) return "";
                                            if (Number.isInteger(props.value))
                                                return props.value
                                                    .toString()
                                                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                            else
                                                return props.value
                                                    .toFixed(3)
                                                    .toString()
                                                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                        },
                                    },
                                ],
                            },
                            {
                                Header: "GDPc, $",
                                accessor: "gdp",
                                show: true,
                                Cell: (props) => {
                                    if (props.value != null)
                                        return props.value
                                            .toFixed(0)
                                            .toString()
                                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                    else return "";
                                },
                            },
                            {
                                Header: getValue("AwardDate", getLang()),
                                accessor: "year",
                            },

                            {
                                Header: getValue("Term", getLang()),
                                accessor: "terms",
                                Cell: (props) => {
                                    if (props.value != null && props.value != "")
                                        return parseFloat(props.value).toFixed(1);
                                    else return "";
                                },
                            },
                            {
                                Header: getValue("Bands", getLang()),
                                accessor: "band",
                            },
                            {
                                Header: () => <div id="meanValueContainer" style={{ justifyContent: "end", display: "flex" }}>{getValue("Mean", getLang())}: {mean}</div>,
                                accessor: "Mean",
                                disableSortBy: true,
                                columns: [
                                    {
                                        Header: CustomPriceHeader,
                                        accessor: "price",
                                        sortType: (rowA, rowB) => {
                                            if (rowA.original.price > rowB.original.price) return -1;
                                            if (rowB.original.price > rowA.original.price) return 1;
                                        },
                                        Cell: (props) => {
                                            if (props.value != null && props.value != "")
                                                return parseFloat(props.value).toFixed(3);
                                            else return "";
                                        },
                                    },
                                ],
                            },
                        ];
                        const columnsNew = [
                            {
                                id: "checkBox",
                                Header: "",
                                Cell: (props) => {
                                    const rowId = props.row.id;
                                    return (
                                        <div>
                                            <input
                                                type="checkbox"
                                                className="deselect"
                                                checked={deSelectChecked}
                                                onChange={() => handleCheckboxDeselect(rowId)}
                                            />
                                        </div>
                                    );
                                },
                            },
                            {
                                Header: getValue("Country", getLang()),
                                accessor: "countryName",
                            },
                            {
                                Header: "POP, M",
                                accessor: "pop",
                                Cell: (props) => {
                                    if (props.value == null) return "";
                                    if (Number.isInteger(props.value))
                                        return props.value
                                            .toString()
                                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                    else
                                        return props.value
                                            .toFixed(3)
                                            .toString()
                                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                },
                            },
                            {
                                Header: "GDPc, $",
                                accessor: "gdp",
                                show: true,
                                Cell: (props) => {
                                    if (props.value != null)
                                        return props.value
                                            .toFixed(0)
                                            .toString()
                                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                    else return "";
                                },
                            },
                            {
                                Header: getValue("AwardDate", getLang()),
                                accessor: "year",
                            },

                            {
                                Header: getValue("Term", getLang()),
                                accessor: "terms",
                                Cell: (props) => {
                                    if (props.value != null && props.value != "")
                                        return parseFloat(props.value).toFixed(1);
                                    else return "";
                                },
                            },
                            {
                                Header: getValue("Bands", getLang()),
                                accessor: "band",
                            },

                            {
                                Header: CustomPriceHeader,
                                accessor: "price",
                                Cell: (props) => {
                                    if (props.value != null && props.value != "")
                                        return parseFloat(props.value).toFixed(3);
                                    else return "";
                                },
                            },
                        ];
                        setColumns(columnsAdded);
                        setColumnsNew(columnsNew);
                    }
                }

                setAwardsNew([]);
                saveUserFilters(list);
            })
            .catch((e) => {
                console.log(e);
                LoadingAlert("hide");
            });
    };

    const saveUserFilters = (list) => {
        console.log(list);
        APIFunctions.saveUserFilters(list)
            .then((resp) => resp)
            .then((resp) => console.log(resp));
    };

    const checkIfCanOpen = (target) => {
        if (target == "countrySelection") {
            setIsOpen5(true);
        }
    }

    const getUserFilters = () => {
        // LoadingAlert("Show");
        APIFunctions.getUserFilters("PricingTest")
            .then((resp) => resp)
            .then((resp) => {

                var data = resp.data;
                if (data.length > 0) {
                    var fromYear = data.filter((item) => item.field == "FromYear");
                    var toYear = data.filter((item) => item.field == "ToYear");
                    var issueDate = data.filter((item) => item.field == "IssueDate");
                    var awardTypeSelectedValue = data.filter((item) => item.field == "awardTypeSelectedValue");
                    var discountRate = data.filter((item) => item.field == "discountRate");
                    var term = data.filter((item) => item.field == "term");
                    var adjustByInflationFactor = data.filter((item) => item.field == "AdjustByInflationFactor");
                    var adjustByGDPFactor = data.filter((item) => item.field == "AdjustByGDPFactor");
                    var adjustByPPPFactor = data.filter((item) => item.field == "AdjustByPPPFactor");
                    var annualizePrice = data.filter((item) => item.field == "AnnualizePrice");
                    var isIncludeAnnual = data.filter((item) => item.field == "IsIncludeAnnual");
                    var regression = data.filter((item) => item.field == "regression");
                    var upperPercentile = data.filter((item) => item.field == "UpperPercentile");
                    var lowerPercentile = data.filter((item) => item.field == "LowerPercentile");
                    var kValue = data.filter((item) => item.field == "KValue");
                    var standardDeviationValue = data.filter((item) => item.field == "StandardDeviationValue");
                    var ddlOutliers = data.filter((item) => item.field == "ddlOutliers");
                    var sumBand = data.filter((item) => item.field == "sumBand");
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
                    var showMarkersVal = data.filter((item) => item.field == "showMarkers");
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
                    setFromDate(fromYear[0].value);
                    setToDate(toYear[0].value);
                    $('#issueDate').val(issueDate[0].value);
                    $('#showResults').val(awardTypeSelectedValue[0].value);
                    setDiscountRate(discountRate[0].value);
                    setTermValue(term[0].value);
                    setAdjustByInflation(adjustByInflationFactor[0].value == "true" ? true : false);
                    setNormalizeByGDPc(adjustByGDPFactor[0].value == "true" ? true : false);
                    setAdjustByPPPFactor(adjustByPPPFactor[0].value == "true" ? true : false);
                    setAnnualizePrices(annualizePrice[0].value == "true" ? true : false);
                    setAddAnnualPayment(isIncludeAnnual[0].value == "true" ? true : false);
                    setRegressionValue(regression[0].value);
                    setUpperPercentileValueSelected(upperPercentile[0].value);
                    setLowerPercentileValueSelected(lowerPercentile[0].value);
                    setQuartileValue(kValue[0].value);
                    setstandardDeviationValueAdded(standardDeviationValue[0].value);
                    $('#ddlOutliers').val(ddlOutliers[0].value);
                    excludeOutliers();
                    $('#showMarkers').val(typeof showMarkersVal[0] !== "undefined" ? showMarkersVal[0].value : 0);
                    $('#sumBands').val(sumBand[0].value);

                    var _data = JSON.parse(countries[0].value);
                    var lstChecked = _data.filter((x) => x.isChecked == true).length;
                    var lst = _data.length;
                    var value = lstChecked == lst ? true : false;

                    if (lstChecked == 0)
                        setCheckAll(false)
                    else {
                        var value = lstChecked == lst ? true : false;
                        setCheckAll(value)
                    }

                    var _data2 = JSON.parse(bands[0].value);
                    var lstChecked2 = _data2.filter((x) => x.isChecked == true).length;
                    var lst2 = _data2.length;
                    var value2 = lstChecked2 == lst2 ? true : false;

                    if (lstChecked2.length == 0)
                        setCheckAllBands(false);
                    else
                        setCheckAllBands(value2);

                } else {
                    setDiscountRate(8.86);
                    setTermValue(15);
                    setRegressionValue(0);
                    setQuartileValue(1);
                    setUpperPercentileValueSelected(75);
                    setLowerPercentileValueSelected(25);
                    setstandardDeviationValueAdded(2);
                    setMinGDP(0);
                    setMaxGDP(200000);
                    setFromDate(1985);
                    setToDate(new Date().getFullYear());
                }

                // LoadingAlert("Hide");
            });
    }

    const handleCheckbox = (rowId) => {

        setBtnShowClicked(false);

        setDeseltectChecked(true);

        var nbr = parseInt($('#numberOfAwards').html());
        nbr -= 1;
        $("#numberOfAwards").html(nbr);

        let newArray = [...awardsRef.current];
        let deselectedAwards = [...awardsNewRef.current];
        let deselected = newArray[rowId];
        deselectedAwards.push(deselected);
        deselectedAwards.sort((a, b) => (a.countryName > b.countryName) ? 1 : ((b.countryName > a.countryName) ? -1 : 0));
        newArray.splice(rowId, 1);
        setAwards(newArray);
        setAwardsNew(deselectedAwards);

        var mean = 0;
        var sum = 0;
        var count = newArray.length;
        for (var i = 0; i < newArray.length; i++) {
            sum += newArray[i].price;
        }

        mean = calculateMean(sum, count);
        console.log(mean);
        $("#meanValueContainer").html(`${getValue("Mean", getLang())}: ` + mean);

        setDeseltectChecked(false);

    }

    const handleCheckboxDeselect = (rowId) => {

        setBtnShowClicked(false);

        setDeseltectChecked(true);

        var nbr = parseInt($('#numberOfAwards').html());
        nbr += 1;
        console.log("nbr after: ", nbr);
        $("#numberOfAwards").html(nbr);

        let newArray = [...awardsRef.current];
        let deselectedAwards = [...awardsNewRef.current];
        let deselected = deselectedAwards[rowId];
        newArray.push(deselected);
        newArray.sort((a, b) => (a.countryName > b.countryName) ? 1 : ((b.countryName > a.countryName) ? -1 : 0));
        deselectedAwards.splice(rowId, 1);
        setAwards(newArray);
        setAwardsNew(deselectedAwards);

        var mean = 0;
        var sum = 0;
        var count = newArray.length;
        for (var i = 0; i < newArray.length; i++) {
            sum += newArray[i].price;
        }

        mean = calculateMean(sum, count);
        console.log(mean);
        $("#meanValueContainer").html(`${getValue("Mean", getLang())}: ` + mean);

        setDeseltectChecked(false);

    }

    useEffect(() => {
        APIFunctions.getUserCountries("PricingTest")
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
        $('#PricingTest_page').addClass("active");

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
        console.log("User Countries: ", arr);
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

    const getCheckedBand = (id) => {
        const band = bandOptionsList.find((item) => item.value === id);
        return band ? band.isChecked : false;
    };

    const getCheckedCountry = (id) => {
        if (!getCheckedCountry.cache) {
            getCheckedCountry.cache = {};
        }
    
        if (getCheckedCountry.cache[id] !== undefined) {
            return getCheckedCountry.cache[id];
        }
    
        var checked = false;
        var obj = options.find((item) => item.value === id);
    
        if (obj) {
            checked = obj.isChecked;
        }
    
        getCheckedCountry.cache[id] = checked;
    
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

    const setCheckBand = (id, isChecked) => {
        setSelectedBandsOptions((prevOptions) => {
            const updatedOptions = prevOptions.map((item) =>
                item.value === id ? { ...item, isChecked } : item
            );
            return updatedOptions;
        });
    };

    const firstTable = useTable(
        {
            columns,
            data: awards,
            initialState: {
                hiddenColumns: columns.map((column) => {
                    if (column.show === false) return column.accessor || column.id;
                }),
            },
            autoResetSortBy: false,
            autoResetPage: btnShowClicked,
        },
        useSortBy,
        usePagination
    );

    const {
        getTableProps: getFirstTableProps,
        getTableBodyProps: getFirstTableBodyProps,
        headerGroups: firstHeaderGroups,
        page: firstPage,
        nextPage: firstNextPage,
        previousPage: firstPreviousPage,
        canNextPage: firstCanNextPage,
        canPreviousPage: firstCanPreviousPage,
        pageOptions: firstPageOptions,
        gotoPage: firstGotoPage,
        pageCount: firstPageCount,
        setPageSize: firstSetPageSize,
        state: firstState,
        prepareRow: firstPrepareRow,
    } = firstTable;

    const secondTable = useTable(
        {
            columns: columnsNew,
            data: awardsNew,
            initialState: {
                hiddenColumns: columns.map((column) => {
                    if (column.show === false) return column.accessor || column.id;
                }),
            },
            autoResetSortBy: false,
            autoResetPage: btnShowClicked,
        },
        useSortBy,
        usePagination
    );

    const {
        getTableProps: getSecondTableProps,
        getTableBodyProps: getSecondTableBodyProps,
        headerGroups: secondHeaderGroups,
        page: secondPage,
        nextPage: secondNextPage,
        previousPage: secondPreviousPage,
        canNextPage: secondCanNextPage,
        canPreviousPage: secondCanPreviousPage,
        pageOptions: secondPageOptions,
        gotoPage: secondGotoPage,
        pageCount: secondPageCount,
        setPageSize: secondSetPageSize,
        state: secondState,
        prepareRow: secondPrepareRow,
    } = secondTable;

    const { pageIndex } = firstState;
    const secondPageIndex = secondState.pageIndex;

    const setDisplay = () => {
        setShowDisplay2(!showDisplay);
        setIconClass(!showDisplay == true ? "spectre-angle-up btn btn-primary background-color-2 color-white mr-2"
            : "spectre-angle-down btn btn-primary background-color-2 color-white mr-2");
        setShowTxt(!showDisplay == true ? getValue("ShowLess", getLang()) : getValue("ShowMore", getLang()))
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
        const bands = bandOptionsList;
    
        if (bands != null && bands.length > 0) {
            return bands.map((val) => (
                <div key={val.value} className="form-group">
                    <label>
                        <input
                            type="checkbox"
                            checked={getCheckedBand(val.value)}
                            onChange={(e) => setCheckBand(val.value, e.target.checked)}
                        />
                        {val.value}
                    </label>
                </div>
            ));
        }
    
        return null; // Return null if bands array is empty
    };

    
    var countries = options;
    if (getLang() === "ar")
        countries.sort((a, b) => (a.labelAr > b.labelAr) ? 1 : ((b.labelAr > a.labelAr) ? -1 : 0));
    else
        countries.sort((a, b) => (a.labelEn > b.labelEn) ? 1 : ((b.labelEn > a.labelAr) ? -1 : 0));

    const CountryCheckbox = ({ value, checked, regionId, onChange, label }) => (
        <div className="form-group">
            <label className="chk-wrap">
                <input
                    type="checkbox"
                    data-country={value}
                    checked={checked}
                    value={checked}
                    data-region={regionId}
                    onChange={(e) => onChange(value, e.target.checked, regionId)}
                />
                {label}
            </label>
        </div>
    );

    const renderCountries = () => {
        if (countries != null && countries.length > 0) {
            return countries.map((val, idx) => (
                <CountryCheckbox
                    key={val.value}
                    value={val.value}
                    checked={getCheckedCountry(val.value)}
                    regionId={val.regionId}
                    onChange={setCountryChecked}
                    label={getLang() === "ar" ? val.labelAr : val.label}
                />
            ));
        }
    }

    const renderCountries2 = () => {
        const countries = options;
    
        if (countries != null && countries.length > 0) {
            return countries.map((val, idx) => (
                <div key={val.value} className="form-group">
                    <label className="chk-wrap" style={{ display: "flex" }}>
                        <input
                            type="checkbox"
                            data-country={val.value}
                            style={{ margin: "4px" }}
                            checked={getCheckedCountry(val.value)}
                            value={getCheckedCountry(val.value)}
                            data-region={val.regionId}
                            onChange={(e) => setCountryChecked(val.value, e.target.checked, val.regionId)}
                        />
                        {getLang() === "ar" ? val.labelAr : val.label}
                    </label>
                </div>
            ));
        }
    
        return null;
    };

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

    function calculateMean(sum, count) {
        return (sum / count).toFixed(3);
    }

    function calculateMedian(arr) {
        var values = arr;
        var median = 0;
        values.sort(function (a, b) {
            return a - b;
        });

        var half = Math.floor(values.length / 2);

        if (values.length % 2)
            median = parseFloat(values[half]);
        else {
            median = (parseFloat(values[half - 1]) + parseFloat(values[half])) / 2.0;
        }

        return median.toFixed(3);
    }

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

    function renderDate() {
        var now = new Date().getFullYear();
        var arr_years = [];
        for (var i = now + 3; i >= 1985; i--) {
            arr_years.push(i);
        }
        return (arr_years.map((val, idx) => (
            <option value={val}>{val}</option>
        )));
    }



    function excludeOutliers() {
        var val = $("#ddlOutliers").val();
        if (val == 0) {
            setLowerPercentileValue("block");
            setUpperPercentileValue("block");
            setstandardDeviationValue("none");
            setRegressionVisibilityValue("none");
            setquatileVisibiltyValue("none");
            setHasPercentileValue(true);
            setHasRegressionValue(false);
            setHasQuartileValue(false);
            sethasStandardDeviation(false);
            setHasAutoFiltering(false);
        }
        else if (val == 1) {
            setRegressionVisibilityValue("block");
            setstandardDeviationValue("none");
            setLowerPercentileValue("none");
            setUpperPercentileValue("none");
            setquatileVisibiltyValue("none");
            setHasRegressionValue(true);
            setHasPercentileValue(false);
            setHasQuartileValue(false);
            sethasStandardDeviation(false);
            setHasAutoFiltering(false);
        }
        else if (val == 2) {
            setRegressionVisibilityValue("none");
            setLowerPercentileValue("none");
            setUpperPercentileValue("none");
            setstandardDeviationValue("none");
            setquatileVisibiltyValue("block");
            setHasQuartileValue(true);

            setHasRegressionValue(false);
            setHasPercentileValue(false);
            sethasStandardDeviation(false);
            setHasAutoFiltering(false);

        }
        else if (val == 3) {
            setRegressionVisibilityValue("none");
            setLowerPercentileValue("none");
            setUpperPercentileValue("none");
            setquatileVisibiltyValue("none");
            setstandardDeviationValue("block");

            setHasQuartileValue(false);
            setHasRegressionValue(false);
            setHasPercentileValue(false);
            sethasStandardDeviation(true);
            setHasAutoFiltering(false);
        }
        else if (val == 4) {
            setHasAutoFiltering(true);

            setRegressionVisibilityValue("none");
            setLowerPercentileValue("none");
            setUpperPercentileValue("none");
            setquatileVisibiltyValue("none");
            setstandardDeviationValue("none");

            setHasQuartileValue(false);
            setHasRegressionValue(false);
            setHasPercentileValue(false);
            sethasStandardDeviation(false);
        } else {
            setHasAutoFiltering(false);

            setRegressionVisibilityValue("none");
            setLowerPercentileValue("none");
            setUpperPercentileValue("none");
            setquatileVisibiltyValue("none");
            setstandardDeviationValue("none");

            setHasQuartileValue(false);
            setHasRegressionValue(false);
            setHasPercentileValue(false);
            sethasStandardDeviation(false);
        }
    }

    function deselectedGridVisibility() {
        $(".deselected-grid").is(":visible") ? $(".deselected-grid").hide() : $(".deselected-grid").show();
        deselectedIndicator == true ? setDeselectedIndicator(false) : setDeselectedIndicator(true);
    }

    function inputNumberCheck(e) {
        if (e.which == 69 || e.which == 187 || e.which == 189 || e.which == 109) {
            e.preventDefault();
        }
    }

    function getLabels(pointInfo) {
        var item = awardsForChart.filter((item) => item.index == pointInfo.value);
        if (item.length >= 0) {
            return item[0].bandCountry;
        } else {
            return "";
        }
    }

    function customizeTooltip(pointInfo) {
        // console.log(pointInfo);
        var txt = pointInfo.point.data.bandCountry + "- " + pointInfo.point.data.price;
        return { text: txt };
    }

    function saveYScaleValues() {
        let newMinVal = parseFloat($("#yScaleMinVal").val());
        let newMaxVal = parseFloat($("#yScaleMaxVal").val());
        if (newMinVal < newMaxVal) {
            setPlotMinVal(newMinVal);
            setPlotMaxVal(newMaxVal);
            setPlotMinValErr(false);
            setPlotMaxValErr(false);
        } else {
            if (newMinVal == "" || isNaN(newMinVal)) {
                setPlotMinValErr(true);
            } else {
                if (newMinVal >= newMaxVal) {
                    setPlotMinValErr(true);
                } else {
                    setPlotMinValErr(false);
                }
            }
            if (newMaxVal == "" || isNaN(newMaxVal)) {
                setPlotMaxValErr(true);
            } else {
                setPlotMaxValErr(false);
            }
        }
    }


    // $(".dx-visibility-change-handler svg").removeAttr("width");
    // $(".dx-visibility-change-handler svg").css("width", "100%");


    return (
        <div id="Wrapper">
            <div id="filters-box">
                <div class="wrap" style={{ display: showDisplay == true ? "" : "none" }}>
                    {/* License Conditions */}
                    <div data-title={getValue("LicenseConditions", getLang())}>
                        {/* Term */}
                        <div className="form-group">
                            <label class="lbl-icon-left">
                                <span style={{ width: 100 }}><i class="spectre-filters-license-year"></i> {getValue("Term", getLang())}</span>
                                <input type="number"
                                    value={termValue}
                                    min="0"
                                    max="40"
                                    onChange={(e) => setTermValue(e.target.value)}
                                />
                            </label>
                        </div>

                        {/* Issue date */}
                        <div className="form-group">
                            <label class="lbl-icon-left">
                                <span style={{ width: 100 }}><i class="spectre-filters-license-year"></i> {getValue("IssueDate", getLang())}</span>

                                <select id="issueDate">
                                    {renderDate()}
                                </select>
                            </label>
                        </div>
                        {/* Discount rate */}
                        <div className="form-group">
                            <label class="lbl-icon-left">
                                <span style={{ width: 100 }}><i class="spectre-filters-discount-rate"></i> {getValue("DiscountRate", getLang())}</span>
                                <input type="number"
                                    min="0"
                                    max="100"
                                    value={discountRateValue}
                                    onChange={(e) => setDiscountRate(e.target.value)}
                                />
                            </label>
                        </div>
                    </div>
                    {/* Include Awards */}
                    <div data-title={getValue("IncludeAwards", getLang())}>
                        <div className="include-awards-grid">
                            <div className="pe-3">
                                <div className="form-group">
                                    <label className="chk-wrap">
                                        <input type="checkbox"
                                            value={singleBand}
                                            checked={singleBand}
                                            disabled
                                            onChange={(e) => setSingleBand(e.target.checked)} />
                                        {getValue("SingleBand", getLang())}
                                    </label>
                                </div>
                                <div className="form-group">
                                    <label className="chk-wrap">
                                        <input type="checkbox"
                                            value={multiBand}
                                            checked={multiBand}
                                            disabled
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
                    {/* Country Selection */}
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
                        <div id="countries" className="scrollable" style={{ height: 80 }}>
                            {renderCountries()}
                        </div>
                    </div>
                    {/* Band Selection */}
                    <div id="bandSelection" data-title={getValue("BandSelection", getLang())} style={{ cursor: "pointer" }} onClick={(e) => selectAllBands(e.target.id)}>
                        <div className="scrollable bs-scrollable" style={{ height: 125 }}>

                            {renderBands()}
                        </div>
                    </div>
                    {/* Adjustments */}
                    <div data-title={getValue("Adjustments", getLang())}>
                        <div className="form-group">
                            <label className="chk-wrap">
                                <input type="checkbox"
                                    value={adjustByInflation}
                                    checked={adjustByInflation}
                                    onChange={(e) => setAdjustByInflation(e.target.checked)}
                                />
                                {getValue("AdjustInflation", getLang())}
                            </label>
                        </div>
                        <div className="form-group">
                            <label className="chk-wrap">
                                <input type="checkbox"
                                    value={adjustByPPPFactor}
                                    checked={adjustByPPPFactor}
                                    onChange={(e) => setAdjustByPPPFactor(e.target.checked)}
                                />
                                {getValue("AdjustPPPFactor", getLang())}
                            </label>
                        </div>
                        <div className="form-group">
                            <label className="chk-wrap">
                                <input type="checkbox"
                                    value={addAnnualPayment}
                                    checked={addAnnualPayment}
                                    onChange={(e) => setAddAnnualPayment(e.target.checked)}
                                />
                                {getValue("AddAnualPmt", getLang())}
                            </label>
                        </div>
                        <div className="form-group">
                            <label className="chk-wrap">
                                <input type="checkbox"
                                    value={normalizeByGDPc}
                                    checked={normalizeByGDPc}
                                    onChange={(e) => setNormalizeByGDPc(e.target.checked)}
                                />
                                {getValue("NormalizeByGDPc", getLang())}
                            </label>
                        </div>
                        <div className="form-group">
                            <label className="chk-wrap">
                                <input type="checkbox"
                                    value={annualizePrices}
                                    checked={annualizePrices}
                                    onChange={(e) => setAnnualizePrices(e.target.checked)}
                                />
                                {getValue("AnnualizePrices", getLang())}
                            </label>
                        </div>
                    </div>
                    {/* Anaysis */}
                    <div data-title={getValue("Analysis", getLang())}>
                        <div className="scrollable" style={{ height: 125 }}>
                            <div className="form-group">
                                <label>
                                    {getValue("ShowResults", getLang())}
                                    <select id="showResults">
                                        <option value="1">{getValue("AvgAwards", getLang())}</option>
                                        <option value="0">{getValue("UniqueAwards", getLang())}</option>
                                        <option value="-1">{getValue("AvgBySum", getLang())}</option>
                                    </select>
                                </label>
                            </div>
                            <div className="form-group">
                                <label>
                                    {getValue("ShowMarkers", getLang())}
                                    <select
                                        id="showMarkers"
                                    >
                                        <option value="0">{getValue("No", getLang())}</option>
                                        <option value="1">{getValue("Yes", getLang())}</option>
                                    </select>
                                </label>
                            </div>
                            <div className="form-group">
                                <label>
                                    {getValue("SumBands", getLang())}
                                    <select id="sumBands">
                                        <option value="p">{getValue("Paired", getLang())}</option>
                                        <option value="u">{getValue("Unpaired", getLang())}</option>
                                        <option value="pu">{getValue("PairedUnpaired", getLang())}</option>
                                    </select>
                                </label>
                            </div>
                            <div className="form-group">
                                <label>
                                    {getValue("ExcludeOutliers", getLang())}
                                    <select id="ddlOutliers" onChange={() => excludeOutliers()}>
                                        <option value="-1">  {getValue("Select", getLang())}</option>
                                        <option value="0">{getValue("Percentile", getLang())}</option>
                                        <option value="1">{getValue("IterativeRegression", getLang())}</option>
                                        <option value="2">{getValue("Interquartile", getLang())}</option>
                                        <option value="3">{getValue("StandardDeviation", getLang())}</option>
                                        <option value="4">{getValue("AutoFiltering", getLang())}</option>
                                    </select>
                                </label>
                            </div>
                            <div className="form-group" style={{ display: upperPercentileValue }}>
                                <label>
                                    {getValue("Upper%", getLang())}
                                    <input type="number"
                                        value={upperPercentileValueSelected}
                                        min="0"
                                        max="100"
                                        onChange={(e) => setUpperPercentileValueSelected(e.target.value)}
                                    />
                                </label>
                            </div>
                            <div className="form-group" style={{ display: lowerPercentileValue }}>
                                <label>
                                    {getValue("Lower%", getLang())}
                                    <input type="number"
                                        value={lowerPercentileValueSelected}
                                        min="0"
                                        max="100"
                                        onChange={(e) => setLowerPercentileValueSelected(e.target.value)}
                                    />
                                </label>
                            </div>
                            <div className="form-group" style={{ display: regressionVisibilityValue }}>
                                <label>
                                    %

                                    <input type="number"
                                        value={regressionValue}
                                        onChange={(e) => setRegressionValue(e.target.value)}
                                    />
                                </label>
                            </div>
                            <div className="form-group" style={{ display: quartileVisibiltyValue }}>
                                <label>
                                    {getValue("kValue", getLang())}
                                    <input type="number"
                                        value={quartileValue}
                                        min="0"
                                        max="3"
                                        onChange={(e) => setQuartileValue(e.target.value)}
                                    />
                                </label>
                            </div>
                            <div className="form-group" style={{ display: standardDeviationValue }}>
                                <label>
                                    {getValue("StandardDeviation", getLang())}
                                    <input type="number"
                                        value={standardDeviationValueAdded}
                                        min="1"
                                        max="3"
                                        onChange={(e) => setstandardDeviationValueAdded(e.target.value)}
                                    />
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Filter Actions */}
                <div class="filter-actions" style={{ paddingTop: showDisplay == false ? "13px" : "" }}>
                    <a id="toggle-filters" onClick={() => setDisplay()}><i class={iconClass}></i> {showTxt}</a>
                    <button type="submit" className="btn btn-primary background-color-2 mr-2" onClick={() => checkIfCanView()}><i class="spectre-search"></i> {getValue("Show", getLang())}</button>
                </div>
            </div>
            <div id="Content" class="inner-content mt-3">

                <div className="content_wrapper clearfix" style={{ paddingTop: 15, paddingBottom: 60 }}>
                    <div className="sections_group">
                        <div className="section_wrapper mcb-section-inner">
                            <div className="wrap mcb-wrap one valign-top clearfix">
                                <div style={{ borderRadius: "10px" }} className="entry-content inner-entry-content px-4 py-3">
                                    <div className="row">
                                        <div className="col-12 text-left">
                                            <div className="row">
                                                <div className="col-12 text-left d-flex justify-content-between">
                                                    <h4 className="text-blue-d text-bold" style={{ margin: 0 }}>{getValue("PriceBenchmarks", getLang())}</h4>
                                                    <div className="tbl-actions">
                                                        <button disabled class="btn"><i class="fa fa-refresh fa-sm"></i></button>
                                                        <button disabled={!awards.length > 0} onClick={() => ShowPlot()} class={awards.length > 0 ? "btn chart-btn-color" : "btn"}><i class="fa fa-chart-line"></i></button>
                                                        <button disabled={!awards.length > 0} class={awards.length > 0 ? "btn chart-btn-color" : "btn"} onClick={(e) => setIsOpen3(true)}><i class="fa fa-download"></i></button>
                                                    </div>
                                                </div>
                                            </div>
                                            <hr style={{ margin: "5px 0" }} />
                                        </div>
                                    </div>
                                    <div
                                        id="table-content"
                                        className="col-md-12 list p-0 mb-3 custom-scrollbar"
                                        style={{ height: numberOfAwards == 0 ? '' : '470px' }}
                                    >
                                        <table className="table table-striped table-width-auto fs-12px" {...getFirstTableProps()}>
                                            <thead>
                                                {firstHeaderGroups.map((headerGroup) => (
                                                    <tr {...headerGroup.getHeaderGroupProps()}>
                                                        {headerGroup.headers.map((column) => (
                                                            <th
                                                                data-column={column.id}
                                                                className={getLang() === "ar" ? "rtl" : "ltr"}
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
                                                                {column.render("Header")}
                                                            </th>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </thead>
                                            <tbody {...getFirstTableBodyProps()}>
                                                {firstPage.map((row, i) => {
                                                    firstPrepareRow(row);
                                                    return (
                                                        <tr
                                                            className="socio-economic-tr"
                                                            {...row.getRowProps()}
                                                        >
                                                            {row.cells.map((cell) => {
                                                                return (
                                                                    <td
                                                                        data-column={cell.column.id}
                                                                        className={getLang() === "ar" ? "rtl" : "ltr"}
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
                                                    {getValue("Page", getLang())}{" "}
                                                    <strong>
                                                        {firstPageOptions.length !== 0 ? pageIndex + 1 : 0} {getValue("Of", getLang())} {firstPageOptions.length}
                                                    </strong>{" "}
                                                </span>
                                                <span className="text-black d-flex ml-1 mr-1 align-items-start">
                                                    | {getValue("GoToPage", getLang())}
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        max={firstPageOptions.length}
                                                        defaultValue={pageIndex + 1}
                                                        onChange={(e) => {
                                                            const pageNumber = e.target.value
                                                                ? Number(e.target.value) - 1
                                                                : 0;
                                                            firstGotoPage(pageNumber);
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
                                                    onClick={() => firstGotoPage(0)}
                                                    disabled={!firstCanPreviousPage}
                                                >
                                                    {"<<"}
                                                </button>
                                                <button
                                                    className="btn inner-btn-secondary px-5px py-0 me-1"
                                                    onClick={() => firstPreviousPage()}
                                                    disabled={!firstCanPreviousPage}
                                                >
                                                    {getValue("Previous", getLang())}
                                                </button>
                                                <button
                                                    className="btn inner-btn-secondary px-5px py-0 me-1"
                                                    onClick={() => firstNextPage()}
                                                    disabled={!firstCanNextPage}
                                                >
                                                    {getValue("Next", getLang())}
                                                </button>
                                                <button
                                                    className="btn inner-btn-secondary px-5px py-0 me-1"
                                                    onClick={() => firstGotoPage(firstPageCount - 1)}
                                                    disabled={!firstCanNextPage}
                                                >
                                                    {">>"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Deselected rows */}
                                <div style={{ borderRadius: "10px" }} className="entry-content inner-entry-content mt-4 px-4 py-3">
                                    <div className="row">
                                        <div className="col-12 text-left">
                                            <div className="row">
                                                <div className="col-12 text-left d-flex justify-content-between">
                                                    <h4 className="text-blue-d text-bold" style={{ margin: 0 }}><a onClick={() => deselectedGridVisibility()}><i class="spectre-minus-circle" style={{ color: "var(--color-2)", display: deselectedIndicator == true ? "" : "none" }}></i><img style={{ display: deselectedIndicator == true ? "none" : "" }} width="22px" height="22px" src={"./public_pages/images/plus-icon.png"} /></a> {getValue("DeSelectedAwards", getLang())}</h4>
                                                </div>
                                            </div>
                                            <hr style={{ margin: "5px 0" }} />
                                        </div>
                                    </div>

                                    <div
                                        id="table-content"
                                        className="col-md-12 list p-0 mb-3 custom-scrollbar deselected-grid"
                                        style={{ height: numberOfAwards == 0 ? '' : '470px' }}
                                    >
                                        <table className="table table-striped table-width-auto fs-12px" {...getSecondTableProps()}>
                                            <thead>
                                                {secondHeaderGroups.map((headerGroup) => (
                                                    <tr {...headerGroup.getHeaderGroupProps()}>
                                                        {headerGroup.headers.map((column) => (
                                                            <th
                                                                data-column={column.id}
                                                                className={getLang() === "ar" ? "rtl" : "ltr"}
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
                                                                {column.render("Header")}
                                                            </th>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </thead>
                                            <tbody {...getSecondTableBodyProps()}>
                                                {secondPage.map((row, i) => {
                                                    secondPrepareRow(row);
                                                    return (
                                                        <tr
                                                            className="socio-economic-tr"
                                                            {...row.getRowProps()}
                                                        >
                                                            {row.cells.map((cell) => {
                                                                return (
                                                                    <td
                                                                        data-column={cell.column.id}
                                                                        className={getLang() === "ar" ? "rtl" : "ltr"}
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
                                                    {getValue("Page", getLang())}{" "}
                                                    <strong>
                                                        {secondPageOptions.length !== 0 ? secondPageIndex + 1 : 0} {getValue("Of", getLang())} {secondPageOptions.length}
                                                    </strong>{" "}
                                                </span>
                                                <span className="text-black d-flex ml-1 mr-1 align-items-start">
                                                    | {getValue("GoToPage", getLang())}
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        max={secondPageOptions.length}
                                                        defaultValue={parseInt(secondPageIndex) + 1}
                                                        onChange={(e) => {
                                                            const pageNumber = e.target.value
                                                                ? Number(e.target.value) - 1
                                                                : 0;
                                                            secondGotoPage(pageNumber);
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
                                                    onClick={() => secondGotoPage(0)}
                                                    disabled={!secondCanPreviousPage}
                                                >
                                                    {"<<"}
                                                </button>
                                                <button
                                                    className="btn inner-btn-secondary px-5px py-0 me-1"
                                                    onClick={() => secondPreviousPage()}
                                                    disabled={!secondCanPreviousPage}
                                                >
                                                    {getValue("Previous", getLang())}
                                                </button>
                                                <button
                                                    className="btn inner-btn-secondary px-5px py-0 me-1"
                                                    onClick={() => secondNextPage()}
                                                    disabled={!secondCanNextPage}
                                                >
                                                    {getValue("Next", getLang())}
                                                </button>
                                                <button
                                                    className="btn inner-btn-secondary px-5px py-0 me-1"
                                                    onClick={() => secondGotoPage(secondPageCount - 1)}
                                                    disabled={!secondCanNextPage}
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
                {/* side menu */}
                {/* <div id="Side_slide" className="right dark" data-width={250}>
                    <div className="close-wrapper">
                        <a href="#" className="close">
                            <i className="icon-cancel-fine" />
                        </a>
                    </div>
                    <div className="menu_wrapper" />
                </div>
                <div id="body_overlay" /> */}
                <Modal
                    size="xl"
                    show={isOpen}
                    onHide={hideModal}
                    onEntered={modalLoaded}
                    style={{ direction: getLang() == "ar" ? "rtl" : "ltr" }}
                >
                    <Modal.Header closeButton>
                        <div className="d-flex flex-column align-items-start">
                            {/* <div className="mb-1">
                <p>{getValue("PricePlotTitle", getLang()) + " " + myHeader + " " + getValue("ForA", getLang()) + termValue + "" + getValue("PricePlotTitle2", getLang())}</p>
              </div> */}
                            <div className="d-flex flex-row mt-2">
                                <label className="me-2">{getValue("Minimum", getLang())}: </label>
                                <input id="yScaleMinVal" type="number" className={plotMinValErr ? "chart-input me-2 border-danger" : "chart-input me-2"} min={0} onKeyDown={(e) => inputNumberCheck(e)} />
                                <label className="me-2">{getValue("Maximum", getLang())}: </label>
                                <input id="yScaleMaxVal" type="number" className={plotMaxValErr ? "chart-input me-2 border-danger" : "chart-input me-2"} min={0} onKeyDown={(e) => inputNumberCheck(e)} />
                                <button onClick={() => saveYScaleValues()} className="btn btn-primary background-color-2 input-chart-btn me-2">{getValue("Refresh", getLang())}</button>
                            </div>
                        </div>
                    </Modal.Header>
                    <Modal.Body id="modBody" style={{ width: "100%" }}>
                        <Chart
                            ref={chartRef}
                            dataSource={awardsForChart}
                            palette="Harmony Light"
                            id="chart"
                        >
                            <Title
                                text={getLang() == 'ar' 
                                        ? getValue("PricePlotTitle3", getLang()) + " " + termValue + " " + getValue("PricePlotTitle2", getLang()) + " " + myHeader + " " + getValue("PricePlotTitle", getLang()) 
                                        : getLang() == 'en' 
                                        ? getValue("PricePlotTitle", getLang()) + " " + myHeader + " " + getValue("ForA", getLang()) + termValue + "" + getValue("PricePlotTitle2", getLang())
                                        : getValue("PricePlotTitle", getLang()) + " " + myHeader + " " + getValue("ForA", getLang()) + termValue + "" + getValue("PricePlotTitle2", getLang())}
                                horizontalAlignment={getLang() == "ar" ? "right" : "left"}>
                                <Font color="black" size="16px" weight="600" />
                            </Title>
                            <Size
                                width={1100}
                            />
                            <CommonSeriesSettings barPadding={0.6} >
                                <Point visible={false}></Point>
                            </CommonSeriesSettings>
                            <Series
                                name={myHeader}
                                valueField="price"
                                argumentField="index"
                                type="bar"
                                color="#0074D9"
                            />
                            <ValueAxis position={getLang() == "ar" ? "right" : "left"} maxValueMargin={0.01} title={myHeader}>
                                <VisualRange
                                    startValue={plotMinVal}
                                    endValue={plotMaxVal}
                                />
                                <ConstantLine
                                    width={2}
                                    value={$("#showMarkers").val() == 1 ? plotMean : null}
                                    color="#8c8cff"
                                    dashStyle="dash"
                                >
                                    <Label
                                        color="#000000"
                                        position="inside"
                                        horizontalAlignment={getLang() == "ar" ? "left" : "right"}
                                        verticalAlignment="top"
                                        text={getValue("Mean", getLang()) + ": " + (plotMean == null ? "" : plotMean.toString())}
                                    />
                                </ConstantLine>
                                <ConstantLine
                                    width={2}
                                    value={$("#showMarkers").val() == 1 ? plotMedian : null}
                                    color="#a56a8d"
                                    dashStyle="dash">
                                    <Label
                                        color="#000000"
                                        horizontalAlignment={getLang() == "ar" ? "left" : "right"}
                                        position="outside"
                                        text={getValue("Median", getLang()) + ": " + (plotMedian == null ? "" : plotMedian.toString())}
                                    />
                                </ConstantLine>
                                <ConstantLine
                                    width={2}
                                    // value={$("#showMarkers").val() == 1 ? lowerPlot : null}
                                    value={null}
                                    color="#44af6b"
                                    dashStyle="dash"
                                >
                                    <Label
                                        color="#000000"
                                        horizontalAlignment={getLang() == "ar" ? "left" : "right"}
                                        position="outside" text={getValue("Lower%", getLang()) + ": " + (lowerPlot == null ? "" : lowerPlot.toString())}
                                    />
                                </ConstantLine>
                                <ConstantLine
                                    width={2}
                                    // value={$("#showMarkers").val() == 1 ? upperPlot : null}
                                    value={null}
                                    color="#f00"
                                    dashStyle="dash">
                                    <Label
                                        color="#000000"
                                        horizontalAlignment={getLang() == "ar" ? "left" : "right"}
                                        position="outside"
                                        text={getValue("Upper%", getLang()) + ": " + (upperPlot == null ? "" : upperPlot.toString())}
                                    />
                                </ConstantLine>
                            </ValueAxis>
                            <ZoomAndPan
                                argumentAxis="both"
                                valueAxis="both"
                            />
                            <Export enabled={true} />

                            <ArgumentAxis
                                inverted={getLang() == "ar" ? true : false}
                                discreteAxisDivisionMode="crossLabels"
                            >
                                <Tick visible={false} />
                                <Label overlappingBehavior="rotate" rotationAngle="-90" customizeText={getLabels} />
                            </ArgumentAxis>
                            <Legend visible={false} />
                            <Tooltip
                                enabled={true}
                                zIndex="10000"
                                customizeTooltip={customizeTooltip}
                            />

                        </Chart>
                    </Modal.Body>
                </Modal>

                <Modal
                    show={isOpen3}
                    size="sm"
                    onHide={hideModal3}
                    onEntered={modalLoaded3}>
                    <Modal.Header closeButton>
                        <Modal.Title>{title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <ul class="list-group">
                            <li onClick={(e) => { exportToCSV(awards, "Pricing") }} className="list-group-item" style={{ cursor: "pointer" }}> <span style={{ width: 110 }}><i
                                className="fas fa-file-excel"
                                style={{ paddingLeft: "10px", paddingRight: "10px", color: "#56ade0" }}></i>{getValue("ExportToExcel", getLang())}</span></li>
                            <li onClick={(e) => { exportToPDF() }} className="list-group-item" style={{ cursor: "pointer" }}> <span style={{ width: 110 }}><i className="fas fa-file-pdf"
                                style={{ paddingLeft: "10px", paddingRight: "10px", color: "#56ade0" }}></i>{getValue("ExportToPDF", getLang())}</span></li>
                            {isExportPDF && <Pricing2 awards={awards} filters={filters} svg={svg} />}
                        </ul>
                    </Modal.Body>
                </Modal>

                <Modal
                    show={isOpen5}
                    size="sm"
                    onHide={hideModal5}>
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
        </div>
    );
};

export default PricingTest;