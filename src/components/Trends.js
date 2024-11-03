import React, { useState, useEffect, useRef } from "react";
import APIFunctions from "../utils/APIFunctions";
import { useTable, useSortBy, usePagination } from "react-table";
import "react-datepicker/dist/react-datepicker.css";
import "../css/CustomStyle.css";
import { Alert, LoadingAlert, AlertError } from "../components/f_Alerts";
import Modal from "react-bootstrap/Modal";
import { getValue } from "../Assets/Language/Entries";
import { getLang, getIMF, getPPP, displayPop } from "../utils/common";
import $ from "jquery";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import Trends2 from "./Trends2";
import {
  Chart,
  Legend,
  ValueAxis,
  SeriesTemplate,
  Point,
  ZoomAndPan,
  Size,
  CommonSeriesSettings,
  Border,
  CommonPaneSettings,
  Tooltip,
  ArgumentAxis,
  Label,
  Export,
  VisualRange,
  Title,
  Font,
} from "devextreme-react/chart";

const Trends = (props) => {
  const [svg, setSVG] = useState("");
  const [isExportPDF, setisExportPDF] = useState(false);
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
  const [adjustByInflation, setAdjustByInflation] = useState(false);
  const [adjustByPPPFactor, setAdjustByPPPFactor] = useState(false);
  const [addAnnualPayment, setAddAnnualPayment] = useState(false);
  const [normalizeByGDPc, setNormalizeByGDPc] = useState(false);
  const [annualizePrices, setAnnualizePrices] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenLin, setIsOpenLin] = useState(false);
  const [isOpenLog, setIsOpenLog] = useState(false);
  const [isOpenLinear, setIsOpenLinear] = useState(false);
  const [isOpenChartType, setIsOpenChartType] = useState(false);
  const [title, setTitle] = React.useState("Transitioning...");
  const [trendTypeValue, setTrendTypeValue] = useState(0);
  const [showDisplay, setShowDisplay2] = useState(true);
  const [regressionVisibilityValue, setRegressionVisibilityValue] =
    useState("none");
  const [quartileVisibiltyValue, setquatileVisibiltyValue] = useState("none");
  const [standardDeviationValue, setstandardDeviationValue] = useState("none");
  const [upperPercentileValue, setUpperPercentileValue] = useState("none");
  const [lowerPercentileValue, setLowerPercentileValue] = useState("none");
  const [hasPercentileValue, setHasPercentileValue] = useState(false);
  const [awards, setAwards] = useState([]);
  const awardsRef = useRef();
  const optionsRef = useRef();
  const bandOptionsListRef = useRef();
  const [iconClass, setIconClass] = useState(
    "spectre-angle-up btn btn-primary background-color-2 color-white mr-2"
  );
  const [showTxt, setShowTxt] = useState(getValue("ShowLess", getLang()));
  const [discountRateValue, setDiscountRate] = useState();
  const [termValue, setTermValue] = useState();
  const [hasRegressionValue, setHasRegressionValue] = useState(false);
  const [regressionValue, setRegressionValue] = useState();
  const [upperPercentileValueSelected, setUpperPercentileValueSelected] =
    useState();
  const [lowerPercentileValueSelected, setLowerPercentileValueSelected] =
    useState();
  const [hasQuartileValue, setHasQuartileValue] = useState(false);
  const [quartileValue, setQuartileValue] = useState();
  const [hasStandardDeviation, sethasStandardDeviation] = useState(false);
  const [hasAutoFiltering, setHasAutoFiltering] = useState(false);
  const [standardDeviationValueAdded, setstandardDeviationValueAdded] =
    useState();
  const [bandOptionsList, setSelectedBandsOptions] = useState([]);
  const [allBands, setAllBands] = useState([]);
  const [linearScaleBands, setLinearScaleBands] = useState([]);
  const [options, setoptions] = useState([]);
  const [columns, setColumns] = useState([]);
  const [myHeader, setMyHeader] = useState("");
  const [linSeries, setLinSeries] = useState([]);
  const [linearScaleSeries, setLinearScaleSeries] = useState([]);
  const [arrYears, setArrYears] = useState([]);
  const [arrYearsSeries, setArrYearsSeries] = useState([]);
  const [numberOfAwards, setNumberOfAwards] = useState(0);
  const [isOpen3, setIsOpen3] = useState(false);
  const [checkAllBands, setCheckAllBands] = useState(false);
  const [isOpen5, setIsOpen5] = useState(false);
  const [yearPriceArr, setYearPriceArr] = useState([]);
  var _exportedFilters;
  const chartRef = useRef(null);
  const linChartRef = useRef(null);
  const logChartRef = useRef(null);
  const [plotMinValLin, setPlotMinValLin] = useState(null);
  const [plotMaxValLin, setPlotMaxValLin] = useState(null);
  const [plotMinValLog, setPlotMinValLog] = useState(null);
  const [plotMaxValLog, setPlotMaxValLog] = useState(null);
  const [plotMinValYear, setPlotMinValYear] = useState(null);
  const [plotMaxValYear, setPlotMaxValYear] = useState(null);

  const [plotMinValLinErr, setPlotMinValLinErr] = useState(null);
  const [plotMaxValLinErr, setPlotMaxValLinErr] = useState(null);
  const [plotMinValLogErr, setPlotMinValLogErr] = useState(null);
  const [plotMaxValLogErr, setPlotMaxValLogErr] = useState(null);
  const [plotMinValYearErr, setPlotMinValYearErr] = useState(null);
  const [plotMaxValYearErr, setPlotMaxValYearErr] = useState(null);

  const [lastOpenedChart, setLastOpenedChart] = useState(0)

  const [width, setWidth] = useState(window.innerWidth*0.7);

  const modalLoaded3 = () => {
    setTitle("Export");
  };

  const hideModal3 = () => {
    setIsOpen3(false);
    setTitle("Export");
  };

  const styles = {
    chartlegend: {
      display: "none",
    },
  };

  function renderDate() {
    var now = new Date().getFullYear();
    var arr_years = [];
    for (var i = now + 3; i >= 1985; i--) {
      arr_years.push(i);
    }
    return arr_years.map((val, idx) => <option value={val}>{val}</option>);
  }

  useEffect(() => {
    $(".menuItems").removeClass("active");
    $("#Trends_page").addClass("active");
  });

  useEffect(() => {
    APIFunctions.getUserCountries("Trends")
      .then((resp) => resp)
      .then((resp) => bindOptions(resp.data))
      .then((resp) => getUserFilters());
  }, []);

  useEffect(() => {
    APIFunctions.getAllBands()
      .then((resp) => resp)
      .then((resp) => bindOptionsBand(resp.data));
  }, []);

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
      data[i].value == 700 ? (ob.isChecked = true) : (ob.isChecked = false);
      arr.push(ob);
    }
    setSelectedBandsOptions(arr);
  };

  const selectAllBands = (evt) => {
    if (evt == "bandSelection") {
      var updatedSelectedCountries = bandOptionsList;
      updatedSelectedCountries.map((row, i) => {
        row.isChecked = !checkAllBands;
      });

      setCheckAllBands(!checkAllBands);
      setSelectedBandsOptions(bandOptionsList);
    }
  };

  const hideModal5 = () => {
    setIsOpen5(false);
  };

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

  const getUserFilters = () => {
    // LoadingAlert("Show");
    APIFunctions.getUserFilters("Trends")
      .then((resp) => resp)
      .then((resp) => {
        var data = resp.data;
        if (data.length > 0) {
          var fromYear = data.filter((item) => item.field == "FromYear");
          var toYear = data.filter((item) => item.field == "ToYear");
          var issueDate = data.filter((item) => item.field == "IssueDate");
          var awardTypeSelectedValue = data.filter(
            (item) => item.field == "awardTypeSelectedValue"
          );
          var discountRate = data.filter(
            (item) => item.field == "discountRate"
          );
          var term = data.filter((item) => item.field == "term");
          var adjustByInflationFactor = data.filter(
            (item) => item.field == "AdjustByInflationFactor"
          );
          var adjustByGDPFactor = data.filter(
            (item) => item.field == "AdjustByGDPFactor"
          );
          var adjustByPPPFactor = data.filter(
            (item) => item.field == "AdjustByPPPFactor"
          );
          var annualizePrice = data.filter(
            (item) => item.field == "AnnualizePrice"
          );
          var isIncludeAnnual = data.filter(
            (item) => item.field == "IsIncludeAnnual"
          );
          var regression = data.filter((item) => item.field == "regression");
          var upperPercentile = data.filter(
            (item) => item.field == "UpperPercentile"
          );
          var lowerPercentile = data.filter(
            (item) => item.field == "LowerPercentile"
          );
          var kValue = data.filter((item) => item.field == "KValue");
          var standardDeviationValue = data.filter(
            (item) => item.field == "StandardDeviationValue"
          );
          var ddlOutliers = data.filter((item) => item.field == "ddlOutliers");
          var sumBand = data.filter((item) => item.field == "sumBand");
          var maxValue = data.filter((item) => item.field == "MaxGDP");
          var minGDP = data.filter((item) => item.field == "MinGDP");
          var regionalLicense = data.filter(
            (item) => item.field == "RegionalLicense"
          );
          var unPaired = data.filter((item) => item.field == "IsUnPaired");
          var pairedUnpaired = data.filter(
            (item) => item.field == "IsPairedAndUnPaired"
          );
          var paired = data.filter((item) => item.field == "Paired");
          var multiple = data.filter((item) => item.field == "IsMultiple");
          var single = data.filter((item) => item.field == "IsSingle");
          var bands = data.filter((item) => item.field == "Bands");
          var countries = data.filter((item) => item.field == "Country");
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
          $("#issueDate").val(issueDate[0].value);
          $("#showResults").val(awardTypeSelectedValue[0].value);
          setDiscountRate(discountRate[0].value);
          setTermValue(term[0].value);
          setAdjustByInflation(
            adjustByInflationFactor[0].value == "true" ? true : false
          );
          setNormalizeByGDPc(
            adjustByGDPFactor[0].value == "true" ? true : false
          );
          setAdjustByPPPFactor(
            adjustByPPPFactor[0].value == "true" ? true : false
          );
          setAnnualizePrices(annualizePrice[0].value == "true" ? true : false);
          setAddAnnualPayment(
            isIncludeAnnual[0].value == "true" ? true : false
          );
          setRegressionValue(regression[0].value);
          setUpperPercentileValueSelected(upperPercentile[0].value);
          setLowerPercentileValueSelected(lowerPercentile[0].value);
          setQuartileValue(kValue[0].value);
          setstandardDeviationValueAdded(standardDeviationValue[0].value);
          $("#ddlOutliers").val(ddlOutliers[0].value);
          excludeOutliers();
          $("#sumBands").val(sumBand[0].value);

          var _data = JSON.parse(countries[0].value);
          var lstChecked = _data.filter((x) => x.isChecked == true).length;
          var lst = _data.length;
          var value = lstChecked == lst ? true : false;
          if (lstChecked == 0) setCheckAll(false);
          else {
            var value = lstChecked == lst ? true : false;
            setCheckAll(value);
          }

          var _data2 = JSON.parse(bands[0].value);
          var lstChecked2 = _data2.filter((x) => x.isChecked == true).length;
          var lst2 = _data2.length;
          var value2 = lstChecked2 == lst2 ? true : false;

          if (lstChecked2.length == 0) setCheckAllBands(false);
          else setCheckAllBands(value2);
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

        //  LoadingAlert("Hide");
      });
  };

  optionsRef.current = options;
  bandOptionsListRef.current = bandOptionsList;

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
    AwardFilter.ShowMarkers = $("#showMarkers").val() == "1" ? true : false;
    AwardFilter.outliers = $("#ddlOutliers").val();

    AwardFilter.Header = myHeader;
    setFilters(AwardFilter);
    _exportedFilters = AwardFilter;

    ShowPlot();

    if(lastOpenedChart == "2") {
      setTimeout(() => {
        var _svg = chartRef.current.instance.svg();
        setSVG(_svg);
        setisExportPDF(true);
        setTimeout(() => {
          setIsOpen(false);
          setisExportPDF(false);
        }, 300)
      }, 3000);
    } else {
      if(lastOpenedChart == "1") {
        setTimeout(() => {
          var _svg = logChartRef.current.instance.svg();
          setSVG(_svg);
          setisExportPDF(true);
          setTimeout(() => {
            setIsOpenLog(false);
            setisExportPDF(false);
          }, 300)
        }, 3000);
      } else {
      setTimeout(() => {
        var _svg = linChartRef.current.instance.svg();
        setSVG(_svg);
        setisExportPDF(true);
        setTimeout(() => {
          setIsOpenLin(false);
          setisExportPDF(false);
        }, 300)
      }, 3000);
      }
    }
  };

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
    } else if (val == 1) {
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
    } else if (val == 2) {
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
    } else if (val == 3) {
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
    } else if (val == 4) {
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

  const handleCheckAll = (isChecked) => {
    setCheckAll(isChecked);
    var updatedSelectedCountries = options;
    updatedSelectedCountries.map((row, i) => {
      row.isChecked = isChecked;
    });
    setoptions(updatedSelectedCountries);
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

  const renderBands = () => {
    var bands = bandOptionsList;
    if (bands != null && bands.length > 0) {
      {
        return bands.map((val, idx) => (
          <div className="form-group">
            <label>
              {" "}
              <input
                type="checkbox"
                checked={getCheckedBand(val.value)}
                value={getCheckedBand(val.value)}
                onChange={(e) => setCheckBand(val.value, e.target.checked)}
              />
              {val.value}
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
  };

  const setCheckBand = (id, isChecked) => {
    var data = bandOptionsListRef.current;
    var item = data.filter((item) => item.value == id);
    if (item.length > 0) {
      var itemIndex = data.indexOf(item[0]);
      data = data.filter((item) => item.value != id);
      data.splice(itemIndex, 0, {
        value: id,
        isChecked: isChecked,
        label: item[0].label,
      });
    }
    setSelectedBandsOptions(data);
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

  const hideModal = () => {
    setIsOpen(false);
    setIsOpenLin(false);
    setIsOpenLog(false);
    setIsOpenLinear(false);
    setIsOpenChartType(false);
    setTitle("Transitioning...");
  };

  const modalLoaded = () => {
    if (trendTypeValue == 0) setTitle("Price / Band (lin x-scale)");
    else if (trendTypeValue == 1) setTitle("Price / Band (log y-scale)");
    else if (trendTypeValue == 2) setTitle("Prices against year");
    else setTitle("Price / Linear freq scale");
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
  };

  const checkIfCanView = () => {
    APIFunctions.checkIfCanView("Trends")
      .then((response) => {
        if (response.data) {
          filterAwards();
        } else {
          Alert(getValue("FeatureNotAvailable", getLang()));
          return;
        }
      })
      .catch((e) => {
        LoadingAlert("Hide");
        console.log(e);
      });
  };

  const filterAwards = () => {
    var selectedCountries = [];
    var selectedBands = [];

    // Validations Begin
    var valid = true;

    if ((minGDP == "" || minGDP == null) && minGDP != "0") {
      valid = false;
    }
    if (
      maxGDP == null ||
      maxGDP == "" ||
      fromDate == null ||
      fromDate == "" ||
      toDate == null ||
      toDate == ""
    ) {
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
      AlertError(getValue("ValidToDate", getLang()));
      return;
    }
    if (toDate.length > 4 || toDate.length < 4) {
      AlertError(getValue("ValidToDate", getLang()));
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
    if (
      discountRateValue == "" ||
      discountRateValue == null ||
      discountRateValue < 0
    ) {
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
      AlertError(
        getValue("MaximumFromDate", getLang()) + new Date().getFullYear()
      );
      return;
    }
    if (parseInt(toDate) < 1985) {
      AlertError(getValue("MinimumToDate", getLang()));
      return;
    }
    if (parseInt(toDate) > new Date().getFullYear()) {
      AlertError(
        getValue("MaximumToDate", getLang()) + new Date().getFullYear()
      );
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
      }
      if (+lowerPercentileValueSelected < 0) {
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
    AwardFilter.UpperPercentile = upperPercentileValueSelected;
    AwardFilter.LowerPercentile = lowerPercentileValueSelected;
    AwardFilter.HasQuartile = hasQuartileValue;
    AwardFilter.KValue = quartileValue;
    AwardFilter.HasStandardDeviation = hasStandardDeviation;
    AwardFilter.StandardDeviationValue = standardDeviationValueAdded;
    AwardFilter.AutoFiltering = hasAutoFiltering;
    AwardFilter.sumBand = $("#sumBands").val();

    console.log(AwardFilter);

    var list = [];
    list.push(
      {
        id: 0,
        pageUrl: "Trends",
        field: "FromYear",
        value: fromDate.toString(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Trends",
        field: "ToYear",
        value: toDate.toString(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Trends",
        field: "IssueDate",
        value: $("#issueDate").val(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Trends",
        field: "awardTypeSelectedValue",
        value: $("#showResults").val(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Trends",
        field: "discountRate",
        value: discountRateValue.toString(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Trends",
        field: "term",
        value: termValue.toString(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Trends",
        field: "AdjustByInflationFactor",
        value: adjustByInflation.toString(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Trends",
        field: "AdjustByGDPFactor",
        value: normalizeByGDPc.toString(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Trends",
        field: "AdjustByPPPFactor",
        value: adjustByPPPFactor.toString(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Trends",
        field: "AnnualizePrice",
        value: annualizePrices.toString(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Trends",
        field: "IsIncludeAnnual",
        value: addAnnualPayment.toString(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Trends",
        field: "regression",
        value: regressionValue.toString(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Trends",
        field: "UpperPercentile",
        value: upperPercentileValueSelected.toString(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Trends",
        field: "LowerPercentile",
        value: lowerPercentileValueSelected.toString(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Trends",
        field: "KValue",
        value: quartileValue.toString(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Trends",
        field: "StandardDeviationValue",
        value: standardDeviationValueAdded.toString(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Trends",
        field: "ddlOutliers",
        value: $("#ddlOutliers").val(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Trends",
        field: "sumBand",
        value: $("#sumBands").val(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Trends",
        field: "MinGDP",
        value: minGDP.toString(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Trends",
        field: "MaxGDP",
        value: maxGDP.toString(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Trends",
        field: "RegionalLicense",
        value: includeRegional.toString(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Trends",
        field: "Paired",
        value: AwardFilter.IsPaired.toString(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Trends",
        field: "IsUnPaired",
        value: AwardFilter.IsUnPaired.toString(),
        UserId: 0,
      },
      {
        id: 0,
        pageUrl: "Trends",
        field: "IsPairedAndUnPaired",
        value: AwardFilter.IsPairedAndUnPaired.toString(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Trends",
        field: "IsMultiple",
        value: AwardFilter.IsMultiple.toString(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Trends",
        field: "IsSingle",
        value: AwardFilter.IsSingle.toString(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Trends",
        field: "Bands",
        value: JSON.stringify(bandOptionsList),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Trends",
        field: "Country",
        value: JSON.stringify(options),
        userId: 0,
      }
    );

    console.log(list);

    saveUserFilters(list);

    LoadingAlert("Show");
    APIFunctions.FilterTrends(AwardFilter)
      .then((response) => {
        console.log(response.data);
        LoadingAlert("Hide");
        if (response.data == 0) {
          Alert(getValue("NoDataToDisplay", getLang()));
          setAwards([]);
          setNumberOfAwards(0);
          document.getElementById("numberOfAwards").innerHTML = 0;
          var meanContainer = document.getElementById("meanValueContainer");
          if (typeof meanContainer != "undefined" && meanContainer != null)
            meanContainer.innerHTML = "Mean: 0";
          return;
        } else {
          setAwards(response.data);
          var nbr_of_awards = response.data.length;
          setNumberOfAwards(response.data.length);

          var data = response.data;
          var CustomPriceHeader = "$/M/P x1";
          var count = 0;
          var min = Number.MAX_VALUE;

          for (var i = 0, l = data.length; i < l; i++) {
            min = Math.min(min, data[i].price);
          }

          if (min != 0) {
            while (min < 0.001) {
              min *= 10;
              count++;
              console.log(min);
            }
          }

          var CustomPriceHeader = "$/M/P";
          if (annualizePrices) {
            CustomPriceHeader += "/Y";
          }

          if (normalizeByGDPc) {
            CustomPriceHeader += "/GDPc x " + Math.pow(10, count);
            for (var i = 0, l = response.data.length; i < l; i++) {
              response.data[i].price *= Math.pow(10, count);
            }
          } else {
            CustomPriceHeader += " x 1";
          }

          setMyHeader(CustomPriceHeader);

          var all_bands = [];
          for (var i = 0; i < bandOptionsList.length; i++) {
            all_bands.push(bandOptionsList[i].value);
          }

          setAllBands(all_bands);

          //lin series
          var series = [];
          for (var i = 0; i < response.data.length; i++) {
            var data_arr = [];
            for (var j = 0; j < all_bands.length; j++) {
              if (all_bands[j] == response.data[i].band)
                data_arr.push(response.data[i].price.toFixed(3));
              else data_arr.push(null);
            }
            series.push({
              name: response.data[i].countryName,
              data: data_arr,
            });
          }
          setLinSeries(series);

          // Linear freq scale
          var bands_linear = [];
          for (var i = 400; i < 30000; ) {
            bands_linear.push(i);
            i < 900
              ? (i += 50)
              : i == 900
              ? (i = 1000)
              : i < 4000
              ? (i += 1000)
              : i == 4000
              ? (i = 23000)
              : (i += 1000);
          }
          console.log(bands_linear);
          setLinearScaleBands(bands_linear);
          var linear_scale_series = [];
          for (var i = 0; i < response.data.length; i++) {
            var data_arr = [];
            for (var j = 0; j < bands_linear.length; j++) {
              if (bands_linear[j] == response.data[i].band)
                data_arr.push(response.data[i].price.toFixed(3));
              else data_arr.push(null);
            }
            linear_scale_series.push({
              data: data_arr,
            });
          }
          setLinearScaleSeries(linear_scale_series);

          console.log(awards);
          var arr_band_countries = [];
          for (var k = 0; k < response.data.length; k++) {
            arr_band_countries.push(response.data[k].bandCountry);
          }
          console.log(arr_band_countries);
          var arr = response.data.map(function (val) {
            return val.price == null ? 0 : val.price.toFixed(3);
          });

          var arr2 = response.data.map(function (val) {
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

          var arr3 = response.data.map(function (val) {
            return val.price;
          });

          console.log(min);

          var mean = 0;
          var sum = 0;
          var count = response.data.length;
          for (var i = 0; i < data.length; i++) {
            sum += data[i].price;
          }

          mean = calculateMean(sum, count);

          var min = 0;
          if (awardTypeSelectedValue == 0) {
            const columnsAdded = [
              {
                Header: () => (
                  <div
                    id="numberOfAwardsContainer"
                    className="text-black fw-600"
                    style={{ justifyContent: "start", display: "flex" }}
                  >
                    {getValue("NumberOfAwards", getLang())}:&nbsp;{" "}
                    <span id="numberOfAwards">{nbr_of_awards}</span>
                  </div>
                ),
                accessor: "numberOfAwards",
                disableSortBy: true,
                columns: [
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
                ],
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
                Header: "Price $M",
                accessor: "upFrontFees",
                Cell: (props) => {
                  if (props.value != null)
                    return parseFloat(props.value).toFixed(2);
                  else return "";
                },
              },
              {
                Header: getValue("Term", getLang()),
                accessor: "terms",
                Cell: (props) => {
                  if (props.value != null || props.value != "")
                    return parseFloat(props.value).toFixed(1);
                  else return "";
                },
              },
              {
                Header: getValue("Bands", getLang()),
                accessor: "band",
              },
              {
                Header: () => (
                  <div
                    id="meanValueContainer"
                    style={{ justifyContent: "end", display: "flex" }}
                  >
                    {getValue("Mean", getLang())}: {mean}
                  </div>
                ),
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
            setColumns(columnsAdded);
          } else {
            const columnsAdded = [
              {
                Header: () => (
                  <div
                    id="numberOfAwardsContainer"
                    className="text-black fw-600"
                    style={{ justifyContent: "start", display: "flex" }}
                  >
                    {getValue("NumberOfAwards", getLang())}:&nbsp;{" "}
                    <span id="numberOfAwards">{nbr_of_awards}</span>
                  </div>
                ),
                accessor: "numberOfAwards",
                disableSortBy: true,
                columns: [
                  {
                    Header: getValue("Country", getLang()),
                    accessor: "countryName",
                  },
                  {
                    Header: "POP .M",
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
                ],
              },
              {
                Header: getValue("AwardDate", getLang()),
                accessor: "year",
              },
              {
                Header: getValue("Term", getLang()),
                accessor: "terms",
                Cell: (props) => {
                  if (props.value != null || props.value != "")
                    return parseFloat(props.value).toFixed(1);
                  else return "";
                },
              },
              {
                Header: getValue("Bands", getLang()),
                accessor: "band",
              },
              {
                Header: () => (
                  <div
                    id="meanValueContainer"
                    style={{ justifyContent: "end", display: "flex" }}
                  >
                    {getValue("Mean", getLang())}: {mean}
                  </div>
                ),
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
            setColumns(columnsAdded);
          }

          // Plots start

          // console.log(tst)
          var arr = response.data.map(function (val) {
            return { x: val.year, y: parseInt(val.mhz) };
          });
          var arr_years = [];
          // for (var i = fromDate; i < toDate; i++) {
          //   arr_years.push(i.toString());
          // }
          var min_year = response.data[0].year;
          for (var i = 0; i < response.data.length; i++) {
            if (parseInt(response.data[i].year) < min_year) {
              min_year = parseInt(response.data[i].year);
            }
          }
          for (var i = min_year; i < toDate; i++) {
            arr_years.push(i.toString());
          }
          console.log("array of years: ", arr_years);
          setArrYears(arr_years);
          console.log(arr);

          var year_series = [];
          for (var i = 0; i < response.data.length; i++) {
            var data_arr = [];
            for (var j = 0; j < arr_years.length; j++) {
              if (parseInt(arr_years[j]) == response.data[i].year)
                data_arr.push(response.data[i].price.toFixed(3));
              else data_arr.push(null);
            }
            year_series.push({
              name: response.data[i].countryName,
              data: data_arr,
            });
          }
          setArrYearsSeries(year_series);

          var arrOfLin = response.data.map(function (val) {
            return {
              x: val.band.toString(),
              y: parseInt(val.price.toFixed(3)),
            };
          });

          var arrOfYears = [];
          var arrOfYearValues = [];
          var yearsData = [];
          var i = 0;
          var flag = 0;
          response.data.map(function (val) {
            for (i = 0; i < arrOfYears.length; i++) {
              if (arrOfYears[i] == val.year) {
                flag = 1;
                break;
              } else {
                flag = 0;
              }
            }
            if (flag == 1) {
              arrOfYearValues[i] += 1;
            } else {
              arrOfYears[i] = val.year;
              arrOfYearValues[i] = 1;
            }
          });

          for (i = 0; i < arr.length; i++) {
            yearsData.push({ year: arrOfYears[i], value: arrOfYearValues[i] });
            // yearsData.push({"x": arr[i][0], "y" : arr[i][1]});
            // yearsData.push({[arrOfYears[i]]: arrOfYearValues[i]});
          }
          // console.log(yearsData);

          var arr_bands = response.data.map(function (val) {
            var v = parseInt(val.band);
            return v;
          });

          // Plots end
        }
      })
      .catch((e) => {
        console.log(e);
        LoadingAlert("hide");
      });
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
              {getLang() == "ar" ? val.labelAr : val.label}
            </label>
          </div>
        ));
      }
    }
  };

  const ShowPlotQuestion = () => {
    setIsOpenChartType(true);
  };

  function calculateMean(sum, count) {
    return (sum / count).toFixed(3);
  }

  const ShowPlot = () => {
    setPlotMinValLin(null);
    setPlotMaxValLin(null);
    setPlotMinValLog(null);
    setPlotMaxValLog(null);
    setPlotMinValYear(null);
    setPlotMaxValYear(null);
    var t = $("#chartType").val() == '-1' || !$("#chartType").val() ? lastOpenedChart : $("#chartType").val();
    setLastOpenedChart(t);

    var arr = [];
    var data = awards;
    if (t == 2) {
      var _minYear = data.reduce(function (prev, curr) {
        return prev.year < curr.year ? prev : curr;
      });

      var _minY = _minYear.year;
      for (var i = _minY; i < toDate; i++) {
        var item = new Object();
        item.year = i;
        item.price = null;
        item.countryName = "";
        item.band = "";
        arr.push(item);
      }
      data = data.sort((a, b) =>
        parseFloat(a.year) > parseFloat(b.year) ? 1 : -1
      );
    } else if (t == 0 || t == 1) {
      data = data.sort((a, b) =>
        parseInt(a.band) > parseInt(b.band) ? 1 : -1
      );
    } else if (t == 2) {
      for (var i = 0; i < bandOptionsList.length; i++) {
        var item = new Object();
        item.year = null;
        item.price = null;
        item.countryName = "";
        item.band = bandOptionsList[i].value;
        arr.push(item);
      }
    }

    data.map((val, i) => {
      var count = getBandsCount(val.band);
      var countByYear = getBandsCountByYear(val.year);
      var item = new Object();
      item.year = val.year.toString();
      item.yearWithCount = val.year.toString() + " (" + countByYear + ")";
      item.price = parseFloat(val.price.toFixed(3));
      item.countryName = val.countryName;
      item.band = val.band;
      item.bandCount = val.band + " (" + count + ")";
      arr.push(item);
    });
    setYearPriceArr(arr);

    hideModal();
    setTrendTypeValue(t);

    if(t == "2") {
      setTimeout(() => {
        if (chartRef.current !== null) {
          var _svg = chartRef.current.instance.svg();
        }
        if (_svg !== null) setSVG(_svg);
      }, 3000);
    } else {
      if(t == "1") {
        setTimeout(() => {
          if (logChartRef.current !== null){
            var _svg = logChartRef.current.instance.svg();
          }
          if (_svg !== null) setSVG(_svg);
        }, 3000);
      } else {
        setTimeout(() => {
          if (linChartRef.current !== null){
            var _svg = linChartRef.current.instance.svg();
          }
          if (_svg !== null) setSVG(_svg);
        }, 3000);
      }
    }
    

    if (t == 0) setIsOpenLin(true);
    else if (t == 1) setIsOpenLog(true);
    else if (t == 2) setIsOpen(true);
  };

  function getBandsCount(band) {
    var count = 0;
    awards.map(function (val) {
      if (val.band == band) {
        count++;
      }
    });

    return count;
  }

  function getBandsCountByYear(year) {
    let count = 0;
    awards.map(function (val) {
      if (val.year == year) {
        count++;
      }
    });

    return count;
  }

  function customizeTooltip(pointInfo) {
    var txt =
      pointInfo.point.data.countryName +
      "-" +
      pointInfo.point.data.band +
      "-" +
      "(" +
      pointInfo.point.data.year +
      ")" +
      " " +
      pointInfo.point.data.price.toString();
    return { text: txt };
  }

  const firstTable = useTable(
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

  const { pageIndex, pageSize } = firstState;

  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const exportToCSV = (csvData, fileName) => {
    var result = [];
    if ($("#showResults").val() == "0") {
      csvData.map((val, i) => {
        var item = new Object();
        item.Country = val.countryName;
        item["Pop,M"] = displayPop(val.pop, getIMF());
        item["GDPc, $"] =
          val.gdp == 0 || val.gdp == null ? "" : val.gdp.toFixed(0);
        item.Operator = val.operatorName;
        item.Date = val.year;
        item["Price, $M	"] = val.upFrontFees;
        item["Term (Y)"] = val.terms;
        item.Band = val.band;
        item[myHeader] = val.price.toFixed(3);

        result.push(item);
      });
    } else {
      csvData.map((val, i) => {
        var item = new Object();
        item.Country = val.countryName;
        item["Pop,M"] = displayPop(val.pop, getIMF());
        item["GDPc, $"] =
          val.gdp == 0 || val.gdp == null ? "" : val.gdp.toFixed(0);
        item.Date = val.year;
        item["Term (Y)"] = val.terms;
        item.Band = val.band;
        item[myHeader] = val.price;
        result.push(item);
      });
    }

    const ws = XLSX.utils.json_to_sheet(result);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  function inputNumberCheck(e) {
    if (e.which == 69 || e.which == 187 || e.which == 189 || e.which == 109) {
      e.preventDefault();
    }
  }

  function saveYScaleValuesLin() {
    let newMinVal = parseFloat($("#yScaleMinValLin").val());
    let newMaxVal = parseFloat($("#yScaleMaxValLin").val());
    if (newMinVal < newMaxVal) {
      setPlotMinValLin(newMinVal);
      setPlotMaxValLin(newMaxVal);
      setPlotMinValLinErr(false);
      setPlotMaxValLinErr(false);
    } else {
      if (newMinVal == "" || isNaN(newMinVal)) {
        setPlotMinValLinErr(true);
      } else {
        if (newMinVal >= newMaxVal) {
          setPlotMinValLinErr(true);
        } else {
          setPlotMinValLinErr(false);
        }
      }
      if (newMaxVal == "" || isNaN(newMaxVal)) {
        setPlotMaxValLinErr(true);
      } else {
        setPlotMaxValLinErr(false);
      }
    }
  }

  function saveYScaleValuesLog() {
    let newMinVal = parseFloat($("#yScaleMinValLog").val());
    let newMaxVal = parseFloat($("#yScaleMaxValLog").val());
    if (newMinVal < newMaxVal) {
      setPlotMinValLog(newMinVal);
      setPlotMaxValLog(newMaxVal);
      setPlotMinValLogErr(false);
      setPlotMaxValLogErr(false);
    } else {
      if (newMinVal == "" || isNaN(newMinVal)) {
        setPlotMinValLogErr(true);
      } else {
        if (newMinVal >= newMaxVal) {
          setPlotMinValLogErr(true);
        } else {
          setPlotMinValLogErr(false);
        }
      }
      if (newMaxVal == "" || isNaN(newMaxVal)) {
        setPlotMaxValLogErr(true);
      } else {
        setPlotMaxValLogErr(false);
      }
    }
  }

  function saveYScaleValuesYear() {
    let newMinVal = parseFloat($("#yScaleMinValYear").val());
    let newMaxVal = parseFloat($("#yScaleMaxValYear").val());
    if (newMinVal < newMaxVal) {
      setPlotMinValYear(parseFloat(newMinVal));
      setPlotMaxValYear(parseFloat(newMaxVal));
      setPlotMinValYearErr(false);
      setPlotMaxValYearErr(false);
    } else {
      if (newMinVal == "" || isNaN(newMinVal)) {
        setPlotMinValYearErr(true);
      } else {
        if (newMinVal >= newMaxVal) {
          setPlotMinValYearErr(true);
        } else {
          setPlotMinValYearErr(false);
        }
      }
      if (newMaxVal == "" || isNaN(newMaxVal)) {
        setPlotMaxValYearErr(true);
      } else {
        setPlotMaxValYearErr(false);
      }
    }
  }

  return (
    <div id="Wrapper">
      <div id="filters-box">
        <div
          class="wrap"
          style={{ display: showDisplay == true ? "" : "none" }}
        >
          {/* License Certifications */}
          <div data-title={getValue("LicenseCertifications", getLang())}>
            {/* Term */}
            <div className="form-group">
              <label class="lbl-icon-left">
                <span style={{ width: 100 }}>
                  <i class="spectre-filters-license-year"></i>
                  {getValue("Term", getLang())}
                </span>
                <input
                  type="number"
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
                <span style={{ width: 100 }}>
                  <i class="spectre-filters-license-year"></i>{" "}
                  {getValue("IssueDate", getLang())}
                </span>

                <select id="issueDate">{renderDate()}</select>
              </label>
            </div>

            {/* Discount rate */}
            <div className="form-group">
              <label class="lbl-icon-left">
                <span style={{ width: 100 }}>
                  <i class="spectre-filters-discount-rate"></i>{" "}
                  {getValue("DiscountRate", getLang())}
                </span>
                <input
                  type="number"
                  value={discountRateValue}
                  min="0"
                  max="100"
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
                    <input
                      type="checkbox"
                      value={singleBand}
                      checked={singleBand}
                      disabled
                      onChange={(e) => setSingleBand(e.target.checked)}
                    />
                    {getValue("SingleBand", getLang())}
                  </label>
                </div>
                <div className="form-group">
                  <label className="chk-wrap">
                    <input
                      type="checkbox"
                      value={multiBand}
                      checked={multiBand}
                      disabled
                      onChange={(e) => setMultiBand(e.target.checked)}
                    />
                    {getValue("MultiBand", getLang())}
                  </label>
                </div>
                <div className="form-group">
                  <label style={{ alignItems: 'flex-start' }} className="chk-wrap">
                    <input
                      type="checkbox"
                      value={includeRegional}
                      checked={includeRegional}
                      onChange={(e) => setIncludeRegional(e.target.checked)}
                    />
                    {getValue("RegionalLicenses", getLang())}
                  </label>
                </div>
              </div>
              <div className="has-border-left ps-2 pe-2">
                <div className="form-group">
                  <label className="chk-wrap">
                    <input
                      type="checkbox"
                      value={paired}
                      checked={paired}
                      onChange={(e) => setPaired(e.target.checked)}
                    />
                    {getValue("Paired", getLang())}
                  </label>
                </div>
                <div className="form-group">
                  <label className="chk-wrap">
                    <input
                      type="checkbox"
                      value={unPaired}
                      checked={unPaired}
                      onChange={(e) => setUnPaired(e.target.checked)}
                    />
                    {getValue("Unpaired", getLang())}
                  </label>
                </div>
                <div className="form-group">
                  <label style={{ alignItems: 'flex-start' }} className="chk-wrap">
                    <input
                      type="checkbox"
                      value={pairedUnpaired}
                      checked={pairedUnpaired}
                      onChange={(e) => setPairedUnPaired(e.target.checked)}
                    />
                    {getValue("PairedUnpaired", getLang())}
                  </label>
                </div>
              </div>
              <div className="has-border-left ps-1">
                <div className="form-group">
                  <label class="lbl-icon-left">
                    <span style={{ width: 110 }}>
                      <i class="spectre-filters-min-gdpc"></i>
                      {getValue("MinGDPc", getLang())}
                    </span>
                    <input
                      type="number"
                      placeholder=""
                      min="0"
                      step="100"
                      value={minGDP}
                      onChange={(e) => setMinGDP(e.target.value)}
                      onKeyDown={(e) => inputNumberCheck(e)}
                    />
                  </label>
                </div>
                <div className="form-group">
                  <label class="lbl-icon-left">
                    <span style={{ width: 110 }}>
                      <i class="spectre-filters-max-gdpc"></i>
                      {getValue("MaxGDPc", getLang())}
                    </span>
                    <input
                      type="number"
                      placeholder=""
                      value={maxGDP}
                      step="100"
                      onChange={(e) => setMaxGDP(e.target.value)}
                      onKeyDown={(e) => inputNumberCheck(e)}
                    />
                  </label>
                </div>
                <div className="form-group">
                  <label class="lbl-icon-left">
                    <span style={{ width: 110 }}>
                      <i class="spectre-filters-awards-from"></i>
                      {getValue("AwardsFrom", getLang())}
                    </span>
                    <input
                      type="number"
                      placeholder=""
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                    />
                  </label>
                </div>
                <div className="form-group">
                  <label class="lbl-icon-left">
                    <span style={{ width: 110 }}>
                      <i class="spectre-filters-awards-to"></i>
                      {getValue("AwardsTo", getLang())}
                    </span>
                    <input
                      type="number"
                      placeholder=""
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
          {/* Country Selection */}
          <div
            id="countrySelection"
            data-title={getValue("CountrySelection", getLang())}
            style={{ cursor: "pointer" }}
            onClick={(e) => {
              checkIfCanOpen(e.target.id);
            }}
          >
            <div className="form-group">
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
            <div className="form-group">
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
            <div id="countries" className="scrollable" style={{ height: 80 }}>
              {renderCountries()}
            </div>
          </div>
          {/* Band Selection */}
          <div
            id="bandSelection"
            data-title={getValue("BandSelection", getLang())}
            style={{ cursor: "pointer" }}
            onClick={(e) => selectAllBands(e.target.id)}
          >
            <div className="scrollable" style={{ height: 125 }}>
              {renderBands()}
            </div>
          </div>
          {/* Adjustments */}
          <div data-title="Adjustments">
            <div className="form-group">
              <label className="chk-wrap">
                <input
                  type="checkbox"
                  value={adjustByInflation}
                  checked={adjustByInflation}
                  onChange={(e) => setAdjustByInflation(e.target.checked)}
                />
                {getValue("AdjustInflation", getLang())}
              </label>
            </div>
            <div className="form-group">
              <label className="chk-wrap">
                <input
                  type="checkbox"
                  value={adjustByPPPFactor}
                  checked={adjustByPPPFactor}
                  onChange={(e) => setAdjustByPPPFactor(e.target.checked)}
                />
                {getValue("AdjustPPPFactor", getLang())}
              </label>
            </div>
            <div className="form-group">
              <label className="chk-wrap">
                <input
                  type="checkbox"
                  value={addAnnualPayment}
                  checked={addAnnualPayment}
                  onChange={(e) => setAddAnnualPayment(e.target.checked)}
                />
                {getValue("AddAnualPmt", getLang())}
              </label>
            </div>
            <div className="form-group">
              <label className="chk-wrap">
                <input
                  type="checkbox"
                  value={normalizeByGDPc}
                  checked={normalizeByGDPc}
                  onChange={(e) => setNormalizeByGDPc(e.target.checked)}
                />
                {getValue("NormalizeByGDPc", getLang())}
              </label>
            </div>
            <div className="form-group">
              <label className="chk-wrap">
                <input
                  type="checkbox"
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
                    <option value="1">
                      {getValue("AvgAwards", getLang())}
                    </option>
                    <option value="0">
                      {getValue("UniqueAwards", getLang())}
                    </option>
                    <option value="-1">
                      {getValue("AvgBySum", getLang())}
                    </option>
                  </select>
                </label>
              </div>
              <div className="form-group">
                <label>
                  {getValue("SumBands", getLang())}
                  <select id="sumBands">
                    <option value="p">{getValue("Paired", getLang())}</option>
                    <option value="u">{getValue("Unpaired", getLang())}</option>
                    <option value="pu">
                      {getValue("PairedUnpaired", getLang())}
                    </option>
                  </select>
                </label>
              </div>
              <div className="form-group">
                <label>
                  {getValue("ExcludeOutliers", getLang())}
                  <select id="ddlOutliers" onChange={() => excludeOutliers()}>
                    <option value="-1">{getValue("Select", getLang())}</option>
                    <option value="0">
                      {getValue("Percentile", getLang())}
                    </option>
                    <option value="1">
                      {getValue("IterativeRegression", getLang())}
                    </option>
                    <option value="2">
                      {getValue("Interquartile", getLang())}
                    </option>
                    <option value="3">
                      {getValue("StandardDeviation", getLang())}
                    </option>
                    <option value="4">
                      {getValue("AutoFiltering", getLang())}
                    </option>
                  </select>
                </label>
              </div>
              <div
                className="form-group"
                style={{ display: upperPercentileValue }}
              >
                <label>
                  Upper %
                  <input
                    type="number"
                    value={upperPercentileValueSelected}
                    min="0"
                    max="100"
                    onChange={(e) =>
                      setUpperPercentileValueSelected(e.target.value)
                    }
                  />
                </label>
              </div>
              <div
                className="form-group"
                style={{ display: lowerPercentileValue }}
              >
                <label>
                  Lower %
                  <input
                    type="number"
                    value={lowerPercentileValueSelected}
                    min="0"
                    max="100"
                    onChange={(e) =>
                      setLowerPercentileValueSelected(e.target.value)
                    }
                  />
                </label>
              </div>
              <div
                className="form-group"
                style={{ display: regressionVisibilityValue }}
              >
                <label>
                  Percentage
                  <input
                    type="number"
                    value={regressionValue}
                    min="0"
                    max="100"
                    onChange={(e) => setRegressionValue(e.target.value)}
                  />
                </label>
              </div>
              <div
                className="form-group"
                style={{ display: quartileVisibiltyValue }}
              >
                <label>
                  k value
                  <input
                    type="number"
                    value={quartileValue}
                    min="0"
                    max="3"
                    onChange={(e) => setQuartileValue(e.target.value)}
                  />
                </label>
              </div>
              <div
                className="form-group"
                style={{ display: standardDeviationValue }}
              >
                <label>
                  {getValue("StandardDeviation", getLang())}
                  <input
                    type="number"
                    value={standardDeviationValueAdded}
                    min="1"
                    max="3"
                    onChange={(e) =>
                      setstandardDeviationValueAdded(e.target.value)
                    }
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
        {/* Filter Actions */}
        <div
          class="filter-actions"
          style={{ paddingTop: showDisplay == false ? "13px" : ""}}
        >
          <a id="toggle-filters" onClick={() => setDisplay()}>
            <i class={iconClass}></i> {showTxt}
          </a>
          <button
            type="submit"
            className="btn btn-primary background-color-2 mr-2"
            onClick={() => checkIfCanView()}
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
                            {" "}
                            {getValue("Trends", getLang())}
                          </h4>
                          <div className="tbl-actions">
                            <button disabled class="btn">
                              <i class="fa fa-refresh"></i>
                            </button>
                            <button
                              disabled={!awards.length > 0}
                              onClick={() => ShowPlotQuestion()}
                              class={
                                awards.length > 0
                                  ? "btn chart-btn-color"
                                  : "btn"
                              }
                            >
                              <i class="fa fa-chart-line"></i>
                            </button>
                            <button
                              disabled={!awards.length > 0}
                              class={
                                awards.length > 0
                                  ? "btn chart-btn-color"
                                  : "btn"
                              }
                              onClick={(e) => setIsOpen3(true)}
                            >
                              <i class="fa fa-download"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                      <hr style={{ margin: "5px 0" }} />
                    </div>
                  </div>
                  <div
                    id="table-content"
                    className="col-md-12 list p-0 mb-3 custom-scrollbar"
                    style={{ height: numberOfAwards == 0 ? "" : "470px" }}
                  >
                    <table
                      className="table table-striped table-width-auto fs-12px"
                      {...getFirstTableProps()}
                    >
                      <thead>
                        {firstHeaderGroups.map((headerGroup) => (
                          <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                              <th
                                {...column.getHeaderProps(
                                  column.getSortByToggleProps()
                                )}
                                data-column={column.id}
                                className={getLang() === "ar" ? "rtl" : "ltr"}
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
                                    className={
                                      getLang() === "ar" ? "rtl" : "ltr"
                                    }
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
                            {firstPageOptions.length !== 0 ? pageIndex + 1 : 0}{" "}
                            {getValue("Of", getLang())}{" "}
                            {firstPageOptions.length}
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
              </div>
            </div>
          </div>
        </div>
        {/* side menu */}

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
                <p>{getValue("YearPlotTitle", getLang())}</p>
              </div> */}
              <div className="d-flex flex-row mt-2">
                <label className="me-2">
                  {getValue("Minimum", getLang())}:{" "}
                </label>
                <input
                  id="yScaleMinValYear"
                  type="number"
                  className={
                    plotMinValYearErr
                      ? "chart-input me-2 border-danger"
                      : "chart-input me-2"
                  }
                  min={0}
                  onKeyDown={(e) => inputNumberCheck(e)}
                />
                <label className="me-2">
                  {getValue("Maximum", getLang())}:{" "}
                </label>
                <input
                  id="yScaleMaxValYear"
                  type="number"
                  className={
                    plotMaxValYearErr
                      ? "chart-input me-2 border-danger"
                      : "chart-input me-2"
                  }
                  min={0}
                  onKeyDown={(e) => inputNumberCheck(e)}
                />
                <button
                  onClick={() => saveYScaleValuesYear()}
                  className="btn btn-primary background-color-2 input-chart-btn me-2"
                >
                  {getValue("Refresh", getLang())}
                </button>
              </div>
            </div>
          </Modal.Header>
          <Modal.Body>
            <Chart
              ref={chartRef}
              id="chart"
              dataSource={yearPriceArr}
              palette="Soft"
              paletteExtensionMode="alternate"
            >
              <Title
                text={getValue("YearPlotTitle", getLang())}
                horizontalAlignment={getLang() == "ar" ? "right" : "left"}
              >
                <Font color="black" size="16px" weight="600" />
              </Title>
              <Size width={1100} />
              <ArgumentAxis
                inverted={getLang() == "ar" ? true : false}
                discreteAxisDivisionMode="crossLabels"
              >
                <Label
                  overlappingBehavior="rotate"
                  title={getValue("Year", getLang())}
                />
              </ArgumentAxis>
              <CommonPaneSettings>
                <Border visible={true} />
              </CommonPaneSettings>
              <CommonSeriesSettings
                argumentField="yearWithCount"
                valueField="price"
                type="scatter"
                argumentScaleType="Qualitative"
              >
                <Point size={8} />
              </CommonSeriesSettings>
              <SeriesTemplate nameField="price" />
              <Tooltip
                enabled={true}
                zIndex="10000"
                customizeTooltip={customizeTooltip}
              />
              <ValueAxis
                position={getLang() == "ar" ? "right" : "left"}
                title={myHeader}
              >
                <VisualRange
                  startValue={plotMinValYear}
                  endValue={plotMaxValYear}
                />
              </ValueAxis>
              <Legend visible={false} />
              <Export enabled={true} />
              <ZoomAndPan argumentAxis="both" valueAxis="both" />
            </Chart>
          </Modal.Body>
        </Modal>
        <Modal
          size="xl"
          show={isOpenLin}
          onHide={hideModal}
          onEntered={modalLoaded}
          style={{ direction: getLang() == "ar" ? "rtl" : "ltr" }}
        >
          <Modal.Header closeButton>
            <div className="d-flex flex-column align-items-start">
              {/* <div className="mb-1">
                <p>{getValue("BandPlotTitle", getLang())}</p>
              </div> */}
              <div className="d-flex flex-row mt-2">
                <label className="me-2">
                  {getValue("Minimum", getLang())}:{" "}
                </label>
                <input
                  id="yScaleMinValLin"
                  type="number"
                  className={
                    plotMinValLinErr
                      ? "chart-input me-2 border-danger"
                      : "chart-input me-2"
                  }
                  min={0}
                  onKeyDown={(e) => inputNumberCheck(e)}
                />
                <label className="me-2">
                  {getValue("Maximum", getLang())}:{" "}
                </label>
                <input
                  id="yScaleMaxValLin"
                  type="number"
                  className={
                    plotMaxValLinErr
                      ? "chart-input me-2 border-danger"
                      : "chart-input me-2"
                  }
                  min={0}
                  onKeyDown={(e) => inputNumberCheck(e)}
                />
                <button
                  onClick={() => saveYScaleValuesLin()}
                  className="btn btn-primary background-color-2 input-chart-btn me-2"
                >
                  {getValue("Refresh", getLang())}
                </button>
              </div>
            </div>
          </Modal.Header>
          <Modal.Body>
            <Chart
              ref={linChartRef}
              id="chart"
              dataSource={yearPriceArr}
              palette="Soft"
              paletteExtensionMode="alternate"
            >
              <Title
                text={getValue("BandPlotTitle", getLang())}
                horizontalAlignment={getLang() == "ar" ? "right" : "left"}
              >
                <Font color="black" size="16px" weight="600" />
              </Title>
              <Size width={1100} />
              <ArgumentAxis
                inverted={getLang() == "ar" ? true : false}
                title={getValue("Bands", getLang())}
                discreteAxisDivisionMode="crossLabels"
              >
                <Label overlappingBehavior="rotate" />
              </ArgumentAxis>
              <CommonPaneSettings>
                <Border visible={true} />
              </CommonPaneSettings>
              <CommonSeriesSettings
                argumentField="bandCount"
                valueField="price"
                type="scatter"
                argumentScaleType="Qualitative"
              >
                <Point size={8} />
              </CommonSeriesSettings>
              <SeriesTemplate nameField="price" />
              <Tooltip
                enabled={true}
                zIndex="10000"
                customizeTooltip={customizeTooltip}
              />
              <ValueAxis
                position={getLang() == "ar" ? "right" : "left"}
                title={myHeader}
              >
                <VisualRange
                  startValue={plotMinValLin}
                  endValue={plotMaxValLin}
                />
              </ValueAxis>
              <Legend visible={false} />
              <Export enabled={true} />
              <ZoomAndPan argumentAxis="both" valueAxis="both" />
            </Chart>
          </Modal.Body>
        </Modal>
        <Modal
          size="xl"
          show={isOpenLog}
          onHide={hideModal}
          onEntered={modalLoaded}
          style={{ direction: getLang() == "ar" ? "rtl" : "ltr" }}
        >
          <Modal.Header closeButton>
            <div className="d-flex flex-column align-items-start">
              {/* <div className="mb-1">
                <p>{getValue("LogPlotTitle", getLang())}</p>
              </div> */}
              <div className="d-flex flex-row mt-2">
                <label className="me-2">
                  {getValue("Minimum", getLang())}:{" "}
                </label>
                <input
                  id="yScaleMinValLog"
                  type="number"
                  className={
                    plotMinValLogErr
                      ? "chart-input me-2 border-danger"
                      : "chart-input me-2"
                  }
                  min={0}
                  onKeyDown={(e) => inputNumberCheck(e)}
                />
                <label className="me-2">
                  {getValue("Maximum", getLang())}:{" "}
                </label>
                <input
                  id="yScaleMaxValLog"
                  type="number"
                  className={
                    plotMaxValLogErr
                      ? "chart-input me-2 border-danger"
                      : "chart-input me-2"
                  }
                  min={0}
                  onKeyDown={(e) => inputNumberCheck(e)}
                />
                <button
                  onClick={() => saveYScaleValuesLog()}
                  className="btn btn-primary background-color-2 input-chart-btn me-2"
                >
                  {getValue("Refresh", getLang())}
                </button>
              </div>
            </div>
          </Modal.Header>
          <Modal.Body>
            <Chart
              ref={logChartRef}
              id="chart"
              dataSource={yearPriceArr}
              palette="Soft"
              paletteExtensionMode="alternate"
            >
              <Title
                text={getValue("LogPlotTitle", getLang())}
                horizontalAlignment={getLang() == "ar" ? "right" : "left"}
              >
                <Font color="black" size="16px" weight="600" />
              </Title>
              <Size width={1100} />
              <ArgumentAxis
                nverted={getLang() == "ar" ? true : false}
                title={getValue("Bands", getLang())}
                discreteAxisDivisionMode="crossLabels"
              >
                <Label rotationAngle={90} overlappingBehavior="rotate" />
              </ArgumentAxis>
              <CommonPaneSettings>
                <Border visible={true} />
              </CommonPaneSettings>
              <CommonSeriesSettings
                argumentField="bandCount"
                valueField="price"
                type="scatter"
              >
                <Point size={8} />
              </CommonSeriesSettings>
              {/* <Series argumentField="band" valueField="price" type="scatter" >
                    <Point size={10} />
                  </Series> */}
              <SeriesTemplate nameField="price" />
              <Tooltip
                enabled={true}
                zIndex="10000"
                customizeTooltip={customizeTooltip}
              />
              <ValueAxis
                position={getLang() == "ar" ? "right" : "left"}
                type="logarithmic"
                title={myHeader}
              >
                <VisualRange
                  startValue={plotMinValLog}
                  endValue={plotMaxValLog}
                />
              </ValueAxis>
              <Legend visible={false} />
              <Export enabled={true} />
              <ZoomAndPan argumentAxis="both" valueAxis="both" />
            </Chart>
          </Modal.Body>
        </Modal>
        <Modal
          size="xl"
          show={isOpenLinear}
          onHide={hideModal}
          onEntered={modalLoaded}
        >
          <Modal.Header closeButton>
            <Modal.Title>{title}</Modal.Title>
            {/* <button type="button" className="btn-close" aria-label="Close"></button> */}
          </Modal.Header>
          <Modal.Body style={{ height: "550px" }}></Modal.Body>
        </Modal>

        <Modal
          size="sm"
          show={isOpenChartType}
          onHide={hideModal}
          onEntered={modalLoaded}
        >
          <Modal.Header closeButton>
            <Modal.Title>{getValue("ChartType", getLang())}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="form-group">
              <label>
                <select
                  style={{ color: "#000" }}
                  id="chartType"
                  onChange={() => ShowPlot()}
                >
                  <option value="-1">{getValue("Select", getLang())}</option>
                  <option value="0">Price / Band (lin x-scale)</option>
                  <option value="1">Price / Band (log y-scale)</option>
                  <option value="2">Price against year</option>
                  {/* <option value="3">Price / Linear freq scale</option> */}
                </select>
              </label>
            </div>
          </Modal.Body>
        </Modal>
      </div>

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
                exportToCSV(awards, "Trends");
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
            <li
              onClick={(e) => {
                exportToPDF();
              }}
              className="list-group-item"
              style={{ cursor: "pointer" }}
            >
              {" "}
              <span style={{ width: 110 }}>
                <i
                  className="fas fa-file-pdf"
                  style={{
                    paddingLeft: "10px",
                    paddingRight: "10px",
                    color: "#56ade0",
                  }}
                ></i>
                {getValue("ExportToPDF", getLang())}
              </span>
            </li>
            {isExportPDF && <Trends2 awards={awards} filters={filters} svg={svg} />}
          </ul>
        </Modal.Body>
      </Modal>

      <Modal show={isOpen5} size="sm" onHide={hideModal5}>
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

export default Trends;
