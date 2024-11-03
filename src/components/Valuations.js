import React, {
  useState,
  useEffect,
  useRef,
} from "react";
import APIFunctions from "../utils/APIFunctions";
import { useTable, useSortBy, usePagination } from "react-table";
import "react-datepicker/dist/react-datepicker.css";
import "../css/CustomStyle.css";
import {
  Alert,
  LoadingAlert,
  AlertError,
} from "../components/f_Alerts";
import Modal from "react-bootstrap/Modal";
import { getValue } from "../Assets/Language/Entries";
import {
  getLang,
  getIMF,
  getPPP,
  displayPop,
} from "../utils/common";
import $ from "jquery";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import Benchmark2 from "./Benchmark2";
import AwardsMenu from "./AwardsMenu";
import ValuationsEcharts from "./ValuationsEcharts";

import Chart, {
  ArgumentAxis,
  CommonSeriesSettings,
  ZoomAndPan,
  Legend,
  Series,
  Export,
  Tooltip,
  ValueAxis,
  ConstantLine,
  Label,
  Point,
  CommonPaneSettings,
  Border,
  SeriesTemplate,
  Size,
  Title,
  Tick,
  VisualRange,
  Font,
} from "devextreme-react/chart";
import { exportFromMarkup } from "devextreme/viz/export";
import toCanvas from "canvg";

const Valuations = (props) => {
  const [svg, setSVG] = useState("");
  const [isValuationExport, setIsValuationExport] = useState(false);
  const [columns, setColumns] = useState([]);
  const [columnsValuation, setColumnsValuation] = useState([]);
  const [columnsRegression, setColumnsRegression] = useState([]);
  const [columnsNew, setColumnsNew] = useState([]);
  const [selected, setSelected] = useState([]);
  const [SelectedBands, setSelectedBands] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen6, setIsOpen6] = useState(false);
  const [isOpenNumeric, setIsOpenNumeric] = useState(false);
  const [isOpenDistancing, setIsOpenDistancing] = useState(false);
  const [title, setTitle] = React.useState("Transitioning...");
  const [regressionVisibilityValue, setRegressionVisibilityValue] =
    useState("none");
  const [quartileVisibiltyValue, setquatileVisibiltyValue] = useState("none");
  const [standardDeviationValue, setstandardDeviationValue] = useState("none");
  const [upperPercentileValue, setUpperPercentileValue] = useState("none");
  const [lowerPercentileValue, setLowerPercentileValue] = useState("none");
  const [hasPercentileValue, setHasPercentileValue] = useState(false);
  const [hasAutoFiltering, setHasAutoFiltering] = useState(false);
  const [awards, setAwards] = useState([]);
  const [awardsNew, setAwardsNew] = useState([]);
  const [valuationValues, setValuationValues] = useState([]);
  const [regressionValues, setRegressionValues] = useState([]);
  const awardsRef = useRef();
  const awardsNewRef = useRef();
  const optionsRef = useRef();
  const bandOptionsListRef = useRef();
  const distancingRef = useRef();
  const multiplierRef = useRef();
  const [showDisplay, setShowDisplay2] = useState(true);
  const [showValuationCase, setShowValuationCase] = useState(false);
  const [showRegressionFirstRow, setShowRegressionFirstRow] = useState(false);
  const [showBenchmarks, setShowBenchmarks] = useState(false);
  const [showRegressions, setShowRegressions] = useState(false);
  const [showDistances, setShowDistances] = useState(false);
  const [showDoDistancing, setShowDoDistancing] = useState(false);
  const [showTxt, setShowTxt] = useState(getValue("ShowLess", getLang()));
  const [discountRateValue, setDiscountRate] = useState("");
  const [termValue, setTermValue] = useState("");
  const [hasRegressionValue, setHasRegressionValue] = useState(false);
  const [regressionValue, setRegressionValue] = useState(0);
  const [hasQuartileValue, setHasQuartileValue] = useState(false);
  const [quartileValue, setQuartileValue] = useState(0);
  const [hasStandardDeviation, sethasStandardDeviation] = useState(false);
  const [standardDeviationValueAdded, setstandardDeviationValueAdded] =
    useState(0);
  const [options, setoptions] = useState([]);
  const [iconClass, setIconClass] = useState(
    "spectre-angle-up btn btn-primary background-color-2 color-white mr-2"
  );
  const [bandOptionsList, setSelectedBandsOptions] = useState([]);
  const [checkAll, setCheckAll] = React.useState(false);
  const [singleBand, setSingleBand] = useState(true);
  const [multiBand, setMultiBand] = useState(false);
  const [includeRegional, setIncludeRegional] = useState(false);
  const [paired, setPaired] = useState(true);
  const [unPaired, setUnPaired] = useState(false);
  const [pairedUnpaired, setPairedUnPaired] = useState(false);
  const [minGDP, setMinGDP] = useState(0);
  const [maxGDP, setMaxGDP] = useState(200000);
  const [fromDate, setFromDate] = useState(1985);
  const [toDate, setToDate] = useState(new Date().getFullYear());
  const [adjustByInflation, setAdjustByInflation] = useState(false);
  const [adjustByPPPFactor, setAdjustByPPPFactor] = useState(false);
  const [addAnnualPayment, setAddAnnualPayment] = useState(false);
  const [normalizeByGDPc, setNormalizeByGDPc] = useState(false);
  const [annualizePrices, setAnnualizePrices] = useState(false);
  const [upperPercentileValueSelected, setUpperPercentileValueSelected] =
    useState(75);
  const [lowerPercentileValueSelected, setLowerPercentileValueSelected] =
    useState(25);
  const [populationValue, setPopulationValue] = useState("");
  const [distancingData, setDistancingData] = useState([]);
  const [deSelectChecked, setDeseltectChecked] = useState(false);
  const [enforeBPositive, setEnforeBPositive] = useState("0");
  const [numberOfAwards, setNumberOfAwards] = useState(0);
  const [awardsWithMarkers, setAwardsWithMar] = useState(false);
  const [arrayOfBandCountries, setArrayOfBandCountries] = useState([]);
  const [chartSeries, setChartSeries] = useState([]);
  const [chartSeriesNumeric, setChartSeriesNumeric] = useState([]);
  const [allBandsMean, setAllBandsMean] = useState([]);
  const [deselectedIndicator, setDeselectedIndicator] = useState(true);
  const [distancingSeries, setDistancingSeries] = useState([]);
  const [distancingCategories, setDistancingCategories] = useState([]);
  const distancingCategoriesRef = useRef();
  const [valuatedCountryMeanValue, setValuatedCountryMeanValue] = useState([]);
  const [distancingSeriesSize, setDistancingSeriesSize] = useState([]);
  const [methodTitle, setMethodTitle] = useState(
    getValue("AwardsByValuation", getLang())
  );
  const [checkAllBands, setCheckAllBands] = useState(false);
  const [filters, setFilters] = useState();
  const [userEnforceB, setUserEnforceB] = useState("0");
  const [lstCountries, setLstCountries] = useState([]);
  const [clrs, setClrs] = useState([]);
  const [mySelectedMethod, setMySelectedMethod] = useState("");
  const [isExportPDF, setisExportPDF] = useState(false);
  const [isDistanceExported, setIsDistanceExported] = useState(false);
  const [isOpen5, setIsOpen5] = useState(false);
  const [myHeader, setMyHeader] = useState("");
  const [awardsForChart, setAwardsForCharts] = useState([]);
  const [isIMF, setIsIMF] = useState(false);
  const [isPPP, setIsPPP] = useState(true);
  const [btnShowClicked, setBtnShowClicked] = useState(false);

  const [valuatedCountryTxt, setValuatedCountryTxt] = useState("");
  const [valuatedCountryPop, setValuatedCountryPop] = useState("");
  const [plotMean, setPlotMean] = useState(null);
  const [plotMedian, setPlotMedian] = useState(null);
  const [upperPlot, setPlotUpper] = useState(null);
  const [lowerPlot, setPlotLower] = useState(null);
  const [chartBenchmarkData, setChartBenchmarkData] = useState([]);
  const [awardsForChartRegression, setAwardsForChartRegression] = useState([]);
  const [hiddenAwards, setHiddenAwards] = useState([]);
  const [plotMinValBenchmark, setPlotMinValBenchmark] = useState(null);
  const [plotMaxValBenchmark, setPlotMaxValBenchmark] = useState(null);
  const [plotMinValRegression, setPlotMinValRegression] = useState(null);
  const [plotMaxValRegression, setPlotMaxValRegression] = useState(null);
  const [plotMinValDistancing, setPlotMinValDistancing] = useState(null);
  const [plotMaxValDistancing, setPlotMaxValDistancing] = useState(null);
  const [isRegressionGlowed, setIsRegressionGlowed] = useState(false);
  const [isDistancingGlowed, setIsDistancingGlowed] = useState(false);
  const [yScaleMaxValBenchmarkErr, setYScaleMaxValBenchmarkErr] =
    useState(false);
  const [yScaleMaxValRegressionErr, setYScaleMaxValRegressionErr] =
    useState(false);
  const [yScaleMaxValDistancingErr, setYScaleMaxValDistancingErr] =
    useState(false);
  const [yScaleMinValBenchmarkErr, setYScaleMinValBenchmarkErr] =
    useState(false);
  const [yScaleMinValRegressionErr, setYScaleMinValRegressionErr] =
    useState(false);
  const [yScaleMinValDistancingErr, setYScaleMinValDistancingErr] =
    useState(false);
  const [tempAwardsForRegressionPlot, setTempAwardsForRegressionPlot] =
    useState([]);

  const [maxRegGDP, setMaxRegGDP] = useState(200000);

  // const [width, setWidth] = useState(window.innerWidth*0.7);

  var _exportedFilters;

  var _selectedMethod = "";
  var Header;
  const [multiplier, setMultiplier] = useState(0);

  const chartBenchmarkRef = useRef(null);
  const regRef = useRef(null);
  const distanceRef = useRef(null);

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
    IsPairedAndUnPaired: true,
    IsPaired: false,
    IsSingle: "",
    ISIMF: false,
    term: 0,
    IsIncludeAnnual: true,
  };

  awardsRef.current = awards;
  awardsNewRef.current = awardsNew;
  optionsRef.current = options;
  bandOptionsListRef.current = bandOptionsList;
  distancingCategoriesRef.current = distancingCategories;

  const ShowPlot = (chartType) => {
    setPlotMinValBenchmark(null);
    setPlotMaxValBenchmark(null);
    setPlotMinValRegression(null);
    setPlotMaxValRegression(null);
    setPlotMinValDistancing(null);
    setPlotMaxValDistancing(null);
    setYScaleMaxValBenchmarkErr(false);
    setYScaleMinValBenchmarkErr(false);
    setYScaleMaxValRegressionErr(false);
    setYScaleMinValRegressionErr(false);
    setYScaleMaxValDistancingErr(false);
    setYScaleMinValDistancingErr(false);
    var upperValueArr = [];
    var lowerValueArr = [];
    var meanArr = [];
    var medianArr = [];
    var sum_val = 0;
    var mean_val = 0;
    var median_val = 0;
    var a = 0;
    var b = 0;
    if (chartType == 0) {
      var data = [...awardsWithMarkers];
      // console.log("awards: ", awards);
      // console.log("awards with markers: ", data);

      let fixedData = [];
      for (var i = 0; i < awards.length; i++) {
        for (var j = 0; j < data.length; j++) {
          if (awards[i].id == data[j].id) {
            fixedData.push(data[j]);
            break;
          }
        }
      }
      for (var i = 0; i < data.length; i++) {
        if (data[i].isHidden == true) {
          fixedData.push(data[i]);
        }
      }
      // console.log("fixedData: ", fixedData);
      var awardsForChartBenchmark = fixedData;
      let sum = 0;
      for (var i = 0; i < awardsForChartBenchmark.length; i++) {
        sum += awardsForChartBenchmark[i].price;
      }
      let mean = calculateMean(sum, awardsForChartBenchmark.length);

      var arr_prices = awardsForChartBenchmark.map(function (val) {
        return val.price == null || val.price == "" ? 0 : val.price.toFixed(3);
      });

      let median = calculateMedian(arr_prices);
      let upperPercentile = null;
      let lowerPercentile = null;

      awardsForChartBenchmark.map((val, i) => {
        awardsForChartBenchmark[i].isValuated = false;
      });
      if (columnsValuation.length == 2) {
        awardsForChartBenchmark.push({
          bandCountry:
            columnsValuation[0].Header + "-" + columnsValuation[1].Header,
          price: parseFloat(
            valuationValues[2][`accessor_${columnsValuation[1].Header}`]
          ),
          isValuated: true,
          countryName: columnsValuation[0].Header,
          band: columnsValuation[1].Header,
        });
      } else {
        for (var i = 0; i < columnsValuation.length; i++) {
          if (i + 1 != columnsValuation.length) {
            awardsForChartBenchmark.push({
              bandCountry:
                columnsValuation[0].Header +
                "-" +
                columnsValuation[i + 1].Header,
              price: parseFloat(
                valuationValues[2][`accessor_${columnsValuation[i + 1].Header}`]
              ),
              isValuated: true,
              countryName: columnsValuation[0].Header,
              band: columnsValuation[i + 1].Header,
            });
          } else {
            awardsForChartBenchmark.push({
              bandCountry:
                columnsValuation[0].Header + "-" + columnsValuation[i].Header,
              price: parseFloat(valuationValues[2][`allBands`]),
              isValuated: true,
              countryName: columnsValuation[0].Header,
              band: columnsValuation[i].Header,
            });
          }
        }
      }
      var upperValue = null;
      var lowerValue = null;

      // console.log("custom header: ", myHeader);
      let multiplier = parseInt(myHeader.split("x")[1].trim());

      console.log(
        "awards benchmark plot after push: ",
        awardsForChartBenchmark
      );
      awardsForChartBenchmark.map((val, i) => {
        awardsForChartBenchmark[i].index = i.toString();
        awardsForChartBenchmark[i].mean = parseFloat(mean);
        awardsForChartBenchmark[i].median = parseFloat(median);
        awardsForChartBenchmark[i].upperValue =
          val.upperValue === null ? null : val.upperValue;
        awardsForChartBenchmark[i].lowerValue =
          val.lowerValue === null ? null : val.lowerValue;
      });
      if (awardsForChartBenchmark.length > 0) {
        lowerValue =
          awardsForChartBenchmark[0].lowerValue == null
            ? null
            : normalizeByGDPc
            ? (awardsForChartBenchmark[0].lowerValue * multiplier).toFixed(3)
            : awardsForChartBenchmark[0].lowerValue.toFixed(3);
        upperValue =
          awardsForChartBenchmark[0].upperValue == null
            ? null
            : normalizeByGDPc
            ? (awardsForChartBenchmark[0].upperValue * multiplier).toFixed(3)
            : awardsForChartBenchmark[0].upperValue.toFixed(3);
      }
      console.log("upper and lower here: ", upperValue, lowerValue);
      setPlotUpper(upperValue);
      setPlotLower(lowerValue);
      for (var i = 0; i < awardsForChartBenchmark; i++) {
        awardsForChartBenchmark[i].price = parseFloat(
          awardsForChartBenchmark[i].price
        ).toFixed(3);
      }
      awardsForChartBenchmark = awardsForChartBenchmark.sort((a, b) =>
        parseFloat(a.price) < parseFloat(b.price) ? 1 : -1
      );

      var selectedBands = [];
      for (var i = 0, l = bandOptionsList.length; i < l; i++) {
        if (bandOptionsList[i].term != "") {
          selectedBands.push(bandOptionsList[i].value);
        }
      }

      if (selectedBands.length > 1) awardsForChartBenchmark.shift();
      setChartBenchmarkData(awardsForChartBenchmark);
      setIsOpen(true);

      try {
        setTimeout(() => {
          var _svg = chartBenchmarkRef.current.instance.svg();
          setSVG(_svg);
        }, 3000);
      } catch (e) {
        console.log(e);
      }
    } else if (chartType == 1) {
      setAwardsForChartRegression([]);
      let awardsForChartRegression = [...awards];
      let tempAwardsForRegression = [...tempAwardsForRegressionPlot];

      for (var i = 0; i < tempAwardsForRegression.length; i++) {
        awardsForChartRegression.push(tempAwardsForRegression[i]);
      }
      if (awardsForChartRegression.length > 0) {
        if (normalizeByGDPc) {
          a = awardsForChartRegression[0].aValue * multiplier;
          b = awardsForChartRegression[0].bValue * multiplier;
        } else {
          a = awardsForChartRegression[0].aValue;
          b = awardsForChartRegression[0].bValue;
        }
      }

      if (awardsForChartRegression.length > 0 && regressionValues.length > 0) {
        let obj = {};
        obj = {
          valuatedCountryVal: regressionValues[0].price,
          gdp: regressionValues[0].gdp,
        };
        awardsForChartRegression.push(obj);
        // awardsForChartRegression[awardsForChartRegression.length].valuatedCountryVal = regressionValues[0].price;
        // awardsForChartRegression[awardsForChartRegression.length].gdp = regressionValues[0].gdp;
      }

      for (var i = 0; i < awardsForChartRegression.length; i++) {
        awardsForChartRegression[i].slope =
          a * parseFloat(awardsForChartRegression[i].gdp) + b;
      }

      var _value = a * 0.0 + b;
      awardsForChartRegression.push({ slope: _value, gdp: 0.0 });
      console.log("awards for regression chart: ", awardsForChartRegression);

      var _max = Math.max.apply(
        Math,
        awardsForChartRegression.map(function (o) {
          return o.gdp;
        })
      );
      setMaxRegGDP(_max);

      setAwardsForChartRegression(awardsForChartRegression);

      setIsOpenNumeric(true);

      try {
        setTimeout(() => {
          var _svg = regRef.current.instance.svg();
          setSVG(_svg);
        }, 3000);
      } catch (e) {
        console.log(e);
      }
    } else {
      var data = awardsRef.current;
      if ($("#showMarkers").val() == "1" || $("#showMarkers").val() == 1) {
        awardsWithMarkers.map(function (val) {
          if (val.isHidden == true) data.push(val);
        });
      } else {
        data = data.filter(
          (item) => item.isHidden == null || item.isHidden == false
        );
      }
      var categories = [];
      var series = [];
      var seriesSize = [];
      console.log("data: ", data);

      for (var i = 0; i < data.length; i++) {
        if (categories.includes(data[i].countryName) == false)
          categories.push(data[i].countryName);
      }

      if ($("#showMarkers").val() == "1" || $("#showMarkers").val() == 1) {
        awardsWithMarkers.map(function (val) {
          if (val.isHidden == true) data.push(val);
        });
        var arr_prices = data.map(function (val) {
          return val.Price == null ? 0 : val.relativePrice.toFixed(3);
        });
        for (var i = 0; i < data.length; i++) {
          sum_val += data[i].relativePrice;
        }
        mean_val = calculateMean(sum_val, data.length);
        median_val = calculateMedian(arr_prices);
        categories.map(function (val) {
          meanArr.push(mean_val);
          medianArr.push(median_val);
        });
      } else {
        data = data.filter(
          (item) => item.isHidden == null || item.isHidden == false
        );
      }

      var arr = [];
      $.map(data, function (val, ind) {
        var item = new Object();
        item.countryName =
          val.countryName + " - " + val.lowBand + " - " + val.highBand;
        item.price = parseFloat(val.relativePrice.toFixed(3));

        arr.push(item);
      });
      setDistancingCategories(arr);

      setIsOpenDistancing(true);

      try {
        setTimeout(() => {
          var _svg = distanceRef.current.instance.svg();
          setSVG(_svg);
        }, 3000);
      } catch (e) {}
    }
  };

  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const exportToCSV = (csvData, fileName) => {
    var arr = [];
    var headers = [];
    var arr2 = [];
    var headers2 = [];

    if (mySelectedMethod == "Benchmark") {
      if ($("#showResults").val() == 0) {
        headers = [
          "Country",
          "Pop,M",
          "GDPc,$",
          "Operator",
          "Date",
          "Term (Y)",
          "Price,M",
          "Bands",
        ];
      } else {
        headers = ["Country", "Pop,M", "GDPc,$", "Date", "Term (Y)", "Bands"];
      }

      awards.forEach((element1) => {
        var obj = new Object();

        columns.forEach((element) => {
          if (element.accessor == "mhz_price") {
            var items = element.columns;
            items.forEach((myItem) => {
              if (myItem.accessor != "SeparatorValuationMHZ") {
                if (headers.indexOf(String(myItem.Header)) < 0) {
                  headers.push(String(myItem.Header));
                }
                if (myItem.accessor != "allBands") {
                  var value = element1["value_" + String(myItem.Header)];
                  obj[String(myItem.Header)] =
                    value == null || value == undefined ? "" : value;
                } else {
                  var value = element1.allBands;
                  obj[String(myItem.Header)] =
                    value == null || value == undefined ? "" : value;
                }
              }
            });
          }
        });

        obj.Country = element1.countryName;
        obj["Pop,M"] = displayPop(element1.pop, getIMF());
        obj["GDPc,$"] =
          element1.gdp == 0 || element1.gdp == null
            ? ""
            : element1.gdp.toFixed(0);
        if ($("#showResults").val() == 0) {
          obj.Operator = element1.operatorName;
        }
        obj.Date = element1.year;
        obj["Term (Y)"] = element1.terms;
        if ($("#showResults").val() == 0) {
          obj["Price,M"] = element1.upFrontFees;
        }

        obj.Bands = element1.band;

        console.log(obj);
        arr.push(obj);
      });
      valuationValues.forEach((val) => {
        var obj = new Object();
        columnsValuation.forEach((element) => {
          if (headers2.indexOf(String(element.Header)) < 0) {
            headers2.push(String(element.Header));
          }

          if (typeof String(element.accessor) === "object")
            obj[String(element.Header)] = val[String(element.accessor)];
          else {
            if (val[String(element.accessor)].props != undefined)
              obj[String(element.Header)] =
                val[String(element.accessor)].props.children[0];
            else obj[String(element.Header)] = val[String(element.accessor)];
            // obj[String(element.Header)] =
            //   val[String(element.accessor.props.children[0])];
          }

          // else if (val.id == 2) obj["Mean"] = val[String(element.accessor)];
          // else if (val.id == 3) obj["Median"] = val[String(element.accessor)];
        });

        arr2.push(obj);
      });

      console.log(arr2);

      const ws = XLSX.utils.json_to_sheet(arr, { header: headers, origin: "A2" });
      const ws2 = XLSX.utils.json_to_sheet(arr2, { header: headers2 });

      const wb = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(wb, ws, "SheetJS1");
      XLSX.utils.book_append_sheet(wb, ws2, "SheetJS2");

      const firstSheet = wb.Sheets[wb.SheetNames[0]];
      firstSheet['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: headers.length - 1 } }];

      firstSheet['A1'] = { t: "s", v: `Prices are in ${myHeader}` };

      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

      const data = new Blob([excelBuffer], { type: fileType });
      FileSaver.saveAs(data, "ValuationByBenchmark" + fileExtension);
    } else if (mySelectedMethod == "Regression") {
      var result = [];
      var result2 = [];
      awards.map((val, i) => {
        var item = new Object();
        item.Country = val.countryName;
        item["Pop,M"] = displayPop(val.pop, getIMF());
        item["GDPc, $"] =
          val.gdp == 0 || val.gdp == null ? "" : val.gdp.toFixed(0);

        if ($("#showResults").val() == 0) {
          item.Operator = val.operatorName;
        }
        item.Date = val.year;
        item["Term (Y)"] = val.terms;
        item.Band = val.band;
        item[`Prices in ${myHeader}`] = val.price.toFixed(3);

        result.push(item);
      });
      regressionValues.map((val, i) => {
        var item = new Object();
        item.Country = val.countryName;
        item["Pop,M"] = displayPop(val.pop, getIMF());
        item["GDPc, $"] =
          val.gdp == 0 || val.gdp == null ? "" : val.gdp.toFixed(0);

        if ($("#showResults").val() == 0) {
          item.Operator = val.operatorName;
        }
        item.Date = val.year;
        item["Term (Y)"] = val.terms;
        item.Band = val.band;
        item["$/M/P"] = val.price.toFixed(3);

        result2.push(item);
      });

      const ws = XLSX.utils.json_to_sheet(result, { origin: 'A1' });
      const ws2 = XLSX.utils.json_to_sheet(result2);

      const wb = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(wb, ws, "SheetJS1");
      XLSX.utils.book_append_sheet(wb, ws2, "SheetJS2");

      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const data = new Blob([excelBuffer], { type: fileType });
      FileSaver.saveAs(data, "ValuationByRegression" + fileExtension);
    } else {
      awards.map((val, i) => {
        var item = new Object();
        item.Country = val.countryName;
        item["High Band"] = val.highBand;
        item["High Band Year"] = val.highBandYear;
        item["High Band Price"] = val.highBandPrice;
        item["Low Band"] = val.lowBand;
        item["Low Year"] = val.lowBandYear;
        item["Low Price"] = val.lowBandPrice;
        item["Target Band"] = val.targetBand;
        item["Target Year"] = val.targetBandYear;
        item["Target Price"] = val.targetBandPrice;

        item["Relative Value"] = val.relativePrice;

        arr.push(item);
      });

      const ws = XLSX.utils.json_to_sheet(arr, { origin: 'A2' });
      const wb = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(wb, ws, "SheetJS1");

      const firstSheet = wb.Sheets[wb.SheetNames[0]];
      firstSheet['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 10 } }];

      firstSheet['A1'] = { t: "s", v: `Prices are in ${myHeader}` };

      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const data = new Blob([excelBuffer], { type: fileType });
      FileSaver.saveAs(data, "ValuationByDistancing" + fileExtension);
    }
  };

  const hideModal5 = () => {
    setIsOpen5(false);
  };

  const hideModal6 = () => {
    setIsOpen6(false);
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
                data-country={val.value}
                type="checkbox"
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

  useEffect(() => {
    APIFunctions.getUserCountriesWithSource("Valuations", "NotMain")
      .then((resp) => resp)
      .then((resp) => bindOptions2(resp.data))
      .then((resp) => getUserFilters());
  }, []);

  useEffect(() => {
    APIFunctions.getUserCountries("Valuations")
      .then((resp) => resp)
      .then((resp) => bindOptions(resp.data))
      .then((resp) => getUserFilters());
  }, []);

  const hideModal = () => {
    setIsOpen(false);
    setIsOpenNumeric(false);
    setIsOpenDistancing(false);
    setTitle("Transitioning...");
  };

  const modalLoaded = () => {
    setTitle("Pricing Plot");
  };

  const handleCheckboxDistance = (
    name,
    country,
    band,
    arr,
    year,
    rowId,
    countryName
  ) => {
    setBtnShowClicked(false);
    setIsDistancingGlowed(true);
    $(".deselect").prop("checked", false);
    var nbr = parseInt($("#numberOfAwards").html());
    for (var i = 0; i < bandOptionsList.length; i++) {
      if (bandOptionsList[i].term != "") {
        var target_band = bandOptionsList[i].value;
        break;
      }
    }

    let newArray = [...awardsRef.current];
    let deselectedAwards = [...awardsNewRef.current];
    var filtered = [];
    var filteredDeselect = [];
    if (parseInt($("#valuatedCountry").val()) != country) {
      newArray.map((el) => {
        if (parseInt(country) != parseInt(el.CountryId)) {
          filtered.push(el);
        } else {
          if (
            parseInt(el.Band) != parseInt(band) ||
            parseInt(el.Year) != parseInt(year)
          )
            filtered.push(el);
          else filteredDeselect.push(el);
        }
      });

      setAwards(filtered);

      deselectedAwards.sort((a, b) =>
        a.CountryName > b.CountryName
          ? 1
          : b.CountryName > a.CountryName
          ? -1
          : 0
      );
      setAwardsNew(deselectedAwards);

      newArray = [...awardsRef.current];
      deselectedAwards = [...awardsNewRef.current];

      var lowBands = [];
      var targetBands = [];
      var highBands = [];

      filtered.map((el) => {
        if (el.CountryId == country) {
          if (el.Band < target_band) {
            lowBands.push(el);
          } else {
            if (el.Band > target_band) {
              highBands.push(el);
            } else {
              targetBands.push(el);
            }
          }
        }
      });

      if (
        lowBands.length == 0 ||
        targetBands.length == 0 ||
        highBands.length == 0
      ) {
        filtered = newArray.filter(function (el) {
          return el.CountryId != country;
        });
        filteredDeselect = newArray.filter(function (el) {
          return el.CountryId == country;
        });
      }

      setAwards(filtered);
      for (var i = 0; i < filteredDeselect.length; i++) {
        deselectedAwards.push(filteredDeselect[i]);
        nbr -= 1;
      }
      $("#numberOfAwards").html(nbr);
      deselectedAwards.sort((a, b) =>
        a.CountryName > b.CountryName
          ? 1
          : b.CountryName > a.CountryName
          ? -1
          : 0
      );
      setAwardsNew(deselectedAwards);
    } else {
      var lowBands = [];
      var targetBands = [];
      var highBands = [];

      newArray.map((el) => {
        if (parseInt(country) != parseInt(el.CountryId)) {
          filtered.push(el);
        } else {
          if (
            parseInt(el.Band) != parseInt(band) ||
            parseInt(el.Year) != parseInt(year)
          )
            filtered.push(el);
          else filteredDeselect.push(el);
        }
      });

      filtered.map((el) => {
        if (el.CountryId == country) {
          if (el.Band < target_band) {
            lowBands.push(el);
          } else {
            if (el.Band > target_band) {
              highBands.push(el);
            } else {
              targetBands.push(el);
            }
          }
        }
      });

      if (lowBands.length >= 1 && highBands.length >= 1) {
        setAwards(filtered);
        for (var i = 0; i < filteredDeselect.length; i++) {
          deselectedAwards.push(filteredDeselect[i]);
          nbr -= 1;
        }
        $("#numberOfAwards").html(nbr);
        deselectedAwards.sort((a, b) =>
          a.CountryName > b.CountryName
            ? 1
            : b.CountryName > a.CountryName
            ? -1
            : 0
        );
        setAwardsNew(deselectedAwards);
      }
    }
  };

  const handleCheckboxDistanceDeselect = (name, country, band, arr, rowId) => {
    setIsDistancingGlowed(true);
    setBtnShowClicked(false);
    $(".deselect").prop("checked", false);
    var nbr = parseInt($("#numberOfAwards").html());
    let newArray = [...awardsRef.current];
    let deselectedAwards = [...awardsNewRef.current];

    var checkIfExist = newArray.filter(function (el) {
      return el.CountryName == country;
    });

    if (checkIfExist.length == 0) {
      var filtered = deselectedAwards.filter(function (el) {
        return el.CountryName != country;
      });
      var filteredDeselect = deselectedAwards.filter(function (el) {
        return el.CountryName == country;
      });
      setAwardsNew(filtered);

      for (var i = 0; i < filteredDeselect.length; i++) {
        newArray.push(filteredDeselect[i]);
        nbr += 1;
      }
      $("#numberOfAwards").html(nbr);
      newArray.sort((a, b) =>
        a.CountryName > b.CountryName
          ? 1
          : b.CountryName > a.CountryName
          ? -1
          : 0
      );
      setAwards(newArray);
    } else {
      nbr += 1;
      $("#numberOfAwards").html(nbr);
      let deselected = deselectedAwards[rowId];
      newArray.push(deselected);
      newArray.sort((a, b) =>
        a.countryName > b.countryName
          ? 1
          : b.countryName > a.countryName
          ? -1
          : 0
      );
      deselectedAwards.splice(rowId, 1);
      setAwards(newArray);
      setAwardsNew(deselectedAwards);
    }
  };

  const handleCheckboxDistancingToDeselect = (relativePrice) => {
    setBtnShowClicked(false);

    var nbr = parseInt($("#numberOfAwards").html());
    nbr -= 1;
    $("#numberOfAwards").html(nbr);

    let newArray = [...awardsRef.current];

    let deselectedAwards = [...awardsNewRef.current];
    let deselected = newArray.filter((x) => x.relativePrice === relativePrice);
    let remainingItems = newArray.filter(
      (x) => x.relativePrice !== relativePrice
    );

    deselectedAwards.push(deselected[0]);
    deselectedAwards.sort((a, b) =>
      a.countryName > b.countryName ? 1 : b.countryName > a.countryName ? -1 : 0
    );
    setAwards(remainingItems);
    setAwardsNew(deselectedAwards);
    // console.log("deselected awards: ", deselectedAwards);

    // remove from plot

    // console.log("distancing cateogires ref .current (deselect): ", distancingCategoriesRef.current);
    let oldDistancingCategories = [...distancingCategoriesRef.current];
    // console.log("old distancing before: ", oldDistancingCategories);
    // console.log("relative price to fixed: ", relativePrice.toFixed(3));
    let newDistacingCategories = oldDistancingCategories.filter(
      (x) => x.price != relativePrice.toFixed(3)
    );
    // console.log("new distancing after: ", newDistacingCategories);
    setDistancingCategories(newDistacingCategories);

    // recalculate mean

    var mean = 0;
    var sum = 0;
    var count = remainingItems.length;
    for (var i = 0; i < remainingItems.length; i++) {
      sum += remainingItems[i].relativePrice;
    }
    // console.log("sum: ", sum);
    // console.log("count: ", count);
    mean = calculateMean(sum, count);
    $("#meanValueContainer").html(getValue("Mean", getLang()) + ": " + mean);
  };

  const handleCheckboxToDeselect = (rowId) => {
    console.log("selected method: ", _selectedMethod);
    if (_selectedMethod == "Regression") {
      setIsRegressionGlowed(true);
    }

    setBtnShowClicked(false);

    setDeseltectChecked(true);

    var nbr = parseInt($("#numberOfAwards").html());
    nbr -= 1;
    $("#numberOfAwards").html(nbr);

    let newArray = [...awardsRef.current];

    let deselectedAwards = [...awardsNewRef.current];
    let deselected = newArray[rowId];
    deselectedAwards.push(deselected);
    deselectedAwards.sort((a, b) =>
      a.countryName > b.countryName ? 1 : b.countryName > a.countryName ? -1 : 0
    );
    newArray.splice(rowId, 1);
    setAwards(newArray);
    setAwardsNew(deselectedAwards);
    if (_selectedMethod == "Regression") {
      console.log("11111");
      console.log(deselectedAwards);
      setTempAwardsForRegressionPlot(deselectedAwards);
    }

    var mean = 0;
    var sum = 0;
    var count = newArray.length;
    if (count > 0) {
      if (isNaN(newArray[0].price)) {
        for (var i = 0; i < newArray.length; i++) {
          sum += newArray[i].relativePrice;
        }
      } else {
        for (var i = 0; i < newArray.length; i++) {
          sum += newArray[i].price;
        }
      }
    }

    mean = calculateMean(sum, count);
    $("#meanValueContainer").html(getValue("Mean", getLang()) + ": " + mean);
    setPlotMean(mean);

    var arr_prices = newArray.map(function (val) {
      return val.price == null || val.price == "" ? 0 : val.price.toFixed(3);
    });
    let median = calculateMedian(arr_prices);
    setPlotMedian(median);

    if (_selectedMethod == "Benchmark") {
      calculateAwardsUsedInValuationByBenchmark(newArray);
    }

    setDeseltectChecked(false);
  };

  const handleCheckboxDeselect = (rowId) => {
    if (_selectedMethod == "Regression") {
      setIsRegressionGlowed(true);
    }

    setBtnShowClicked(false);

    setDeseltectChecked(true);

    var nbr = parseInt($("#numberOfAwards").html());
    nbr += 1;
    $("#numberOfAwards").html(nbr);

    let newArray = [...awardsRef.current];
    let deselectedAwards = [...awardsNewRef.current];
    let deselected = deselectedAwards[rowId];
    newArray.push(deselected);
    newArray.sort((a, b) =>
      a.countryName > b.countryName ? 1 : b.countryName > a.countryName ? -1 : 0
    );
    deselectedAwards.splice(rowId, 1);
    setAwards(newArray);
    setAwardsNew(deselectedAwards);
    if (_selectedMethod == "Regression") {
      console.log("2222");
      console.log(deselectedAwards);
      setTempAwardsForRegressionPlot(deselectedAwards);
    }

    var mean = 0;
    var sum = 0;
    var count = newArray.length;
    if (isNaN(newArray[0].price)) {
      for (var i = 0; i < newArray.length; i++) {
        sum += newArray[i].relativePrice;
      }
    } else {
      for (var i = 0; i < newArray.length; i++) {
        sum += newArray[i].price;
      }
    }

    mean = calculateMean(sum, count);
    $("#meanValueContainer").html(getValue("Mean", getLang()) + ": " + mean);
    setPlotMean(mean);

    var arr_prices = newArray.map(function (val) {
      return val.price == null || val.price == "" ? 0 : val.price.toFixed(3);
    });
    let median = calculateMedian(arr_prices);
    setPlotMedian(median);

    if (_selectedMethod == "Benchmark") {
      calculateAwardsUsedInValuationByBenchmark(newArray);
    }

    setDeseltectChecked(false);
  };

  const calculateAwardsUsedInValuationByBenchmark = (newArray) => {
    var value2 = [];
    var bandCount = [];
    var bandSum = [];
    var bandMean = [];
    var bandMedian = [];
    var bandValues = [];
    var nbrOptions = 0;
    for (var i = 0, l = bandOptionsList.length; i < l; i++) {
      if (bandOptionsList[i].term != "") {
        value2.push(bandOptionsList[i].term);
        bandCount.push({
          band: bandOptionsList[i].value,
          count_value: 0,
        });
        bandSum.push({
          band: bandOptionsList[i].value,
          sum_value: 0,
        });
        bandMean.push({
          band: bandOptionsList[i].value,
          mean_value: 0,
        });
        bandMedian.push({
          band: bandOptionsList[i].value,
          median_value: 0,
        });
        bandValues.push({
          band: bandOptionsList[i].value,
          band_values: [],
        });
      }
    }
    newArray.forEach(function (element, index) {
      if (element.price != null) {
        newArray[index][`value_${element.band}`] = element.price.toFixed(3);
        newArray[index]["allBands"] = element.price.toFixed(3);

        // band count
        for (var i = 0; i < bandCount.length; i++) {
          if (element.band == bandCount[i].band) {
            var nbr = bandCount[i].count_value;
            nbr += 1;
            bandCount[i].count_value = nbr;
          }
        }

        // band sum
        for (var i = 0; i < bandSum.length; i++) {
          if (element.band == bandSum[i].band) {
            var sum = parseFloat(bandSum[i].sum_value);
            sum += parseFloat(element.price);
            bandSum[i].sum_value = sum;
          }
        }

        // band values
        for (var i = 0; i < bandValues.length; i++) {
          if (element.band == bandValues[i].band) {
            var val = element.price;
            bandValues[i].band_values[bandValues[i].band_values.length] = val;
          }
        }
      } else {
        newArray[index][`value_${element.band}`] = "";
        newArray[index]["allBands"] = "";
      }
    });

    // mean
    for (var i = 0; i < bandCount.length; i++) {
      // var mean = bandSum[i].sum_value / bandCount[i].count_value;
      bandMean[i].mean_value = calculateMean(
        bandSum[i].sum_value,
        bandCount[i].count_value
      );
    }
    setAllBandsMean(bandMean);

    // median
    for (var i = 0; i < bandValues.length; i++) {
      bandMedian[i].median_value = calculateMedian(bandValues[i].band_values);
    }
    var clmns_valuation = [];

    var this_country_id = $("#valuatedCountry").val();
    var this_country_name = "";
    var this_country_pop = 0;
    var firstColHeader = "";
    for (var i = 0; i < options.length; i++) {
      if (options[i].value == this_country_id) {
        this_country_name = options[i].label;
        break;
      }
    }

    for (var i = 0; i < newArray.length; i++) {
      if (newArray[i].countryName == this_country_name) {
        this_country_pop = newArray[i].pop;
      }
    }
    firstColHeader = `${this_country_name}`;
    clmns_valuation.push({
      id: "firstCol",
      Header: firstColHeader,
      accessor: "firstCol",
    });
    for (i = 0; i < bandMedian.length; i++) {
      nbrOptions += 1;
      clmns_valuation.push({
        id: `id_${bandMedian[i].band}`,
        Header: bandMedian[i].band,
        accessor: `accessor_${bandMedian[i].band}`,
        className: "int",
      });
    }
    if (nbrOptions > 1) {
      clmns_valuation.push({
        id: "allBands",
        Header: getValue("AllBands", getLang()),
        accessor: "allBands",
      });
    }

    setColumnsValuation(clmns_valuation);

    var arr_first_col = [];
    arr_first_col.push({
      id: 0,
      firstCol: getValue("NumberOfAwards", getLang()),
    });
    arr_first_col.push({
      id: 1,
      firstCol: getValue("LicenseTerm", getLang()),
    });
    arr_first_col.push({
      id: 2,
      firstCol: getValue("PriceByMean", getLang()),
    });
    arr_first_col.push({
      id: 3,
      firstCol: getValue("PriceByMedian", getLang()),
    });

    var arr_valuation_values = [];
    for (i = 0; i < arr_first_col.length; i++) {
      if (i > 1) {
        arr_valuation_values.push({
          id: i,
          firstCol: (
            <div>
              {arr_first_col[i].firstCol} <span dir="ltr">{Header}</span>{" "}
            </div>
          ),
        });
      } else {
        arr_valuation_values.push({
          id: i,
          firstCol: arr_first_col[i].firstCol,
        });
      }
    }

    var k = 0;
    arr_valuation_values.forEach(function (element, index) {
      if (k == 0) {
        var s = 0;
        for (var j = 0, m = 0; j < bandOptionsList.length; j++) {
          if (bandOptionsList[j].term != "") {
            arr_valuation_values[index][
              `accessor_${bandOptionsList[j].value}`
            ] = bandCount[m].count_value;
            s = s + parseInt(bandCount[m].count_value);
            m++;
          }
        }
        arr_valuation_values[index]["allBands"] = s;
      } else {
        if (k == 1) {
          var uniqueBands = [];
          for (var j = 0; j < bandOptionsList.length; j++) {
            if (bandOptionsList[j].term != "") {
              arr_valuation_values[index][
                `accessor_${bandOptionsList[j].value}`
              ] = bandOptionsList[j].term;
              uniqueBands[uniqueBands.length] = bandOptionsList[j].term;
            }
          }
          uniqueBands = uniqueBands.filter(function (item, pos) {
            return uniqueBands.indexOf(item) == pos;
          });
          var strBands = "";
          for (j = 0; j < uniqueBands.length; j++) {
            if (j == uniqueBands.length - 1) strBands += uniqueBands[j];
            else strBands += uniqueBands[j] + " / ";
          }
          arr_valuation_values[index]["allBands"] = strBands;
        } else {
          if (k == 2) {
            for (var j = 0, m = 0; j < bandOptionsList.length; j++) {
              if (bandOptionsList[j].term != "") {
                arr_valuation_values[index][
                  `accessor_${bandOptionsList[j].value}`
                ] = isNaN(bandMean[m].mean_value) ? 0 : bandMean[m].mean_value;
                m++;
              }
            }
            var s_sum = 0;
            var s_count = 0;
            for (var j = 0; j < bandCount.length; j++) {
              s_sum += parseFloat(bandSum[j].sum_value);
              s_count += parseFloat(bandCount[j].count_value);
            }
            arr_valuation_values[index]["allBands"] = (s_sum / s_count).toFixed(
              3
            );
          } else {
            if (k == 3) {
              for (var j = 0, m = 0; j < bandOptionsList.length; j++) {
                if (bandOptionsList[j].term != "") {
                  arr_valuation_values[index][
                    `accessor_${bandOptionsList[j].value}`
                  ] = isNaN(bandMedian[m].median_value)
                    ? 0
                    : bandMedian[m].median_value;
                  m++;
                }
              }
              var arr_all_values = [];
              for (var j = 0; j < bandValues.length; j++) {
                var temp = bandValues[j].band_values;
                var child = arr_all_values;
                arr_all_values = child.concat(temp);
              }
              for (var j = 0; j < arr_all_values.length; j++) {
                arr_all_values[j] = parseFloat(arr_all_values[j]);
              }
              var median = 0;
              arr_all_values.sort(function (a, b) {
                return a - b;
              });

              var half = Math.floor(arr_all_values.length / 2);

              if (arr_all_values.length % 2)
                median = parseFloat(arr_all_values[half]);
              else
                median =
                  parseFloat(arr_all_values[half - 1] + arr_all_values[half]) /
                  2.0;
              arr_valuation_values[index]["allBands"] = median.toFixed(3);
            }
          }
        }
      }
      k += 1;
    });

    setValuationValues(arr_valuation_values);
  };

  function calculateMedian(arr) {
    var values = arr;
    var median = 0;
    values.sort(function (a, b) {
      return a - b;
    });

    var half = Math.floor(values.length / 2);

    if (values.length % 2) median = parseFloat(values[half]);
    else {
      median = (parseFloat(values[half - 1]) + parseFloat(values[half])) / 2.0;
    }

    return median.toFixed(3);
  }

  function calculateMean(sum, count) {
    return (sum / count).toFixed(3);
  }

  const doDistancing = () => {
    setBtnShowClicked(true);
    setShowDistances(false);
    setShowDoDistancing(true);
    setIsDistancingGlowed(false);
    var txt = getValue("DistancingTitle", getLang());

    setMethodTitle(txt);
    setAwardsNew([]);
    LoadingAlert("Show");
    var obj = new Object();
    // $("#plotBtn").prop('disabled', false);
    document.getElementById("distancingBtn").style.display = "none";
    document.getElementById("downloadBtn").style.display = "";

    obj.ValutatedCountryId = parseInt($("#valuatedCountry").val());
    obj.TargetBand = SelectedBands[0].toString();
    obj.FilteredAwards = awardsRef.current; //distancingData
    APIFunctions.getDistancingResult(obj)
      .then((resp) => resp)
      .then((resp) => {
        distancingRef.current = resp.data;

        var sum = 0;
        var data_without_hidden = resp.data;
        var count = resp.data.length;
        var mean = 0;
        var nbr_of_awards = 0;

        for (var i = 0; i < resp.data.length; i++) {
          sum += resp.data[i].relativePrice;
        }

        mean = calculateMean(sum, count);
        const clm = [
          {
            id: "checkBox",
            Header: "",
            Cell: (props) => {
              // console.log(props);
              const relativePrice = props.row.original.relativePrice;
              return (
                <div>
                  <input
                    type="checkbox"
                    className="deselect"
                    checked={deSelectChecked}
                    onChange={() =>
                      handleCheckboxDistancingToDeselect(relativePrice)
                    }
                  />
                </div>
              );
            },
          },
          {
            id: "Country",
            Header: () => (
              <div className="td-separator-right">
                {getValue("Country", getLang())}
              </div>
            ),
            accessor: "countryName",
          },
          {
            Header: () => <div style={{ width: "5px" }}></div>,
            accessor: "SeparatorValuationMHZ",
            Cell: (props) => {
              $(".td-separator-right")
                .parent()
                .css("border-inline-end", "1px solid #dee2e6");
              $(".td-separator-left")
                .parent()
                .css("border-inline-start", "1px solid #dee2e6");
              return <div className="td-separator-left"></div>;
            },
          },
          {
            Header: () => (
              <div style={{ justifyContent: "center", display: "flex" }}>
                {getValue("LowBand", getLang())}
              </div>
            ),
            accessor: "LowBandHeader",
            disableSortBy: true,
            columns: [
              {
                id: "LowBand",
                Header: () => <div>{getValue("Band", getLang())}</div>,
                accessor: "lowBand",
              },
              {
                id: "LowBandYear",
                Header: getValue("Date", getLang()),
                accessor: "lowBandYear",
              },
              {
                id: "LowBandPrice",
                Header: () => (
                  <div className="td-separator-right">
                    {getValue("Price", getLang())}
                  </div>
                ),
                accessor: "lowBandPrice",
                sortType: (rowA, rowB) => {
                  if (rowA.original.lowBandPrice > rowB.original.lowBandPrice)
                    return -1;
                  if (rowB.original.lowBandPrice > rowA.original.lowBandPrice)
                    return 1;
                },
                Cell: (props) => {
                  if (props.value != null)
                    return parseFloat(props.value).toFixed(3);
                  else return "";
                },
              },
            ],
          },
          {
            Header: () => <div style={{ width: "5px" }}></div>,
            accessor: "Separator2",
            Cell: (props) => {
              return <div className="td-separator-left"></div>;
            },
          },
          {
            Header: () => (
              <div style={{ justifyContent: "center", display: "flex" }}>
                {getValue("TargetBand", getLang())}
              </div>
            ),
            accessor: "TargetBandHeader",
            disableSortBy: true,
            columns: [
              {
                id: "TargetBand",
                Header: () => <div>{getValue("Band", getLang())}</div>,
                accessor: "targetBand",
              },
              {
                id: "TargetBandYear",
                Header: getValue("Date", getLang()),
                accessor: "targetBandYear",
              },
              {
                id: "TargetBandPrice",
                Header: () => (
                  <div className="td-separator-right">
                    {getValue("Price", getLang())}
                  </div>
                ),
                accessor: "targetBandPrice",
                sortType: (rowA, rowB) => {
                  if (
                    rowA.original.targetBandPrice >
                    rowB.original.targetBandPrice
                  )
                    return -1;
                  if (
                    rowB.original.targetBandPrice >
                    rowA.original.targetBandPrice
                  )
                    return 1;
                },
                Cell: (props) => {
                  if (props.value != null)
                    return parseFloat(props.value).toFixed(3);
                  else return "";
                },
              },
            ],
          },
          {
            Header: () => <div style={{ width: "5px" }}></div>,
            accessor: "Separator3",
            Cell: (props) => {
              return <div className="td-separator-left"></div>;
            },
          },
          {
            Header: () => (
              <div style={{ justifyContent: "center", display: "flex" }}>
                {getValue("HighBand", getLang())}
              </div>
            ),
            accessor: "HighBandHeader",
            disableSortBy: true,
            columns: [
              {
                id: "HighBand",
                Header: () => <div>{getValue("Band", getLang())}</div>,
                accessor: "highBand",
              },
              {
                id: "HighBandYear",
                Header: getValue("Date", getLang()),
                accessor: "highBandYear",
              },
              {
                id: "HighBandPrice",
                Header: () => (
                  <div className="td-separator-right">
                    {getValue("Price", getLang())}
                  </div>
                ),
                accessor: "highBandPrice",
                sortType: (rowA, rowB) => {
                  if (rowA.original.highBandPrice > rowB.original.highBandPrice)
                    return -1;
                  if (rowB.original.highBandPrice > rowA.original.highBandPrice)
                    return 1;
                },
                Cell: (props) => {
                  if (props.value != null)
                    return parseFloat(props.value).toFixed(3);
                  else return "";
                },
              },
            ],
          },
          {
            Header: () => <div style={{ width: "5px" }}></div>,
            accessor: "Separator4",
            Cell: (props) => {
              return <div className="td-separator-left"></div>;
            },
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
                id: "RelativePrice",
                Header: () => (
                  <div style={{ justifyContent: "center", display: "flex" }}>
                    {getValue("RelativeValue", getLang())}
                  </div>
                ),
                accessor: "relativePrice",
                sortType: (rowA, rowB) => {
                  if (rowA.original.relativePrice > rowB.original.relativePrice)
                    return -1;
                  if (rowB.original.relativePrice > rowA.original.relativePrice)
                    return 1;
                },
                Cell: (props) => {
                  if (props.value != null)
                    return (
                      <div
                        style={{ justifyContent: "center", display: "flex" }}
                      >
                        {parseFloat(props.value).toFixed(3)}
                      </div>
                    );
                  else return "";
                },
              },
            ],
          },
        ];
        const clm_new = [
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
            id: "Country",
            Header: () => <div className="td-separator-right">Country</div>,
            accessor: "countryName",
          },
          {
            Header: () => <div style={{ width: "5px" }}></div>,
            accessor: "SeparatorValuationMHZ",
            Cell: (props) => {
              $(".td-separator-right")
                .parent()
                .css("border-inline-end", "1px solid #dee2e6");
              $(".td-separator-left")
                .parent()
                .css("border-inline-start", "1px solid #dee2e6");
              return <div className="td-separator-left"></div>;
            },
          },
          {
            Header: () => (
              <div style={{ justifyContent: "center", display: "flex" }}>
                Low Band
              </div>
            ),
            accessor: "LowBandHeader",
            disableSortBy: true,
            columns: [
              {
                id: "LowBand",
                Header: () => <div>Band</div>,
                accessor: "lowBand",
              },
              {
                id: "LowBandYear",
                Header: "DATE",
                accessor: "lowBandYear",
              },
              {
                id: "LowBandPrice",
                Header: () => <div className="td-separator-right">Price</div>,
                accessor: "lowBandPrice",
                sortType: (rowA, rowB) => {
                  if (rowA.original.lowBandPrice > rowB.original.lowBandPrice)
                    return -1;
                  if (rowB.original.lowBandPrice > rowA.original.lowBandPrice)
                    return 1;
                },
                Cell: (props) => {
                  if (props.value != null)
                    return parseFloat(props.value).toFixed(3);
                  else return "";
                },
              },
            ],
          },
          {
            Header: () => <div style={{ width: "5px" }}></div>,
            accessor: "Separator2",
            Cell: (props) => {
              return <div className="td-separator-left"></div>;
            },
          },
          {
            Header: () => (
              <div style={{ justifyContent: "center", display: "flex" }}>
                {getValue("TargetBand", getLang())}
              </div>
            ),
            accessor: "TargetBandHeader",
            disableSortBy: true,
            columns: [
              {
                id: "TargetBand",
                Header: () => <div>{getValue("Band", getLang())}</div>,
                accessor: "targetBand",
              },
              {
                id: "TargetBandYear",
                Header: getValue("Date", getLang()),
                accessor: "targetBandYear",
              },
              {
                id: "TargetBandPrice",
                Header: () => (
                  <div className="td-separator-right">
                    {getValue("Price", getLang())}
                  </div>
                ),
                accessor: "targetBandPrice",
                sortType: (rowA, rowB) => {
                  if (
                    rowA.original.targetBandPrice >
                    rowB.original.targetBandPrice
                  )
                    return -1;
                  if (
                    rowB.original.targetBandPrice >
                    rowA.original.targetBandPrice
                  )
                    return 1;
                },
                Cell: (props) => {
                  if (props.value != null)
                    return parseFloat(props.value).toFixed(3);
                  else return "";
                },
              },
            ],
          },
          {
            Header: () => <div style={{ width: "5px" }}></div>,
            accessor: "Separator3",
            Cell: (props) => {
              return <div className="td-separator-left"></div>;
            },
          },
          {
            Header: () => (
              <div style={{ justifyContent: "center", display: "flex" }}>
                {getValue("HighBand", getLang())}
              </div>
            ),
            accessor: "HighBandHeader",
            disableSortBy: true,
            columns: [
              {
                id: "HighBand",
                Header: () => <div>{getValue("Band", getLang())}</div>,
                accessor: "highBand",
              },
              {
                id: "HighBandYear",
                Header: getValue("Date", getLang()),
                accessor: "highBandYear",
              },
              {
                id: "HighBandPrice",
                Header: () => (
                  <div className="td-separator-right">
                    {getValue("Price", getLang())}
                  </div>
                ),
                accessor: "highBandPrice",
                sortType: (rowA, rowB) => {
                  if (rowA.original.highBandPrice > rowB.original.highBandPrice)
                    return -1;
                  if (rowB.original.highBandPrice > rowA.original.highBandPrice)
                    return 1;
                },
                Cell: (props) => {
                  if (props.value != null)
                    return parseFloat(props.value).toFixed(3);
                  else return "";
                },
              },
            ],
          },
          {
            Header: () => <div style={{ width: "5px" }}></div>,
            accessor: "Separator4",
            Cell: (props) => {
              return <div className="td-separator-left"></div>;
            },
          },
          {
            Header: () => (
              <div style={{ justifyContent: "end", display: "flex" }}></div>
            ),
            accessor: "Mean",
            disableSortBy: true,
            columns: [
              {
                id: "RelativePrice",
                Header: () => (
                  <div style={{ justifyContent: "center", display: "flex" }}>
                    {getValue("RelativeValue", getLang())}
                  </div>
                ),
                accessor: "relativePrice",
                sortType: (rowA, rowB) => {
                  if (rowA.original.relativePrice > rowB.original.relativePrice)
                    return -1;
                  if (rowB.original.relativePrice > rowA.original.relativePrice)
                    return 1;
                },
                Cell: (props) => {
                  if (props.value != null)
                    return (
                      <div
                        style={{ justifyContent: "center", display: "flex" }}
                      >
                        {parseFloat(props.value).toFixed(3)}
                      </div>
                    );
                  else return "";
                },
              },
            ],
          },
        ];

        setAwards(resp.data);
        setColumns(clm);
        setColumnsNew(clm_new);
        nbr_of_awards = resp.data.length;

        setNumberOfAwards(resp.data.length);
        $("#meanValueContainer").addClass("btn-glow");
        LoadingAlert("Hide");
      })
      .catch((e) => {
        LoadingAlert("Hide");
        console.log(e);
      });
  };

  const searchWithRegression = (AwardFilter, awardTypeSelectedValue, res) => {
    if (res === "1") {
      setUserEnforceB("1");
      AwardFilter.EnforeBPositive = "1";
    }else if(res === "0") {
      setUserEnforceB("0");
      AwardFilter.EnforeBPositive = "0";
    }
    else{
      AwardFilter.EnforeBPositive = "-1";
    }

    LoadingAlert("Show");
    setMethodTitle(getValue("AwardsByRegression", getLang()));
    APIFunctions.FilterValuations(AwardFilter)
      .then((response) => {
        if (!Array.isArray(response.data)) {
          AlertError(response.data);
          return;
        }
        if (response.data.length < 1) {
          Alert(getValue("NoDataToDisplay", getLang()));
          setAwards([]);
          setNumberOfAwards(0);
          var numberOfAwardsContainer =
            document.getElementById("numberOfAwards");
          if (
            typeof numberOfAwardsContainer != "undefined" &&
            numberOfAwardsContainer != null
          )
            document.getElementById("numberOfAwards").innerHTML = 0;
          var meanContainer = document.getElementById("meanValueContainer");
          if (typeof meanContainer != "undefined" && meanContainer != null)
            meanContainer.innerHTML = "Mean: 0";
          return;
        }

        var data = response.data;
        setAwardsWithMar(response.data);

        var hiddenData = data.filter((item) => item.isHidden);
        console.log("hidden data: ", hiddenData);
        setHiddenAwards(hiddenData);
        var arr = data.filter(
          (item) => item.isHidden == null || item.isHidden == false
        );
        data = arr;
        var arr_band_countries = [];
        for (var k = 0; k < data.length; k++) {
          arr_band_countries.push(data[k].bandCountry);
        }
        setArrayOfBandCountries(arr_band_countries);

        var min = Number.MAX_VALUE;
        for (var i = 0, l = data.length; i < l; i++) {
          min = Math.min(min, data[i].price);
        }

        var count = 0;
        if (min < 0) min = min * -1;
        if (min != 0) {
          while (min < 0.001) {
            min *= 10;
            count++;
          }
        }

        var CustomPriceHeader = "$/M/P";

        if (annualizePrices) {
          CustomPriceHeader += "/Y";
        }

        if (normalizeByGDPc) {
          CustomPriceHeader += "/GDPc x " + Math.pow(10, count);
          for (var i = 0, l = data.length; i < l; i++) {
            data[i].price *= Math.pow(10, count);
          }
          for (var i = 0, l = hiddenData.length; i < l; i++) {
            hiddenData[i].price *= Math.pow(10, count);
          }
        } else {
          CustomPriceHeader += " x 1";
        }

        setHiddenAwards(hiddenData);

        Header = CustomPriceHeader;
        setMyHeader(CustomPriceHeader);

        setMultiplier(Math.pow(10, count));
        multiplierRef.current = Math.pow(10, count);

        var count = data.length - 1;
        var mean = 0;
        var sum = 0;
        var nbr_of_awards = 0;
        for (var i = 1; i < data.length; i++) {
          sum += data[i].price;
        }

        mean = calculateMean(sum, count);
        nbr_of_awards = data.length - 1;
        setNumberOfAwards(data.length - 1);

        LoadingAlert("Hide");
        setColumns([]);
        setColumnsNew([]);
        setColumnsValuation([]);
        setAwards([]);
        setAwardsNew([]);
        var arrFiltered = [];

        data.forEach(function (element, index) {
          var commonAwards = data.filter(
            (x) =>
              x.countryName == element.countryName &&
              x.year == element.year &&
              x.band == element.band
          );
          if (
            !arrFiltered.some(
              (e) =>
                e.Year == element.year &&
                e.Band == element.band &&
                e.CountryName == element.countryName
            )
          ) {
            arrFiltered.push({
              CountryName: element.countryName,
              NumberOfAwards: element.numberOfAwards,
              Band: element.band,
              Year: element.year,
              MHZPrice: element.mhz,
              Price: element.price,
              CountryId: element.countryId,
            });
          }
        });
        setShowRegressions(true);
        // var arr = response.data;
        var valuatedCountry = [];
        valuatedCountry.push(arr[0]);
        setPopulationValue(arr[0].PopCovered);
        arr.shift();
        valuatedCountry[0].priceM =
          valuatedCountry[0].priceM == null
            ? ""
            : valuatedCountry[0].priceM;

        setRegressionValues(valuatedCountry);
        setShowRegressionFirstRow(true);

        var clmns = [];
        var columnsNew = [];
        var clm_regression = [];

        if (awardTypeSelectedValue == 0) {
          clmns = [
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
                          onChange={() => handleCheckboxToDeselect(rowId)}
                        />
                      </div>
                    );
                  },
                },
                {
                  id: "Country",
                  Header: getValue("Country", getLang()),
                  accessor: "countryName",
                },
                {
                  id: "POP",
                  Header: getValue("Pop", getLang()),
                  accessor: "pop",
                  Cell: (props) => {
                    if (props.value == null) return "";
                    if (Number.isInteger(props.value)) return props.value;
                    else return props.value.toFixed(3);
                  },
                },
              ],
            },
            {
              id: "GDPc",
              Header: "GDPc, $",
              accessor: "gdp",
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
              id: "awardDate",
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
              Header: "Price, $M",
              accessor: "upFrontFees",
              Cell: (props) => {
                if (
                  props.value != null &&
                  props.value != "" &&
                  props.value != 0
                )
                  return parseFloat(props.value).toFixed(2);
                else return "";
              },
            },
            {
              id: "Band",
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
                  sortType: (rowA, rowB) => {
                    if (rowA.original.price > rowB.original.price)
                      return -1;
                    if (rowB.original.price > rowA.original.price) return 1;
                  },
                  accessor: "price",
                  Cell: (props) => {
                    if (props.value != null && props.value != "")
                      return parseFloat(props.value).toFixed(3);
                    else return "";
                  },
                },
              ],
            },
          ];

          columnsNew = [
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
              id: "Country",
              Header: getValue("Country", getLang()),
              accessor: "countryName",
            },
            {
              id: "POP",
              Header: getValue("Pop", getLang()),
              accessor: "pop",
              Cell: (props) => {
                if (props.value == null) return "";
                if (Number.isInteger(props.value)) return props.value;
                else return props.value.toFixed(3);
              },
            },
            {
              id: "GDPc",
              Header: "GDPc, $",
              accessor: "gdp",
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
              id: "awardDate",
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
              id: "Band",
              Header: getValue("Bands", getLang()),
              accessor: "band",
            },
            {
              id: "Mhz",
              Header: CustomPriceHeader,
              sortType: (rowA, rowB) => {
                if (rowA.original.price > rowB.original.price) return -1;
                if (rowB.original.price > rowA.original.price) return 1;
              },
              accessor: "price",
              Cell: (props) => {
                if (props.value != null)
                  return parseFloat(props.value).toFixed(3);
                else return "";
              },
            },
          ];

          clm_regression = [
            {
              id: "Country",
              Header: getValue("Country", getLang()),
              accessor: "countryName",
            },
            {
              id: "Pop",
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
              id: "GDP",
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
              id: "Operator",
              Header: getValue("Operator", getLang()),
              accessor: "operatorName",
            },
            {
              id: "AwardDate",
              Header: getValue("AwardDate", getLang()),
              accessor: "year",
            },
            {
              id: "Price",
              Header: getValue("Price$M", getLang()),
              accessor: "upFrontFees",
              Cell: (props) => {
                if (
                  props.value != null &&
                  props.value != "0" &&
                  props.value != 0 &&
                  props.value != ""
                )
                  return props.value;
                else return "";
              },
            },
            {
              id: "Terms",
              Header: getValue("Term", getLang()),
              accessor: "terms",
              Cell: (props) => {
                if (props.value != null) return props.value;
                else return "";
              },
            },
            {
              id: "Bands",
              Header: getValue("Bands", getLang()),
              accessor: "band",
            },
            {
              id: "Mhz",
              Header: CustomPriceHeader,
              sortType: (rowA, rowB) => {
                if (rowA.original.price > rowB.original.price) return -1;
                if (rowB.original.price > rowA.original.price) return 1;
              },
              accessor: "price",
              Cell: (props) => {
                if (props.value != null)
                  return parseFloat(props.value).toFixed(3);
                else return "";
              },
            },
          ];
        } else {
          clmns = [
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
                          onChange={() => handleCheckboxToDeselect(rowId)}
                        />
                      </div>
                    );
                  },
                },
                {
                  id: "Country",
                  Header: getValue("Country", getLang()),
                  accessor: "countryName",
                },
                {
                  id: "POP",
                  Header: getValue("Pop", getLang()),
                  accessor: "pop",
                  Cell: (props) => {
                    if (props.value == null) return "";
                    if (Number.isInteger(props.value)) return props.value;
                    else return props.value.toFixed(3);
                  },
                },
              ],
            },
            {
              id: "GDPc",
              Header: "GDPc, $",
              accessor: "gdp",
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
              id: "awardDate",
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
              id: "Band",
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
                  sortType: (rowA, rowB) => {
                    if (rowA.original.price > rowB.original.price)
                      return -1;
                    if (rowB.original.price > rowA.original.price) return 1;
                  },
                  accessor: "price",
                  Cell: (props) => {
                    if (props.value != null && props.value != "")
                      return parseFloat(props.value).toFixed(3);
                    else return "";
                  },
                },
              ],
            },
          ];

          columnsNew = [
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
              id: "Country",
              Header: getValue("Country", getLang()),
              accessor: "countryName",
            },
            {
              id: "POP",
              Header: getValue("Pop", getLang()),
              accessor: "pop",
              Cell: (props) => {
                if (props.value == null) return "";
                if (Number.isInteger(props.value)) return props.value;
                else return props.value.toFixed(3);
              },
            },
            {
              id: "GDPc",
              Header: "GDPc, $",
              accessor: "gdp",
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
              id: "awardDate",
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
              id: "Band",
              Header: getValue("Bands", getLang()),
              accessor: "band",
            },
            {
              id: "Mhz",
              Header: CustomPriceHeader,
              sortType: (rowA, rowB) => {
                if (rowA.original.price > rowB.original.price) return -1;
                if (rowB.original.price > rowA.original.price) return 1;
              },
              accessor: "price",
              Cell: (props) => {
                if (props.value != null)
                  return parseFloat(props.value).toFixed(3);
                else return "";
              },
            },
          ];

          clm_regression = [
            {
              id: "Country",
              Header: getValue("Country", getLang()),
              accessor: "countryName",
            },
            {
              id: "Pop",
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
              id: "GDP",
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
              id: "AwardDate",
              Header: getValue("AwardDate", getLang()),
              accessor: "year",
            },
            {
              id: "Terms",
              Header: getValue("Term", getLang()),
              accessor: "terms",
              Cell: (props) => {
                if (props.value != null) return props.value;
                else return "";
              },
            },
            {
              id: "Bands",
              Header: getValue("Bands", getLang()),
              accessor: "band",
            },
            {
              id: "Mhz",
              Header: CustomPriceHeader,
              sortType: (rowA, rowB) => {
                if (rowA.original.price > rowB.original.price) return -1;
                if (rowB.original.price > rowA.original.price) return 1;
              },
              accessor: "price",
              Cell: (props) => {
                if (props.value != null)
                  return parseFloat(props.value).toFixed(3);
                else return "";
              },
            },
          ];
        }

        setColumns(clmns);
        setColumnsNew(columnsNew);
        setColumnsRegression(clm_regression);
        setAwards(arr);
        var arr2 = arr.map(function (val) {
          return val.gdp;
        });
      })
      .catch((e) => {
        LoadingAlert("Hide");
        console.log(e);
      });
  }

  const filterAwards = () => {
    setBtnShowClicked(true);
    setIsDistancingGlowed(false);
    setIsRegressionGlowed(false);
    $("#meanValueContainer").removeClass("btn-glow");

    var selectedCountries = [];
    var selectedBands = [];
    setShowValuationCase(false);
    setShowBenchmarks(false);
    setShowRegressions(false);
    setShowDistances(false);
    setShowDoDistancing(false);
    setShowRegressionFirstRow(false);
    setTempAwardsForRegressionPlot([]);

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
      if (bandOptionsList[i].term != "") {
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
    for (var i = 0, l = bandOptionsList.length; i < l; i++) {
      if (bandOptionsList[i].term != "") {
        if (parseFloat(bandOptionsList[i].term) <= 0) {
          AlertError(getValue("MinTermValue", getLang()));
          return;
        }
        if (parseFloat(bandOptionsList[i].term) > 40) {
          AlertError(getValue("MaxTermValue", getLang()));
          return;
        }
      }
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

    if (_selectedMethod == "Distance" && $("#ddlOutliers").val() != -1) {
      AlertError(getValue("DistanceOutliersError", getLang()))
      setAwards([]);
      setColumns([]);
      return;
    }

    if ($("#ddlOutliers").val() == 0) {
      if (
        upperPercentileValueSelected.trim() == "" ||
        lowerPercentileValueSelected.trim() == ""
      ) {
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
      if (regressionValue.trim() == "") {
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
      if (quartileValue.trim() == "") {
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
      if (standardDeviationValueAdded.trim() == "") {
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

    if (_selectedMethod == "Distance" && selectedBands.length > 1) {
      AlertError(getValue("DistancingBandValidation", getLang()));
      setAwards([]);
      setColumns([]);
      return;
    }

    if (selectedBands.length > 5) {
      AlertError("maximum is 5");
      setAwards([]);
      setColumns([]);
      return;
    }

    // Validations End

    setSelectedBands(selectedBands);
    var element = document.getElementById("table-content");
    element.scrollIntoView(true, { block: "start", inline: "nearest" });
    //SaveFilterResult();
    if (discountRateValue == "") setDiscountRate(null);
    if (termValue == "") setTermValue(null);

    AwardFilter.ISPPP = getPPP() == "true" ? true : false;
    AwardFilter.ISIMF = getIMF() == "true" ? true : false;
    AwardFilter.IsPairedAndUnPaired = pairedUnpaired;
    AwardFilter.IsPaired = paired;
    AwardFilter.IsUnPaired = unPaired;

    var awardTypeSelectedValue = $("#showResults").val();
    if (awardTypeSelectedValue == -1) AwardFilter.AverageSumPricesAndMHZ = true;
    else AwardFilter.AverageSumPricesAndMHZ = false;
    if (awardTypeSelectedValue == 1) AwardFilter.averageAwards = true;
    else AwardFilter.averageAwards = false;
    if (awardTypeSelectedValue == 0) AwardFilter.uniqueAwards = true;
    else AwardFilter.uniqueAwards = false;

    AwardFilter.regionalLicense = includeRegional;
    AwardFilter.FromYear = parseInt(fromDate);
    AwardFilter.ToYear = parseInt(toDate);
    AwardFilter.Lang = getLang();
    AwardFilter.minGDPValue = parseInt(minGDP);
    AwardFilter.maxGDPValue = parseInt(maxGDP);
    AwardFilter.MaxGDP = parseInt(maxGDP);
    AwardFilter.MinGDP = parseInt(minGDP);
    AwardFilter.discountRate = parseFloat(discountRateValue);
    AwardFilter.sumBand = $("#sumBands").val();

    AwardFilter.hasRegression = hasRegressionValue;
    AwardFilter.regression = parseInt(regressionValue);
    AwardFilter.HasPercentile = hasPercentileValue;
    AwardFilter.UpperPercentile = parseInt(upperPercentileValueSelected);
    AwardFilter.LowerPercentile = parseInt(lowerPercentileValueSelected);
    AwardFilter.HasQuartile = hasQuartileValue;
    AwardFilter.KValue = parseFloat(quartileValue);
    AwardFilter.HasStandardDeviation = hasStandardDeviation;
    AwardFilter.StandardDeviationValue = parseInt(standardDeviationValueAdded);
    AwardFilter.AutoFiltering = hasAutoFiltering;
    AwardFilter.AdjustByInflationFactor = adjustByInflation;
    AwardFilter.AdjustByGDPFactor = normalizeByGDPc;
    AwardFilter.AdjustByPPPFactor = adjustByPPPFactor;
    AwardFilter.AnnualizePrice = annualizePrices;
    AwardFilter.IsIncludeAnnual = addAnnualPayment;
    AwardFilter.IsSingle = singleBand;
    AwardFilter.IsMultiple = multiBand;
    AwardFilter.issueDate = parseInt($("#issueDate").val());

    if (_selectedMethod == "Distance") {
      AwardFilter.IsRegression = false;
      AwardFilter.IsBenchMark = false;
      AwardFilter.IsDistance = true;
    } else {
      if (_selectedMethod == "Regression") {
        AwardFilter.IsRegression = true;
        AwardFilter.IsBenchMark = false;
        AwardFilter.IsDistance = false;
      } else {
        AwardFilter.IsRegression = false;
        AwardFilter.IsBenchMark = true;
        AwardFilter.IsDistance = false;
      }
    }
    AwardFilter.CountryId = $("#valuatedCountry").val();
    AwardFilter.PopCovered = null;
    AwardFilter.EnforeBPositive = enforeBPositive;

    var bandsArray = [];
    var termsArray = [];
    var bandTermsArray = [];
    for (var i = 0; i < bandOptionsList.length; i++) {
      if (bandOptionsList[i].term != "") {
        bandsArray.push(bandOptionsList[i].value);
        termsArray.push(bandOptionsList[i].term);
        bandTermsArray.push({
          band: bandOptionsList[i].value,
          term: bandOptionsList[i].term,
        });
      }
    }
    AwardFilter.Band = bandsArray.join(",");
    AwardFilter.Terms = termsArray.join(",");
    AwardFilter.BandTerms = bandTermsArray;

    var value2 = [];
    var bandCount = [];
    var bandSum = [];
    var bandMean = [];
    var bandMedian = [];
    var bandValues = [];
    for (var i = 0, l = bandOptionsList.length; i < l; i++) {
      if (bandOptionsList[i].term != "") {
        value2.push(bandOptionsList[i].term);
        bandCount.push({
          band: bandOptionsList[i].value,
          count_value: 0,
        });
        bandSum.push({
          band: bandOptionsList[i].value,
          sum_value: 0,
        });
        bandMean.push({
          band: bandOptionsList[i].value,
          mean_value: 0,
        });
        bandMedian.push({
          band: bandOptionsList[i].value,
          median_value: 0,
        });
        bandValues.push({
          band: bandOptionsList[i].value,
          band_values: [],
        });
      }
    }

    var selectedCountries = [];
    for (var i = 0, l = options.length; i < l; i++) {
      if (options[i].isChecked) {
        selectedCountries.push(options[i].value);
      }
    }
    AwardFilter.countryIds = selectedCountries.join(",");
    AwardFilter.ShowMarkers = $("#showMarkers").val() == "1" ? true : false;

    var list = [];
    list.push(
      {
        id: 0,
        pageUrl: "Valuation",
        field: "FromYear",
        value: fromDate.toString(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Valuation",
        field: "ToYear",
        value: toDate.toString(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Valuation",
        field: "IssueDate",
        value: $("#issueDate").val(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Valuation",
        field: "valuatedCountry",
        value: $("#valuatedCountry").val(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Valuation",
        field: "awardTypeSelectedValue",
        value: $("#showResults").val(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Valuation",
        field: "discountRate",
        value: discountRateValue.toString(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Valuation",
        field: "population",
        value: "",
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Valuation",
        field: "AdjustByInflationFactor",
        value: adjustByInflation.toString(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Valuation",
        field: "AdjustByGDPFactor",
        value: normalizeByGDPc.toString(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Valuation",
        field: "AdjustByPPPFactor",
        value: adjustByPPPFactor.toString(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Valuation",
        field: "AnnualizePrice",
        value: annualizePrices.toString(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Valuation",
        field: "IsIncludeAnnual",
        value: addAnnualPayment.toString(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Valuation",
        field: "regression",
        value: regressionValue.toString(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Valuation",
        field: "UpperPercentile",
        value: upperPercentileValueSelected.toString(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Valuation",
        field: "LowerPercentile",
        value: lowerPercentileValueSelected.toString(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Valuation",
        field: "KValue",
        value: quartileValue.toString(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Valuation",
        field: "StandardDeviationValue",
        value: standardDeviationValueAdded.toString(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Valuation",
        field: "ddlOutliers",
        value: $("#ddlOutliers").val(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Valuation",
        field: "sumBand",
        value: $("#sumBands").val(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Valuation",
        field: "showMarkers",
        value: $("#showMarkers").val(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Valuation",
        field: "MinGDP",
        value: minGDP.toString(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Valuation",
        field: "MaxGDP",
        value: maxGDP.toString(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Valuation",
        field: "RegionalLicense",
        value: includeRegional.toString(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Valuation",
        field: "Paired",
        value: AwardFilter.IsPaired.toString(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Valuation",
        field: "IsUnPaired",
        value: AwardFilter.IsUnPaired.toString(),
        UserId: 0,
      },
      {
        id: 0,
        pageUrl: "Valuation",
        field: "IsPairedAndUnPaired",
        value: AwardFilter.IsPairedAndUnPaired.toString(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Valuation",
        field: "IsMultiple",
        value: AwardFilter.IsMultiple.toString(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Valuation",
        field: "IsSingle",
        value: AwardFilter.IsSingle.toString(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Valuation",
        field: "Bands",
        value: JSON.stringify(bandOptionsList),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Valuation",
        field: "Country",
        value: JSON.stringify(options),
        userId: 0,
      }
    );

    saveUserFilters(list);

    if (_selectedMethod == "Regression") {
      var AllowClientToChooseBePositive = localStorage.getItem("Spectre_AllowClientToChooseBePositive");// == "true";    
      if(AllowClientToChooseBePositive =="1") {
        searchWithRegression(AwardFilter,awardTypeSelectedValue, "1");
      }
      else if(AllowClientToChooseBePositive =="0"){
        searchWithRegression(AwardFilter,awardTypeSelectedValue, "0");
      }
      else{
        searchWithRegression(AwardFilter,awardTypeSelectedValue, "-1");
      }
    } else {
      LoadingAlert("Show");
      APIFunctions.FilterValuations(AwardFilter)
        .then((response) => {
          var data = response.data;

          if (!Array.isArray(data)) {
            AlertError(data);
            return;
          }
          console.log("data: ", response.data);
          var hiddenData = data.filter((item) => item.isHidden);

          setHiddenAwards(hiddenData);
          data = data.filter(
            (item) => item.isHidden == null || item.isHidden == false
          );

          var min = Number.MAX_VALUE;
          for (var i = 0, l = data.length; i < l; i++) {
            min = Math.min(min, data[i].price);
          }
          setAwardsWithMar(response.data);

          var arr_band_countries = [];
          for (var k = 0; k < data.length; k++) {
            arr_band_countries.push(data[k].bandCountry);
          }
          setArrayOfBandCountries(arr_band_countries);

          var count = 0;
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
            for (var i = 0, l = data.length; i < l; i++) {
              data[i].price *= Math.pow(10, count);
            }
          } else {
            CustomPriceHeader += " x 1";
          }

          Header = CustomPriceHeader;
          setMyHeader(CustomPriceHeader);

          if (!Array.isArray(data)) {
            AlertError(data);
            return;
          }
          if (data.length < 1) {
            setAwards([]);
            setNumberOfAwards(0);
            var numberOfAwardsContainer =
              document.getElementById("numberOfAwards");
            if (
              typeof numberOfAwardsContainer != "undefined" &&
              numberOfAwardsContainer != null
            )
              document.getElementById("numberOfAwards").innerHTML = 0;
            var meanContainer = document.getElementById("meanValueContainer");
            if (typeof meanContainer != "undefined" && meanContainer != null)
              meanContainer.innerHTML = "Mean: 0";
            Alert(getValue("NoDataToDisplay", getLang()));
            return;
          }

          var nbr_of_awards = data.length;
          setNumberOfAwards(data.length);
          LoadingAlert("Hide");
          setColumns([]);
          setColumnsNew([]);
          setColumnsValuation([]);
          setAwards([]);
          setAwardsNew([]);
          var arrFiltered = [];

          data.forEach(function (element, index) {
            var commonAwards = data.filter(
              (x) =>
                x.countryName == element.countryName &&
                x.year == element.year &&
                x.band == element.band
            );
            if (
              !arrFiltered.some(
                (e) =>
                  e.Year == element.year &&
                  e.Band == element.band &&
                  e.CountryName == element.countryName
              )
            ) {
              arrFiltered.push({
                CountryName: element.countryName,
                NumberOfAwards: element.numberOfAwards,
                Band: element.band,
                Year: element.year,
                MHZPrice: element.mhz,
                Price: element.price,
                CountryId: element.countryId,
                POP: element.pop,
                GDPc: element.gdp,
              });
            }
          });
          if (_selectedMethod == "Distance") {
            setMethodTitle(getValue("AwardsByDistance", getLang()));
            setShowDistances(true);

            var arr = data;
            setDistancingData(arr);
            var clmns = [
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
                    id: "checkBox",
                    Header: "",
                    Cell: (props) => {
                      const rowId = props.row.id;
                      const band = props.row.original.Band;
                      const country = props.row.original.CountryId;
                      const year = props.row.original.Year;
                      const countryId = props.row.original.CountryId;
                      const chkName = country + "_band_" + band;
                      var new_arr = arrFiltered.filter(function (el) {
                        return el.CountryName == country;
                      });
                      return (
                        <div>
                          <input
                            type="checkbox"
                            name={chkName + "[]"}
                            className="deselect"
                            onChange={() =>
                              handleCheckboxDistance(
                                chkName,
                                countryId,
                                band,
                                new_arr,
                                year,
                                rowId,
                                country
                              )
                            }
                            data-country={country}
                            data-band={band}
                            data-rowId={rowId}
                          />
                        </div>
                      );
                    },
                  },
                  {
                    id: "Country",
                    Header: getValue("Country", getLang()),
                    accessor: "CountryName",
                  },
                  {
                    Header: getValue("Pop", getLang()),
                    accessor: "POP",
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
                    accessor: "GDPc",
                    show: true,
                    Cell: (props) => {
                      if (props.value != null)
                        if (props.value == 0) {
                          return "";
                        } else {
                          return props.value
                            .toFixed(0)
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        }
                      else return "";
                    },
                  },
                ],
              },
              {
                id: "awardDate",
                Header: getValue("AwardDate", getLang()),
                accessor: "Year",
              },
              {
                id: "NumberOfAwards",
                Header: getValue("NumberOfAwards", getLang()),
                accessor: "NumberOfAwards",
              },
              {
                id: "Band",
                Header: getValue("Bands", getLang()),
                accessor: "Band",
              },
              {
                id: "Price",
                Header: CustomPriceHeader,
                accessor: "Price",
                sortType: (rowA, rowB) => {
                  if (rowA.original.Price > rowB.original.Price) return -1;
                  if (rowB.original.Price > rowA.original.Price) return 1;
                },
                Cell: (props) => {
                  if (props.value != null)
                    return parseFloat(props.value).toFixed(3);
                  else return "";
                },
              },
            ];

            const columnsNew = [
              {
                id: "checkBox",
                Header: "",
                Cell: (props) => {
                  const rowId = props.row.id;
                  const band = props.row.cells[2].value;
                  const country = props.row.cells[1].value;
                  const chkName = country + "_band_" + band;
                  var new_arr = arrFiltered.filter(function (el) {
                    return el.CountryName == country;
                  });
                  return (
                    <div>
                      <input
                        type="checkbox"
                        name={chkName + "[]"}
                        className="deselect"
                        onChange={() =>
                          handleCheckboxDistanceDeselect(
                            chkName,
                            country,
                            band,
                            new_arr,
                            rowId
                          )
                        }
                        data-country={country}
                        data-band={band}
                        data-rowId={rowId}
                      />
                    </div>
                  );
                },
              },
              {
                id: "Country",
                Header: getValue("Country", getLang()),
                accessor: "CountryName",
              },
              {
                Header: getValue("Pop", getLang()),
                accessor: "POP",
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
                accessor: "GDPc",
                show: true,
                Cell: (props) => {
                  if (props.value != null)
                    if (props.value == 0) {
                      return "";
                    } else {
                      return props.value
                        .toFixed(0)
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    }
                  else return "";
                },
              },
              {
                id: "awardDate",
                Header: getValue("AwardDate", getLang()),
                accessor: "Year",
              },
              {
                id: "NumberOfAwards",
                Header: getValue("NumberOfAwards", getLang()),
                accessor: "NumberOfAwards",
              },
              {
                id: "Band",
                Header: getValue("Bands", getLang()),
                accessor: "Band",
              },
              {
                id: "Price",
                Header: getValue("Price", getLang()),
                accessor: "Price",
                sortType: (rowA, rowB) => {
                  if (rowA.original.Price > rowB.original.Price) return -1;
                  if (rowB.original.Price > rowA.original.Price) return 1;
                },
                Cell: (props) => {
                  if (props.value != null)
                    return parseFloat(props.value).toFixed(3);
                  else return "";
                },
              },
            ];

            setColumns(clmns);
            setColumnsNew(columnsNew);

            setAwards(arrFiltered);

            var arr2 = arr.map(function (val) {
              return val.gdp;
            });
          } else {
            // value / benchmark
            setMethodTitle(getValue("AwardsByBenchmark", getLang()));
            setShowValuationCase(true);
            setShowBenchmarks(true);
            setShowDoDistancing(false);
            var arr = data;

            var clmns = [];
            var columnsNew = [];

            if (awardTypeSelectedValue == 0) {
              clmns = [
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
                              onChange={() => handleCheckboxToDeselect(rowId)}
                            />
                          </div>
                        );
                      },
                    },
                    {
                      id: "Country",
                      Header: getValue("Country", getLang()),
                      accessor: "countryName",
                    },
                    {
                      id: "POP",
                      Header: getValue("Pop", getLang()),
                      accessor: "pop",
                      Cell: (props) => {
                        if (props.value == null) return "";
                        if (Number.isInteger(props.value)) return props.value;
                        else return props.value.toFixed(3);
                      },
                    },
                  ],
                },
                {
                  id: "GDPc",
                  Header: "GDPc, $",
                  accessor: "gdp",
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
                  id: "awardDate",
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
                  Header: "Price, $M",
                  accessor: "upFrontFees",
                  Cell: (props) => {
                    if (props.value != null && props.value != "")
                      return parseFloat(props.value).toFixed(2);
                    else return "";
                  },
                },
                {
                  id: "Band",
                  Header: getValue("Bands", getLang()),
                  accessor: "band",
                },
              ];

              columnsNew = [
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
                  id: "Country",
                  Header: getValue("Country", getLang()),
                  accessor: "countryName",
                },
                {
                  id: "POP",
                  Header: getValue("Pop", getLang()),
                  accessor: "pop",
                  Cell: (props) => {
                    if (props.value == null) return "";
                    if (Number.isInteger(props.value)) return props.value;
                    else return props.value.toFixed(3);
                  },
                },
                {
                  id: "GDPc",
                  Header: "GDPc, $",
                  accessor: "gdp",
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
                  id: "awardDate",
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
                  id: "Band",
                  Header: getValue("Bands", getLang()),
                  accessor: "band",
                },
              ];
            } else {
              clmns = [
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
                              onChange={() => handleCheckboxToDeselect(rowId)}
                            />
                          </div>
                        );
                      },
                    },
                    {
                      id: "Country",
                      Header: getValue("Country", getLang()),
                      accessor: "countryName",
                    },
                    {
                      id: "POP",
                      Header: getValue("Pop", getLang()),
                      accessor: "pop",
                      Cell: (props) => {
                        if (props.value == null) return "";
                        if (Number.isInteger(props.value)) return props.value;
                        else return props.value.toFixed(3);
                      },
                    },
                  ],
                },
                {
                  id: "GDPc",
                  Header: "GDPc, $",
                  accessor: "gdp",
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
                  id: "awardDate",
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
                  id: "Band",
                  Header: getValue("Bands", getLang()),
                  accessor: "band",
                },
              ];

              columnsNew = [
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
                  id: "Country",
                  Header: getValue("Country", getLang()),
                  accessor: "countryName",
                },
                {
                  id: "POP",
                  Header: getValue("Pop", getLang()),
                  accessor: "pop",
                  Cell: (props) => {
                    if (props.value == null) return "";
                    if (Number.isInteger(props.value)) return props.value;
                    else return props.value.toFixed(3);
                  },
                },
                {
                  id: "GDPc",
                  Header: "GDPc, $",
                  accessor: "gdp",
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
                  id: "awardDate",
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
                  id: "Band",
                  Header: getValue("Bands", getLang()),
                  accessor: "band",
                },
              ];
            }

            var nbrOptions = 0;
            var clmns_with_header = [];
            clmns_with_header.push({
              Header: () => (
                <div
                  style={{ width: "5px" }}
                  className="td-separator-left"
                ></div>
              ),
              accessor: "SeparatorValuationMHZ",
              Cell: (props) => {
                $(".td-separator-right")
                  .parent()
                  .css("border-inline-end", "1px solid #dee2e6");
                $(".td-separator-left")
                  .parent()
                  .css("border-inline-start", "1px solid #dee2e6");
                return <div className="td-separator-left"></div>;
              },
            });
            for (var i = 0; i < bandOptionsList.length; i++) {
              if (bandOptionsList[i].term != "") {
                nbrOptions += 1;
                clmns_with_header.push({
                  id: bandOptionsList[i].value,
                  Header: bandOptionsList[i].value,
                  accessor: `value_${bandOptionsList[i].value}`,
                  className: "int",
                });
                columnsNew.push({
                  id: bandOptionsList[i].value,
                  Header: bandOptionsList[i].value,
                  accessor: `value_${bandOptionsList[i].value}`,
                });
              }
            }

            if (nbrOptions > 1) {
              clmns_with_header.push({
                id: "AllBands",
                Header: getValue("AllBands", getLang()),
                accessor: "allBands",
              });

              columnsNew.push({
                id: "AllBands",
                Header: getValue("AllBands", getLang()),
                accessor: "allBands",
              });
            }
            clmns.push({
              id: "mhz_price",
              Header: (
                <div className="td-separator-left force-ltr">
                  {CustomPriceHeader}
                </div>
              ),
              sortType: (rowA, rowB) => {
                if (rowA.original.price > rowB.original.price) return -1;
                if (rowB.original.price > rowA.original.price) return 1;
              },
              accessor: "mhz_price",
              disableSortBy: true,
              columns: clmns_with_header,
            });
            setColumns(clmns);
            setColumnsNew(columnsNew);

            data.forEach(function (element, index) {
              if (element.price != null) {
                data[index][`value_${element.band}`] = element.price.toFixed(3);
                data[index]["allBands"] = element.price.toFixed(3);

                // band count
                for (var i = 0; i < bandCount.length; i++) {
                  if (element.band == bandCount[i].band) {
                    var nbr = bandCount[i].count_value;
                    nbr += 1;
                    bandCount[i].count_value = nbr;
                  }
                }

                // band sum
                for (var i = 0; i < bandSum.length; i++) {
                  if (element.band == bandSum[i].band) {
                    var sum = parseFloat(bandSum[i].sum_value);
                    sum += parseFloat(element.price);
                    bandSum[i].sum_value = sum;
                  }
                }

                // band values
                for (var i = 0; i < bandValues.length; i++) {
                  if (element.band == bandValues[i].band) {
                    var val = element.price;
                    bandValues[i].band_values[
                      bandValues[i].band_values.length
                    ] = val;
                  }
                }
              } else {
                data[index][`value_${element.band}`] = "";
                data[index]["allBands"] = "";
              }
            });

            // mean
            for (var i = 0; i < bandCount.length; i++) {
              // var mean = bandSum[i].sum_value / bandCount[i].count_value;
              bandMean[i].mean_value = calculateMean(
                bandSum[i].sum_value,
                bandCount[i].count_value
              );
            }
            setAllBandsMean(bandMean);

            // median
            for (var i = 0; i < bandValues.length; i++) {
              bandMedian[i].median_value = calculateMedian(
                bandValues[i].band_values
              );
            }

            var clmns_valuation = [];
            var this_country_id = $("#valuatedCountry").val();
            var this_country_name = "";
            var this_country_pop = 0;
            var firstColHeader = "";
            for (var i = 0; i < options.length; i++) {
              if (options[i].value == this_country_id) {
                this_country_name = options[i].label;
                break;
              }
            }
            for (var i = 0; i < data.length; i++) {
              if (data[i].countryName == this_country_name) {
                this_country_pop = data[i].pop;
              }
            }
            firstColHeader = `${this_country_name}`;
            clmns_valuation.push({
              id: "firstCol",
              Header: firstColHeader,
              accessor: "firstCol",
            });
            for (i = 0; i < bandMedian.length; i++) {
              clmns_valuation.push({
                id: `id_${bandMedian[i].band}`,
                Header: bandMedian[i].band,
                accessor: `accessor_${bandMedian[i].band}`,
                className: "int",
              });
            }
            if (nbrOptions > 1) {
              clmns_valuation.push({
                id: "allBands",
                Header: getValue("AllBands", getLang()),
                accessor: "allBands",
              });
            }

            setColumnsValuation(clmns_valuation);

            var arr_first_col = [];
            arr_first_col.push({
              id: 0,
              firstCol: getValue("NumberOfAwards", getLang()),
            });
            arr_first_col.push({
              id: 1,
              firstCol: getValue("LicenseTerm", getLang()),
            });
            arr_first_col.push({
              id: 2,
              firstCol: getValue("PriceByMean", getLang()),
              //  firstCol: ()=> {return <div style={{color: "red"}}>{getValue("PriceByMean", getLang()) + " " + Header}</div>}
            });
            arr_first_col.push({
              id: 3,
              firstCol: getValue("PriceByMedian", getLang()),
              // firstCol:()=><bdi>{getValue("PriceByMedian", getLang()) + " " + Header}</bdi>
            });
            // arr_first_col.push({
            // id: 4,
            // firstCol: getValue("Population", getLang())
            // });

            var arr_valuation_values = [];
            for (i = 0; i < arr_first_col.length; i++) {
              if (i > 1) {
                arr_valuation_values.push({
                  id: i,
                  firstCol: (
                    <div>
                      {arr_first_col[i].firstCol}{" "}
                      <span dir="ltr">{Header}</span>{" "}
                    </div>
                  ),
                });
              } else {
                arr_valuation_values.push({
                  id: i,
                  firstCol: arr_first_col[i].firstCol,
                });
              }
            }

            var k = 0;
            arr_valuation_values.forEach(function (element, index) {
              if (k == 0) {
                var s = 0;
                for (var j = 0, m = 0; j < bandOptionsList.length; j++) {
                  if (bandOptionsList[j].term != "") {
                    arr_valuation_values[index][
                      `accessor_${bandOptionsList[j].value}`
                    ] = bandCount[m].count_value;
                    s = s + parseInt(bandCount[m].count_value);
                    m++;
                  }
                }
                arr_valuation_values[index]["allBands"] = s;
              } else {
                if (k == 1) {
                  var uniqueBands = [];
                  for (var j = 0; j < bandOptionsList.length; j++) {
                    if (bandOptionsList[j].term != "") {
                      arr_valuation_values[index][
                        `accessor_${bandOptionsList[j].value}`
                      ] = bandOptionsList[j].term;
                      uniqueBands[uniqueBands.length] = bandOptionsList[j].term;
                    }
                  }
                  uniqueBands = uniqueBands.filter(function (item, pos) {
                    return uniqueBands.indexOf(item) == pos;
                  });
                  var strBands = "";
                  for (j = 0; j < uniqueBands.length; j++) {
                    if (j == uniqueBands.length - 1) strBands += uniqueBands[j];
                    else strBands += uniqueBands[j] + " / ";
                  }
                  arr_valuation_values[index]["allBands"] = strBands;
                } else {
                  if (k == 2) {
                    for (var j = 0, m = 0; j < bandOptionsList.length; j++) {
                      if (bandOptionsList[j].term != "") {
                        arr_valuation_values[index][
                          `accessor_${bandOptionsList[j].value}`
                        ] = isNaN(bandMean[m].mean_value)
                          ? 0
                          : bandMean[m].mean_value;
                        m++;
                      }
                    }
                    var s_sum = 0;
                    var s_count = 0;
                    for (var j = 0; j < bandCount.length; j++) {
                      s_sum += parseFloat(bandSum[j].sum_value);
                      s_count += parseFloat(bandCount[j].count_value);
                    }
                    arr_valuation_values[index]["allBands"] = (
                      s_sum / s_count
                    ).toFixed(3);
                  } else {
                    if (k == 3) {
                      for (var j = 0, m = 0; j < bandOptionsList.length; j++) {
                        if (bandOptionsList[j].term != "") {
                          arr_valuation_values[index][
                            `accessor_${bandOptionsList[j].value}`
                          ] = isNaN(bandMedian[m].median_value)
                            ? 0
                            : bandMedian[m].median_value;
                          m++;
                        }
                      }
                      var arr_all_values = [];
                      for (var j = 0; j < bandValues.length; j++) {
                        var temp = bandValues[j].band_values;
                        var child = arr_all_values;
                        arr_all_values = child.concat(temp);
                      }
                      for (var j = 0; j < arr_all_values.length; j++) {
                        arr_all_values[j] = parseFloat(arr_all_values[j]);
                      }
                      // console.log(arr_all_values);
                      var median = 0;
                      arr_all_values.sort(function (a, b) {
                        return a - b;
                      });

                      var half = Math.floor(arr_all_values.length / 2);

                      if (arr_all_values.length % 2)
                        median = parseFloat(arr_all_values[half]);
                      else
                        median =
                          parseFloat(
                            arr_all_values[half - 1] + arr_all_values[half]
                          ) / 2.0;
                      arr_valuation_values[index]["allBands"] =
                        median.toFixed(3);
                    }
                    // else {
                    //     for(var j = 0;j < bandOptionsList.length; j++) {
                    //         if(bandOptionsList[j].term != '') {
                    //             arr_valuation_values[index][`accessor_${bandOptionsList[j].value}`] = populationValue;
                    //         }
                    //     }
                    //     arr_valuation_values[index]["allBands"] = populationValue;
                    // }
                  }
                }
              }
              k += 1;
            });

            setValuationValues(arr_valuation_values);

            let sum_of_awards = 0;
            for (var i = 0; i < data.length; i++) {
              sum_of_awards += data[i].price;
            }

            var arr_of_prices = data.map(function (val) {
              return val.price == null ? 0 : val.price.toFixed(3);
            });
            setPlotMean(calculateMean(sum_of_awards, data.length));
            setPlotMedian(calculateMedian(arr_of_prices));
            // setPlotLower();
            // setPlotUpper();

            setAwards(data);
            // var arr2 = arr.map(function (val) {
            // return val.gdp;
            // });
          }
        })
        .catch((e) => {
          LoadingAlert("Hide");
          console.log(e);
        });
    }
  };

  // useEffect(() => {
  //   APIFunctions.getAllCountries()
  //     .then((resp) => resp)
  //     .then((resp) => bindOptions(resp.data));
  // }, []);

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
    console.log(arr);
  };

  const bindOptions2 = (data) => {
    var arr = [];
    for (var i = 0, l = data.length; i < l; i++) {
      var ob = new Object();
      ob.label = data[i].nameEn;
      ob.labelAr = data[i].nameAr;
      // ob.label = getLang() == "ar" ? data[i].nameAr : data[i].nameEn;
      ob.value = data[i].countryId;
      ob.regionId = data[i].regionId;
      ob.isChecked = true;
      arr.push(ob);
    }
    setLstCountries(arr);
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
      columns: columnsValuation,
      data: valuationValues,
      initialState: {
        hiddenColumns: columnsValuation.map((column) => {
          if (column.show === false) return column.accessor || column.id;
        }),
      },
      autoResetSortBy: false,
      autoResetPage: false,
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

  const regressionTable = useTable(
    {
      columns: columnsRegression,
      data: regressionValues,
      initialState: {
        hiddenColumns: columnsRegression.map((column) => {
          if (column.show === false) return column.accessor || column.id;
        }),
      },
    },
    useSortBy,
    usePagination
  );

  const {
    getTableProps: getRegressionTableProps,
    getTableBodyProps: getRegressionTableBodyProps,
    headerGroups: regressionHeaderGroups,
    page: regressionPage,
    nextPage: regressionNextPage,
    previousPage: regressionPreviousPage,
    canNextPage: regressionCanNextPage,
    canPreviousPage: regressionCanPreviousPage,
    pageOptions: regressionPageOptions,
    gotoPage: regressionGotoPage,
    pageCount: regressionPageCount,
    setPageSize: regressionSetPageSize,
    state: regressionState,
    prepareRow: regressionPrepareRow,
  } = regressionTable;

  const deselectedTable = useTable(
    {
      columns: columnsNew,
      data: awardsNew,
      initialState: {
        hiddenColumns: columnsValuation.map((column) => {
          if (column.show === false) return column.accessor || column.id;
        }),
      },
      autoResetSortBy: false,
      autoResetPage: false,
    },
    useSortBy,
    usePagination
  );

  const {
    getTableProps: getDeselectedTableProps,
    getTableBodyProps: getDeselectedTableBodyProps,
    headerGroups: deselectedHeaderGroups,
    page: deselectedPage,
    nextPage: deselectedNextPage,
    previousPage: deselectedPreviousPage,
    canNextPage: deselectedCanNextPage,
    canPreviousPage: deselectedCanPreviousPage,
    pageOptions: deselectedPageOptions,
    gotoPage: deselectedGotoPage,
    pageCount: deselectedPageCount,
    setPageSize: deselectedSetPageSize,
    state: deselectedState,
    prepareRow: deselectedPrepareRow,
  } = deselectedTable;

  const { pageIndex } = firstState;
  const deselectedPageIndex = deselectedState.pageIndex;

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

  const bindOptionsBand = (data) => {
    var arr = [];
    for (var i = 0, l = data.length; i < l; i++) {
      var ob = new Object();
      ob.label = data[i].value;
      ob.value = data[i].value;
      data[i].value == 700 ? (ob.term = "15") : (ob.term = "");
      arr.push(ob);
    }
    setSelectedBandsOptions(arr);
  };

  useEffect(() => {
    APIFunctions.getAllBands()
      .then((resp) => resp)
      .then((resp) => bindOptionsBand(resp.data));
  }, []);

  useEffect(() => {
    $(".menuItems").removeClass("active");
    $("#Valuations_page").addClass("active");
  });

  const renderBands = () => {
    var bands = bandOptionsList;
    if (bands != null && bands.length > 0) {
      {
        return bands.map((val, idx) => (
          <div className="form-group">
            <label>
            <span style={{ width: '36px' }}>
                {val.value}
              </span>
              <input
                type="number"
                checked={getBandTerm(val.value)}
                value={getBandTerm(val.value)}
                min="0"
                max="40"
                onChange={(e) => setBandTerm(val.value, e.target.value)}
              />
            </label>
          </div>
        ));
      }
    }
  };

  const setBandTerm = (id, _term) => {
    var data = bandOptionsListRef.current;
    var item = data.filter((item) => item.value == id);
    if (item.length > 0) {
      var itemIndex = data.indexOf(item[0]);
      data = data.filter((item) => item.value != id);
      data.splice(itemIndex, 0, {
        value: id,
        term: _term,
        label: item[0].label,
      });

      setSelectedBandsOptions(data);
    }
  };

  const getBandTerm = (id) => {
    var term = "";
    var allData = bandOptionsList;
    if (allData.length > 0) {
      var obj = allData.filter((item) => {
        if (item.value == id) {
          return item;
        }
      });

      term = obj[0].term;
    }
    return term;
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
       if(item[0] != null) data.splice(itemIndex, 0, { value: id, isChecked: isChecked, label: item[0].label, labelAr: item[0].labelAr, regionId: item[0].regionId });
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

  function prepareMarkup(chartSvg, markup) {
    return (
      '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="820px" height="420px">' +
      `${markup}<g transform="translate(305,12)">${chartSvg}</g></svg>`
    );
  }

  const exportToPDF = () => {
    var bandsArray = [];
    var termsArray = [];
    var bandTermsArray = [];
    for (var i = 0; i < bandOptionsList.length; i++) {
      if (bandOptionsList[i].term != "") {
        bandsArray.push(bandOptionsList[i].value);
        if (bandOptionsList[i].term != "")
          termsArray.push(bandOptionsList[i].term);
        bandTermsArray.push({
          band: bandOptionsList[i].value,
          term: bandOptionsList[i].term,
        });
      }
    }

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
    AwardFilter.Band = bandsArray.join(",");
    AwardFilter.issueDate = parseInt($("#issueDate").val());
    var awardTypeSelectedValue = $("#showResults").val();
    if (awardTypeSelectedValue == -1) AwardFilter.AverageSumPricesAndMHZ = true;
    else AwardFilter.AverageSumPricesAndMHZ = false;
    if (awardTypeSelectedValue == 1) AwardFilter.averageAwards = true;
    else AwardFilter.averageAwards = false;
    if (awardTypeSelectedValue == 0) AwardFilter.uniqueAwards = true;
    else AwardFilter.uniqueAwards = false;
    AwardFilter.discountRate = discountRateValue;
    AwardFilter.term = termsArray.join(",");
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
    if (mySelectedMethod == "Benchmark") {
      LoadingAlert("Show");

      setFilters(AwardFilter);
      _exportedFilters = AwardFilter;

      var country = $("#valuatedCountry option:selected").text();
      setValuatedCountryTxt(country);

      ShowPlot(0);

      setTimeout(() => {
        var _svg = chartBenchmarkRef.current.instance.svg();
        setSVG(_svg);
        setisExportPDF(true);
        setTimeout(() => {
          setIsOpen(false);
          setisExportPDF(false);
        }, 300);
      }, 3000);
    } else if (mySelectedMethod == "Distance") {
      LoadingAlert("Show");
      ShowPlot(2);
      setFilters(AwardFilter);
      _exportedFilters = AwardFilter;
      var country = $("#valuatedCountry option:selected").text();
      setValuatedCountryTxt(country);

      setTimeout(() => {
        var _svg = distanceRef.current.instance.svg();
        setSVG(_svg);
        setIsDistanceExported(true);
        setTimeout(() => {
          setIsOpenDistancing(false);
          setIsDistanceExported(false);
        }, 500);
      }, 3000);
    } else {
      LoadingAlert("Show");
      setFilters(AwardFilter);
      _exportedFilters = AwardFilter;
      var country = $("#valuatedCountry option:selected").text();
      setValuatedCountryTxt(country);

      ShowPlot(1);

      setTimeout(() => {
        var _svg = regRef.current.instance.svg();
        setSVG(_svg);
        setIsValuationExport(true);
        setTimeout(() => {
          setIsOpenNumeric(false);
          setIsValuationExport(false);
        }, 300);
      }, 3000);
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
      setHasAutoFiltering(false);
      setHasQuartileValue(false);
      sethasStandardDeviation(false);
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
      setHasAutoFiltering(false);
      setHasRegressionValue(false);
      setHasPercentileValue(false);
      sethasStandardDeviation(false);
    } else if (val == 3) {
      setRegressionVisibilityValue("none");
      setLowerPercentileValue("none");
      setUpperPercentileValue("none");
      setquatileVisibiltyValue("none");
      setstandardDeviationValue("block");
      setHasAutoFiltering(false);
      setHasQuartileValue(false);
      setHasRegressionValue(false);
      setHasPercentileValue(false);
      sethasStandardDeviation(true);
    } else if (val == 4) {
      setRegressionVisibilityValue("none");
      setLowerPercentileValue("none");
      setUpperPercentileValue("none");
      setquatileVisibiltyValue("none");
      setstandardDeviationValue("none");
      setHasAutoFiltering(true);
      setHasQuartileValue(false);
      setHasRegressionValue(false);
      setHasPercentileValue(false);
      sethasStandardDeviation(false);
      
    } else {
      setRegressionVisibilityValue("none");
      setLowerPercentileValue("none");
      setUpperPercentileValue("none");
      setquatileVisibiltyValue("none");
      setstandardDeviationValue("none");
      setHasAutoFiltering(false);
      setHasQuartileValue(false);
      setHasRegressionValue(false);
      setHasPercentileValue(false);
      sethasStandardDeviation(false);
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

  const renderValuatedCountries = () => {
    var countries = lstCountries;
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
          <option value={val.value}>
            {getLang() == "ar" ? val.labelAr : val.label}
          </option>
        ));
      }
    }
  };

  const saveUserFilters = (list) => {
    APIFunctions.saveUserFilters(list)
      .then((resp) => resp)
      .then((resp) => console.log(resp));
  };

  const checkIfCanOpen = (target) => {
    if (target == "countrySelection") {
      setIsOpen5(true);
    }
  };

  const getUserFilters = () => {
    //LoadingAlert("Show");
    APIFunctions.getUserFilters("Valuation")
      .then((resp) => resp)
      .then((resp) => {
        var data = resp.data;
        if (data.length > 0) {
          var fromYear = data.filter((item) => item.field == "FromYear");
          var toYear = data.filter((item) => item.field == "ToYear");
          var issueDate = data.filter((item) => item.field == "IssueDate");
          var valuatedCountry = data.filter(
            (item) => item.field == "valuatedCountry"
          );
          var population = data.filter((item) => item.field == "population");
          var awardTypeSelectedValue = data.filter(
            (item) => item.field == "awardTypeSelectedValue"
          );
          var discountRate = data.filter(
            (item) => item.field == "discountRate"
          );
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
          var showMarkersVal = data.filter(
            (item) => item.field == "showMarkers"
          );
          setMinGDP(minGDP[0].value);
          setMaxGDP(maxValue[0].value);
          setPopulationValue(population[0].value);
          setPaired(paired[0].value == "true" ? true : false);
          setUnPaired(unPaired[0].value == "true" ? true : false);
          setPairedUnPaired(pairedUnpaired[0].value == "true" ? true : false);
          setIncludeRegional(regionalLicense[0].value == "true" ? true : false);
          setMultiBand(multiple[0].value == "true" ? true : false);
          setSingleBand(single[0].value == "true" ? true : false);
          var tempBands = JSON.parse(bands[0].value);
          for (var i = 0; i < tempBands.length; i++) {
            setBandTerm(tempBands[i].value, tempBands[i].term);
          }
          var tempCountries = JSON.parse(countries[0].value);
          tempCountries.forEach(function (val) {
            setCountryChecked(val.value, val.isChecked, val.regionId ? val.regionId : -1);
          });
          // setoptions(tempCountries);
          setFromDate(fromYear[0].value);
          setToDate(toYear[0].value);
          $("#issueDate").val(issueDate[0].value);
          $("#valuatedCountry").val(valuatedCountry[0].value);
          $("#showResults").val(awardTypeSelectedValue[0].value);
          setDiscountRate(discountRate[0].value);
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
          $("#showMarkers").val(
            typeof showMarkersVal[0] !== "undefined"
              ? showMarkersVal[0].value
              : 0
          );

          var _data = JSON.parse(countries[0].value);
          var lstChecked = _data.filter((x) => x.isChecked == true).length;
          var lst = _data.length;
          var value = lstChecked == lst ? true : false;
          if (lstChecked == 0) setCheckAll(false);
          else {
            var value = lstChecked == lst ? true : false;
            setCheckAll(value);
          }
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

        //LoadingAlert("Hide");
      });
  };

  const checkIfCanView = (m) => {
    setMySelectedMethod(m);
    _selectedMethod = m;
    // _selectedMethod == "Regression" ? $("#refreshBtn").prop('disabled', false): $("#refreshBtn").prop('disabled', true);
    // _selectedMethod == "Distance" ? $("#plotBtn").prop('disabled', true) : $("#plotBtn", false);

    APIFunctions.checkIfCanView("Valuations")
      .then((response) => {
        setMySelectedMethod(m);
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

  function deselectedGridVisibility() {
    $(".deselected-grid").is(":visible")
      ? $(".deselected-grid").hide()
      : $(".deselected-grid").show();
    deselectedIndicator == true
      ? setDeselectedIndicator(false)
      : setDeselectedIndicator(true);
  }

  const performRecal = () => {
    setIsRegressionGlowed(false);
    setTempAwardsForRegressionPlot([]);
    LoadingAlert("Show");
    var data = new Object();
    data.AwardsFiltered = awards;
    data.CountryId = $("#valuatedCountry").val();
    data.PopCovered = null;
    data.Lang = getLang();
    data.EnforeBPositive = userEnforceB;
    data.IssueDate = parseInt($("#issueDate").val());
    data.IsPPP = getPPP() == "true" ? true : false;
    data.IsIMF = getIMF() == "true" ? true : false;

    var bandsArray = [];
    var termsArray = [];
    var bandTermsArray = [];
    for (var i = 0; i < bandOptionsList.length; i++) {
      if (bandOptionsList[i].term != "") {
        bandsArray.push(bandOptionsList[i].value);
        termsArray.push(bandOptionsList[i].term);
        bandTermsArray.push({
          band: bandOptionsList[i].value,
          term: bandOptionsList[i].term,
        });
      }
    }
    data.Band = bandsArray.join(",");
    data.Terms = termsArray.join(",");

    APIFunctions.recalculateValuation(data)
      .then((response) => {
        recalculateRegression(response);
        LoadingAlert("Hide");
      })
      .catch((e) => {
        LoadingAlert("Hide");
        console.log(e);
      });
  };

  function recalculateRegression(response) {
    _selectedMethod = "Regression";
    if (!Array.isArray(response.data)) {
      AlertError(response.data);
      setNumberOfAwards(0);
      document.getElementById("numberOfAwards").innerHTML = 0;
      document.getElementById("meanValueContainer").innerHTML = "Mean: 0";
      return;
    }
    if (response.data.length < 1) {
      Alert(getValue("NoDataToDisplay", getLang()));
      setAwards([]);
      setNumberOfAwards(0);
      var numberOfAwardsContainer = document.getElementById("numberOfAwards");
      if (
        typeof numberOfAwardsContainer != "undefined" &&
        numberOfAwardsContainer != null
      )
        document.getElementById("numberOfAwards").innerHTML = 0;
      var meanContainer = document.getElementById("meanValueContainer");
      if (typeof meanContainer != "undefined" && meanContainer != null)
        meanContainer.innerHTML = "Mean: 0";
      return;
    }
    if (!Array.isArray(response.data)) {
      AlertError(response.data);
      return;
    }
    if (response.data.length < 1) {
      console.log(response.data);
      Alert(getValue("NoDataToDisplay", getLang()));
      setAwards([]);
      setNumberOfAwards(0);
      var numberOfAwardsContainer = document.getElementById("numberOfAwards");
      if (
        typeof numberOfAwardsContainer != "undefined" &&
        numberOfAwardsContainer != null
      )
        document.getElementById("numberOfAwards").innerHTML = 0;
      var meanContainer = document.getElementById("meanValueContainer");
      if (typeof meanContainer != "undefined" && meanContainer != null)
        meanContainer.innerHTML = "Mean: 0";
      return;
    }
    var data = response.data;
    setAwardsWithMar(response.data);

    var hiddenData = data.filter((item) => item.isHidden);
    console.log("hidden data: ", hiddenData);
    setHiddenAwards(hiddenData);
    var arr = data.filter(
      (item) => item.isHidden == null || item.isHidden == false
    );
    data = arr;
    var arr_band_countries = [];
    for (var k = 0; k < data.length; k++) {
      arr_band_countries.push(data[k].bandCountry);
    }
    setArrayOfBandCountries(arr_band_countries);

    var min = Number.MAX_VALUE;
    for (var i = 0, l = data.length; i < l; i++) {
      min = Math.min(min, data[i].price);
    }

    var count = 0;
    console.log(min);
    if (min < 0) min = min * -1;
    if (min != 0) {
      while (min < 0.001) {
        min *= 10;
        count++;
      }
    }

    var CustomPriceHeader = "$/M/P";

    if (annualizePrices) {
      CustomPriceHeader += "/Y";
    }

    if (normalizeByGDPc) {
      CustomPriceHeader += "/GDPc x " + Math.pow(10, count);
      for (var i = 0, l = data.length; i < l; i++) {
        data[i].price *= Math.pow(10, count);
      }
    } else {
      CustomPriceHeader += " x 1";
    }

    console.log("math.pow: ", Math.pow(10, count));
    Header = CustomPriceHeader;
    CustomPriceHeader = myHeader;
    // setMyHeader(CustomPriceHeader);

    setMultiplier(Math.pow(10, count));
    multiplierRef.current = Math.pow(10, count);

    var count = data.length - 1;
    var mean = 0;
    var sum = 0;
    var nbr_of_awards = 0;
    for (var i = 1; i < data.length; i++) {
      sum += data[i].price;
    }

    mean = calculateMean(sum, count);
    nbr_of_awards = data.length - 1;
    setNumberOfAwards(data.length - 1);

    LoadingAlert("Hide");
    setColumns([]);
    setColumnsNew([]);
    setColumnsValuation([]);
    setAwards([]);
    setAwardsNew([]);
    setTempAwardsForRegressionPlot([]);
    var arrFiltered = [];

    data.forEach(function (element, index) {
      var commonAwards = data.filter(
        (x) =>
          x.countryName == element.countryName &&
          x.year == element.year &&
          x.band == element.band
      );
      if (
        !arrFiltered.some(
          (e) =>
            e.Year == element.year &&
            e.Band == element.band &&
            e.CountryName == element.countryName
        )
      ) {
        arrFiltered.push({
          CountryName: element.countryName,
          NumberOfAwards: element.numberOfAwards,
          Band: element.band,
          Year: element.year,
          MHZPrice: element.mhz,
          Price: element.price,
          CountryId: element.countryId,
        });
      }
    });
    setShowRegressions(true);
    // var arr = response.data;
    var valuatedCountry = [];
    valuatedCountry.push(arr[0]);
    setPopulationValue(arr[0].PopCovered);
    arr.shift();
    valuatedCountry[0].priceM =
      valuatedCountry[0].priceM == null ? "" : valuatedCountry[0].priceM;
    console.log("valuated country: ", valuatedCountry);
    setRegressionValues(valuatedCountry);
    setShowRegressionFirstRow(true);

    var clmns = [];
    var columnsNew = [];
    var clm_regression = [];

    console.log("awards ref .length: ", awardsRef.length);
    var awardTypeSelectedValue = $("#showResults").val();
    if (awardTypeSelectedValue == 0) {
      clmns = [
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
                      onChange={() => handleCheckboxToDeselect(rowId)}
                    />
                  </div>
                );
              },
            },
            {
              id: "Country",
              Header: getValue("Country", getLang()),
              accessor: "countryName",
            },
            {
              id: "POP",
              Header: getValue("Pop", getLang()),
              accessor: "pop",
              Cell: (props) => {
                if (props.value == null) return "";
                if (Number.isInteger(props.value)) return props.value;
                else return props.value.toFixed(3);
              },
            },
          ],
        },
        {
          id: "GDPc",
          Header: "GDPc, $",
          accessor: "gdp",
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
          id: "awardDate",
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
          Header: "Price, $M",
          accessor: "upFrontFees",
          Cell: (props) => {
            if (props.value != null && props.value != "" && props.value != 0)
              return parseFloat(props.value).toFixed(2);
            else return "";
          },
        },
        {
          id: "Band",
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
              sortType: (rowA, rowB) => {
                if (rowA.original.price > rowB.original.price) return -1;
                if (rowB.original.price > rowA.original.price) return 1;
              },
              accessor: "price",
              Cell: (props) => {
                if (props.value != null && props.value != "")
                  return parseFloat(props.value).toFixed(3);
                else return "";
              },
            },
          ],
        },
      ];

      columnsNew = [
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
          id: "Country",
          Header: getValue("Country", getLang()),
          accessor: "countryName",
        },
        {
          id: "POP",
          Header: getValue("Pop", getLang()),
          accessor: "pop",
          Cell: (props) => {
            if (props.value == null) return "";
            if (Number.isInteger(props.value)) return props.value;
            else return props.value.toFixed(3);
          },
        },
        {
          id: "GDPc",
          Header: "GDPc, $",
          accessor: "gdp",
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
          id: "awardDate",
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
          id: "Band",
          Header: getValue("Bands", getLang()),
          accessor: "band",
        },
        {
          id: "Mhz",
          Header: CustomPriceHeader,
          sortType: (rowA, rowB) => {
            if (rowA.original.price > rowB.original.price) return -1;
            if (rowB.original.price > rowA.original.price) return 1;
          },
          accessor: "price",
          Cell: (props) => {
            if (props.value != null) return parseFloat(props.value).toFixed(3);
            else return "";
          },
        },
      ];

      clm_regression = [
        {
          id: "Country",
          Header: getValue("Country", getLang()),
          accessor: "countryName",
        },
        {
          id: "Pop",
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
          id: "GDP",
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
          id: "Operator",
          Header: getValue("Operator", getLang()),
          accessor: "operatorName",
        },
        {
          id: "AwardDate",
          Header: getValue("AwardDate", getLang()),
          accessor: "year",
        },
        {
          id: "Price",
          Header: getValue("Price$M", getLang()),
          accessor: "upFrontFees",
          Cell: (props) => {
            console.log("props.value: ", props.value);
            if (
              props.value != null &&
              props.value != "0" &&
              props.value != 0 &&
              props.value != ""
            )
              return props.value;
            else return "";
          },
        },
        {
          id: "Terms",
          Header: getValue("Term", getLang()),
          accessor: "terms",
          Cell: (props) => {
            if (props.value != null) return props.value;
            else return "";
          },
        },
        {
          id: "Bands",
          Header: getValue("Bands", getLang()),
          accessor: "band",
        },
        {
          id: "Mhz",
          Header: CustomPriceHeader,
          sortType: (rowA, rowB) => {
            if (rowA.original.price > rowB.original.price) return -1;
            if (rowB.original.price > rowA.original.price) return 1;
          },
          accessor: "price",
          Cell: (props) => {
            if (props.value != null) return parseFloat(props.value).toFixed(3);
            else return "";
          },
        },
      ];
    } else {
      clmns = [
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
                      onChange={() => handleCheckboxToDeselect(rowId)}
                    />
                  </div>
                );
              },
            },
            {
              id: "Country",
              Header: getValue("Country", getLang()),
              accessor: "countryName",
            },
            {
              id: "POP",
              Header: getValue("Pop", getLang()),
              accessor: "pop",
              Cell: (props) => {
                if (props.value == null) return "";
                if (Number.isInteger(props.value)) return props.value;
                else return props.value.toFixed(3);
              },
            },
          ],
        },
        {
          id: "GDPc",
          Header: "GDPc, $",
          accessor: "gdp",
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
          id: "awardDate",
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
          id: "Band",
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
              sortType: (rowA, rowB) => {
                if (rowA.original.price > rowB.original.price) return -1;
                if (rowB.original.price > rowA.original.price) return 1;
              },
              accessor: "price",
              Cell: (props) => {
                if (props.value != null && props.value != "")
                  return parseFloat(props.value).toFixed(3);
                else return "";
              },
            },
          ],
        },
      ];

      columnsNew = [
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
          id: "Country",
          Header: getValue("Country", getLang()),
          accessor: "countryName",
        },
        {
          id: "POP",
          Header: getValue("Pop", getLang()),
          accessor: "pop",
          Cell: (props) => {
            if (props.value == null) return "";
            if (Number.isInteger(props.value)) return props.value;
            else return props.value.toFixed(3);
          },
        },
        {
          id: "GDPc",
          Header: "GDPc, $",
          accessor: "gdp",
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
          id: "awardDate",
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
          id: "Band",
          Header: getValue("Bands", getLang()),
          accessor: "band",
        },
        {
          id: "Mhz",
          Header: CustomPriceHeader,
          sortType: (rowA, rowB) => {
            if (rowA.original.price > rowB.original.price) return -1;
            if (rowB.original.price > rowA.original.price) return 1;
          },
          accessor: "price",
          Cell: (props) => {
            if (props.value != null) return parseFloat(props.value).toFixed(3);
            else return "";
          },
        },
      ];

      clm_regression = [
        {
          id: "Country",
          Header: getValue("Country", getLang()),
          accessor: "countryName",
        },
        {
          id: "Pop",
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
          id: "GDP",
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
          id: "AwardDate",
          Header: getValue("AwardDate", getLang()),
          accessor: "year",
        },
        {
          id: "Terms",
          Header: getValue("Term", getLang()),
          accessor: "terms",
          Cell: (props) => {
            if (props.value != null) return props.value;
            else return "";
          },
        },
        {
          id: "Bands",
          Header: getValue("Bands", getLang()),
          accessor: "band",
        },
        {
          id: "Mhz",
          Header: CustomPriceHeader,
          sortType: (rowA, rowB) => {
            if (rowA.original.price > rowB.original.price) return -1;
            if (rowB.original.price > rowA.original.price) return 1;
          },
          accessor: "price",
          Cell: (props) => {
            if (props.value != null) return parseFloat(props.value).toFixed(3);
            else return "";
          },
        },
      ];
    }

    setColumns(clmns);
    setColumnsNew(columnsNew);
    setColumnsRegression(clm_regression);
    setAwards(arr);
    var arr2 = arr.map(function (val) {
      return val.gdp;
    });
  }

  function inputNumberCheck(e) {
    if (e.which == 69 || e.which == 187 || e.which == 189 || e.which == 109) {
      e.preventDefault();
    }
  }

  function customizePoint(arg) {
    if (arg.data.isValuated) {
      return { color: "#ff7c7c", hoverStyle: { color: "#ff7c7c" } };
    } else {
      return { color: "#0074D9", hoverStyle: { color: "#0074D9" } };
    }
  }

  function customizeTooltip(pointInfo) {
    let thisCountry = pointInfo.point.data.countryName;
    var txt = "";
    if (thisCountry == $("#valuatedCountry option:selected").text()) {
      var txt =
        pointInfo.point.data.bandCountry +
        "(" +
        $("#issueDate").val() +
        ") " +
        pointInfo.point.data.price.toFixed(3).toString();
    } else {
      var txt =
        pointInfo.point.data.bandCountry +
        " " +
        pointInfo.point.data.price.toFixed(3).toString();
    }
    return { text: txt };
  }
  function customizeTooltip2(pointInfo) {
    var txt =
      pointInfo.point.data.countryName +
      "  " +
      pointInfo.point.data.price.toString();
    return { text: txt };
  }
  function customizeTooltip3(pointInfo) {
    let thisCountry = pointInfo.point.data.countryName;
    var txt = "";
    var points = pointInfo.points;
    if (
      pointInfo.point.data.bandCountry === undefined ||
      pointInfo.point.data.bandCountry === "undefined" ||
      pointInfo.point.data.bandCountry === null ||
      pointInfo.point.data.bandCountry === ""
    ) {
      txt = myHeader + ": " + points[0].value.toFixed(3);
      // getValue("RegressionLine", getLang()) +
      // ": " +
      // points[1].value.toFixed(3);
    } else {
      txt =
        myHeader +
        ": " +
        points[0].value.toFixed(3) +
        "\n" +
        // getValue("RegressionLine", getLang()) +
        // ": " +
        pointInfo.point.data.bandCountry;
      // " " +
      // points[1].value.toFixed(3);
    }
    return { text: txt };
  }

  function getLabels(pointInfo) {
    var pointValue = parseInt(pointInfo.value);
    var item = chartBenchmarkData.filter(
      (item) => item.index == pointInfo.value
    );
    if (item.length >= 0) {
      return item[0].bandCountry;
    } else {
      return "";
    }
  }

  function customizeTextRegression(axisValue) {
    return axisValue.value;
  }

  function saveYScaleValuesBenchmarks() {
    let newMinVal = parseFloat($("#yScaleMinValBenchmark").val());
    let newMaxVal = parseFloat($("#yScaleMaxValBenchmark").val());
    if (newMinVal < newMaxVal) {
      setPlotMinValBenchmark(newMinVal);
      setPlotMaxValBenchmark(newMaxVal);
      setYScaleMaxValBenchmarkErr(false);
      setYScaleMinValBenchmarkErr(false);
    } else {
      if (newMinVal == "" || isNaN(newMinVal)) {
        setYScaleMinValBenchmarkErr(true);
      } else {
        if (newMinVal >= newMaxVal) {
          setYScaleMinValBenchmarkErr(true);
        } else {
          setYScaleMinValBenchmarkErr(false);
        }
      }
      if (newMaxVal == "" || isNaN(newMaxVal)) {
        setYScaleMaxValBenchmarkErr(true);
      } else {
        setYScaleMaxValBenchmarkErr(false);
      }
    }
  }

  function saveYScaleValuesRegression() {
    let newMinVal = parseFloat($("#yScaleMinValRegression").val());
    let newMaxVal = parseFloat($("#yScaleMaxValRegression").val());
    if (newMinVal < newMaxVal) {
      setPlotMinValRegression(newMinVal);
      setPlotMaxValRegression(newMaxVal);
      setYScaleMaxValRegressionErr(false);
      setYScaleMinValRegressionErr(false);
    } else {
      if (newMinVal == "" || isNaN(newMinVal)) {
        setYScaleMinValRegressionErr(true);
      } else {
        if (newMinVal >= newMaxVal) {
          setYScaleMinValRegressionErr(true);
        } else {
          setYScaleMinValRegressionErr(false);
        }
      }
      if (newMaxVal == "" || isNaN(newMaxVal)) {
        setYScaleMaxValRegressionErr(true);
      } else {
        setYScaleMaxValRegressionErr(false);
      }
    }
  }

  function saveYScaleValuesDistancing() {
    let newMinVal = parseFloat($("#yScaleMinValDistancing").val());
    let newMaxVal = parseFloat($("#yScaleMaxValDistancing").val());
    if (newMinVal < newMaxVal) {
      setPlotMinValDistancing(newMinVal);
      setPlotMaxValDistancing(newMaxVal);
      setYScaleMaxValDistancingErr(false);
      setYScaleMinValDistancingErr(false);
    } else {
      if (newMinVal == "" || isNaN(newMinVal)) {
        setYScaleMinValDistancingErr(true);
      } else {
        if (newMinVal >= newMaxVal) {
          setYScaleMinValDistancingErr(true);
        } else {
          setYScaleMinValDistancingErr(false);
        }
      }
      if (newMaxVal == "" || isNaN(newMaxVal)) {
        setYScaleMaxValDistancingErr(true);
      } else {
        setYScaleMaxValDistancingErr(false);
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
          {/* Valuated License */}
          <div data-title={getValue("ValuatedCase", getLang())}>
            {/* Country */}
            <div className="form-group">
              <label class="lbl-icon-left">
                <span style={{ width: 100 }}>
                  <i class="spectre-select-countries"></i>{" "}
                  {getValue("Country", getLang())}
                </span>
                <select id="valuatedCountry">
                  {renderValuatedCountries()}
                </select>
              </label>
            </div>
            {/* license year */}
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
          >
            <div className="scrollable bs-scrollable" style={{ height: 125 }}>
              <div className="form-group">
                <label>
                  <span style={{ width: '34px' }}>
                    {getValue("Band", getLang())}
                  </span>
                  <input
                    style={{
                      backgroundColor: "#fbfbfb !important",
                      border: "#fbfbfb",
                    }}
                    placeholder={getValue("Term2", getLang())}
                    disabled="disabled"
                    type="text"
                  />
                </label>
              </div>
              {renderBands()}
            </div>
          </div>
          {/* Adjustments */}
          <div data-title={getValue("Adjustments", getLang())}>
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
                  {getValue("ShowMarkers", getLang())}
                  <select id="showMarkers">
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
                    <option value="-1"> {getValue("Select", getLang())}</option>
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
                  {getValue("Upper%", getLang())}
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
                  {getValue("Lower%", getLang())}
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
                  %
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={regressionValue}
                    onChange={(e) => setRegressionValue(e.target.value)}
                  />
                </label>
              </div>
              <div
                className="form-group"
                style={{ display: quartileVisibiltyValue }}
              >
                <label>
                  {getValue("kValue", getLang())}
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
        {/* Action Buttons */}
        <div
          class="filter-actions"
          style={{ paddingTop: showDisplay == false ? "13px" : "" }}
        >
          <a id="toggle-filters" onClick={() => setDisplay()}>
            <i class={iconClass}></i> {showTxt}
          </a>
          <button
            type="submit"
            onClick={() => checkIfCanView("Benchmark")}
            className="btn btn-primary background-color-2 mr-2"
          >
            <i class="spectre-val-bench mr-1"></i>{" "}
            {getValue("Value/Bencmark", getLang())}
          </button>
          <button
            type="submit"
            onClick={() => checkIfCanView("Regression")}
            className="btn btn-danger inner-btn-secondary mr-2"
          >
            <i class="spectre-val-regress mr-1"></i>{" "}
            {getValue("Value/Regression", getLang())}
          </button>
          <button
            type="submit"
            onClick={() => checkIfCanView("Distance")}
            className="btn btn-success"
          >
            <i
              class={
                getLang() === "ar"
                  ? "spectre-val-dist ms-2"
                  : "spectre-val-dist me-2"
              }
            ></i>{" "}
            {getValue("Value/Distance", getLang())}
          </button>
        </div>
      </div>
      <div id="Content" className="inner-content mt-3">
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
                            {methodTitle}
                          </h4>
                          <div
                            className={
                              showDistances ? "tbl-actions-4" : "tbl-actions"
                            }
                          >
                            <button
                              id="distancingBtn"
                              style={{ display: showDistances ? "" : "none" }}
                              type="submit"
                              onClick={() => doDistancing()}
                              class={
                                showDistances && !isDistancingGlowed
                                  ? "btn chart-btn-color btn-glow"
                                  : showDistances && isDistancingGlowed
                                  ? "btn chart-btn-color btn-glow"
                                  : "btn btn-glow"
                              }
                            >
                              <i
                                class={
                                  getLang() == "ar"
                                    ? "spectre-val-dist rtl"
                                    : "spectre-val-dist ltr"
                                }
                              ></i>
                            </button>
                            <button
                              disabled={
                                mySelectedMethod !== "Regression" ||
                                !awards.length > 0
                              }
                              id="refreshBtn"
                              class={
                                showRegressions &&
                                awards.length > 0 &&
                                !isRegressionGlowed? "btn chart-btn-color"
                                  : showRegressions &&
                                    awards.length > 0 &&
                                    isRegressionGlowed
                                  ? "btn chart-btn-color btn-glow"
                                  : "btn"
                              }
                              onClick={(e) => {
                                performRecal();
                              }}
                            >
                              <i class="fa fa-refresh"></i>
                            </button>
                            <button
                              disabled={
                                (mySelectedMethod === "Distance" &&
                                  showDoDistancing === false) ||
                                !awards.length > 0
                              }
                              id="plotBtn"
                              onClick={() => {
                                showBenchmarks
                                  ? ShowPlot(0)
                                  : showRegressions
                                  ? ShowPlot(1)
                                  : ShowPlot(2);
                              }}
                              class={
                                showDistances || !awards.length > 0
                                  ? "btn"
                                  : "btn chart-btn-color"
                              }
                            >
                              <i class="fa fa-chart-line"></i>
                            </button>
                            <button
                              disabled={!awards.length > 0 || showDistances}
                              id="downloadBtn"
                              onClick={() => setIsOpen6(true)}
                              class={
                                showDistances || !awards.length > 0
                                  ? "btn"
                                  : "btn chart-btn-color"
                              }
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
                    style={{
                      display: showDoDistancing && myHeader != "" ? "" : "none",
                    }}
                    className="row mb-2"
                  >
                    <div className="col-12 fw-bold">
                      {getValue("Price", getLang()) + ": "} {myHeader}
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
                                data-column={column.id}
                                className={getLang() === "ar" ? "rtl" : "ltr"}
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
                                    data-bands={cell.column.className}
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

                {/* Valuation Case Results */}
                <div
                  style={{
                    borderRadius: "10px",
                    display: showValuationCase == true ? "" : "none",
                  }}
                  className="entry-content inner-entry-content px-4 py-3 mt-4 mb-4 valuation-case-results"
                >
                  <div className="row">
                    <div className="col-12">
                      <h4
                        className="text-blue-d text-bold"
                        style={{ margin: 0, marginBottom: '10px' }}
                      >
                        {getValue("ValuationCaseResult", getLang())}
                      </h4>
                      <div
                        id="table-content"
                        className="col-md-12 p-0 mb-3 list custom-scrollbar"
                      >
                        <table
                          className="table table-striped table-width-auto fs-12px"
                          {...getSecondTableProps()}
                        >
                          <thead>
                            {secondHeaderGroups.map((headerGroup) => (
                              <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column) => (
                                  <th
                                    data-column={column.id}
                                    data-bands={column.className}
                                    {...column.getHeaderProps(
                                      column.getSortByToggleProps()
                                    )}
                                    className={
                                      getLang() == "ar"
                                        ? "text-right"
                                        : "text-left"
                                    }
                                    style={{ paddingInlineEnd: '75px' }}
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
                                        data-bands={cell.column.className}
                                        className={
                                          getLang() == "ar"
                                            ? "text-black vertical-align-middle text-right"
                                            : "text-black vertical-align-middle text-left"
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
                    </div>
                  </div>
                </div>

                {/* Regression First Row */}
                <div
                  style={{
                    borderRadius: "10px",
                    display: showRegressionFirstRow == true ? "" : "none",
                  }}
                  className="entry-content inner-entry-content px-4 py-3 mt-4 mb-4 valuation-case-results"
                >
                  <div className="row">
                    <div className="col-12">
                      <h4
                        className="text-blue-d text-bold"
                        style={{ margin: 0 }}
                      >
                        {getValue("ValuationCaseResult", getLang())}
                      </h4>
                      <div
                        id="table-content"
                        className="col-md-12 p-0 mb-3 list custom-scrollbar"
                      >
                        <table
                          className="table table-striped table-width-auto fs-12px"
                          {...getRegressionTableProps()}
                        >
                          <thead>
                            {regressionHeaderGroups.map((headerGroup) => (
                              <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column) => (
                                  <th
                                    data-column={column.id}
                                    data-bands={column.className}
                                    {...column.getHeaderProps(
                                      column.getSortByToggleProps()
                                    )}
                                    className={
                                      getLang() == "ar"
                                        ? "text-right"
                                        : "text-left"
                                    }
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
                          <tbody {...getRegressionTableBodyProps()}>
                            {regressionPage.map((row, i) => {
                              regressionPrepareRow(row);
                              return (
                                <tr
                                  className="socio-economic-tr"
                                  {...row.getRowProps()}
                                >
                                  {row.cells.map((cell) => {
                                    return (
                                      <td
                                        data-column={cell.column.id}
                                        data-bands={cell.column.className}
                                        className={
                                          getLang() == "ar"
                                            ? "text-black vertical-align-middle text-right"
                                            : "text-black vertical-align-middle text-left"
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
                    </div>
                  </div>
                </div>

                {/* Deselected Table */}
                <div
                  style={{ borderRadius: "10px" }}
                  className="entry-content inner-entry-content mt-4 px-4 py-3"
                >
                  <div className="row">
                    <div className="col-12 text-left">
                      <div className="row">
                        <div className="col-12 text-left d-flex justify-content-between">
                          <h4
                            className="text-blue-d text-bold"
                            style={{ margin: 0 }}
                          >
                            <a onClick={() => deselectedGridVisibility()}>
                              <i
                                class="spectre-minus-circle"
                                style={{
                                  color: "var(--color-2)",
                                  display:
                                    deselectedIndicator == true ? "" : "none",
                                }}
                              ></i>
                              <img
                                style={{
                                  display:
                                    deselectedIndicator == true ? "none" : "",
                                }}
                                width="22px"
                                height="22px"
                                src={"./public_pages/images/plus-icon.png"}
                              />
                            </a>{" "}
                            {getValue("DeSelectedAwards", getLang())}
                          </h4>
                        </div>
                      </div>
                      <hr style={{ margin: "5px 0" }} />
                    </div>
                  </div>
                  <div
                    id="table-content"
                    className="col-md-12 list p-0 mb-3 custom-scrollbar deselected-grid"
                    style={{ height: numberOfAwards == 0 ? "" : "470px" }}
                  >
                    <table
                      className="table table-striped table-width-auto fs-12px"
                      {...getDeselectedTableProps()}
                    >
                      <thead>
                        {deselectedHeaderGroups.map((headerGroup) => (
                          <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                              <th
                                data-column={column.id}
                                className={getLang() === "ar" ? "rtl" : "ltr"}
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
                                {column.render("Header")}
                              </th>
                            ))}
                          </tr>
                        ))}
                      </thead>
                      <tbody {...getDeselectedTableBodyProps()}>
                        {deselectedPage.map((row, i) => {
                          deselectedPrepareRow(row);
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
                                    data-bands={cell.column.className}
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
                            {deselectedPageOptions.length !== 0
                              ? parseInt(deselectedPageIndex) + 1
                              : 0}{" "}
                            {getValue("Of", getLang())}{" "}
                            {deselectedPageOptions.length}
                          </strong>{" "}
                        </span>
                        <span className="text-black d-flex ml-1 mr-1 align-items-start">
                          | {getValue("GoToPage", getLang())}
                          <input
                            type="number"
                            min="1"
                            max={deselectedPageOptions.length}
                            defaultValue={deselectedPageIndex + 1}
                            onChange={(e) => {
                              const pageNumber = e.target.value
                                ? Number(e.target.value) - 1
                                : 0;
                              deselectedGotoPage(pageNumber);
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
                          onClick={() => deselectedGotoPage(0)}
                          disabled={!deselectedCanPreviousPage}
                        >
                          {"<<"}
                        </button>
                        <button
                          className="btn inner-btn-secondary px-5px py-0 me-1"
                          onClick={() => deselectedPreviousPage()}
                          disabled={!deselectedCanPreviousPage}
                        >
                          {getValue("Previous", getLang())}
                        </button>
                        <button
                          className="btn inner-btn-secondary px-5px py-0 me-1"
                          onClick={() => deselectedNextPage()}
                          disabled={!deselectedCanNextPage}
                        >
                          {getValue("Next", getLang())}
                        </button>
                        <button
                          className="btn inner-btn-secondary px-5px py-0 me-1"
                          onClick={() =>
                            deselectedGotoPage(deselectedPageCount - 1)
                          }
                          disabled={!deselectedCanNextPage}
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
                <p>{`Spectrum valuation of a license in ${awards.length > 0 ? $('#valuatedCountry option:selected').text() : ""} using benchmarks`}</p>
              </div> */}
              <div className="d-flex flex-row mt-2">
                <label className="me-2">
                  {getValue("Minimum", getLang())}:{" "}
                </label>
                <input
                  id="yScaleMinValBenchmark"
                  type="number"
                  className={
                    yScaleMinValBenchmarkErr
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
                  id="yScaleMaxValBenchmark"
                  type="number"
                  className={
                    yScaleMaxValBenchmarkErr
                      ? "chart-input me-2 border-danger"
                      : "chart-input me-2"
                  }
                  min={0}
                  onKeyDown={(e) => inputNumberCheck(e)}
                />
                <button
                  onClick={() => saveYScaleValuesBenchmarks()}
                  className="btn btn-primary background-color-2 input-chart-btn me-2"
                >
                  {getValue("Refresh", getLang())}
                </button>
              </div>
            </div>
          </Modal.Header>
          <Modal.Body>
            <div id="main">
              <Chart
                dataSource={chartBenchmarkData}
                palette="Harmony Light"
                ref={chartBenchmarkRef}
                id="chartbenchmark"
                customizePoint={customizePoint}
              >
                <Title
                  text={
                    getLang() == "ar"
                      ? ` ${getValue("BenchmarksPlotTitle1", getLang())} ${
                          awards.length > 0
                            ? $("#valuatedCountry option:selected").text()
                            : ""
                        } ${getValue("BenchmarksPlotTitle2", getLang())}  `
                      : `${getValue("BenchmarksPlotTitle1", getLang())} ${
                          awards.length > 0
                            ? $("#valuatedCountry option:selected").text()
                            : ""
                        } ${getValue("BenchmarksPlotTitle2", getLang())} `
                  }
                  horizontalAlignment={getLang() == "ar" ? "right" : "left"}
                >
                  <Font color="black" size="16px" weight="600" />
                </Title>
                <Size width={1100} />
                <CommonSeriesSettings barPadding={0.6}>
                  <Point visible={false}></Point>
                </CommonSeriesSettings>
                <Series
                  name="Price"
                  argumentField="index"
                  valueField="price"
                  type="bar"
                />
                <ValueAxis
                  position={getLang() == "ar" ? "right" : "left"}
                  maxValueMargin={0.01}
                  title={myHeader}
                >
                  <VisualRange
                    startValue={plotMinValBenchmark}
                    endValue={plotMaxValBenchmark}
                  />
                  <ConstantLine
                    width={2}
                    value={$("#showMarkers").val() == 1 ? plotMean : null}
                    color="#8c8cff"
                    dashStyle="dash"
                  >
                    <Label
                      color={"#000000"}
                      position="inside"
                      horizontalAlignment={getLang() == "ar" ? "left" : "right"}
                      verticalAlignment="top"
                      text={
                        getValue("Mean", getLang()) +
                        ": " +
                        (plotMean == null ? "" : plotMean.toString())
                      }
                    />
                  </ConstantLine>
                  <ConstantLine
                    width={2}
                    value={$("#showMarkers").val() == 1 ? plotMedian : null}
                    color="#a56a8d"
                    dashStyle="dash"
                  >
                    <Label
                      color={"#000000"}
                      horizontalAlignment={getLang() == "ar" ? "left" : "right"}
                      position="outside"
                      text={
                        getValue("Median", getLang()) +
                        ": " +
                        (plotMedian == null ? "" : plotMedian.toString())
                      }
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
                      color={"#000000"}
                      horizontalAlignment={getLang() == "ar" ? "left" : "right"}
                      position="outside"
                      text={
                        getValue("Lower%", getLang()) +
                        ": " +
                        (lowerPlot == null ? "" : lowerPlot.toString())
                      }
                    />
                  </ConstantLine>
                  <ConstantLine
                    width={2}
                    // value={$("#showMarkers").val() == 1 ? upperPlot : null}
                    value={null}
                    color="#f00"
                    dashStyle="dash"
                  >
                    <Label
                      color={"#000000"}
                      horizontalAlignment={getLang() == "ar" ? "left" : "right"}
                      position="outside"
                      text={
                        getValue("Upper%", getLang()) +
                        ": " +
                        (upperPlot == null ? "" : upperPlot.toString())
                      }
                    />
                  </ConstantLine>
                </ValueAxis>

                <ZoomAndPan argumentAxis="both" valueAxis="both" />
                <Export enabled={true} />

                <ArgumentAxis inverted={getLang() == "ar" ? true : false}>
                  <Tick visible={false} />
                  <Label
                    overlappingBehavior="rotate"
                    rotationAngle="-90"
                    customizeText={getLabels}
                  />
                </ArgumentAxis>
                <Legend visible={false} />
                <Tooltip
                  enabled={true}
                  zIndex="10000"
                  customizeTooltip={customizeTooltip}
                />
              </Chart>
            </div>
          </Modal.Body>
        </Modal>
        <Modal
          size="xl"
          show={isOpenNumeric}
          onHide={hideModal}
          onEntered={modalLoaded}
          style={{ direction: getLang() == "ar" ? "rtl" : "ltr" }}
        >
          <Modal.Header closeButton>
            <div className="d-flex flex-column align-items-start">
              {/* <div className="mb-1">
                <p>{`Spectrum valuation of a license in ${awards.length > 0 ? $('#valuatedCountry option:selected').text() : ""} using Regression`}</p>
              </div> */}
              <div className="d-flex flex-row mt-2">
                <label className="me-2">
                  {getValue("Minimum", getLang())}:{" "}
                </label>
                <input
                  id="yScaleMinValRegression"
                  type="number"
                  className={
                    yScaleMinValRegressionErr
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
                  id="yScaleMaxValRegression"
                  type="number"
                  className={
                    yScaleMaxValRegressionErr
                      ? "chart-input me-2 border-danger"
                      : "chart-input me-2"
                  }
                  min={0}
                  onKeyDown={(e) => inputNumberCheck(e)}
                />
                <button
                  onClick={() => saveYScaleValuesRegression()}
                  className="btn btn-primary background-color-2 input-chart-btn me-2"
                >
                  {getValue("Refresh", getLang())}
                </button>
              </div>
            </div>
          </Modal.Header>
          <Modal.Body>
            <Chart
              dataSource={awardsForChartRegression}
              palette="Harmony Light"
              ref={regRef}
              id="chart"
            >
              <Title
                text={
                  getLang() == "ar"
                    ? `${getValue("RegressionPlotTitle1", getLang())} ${
                        awards.length > 0
                          ? $("#valuatedCountry option:selected").text()
                          : ""
                      } ${getValue("RegressionPlotTitle2", getLang())}`
                    : `${getValue("RegressionPlotTitle1", getLang())} ${
                        awards.length > 0
                          ? $("#valuatedCountry option:selected").text()
                          : ""
                      } ${getValue("RegressionPlotTitle2", getLang())}`
                }
                horizontalAlignment={getLang() == "ar" ? "right" : "left"}
              >
                <Font color="black" size="16px" weight="600" />
              </Title>
              <Size width={1100} />
              {/* <Size width={width} /> */}
              {/* <CommonSeriesSettings argumentField="gdp" /> */}
              <Series
                name="Price"
                valueField="price"
                argumentField="gdp"
                type="scatter"
                color="#0074D9"
              >
                <Point size={8}></Point>
              </Series>
              <Series
                name="Regression Line"
                argumentField="gdp"
                valueField="slope"
                type="line"
                color="#FFDC00"
              >
                <Point size={0}></Point>
              </Series>

              <Series
                name="Valuated Country"
                valueField="valuatedCountryVal"
                argumentField="gdp"
                type="scatter"
                color="#FF4136"
              >
                <Point size={12}></Point>
              </Series>

              <ArgumentAxis
                inverted={getLang() == "ar" ? true : false}
                discreteAxisDivisionMode="crossLabels"
                title="GDPc"
                endOnTick={true} // Force the axis to start and end on ticks
                minValueMargin={0}
                defaultVisualRange={[0, maxRegGDP]}
              >
                <Label
                  overlappingBehavior="stagger"
                  customizeText={customizeTextRegression}
                />
              </ArgumentAxis>
              <ValueAxis
                position={getLang() == "ar" ? "right" : "left"}
                title={myHeader}
              >
                <VisualRange
                  startValue={plotMinValRegression}
                  endValue={plotMaxValRegression}
                />
              </ValueAxis>

              <Tooltip
                enabled={true}
                zIndex="10000"
                shared={true}
                customizeTooltip={customizeTooltip3}
              />

              <Legend visible={false} />
              <ZoomAndPan argumentAxis="both" valueAxis="both" />
              <Export enabled={true} />
            </Chart>
          </Modal.Body>
        </Modal>
        <Modal
          size="xl"
          show={isOpenDistancing}
          onHide={hideModal}
          onEntered={modalLoaded}
          style={{ direction: getLang() == "ar" ? "rtl" : "ltr" }}
        >
          <Modal.Header closeButton>
            <div className="d-flex flex-column align-items-start">
              {/* <div className="mb-1">
                <p>{`Spectrum valuation of a license in ${awards.length > 0 ? $('#valuatedCountry option:selected').text() : ""} using Distance Method`}</p>
              </div> */}
              <div className="d-flex flex-row mt-2">
                <label className="me-2">
                  {getValue("Minimum", getLang())}:{" "}
                </label>
                <input
                  id="yScaleMinValDistancing"
                  type="number"
                  className={
                    yScaleMinValDistancingErr
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
                  id="yScaleMaxValDistancing"
                  type="number"
                  className={
                    yScaleMaxValDistancingErr
                      ? "chart-input me-2 border-danger"
                      : "chart-input me-2"
                  }
                  min={0}
                  onKeyDown={(e) => inputNumberCheck(e)}
                />
                <button
                  onClick={() => saveYScaleValuesDistancing()}
                  className="btn btn-primary background-color-2 input-chart-btn me-2"
                >
                  {getValue("Refresh", getLang())}
                </button>
              </div>
            </div>
          </Modal.Header>
          <Modal.Body>
            <Chart
              id="chart"
              ref={distanceRef}
              dataSource={distancingCategories}
              palette="Soft"
              paletteExtensionMode="alternate"
            >
              <Title
                text={
                  getLang() == "ar"
                    ? `${getValue("DistancingPlotTitle1", getLang())} ${
                        awards.length > 0
                          ? $("#valuatedCountry option:selected").text()
                          : ""
                      } ${getValue("DistancingPlotTitle2", getLang())}`
                    : `${getValue("DistancingPlotTitle1", getLang())} ${
                        awards.length > 0
                          ? $("#valuatedCountry option:selected").text()
                          : ""
                      } ${getValue("DistancingPlotTitle2", getLang())}`
                }
                horizontalAlignment={getLang() == "ar" ? "right" : "left"}
              >
                <Font color="black" size="16px" weight="600" />
              </Title>
              <Size width={1100} />
              <CommonPaneSettings>
                <Border visible={true} />
              </CommonPaneSettings>
              <CommonSeriesSettings
                argumentField="countryName"
                valueField="price"
                type="scatter"
              >
                <Point size={8} />
              </CommonSeriesSettings>
              <SeriesTemplate nameField="price" />
              <Tooltip
                enabled={true}
                zIndex="10000"
                customizeTooltip={customizeTooltip2}
              />
              <ValueAxis
                position={getLang() == "ar" ? "right" : "left"}
                title={myHeader}
              >
                <VisualRange
                  startValue={plotMinValDistancing}
                  endValue={plotMaxValDistancing}
                />
              </ValueAxis>
              <Legend visible={false} />
              <Export enabled={true} />
              <ZoomAndPan argumentAxis="both" valueAxis="both" />
              <ArgumentAxis
                inverted={getLang() == "ar" ? true : false}
                discreteAxisDivisionMode="crossLabels"
              >
                <Label overlappingBehavior="rotate" rotationAngle="-90" />
              </ArgumentAxis>
              <Legend visible={false} />
            </Chart>
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

        <Modal show={isOpen6} size="sm" onHide={hideModal6}>
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
                  {getValue("ExportToExcel", getLang())}
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
              {isExportPDF && (
                <Benchmark2
                  awards={awards}
                  filters={filters}
                  valuationValues={valuationValues}
                  countryName={valuatedCountryTxt}
                  svg={svg}
                />
              )}
              {isDistanceExported && (
                <AwardsMenu
                  awards={awards}
                  filters={filters}
                  countryName={valuatedCountryTxt}
                  svg={svg}
                />
              )}
              {isValuationExport && (
                <ValuationsEcharts
                  awards={awards}
                  filters={filters}
                  valuationValues={regressionValues}
                  countryName={valuatedCountryTxt}
                  svg={svg}
                />
              )}
            </ul>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default Valuations;
