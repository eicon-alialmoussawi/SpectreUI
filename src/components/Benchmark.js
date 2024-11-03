import React, { useState, useEffect, useRef } from "react";
import APIFunctions from "../utils/APIFunctions";
import { useTable, useSortBy, usePagination } from "react-table";
import "react-datepicker/dist/react-datepicker.css";
import "../css/CustomStyle.css";
import {
  Alert,
  LoadingAlert,
  AlertError,
} from "../components/f_Alerts";
import { getValue } from "../Assets/Language/Entries";
import { getLang, getIMF, getPPP } from "../utils/common";
import $ from "jquery";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import Modal from "react-bootstrap/Modal";

const Benchmark = (props) => {
  const [title, setTitle] = React.useState("Transitioning...");
  const [regressionVisibilityValue, setRegressionVisibilityValue] =
    useState("none");
  const [isPPPValue, setPPPValue] = useState("");
  const [quartileVisibiltyValue, setquatileVisibiltyValue] = useState("none");
  const [standardDeviationValue, setstandardDeviationValue] = useState("none");
  const [upperPercentileValue, setUpperPercentileValue] = useState("none");
  const [lowerPercentileValue, setLowerPercentileValue] = useState("none");
  const [hasPercentileValue, setHasPercentileValue] = useState(false);
  const [awards, setAwards] = useState([]);
  const awardsRef = useRef();
  const optionsRef = useRef();
  const [discountRateValue, setDiscountRate] = useState("");
  const [termValue, setTermValue] = useState("");
  const [hasRegressionValue, setHasRegressionValue] = useState(false);
  const [regressionValue, setRegressionValue] = useState();
  const [checked, setChecked] = React.useState(false);
  const [isDisabled, setDisabled] = React.useState(true);
  const [hasQuartileValue, setHasQuartileValue] = useState(false);
  const [quartileValue, setQuartileValue] = useState();
  const [hasStandardDeviation, sethasStandardDeviation] = useState(false);
  const [standardDeviationValueAdded, setstandardDeviationValueAdded] =
    useState();
  const [bandOptionsList, setSelectedBandsOptions] = useState([]);
  const [options, setoptions] = useState([]);
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
  const [hasAutoFiltering, setHasAutoFiltering] = useState(false);
  const [upperPercentileValueSelected, setUpperPercentileValueSelected] =
    useState();
  const [lowerPercentileValueSelected, setLowerPercentileValueSelected] =
    useState();
  const [iconClass, setIconClass] = useState(
    "spectre-angle-up btn btn-primary background-color-2 color-white mr-2"
  );
  const [showTxt, setShowTxt] = useState(getValue("ShowLess", getLang()));
  const [columnsValuation, setColumnsValuation] = useState([]);
  const [valuationValues, setValuationValues] = useState([]);
  const [isOpen3, setIsOpen3] = useState(false);
  const [showDisplay, setShowDisplay2] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState(true);
  const [checkAllBands, setCheckAllBands] = useState(false);
  const [isOpen5, setIsOpen5] = useState(false);
  const [numberOfAwards, setNumberOfAwards] = useState(0);
  const [myHeader, setMyHeader] = useState("");
  const [PriceVsGDPc, setPriceVsGDPc] = useState(true);

  const modalLoaded3 = () => {
    setTitle("Export");
  };

  const hideModal3 = () => {
    setIsOpen3(false);
    setTitle("Export");
  };

  useEffect(() => {
    APIFunctions.getAllBands()
      .then((resp) => resp)
      .then((resp) => bindOptionsBand(resp.data));
  }, []);

  useEffect(() => {
    APIFunctions.getUserCountries("Benchmark")
      .then((resp) => resp)
      .then((resp) => bindOptions(resp.data))
      .then((resp) => getUserFilters());
  }, []);

  useEffect(() => {
    $(".menuItems").removeClass("active");
    $("#Benchmark_page").addClass("active");
  });

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

  const bindOptionsBand = (data) => {
    var arr = [];
    for (var i = 0, l = data.length; i < l; i++) {
      var ob = new Object();
      ob.label = data[i].nameEn;
      ob.labelAr = data[i].nameAr;
      // ob.label = getLang() == "ar" ? data[i].nameAr : data[i].nameEn;
      ob.value = data[i].value;
      ob.isChecked = true;
      arr.push(ob);
    }
    setSelectedBandsOptions(arr);
  };
  awardsRef.current = awards;
  optionsRef.current = options;

  const checkIfCanView = (m) => {
    setSelectedMethod(m);
    APIFunctions.checkIfCanView("Benchmark")
      .then((response) => {
        if (response.data) {
          if (m == "Benchmark") {
            setPriceVsGDPc(true);
            filterAwards();
          }
          else {
            setPriceVsGDPc(false);
            filterRatio();
          }
        } else {
          Alert(getValue("FeatureNotAvailable", getLang()));
          return;
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const exportToCSV = (csvData, fileName) => {
    if (selectedMethod == "Benchmark") {
      var arr = [];
      var arr2 = [];
      var headers = [];

      var headers2 = [];
      awards.forEach((element1) => {
        var obj = new Object();
        obj["GDPc, US$"] = String(element1["gdp"]);

        if (headers.indexOf("GDPc, US$") < 0) headers.push("GDPc, US$");

        columns.forEach((element) => {
          if (element.Header != "GDPc, US$") {
            obj[String(element.Header)] = String(
              element1["value_" + String(element.Header)]
            );
            if (headers.indexOf(element.Header) < 0)
              headers.push(element.Header);
          }
        });

        arr.push(obj);
      });

      valuationValues.forEach((val) => {
        var obj = new Object();
        obj[""] = String(val["firstCol"]);

        if (headers2.indexOf("") < 0) headers2.push("");

        columnsValuation.forEach((element) => {
          if (element.Header != "Value" && element.Header != "") {
            obj[String(element.Header)] = String(
              val["accessor_" + String(element.Header)]
            );
            if (headers2.indexOf(element.Header) < 0)
              headers2.push(element.Header);
          }
        });

        arr2.push(obj);
      });

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
      FileSaver.saveAs(data, "Benchmark" + fileExtension);
    } else {
      var arr = [];
      var arr2 = [];
      var headers = [];
      var headers2 = [];

      awards.forEach((element1) => {
        var obj = new Object();
        obj[getValue("Bands", getLang())] = String(element1["band"]);

        if (headers.indexOf(getValue("Bands", getLang())) < 0) headers.push(getValue("Bands", getLang()));

        columns.forEach((element) => {
          if (element.Header != getValue("Bands", getLang())) {
            obj[String(element.Header)] = String(
              element1["value_" + String(element.Header)]
            );
            if (headers.indexOf(element.Header) < 0)
              headers.push(element.Header);
          }
        });

        arr.push(obj);
      });

      valuationValues.forEach((val) => {
        var obj = new Object();
        obj[""] = String(val["firstCol"]);

        if (headers2.indexOf("") < 0) headers2.push("");

        columnsValuation.forEach((element) => {
          if (element.Header != "Value" && element.Header != "") {
            obj[String(element.Header)] = String(
              val["accessor_" + String(element.Header)]
            );
            if (headers2.indexOf(element.Header) < 0)
              headers2.push(element.Header);
          }
        });

        arr2.push(obj);
      });

      const ws = XLSX.utils.json_to_sheet(arr, { header: headers, origin: "A1" });
      const ws2 = XLSX.utils.json_to_sheet(arr2, { header: headers2 });

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "SheetJS1");
      XLSX.utils.book_append_sheet(wb, ws2, "SheetJS2");

      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const data = new Blob([excelBuffer], { type: fileType });
      FileSaver.saveAs(data, "Benchmark By Ratio" + fileExtension);
    }
  };

  const filterRatio = () => {
    var selectedCountries = [];
    var selectedBands = [];

    for (var i = 0; i < bandOptionsList.length; i++) {
      bandOptionsList[i].isChecked = true;
    }

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
      if (regressionValue.trim() == '') {
          AlertError(getValue("RegressionValueEmpty", getLang()));
          return;
      }
      if (regressionValue < 0) {
          AlertError(getValue("Min%", getLang()));
          return;
      }
      if (regressionValue >= 100) {
          AlertError(getValue("StrictMax%", getLang()));
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
    AwardFilter.Lang = getLang();
    AwardFilter.FromYear = parseInt(fromDate);
    AwardFilter.ToYear = parseInt(toDate);
    AwardFilter.ISPPP = getPPP() == "true" ? true : false;
    AwardFilter.ISIMF = getIMF() == "true" ? true : false;
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
    AwardFilter.discountRate = parseFloat(discountRateValue);
    AwardFilter.term = parseInt(termValue);
    AwardFilter.AdjustByInflationFactor = adjustByInflation;
    AwardFilter.AdjustByGDPFactor = normalizeByGDPc;
    AwardFilter.AdjustByPPPFactor = adjustByPPPFactor;
    AwardFilter.AnnualizePrice = annualizePrices;
    AwardFilter.IsIncludeAnnual = addAnnualPayment;
    AwardFilter.hasRegression = hasRegressionValue;
    AwardFilter.regression = regressionValue.trim() === '' ? 0 : regressionValue;
    AwardFilter.HasPercentile = hasPercentileValue;
    AwardFilter.UpperPercentile = upperPercentileValueSelected;
    AwardFilter.LowerPercentile = lowerPercentileValueSelected;
    AwardFilter.HasQuartile = hasQuartileValue;
    AwardFilter.KValue = quartileValue;
    AwardFilter.HasStandardDeviation = hasStandardDeviation;
    AwardFilter.StandardDeviationValue = standardDeviationValueAdded;
    AwardFilter.AutoFiltering = hasAutoFiltering;
    AwardFilter.sumBand = $("#sumBands").val();

    var list = [];
    list.push(
      {
        id: 0,
        pageUrl: "Benchmark",
        field: "FromYear",
        value: fromDate.toString(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Benchmark",
        field: "ToYear",
        value: toDate.toString(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Benchmark",
        field: "IssueDate",
        value: $("#issueDate").val(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Benchmark",
        field: "awardTypeSelectedValue",
        value: $("#showResults").val(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Benchmark",
        field: "discountRate",
        value: discountRateValue.toString(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Benchmark",
        field: "term",
        value: termValue.toString(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Benchmark",
        field: "AdjustByInflationFactor",
        value: adjustByInflation.toString(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Benchmark",
        field: "AdjustByGDPFactor",
        value: normalizeByGDPc.toString(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Benchmark",
        field: "AdjustByPPPFactor",
        value: adjustByPPPFactor.toString(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Benchmark",
        field: "AnnualizePrice",
        value: annualizePrices.toString(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Benchmark",
        field: "IsIncludeAnnual",
        value: addAnnualPayment.toString(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Benchmark",
        field: "regression",
        value: regressionValue.toString(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Benchmark",
        field: "UpperPercentile",
        value: upperPercentileValueSelected.toString(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Benchmark",
        field: "LowerPercentile",
        value: lowerPercentileValueSelected.toString(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Benchmark",
        field: "KValue",
        value: quartileValue.toString(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Benchmark",
        field: "StandardDeviationValue",
        value: standardDeviationValueAdded.toString(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Benchmark",
        field: "ddlOutliers",
        value: $("#ddlOutliers").val(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Benchmark",
        field: "sumBand",
        value: $("#sumBands").val(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Benchmark",
        field: "MinGDP",
        value: minGDP.toString(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Benchmark",
        field: "MaxGDP",
        value: maxGDP.toString(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Benchmark",
        field: "RegionalLicense",
        value: includeRegional.toString(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Benchmark",
        field: "Paired",
        value: AwardFilter.IsPaired.toString(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Benchmark",
        field: "IsUnPaired",
        value: AwardFilter.IsUnPaired.toString(),
        UserId: 0,
      },
      {
        id: 0,
        pageUrl: "Benchmark",
        field: "IsPairedAndUnPaired",
        value: AwardFilter.IsPairedAndUnPaired.toString(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Benchmark",
        field: "IsMultiple",
        value: AwardFilter.IsMultiple.toString(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Benchmark",
        field: "IsSingle",
        value: AwardFilter.IsSingle.toString(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Benchmark",
        field: "Country",
        value: JSON.stringify(options),
        userId: 0,
      }
    );

    saveUserFilters(list);

    LoadingAlert("Show");

    APIFunctions.getBenchmarkByRatio(AwardFilter)
      .then((response) => {
        LoadingAlert("hide");
        if (
          response.data == 0 ||
          response.data.length < 0 ||
          Array.isArray(response.data.items)
        ) {
          Alert(getValue("NoDataToDisplay", getLang()));
          setColumns([]);
          setAwards([]);
          setColumnsValuation([]);
          setValuationValues([]);
          return;
        } else {
          setColumns([]);
          setAwards([]);
          setColumnsValuation([]);
          setValuationValues([]);

          const filteredRatioAwards = response.data.filter(award => award.numberOfAwards !== 0);

          var bands = [];
          for (var i = 0; i < filteredRatioAwards.length; i++) {
            bands.push(filteredRatioAwards[i].band);
          }
          bands.sort(function (a, b) {
            return a - b;
          });
          console.log("Ratio Awards Columns: ", bands);
          clmns.push({
            id: "bands",
            Header: getValue("Bands", getLang()),
            accessor: "band",
          });
          for (var i = 0; i < bands.length; i++) {
            clmns.push({
              id: bands[i],
              Header: bands[i],
              accessor: `value_${bands[i]}`,
            });
          }
          setColumns(clmns);
          var arr_awards = [];
          for (var i = 0; i < bands.length; i++) {
            var obj = new Object();
            for (var j = 0; j < bands.length; j++) {
              var mean_x = parseFloat(filteredRatioAwards[i].mean);
              var mean_y = parseFloat(filteredRatioAwards[j].mean);
              var r = mean_y / mean_x;
              obj[`value_${filteredRatioAwards[j].band}`] = isNaN(r) ? 0 : r == 1 ? r : r.toFixed(3);
            }
            obj["band"] = parseInt(filteredRatioAwards[i].band);
            arr_awards.push(obj);
          }
          arr_awards.sort((a, b) =>
            a.band > b.band ? 1 : b.band > a.band ? -1 : 0
          );
          setAwards(arr_awards);
          console.log("Ratio Awards Values: ", arr_awards);

          // Linear Regression Results

          var clmns_valuation = [];
          clmns_valuation.push({
            id: "firstCol",
            Header: "",
            accessor: "firstCol",
          });
          for (i = 0; i < bands.length; i++) {
            clmns_valuation.push({
              id: `id_${bands[i]}`,
              Header: bands[i],
              accessor: `accessor_${bands[i]}`,
            });
          }
          setColumnsValuation(clmns_valuation);

          var arr_first_col = [
            {
              id: 0,
              firstCol: getValue("Mean", getLang()),
            },
            {
              id: 1,
              firstCol: getValue("Median", getLang()),
            },
            {
              id: 2,
              firstCol: getValue("NumberOfAwards", getLang()),
            },
          ];

          var arr_linear_results = [];
          for (i = 0; i < arr_first_col.length; i++) {
            arr_linear_results.push({
              id: i,
              firstCol: arr_first_col[i].firstCol,
            });
          }

          var k = 0;
          arr_linear_results.forEach(function (element, index) {
            if (k == 0) {
              for (var j = 0; j < response.data.length; j++) {
                arr_linear_results[index][`accessor_${response.data[j].band}`] =
                  normalizeByGDPc
                    ? response.data[j].mean == 0
                      ? response.data[j].mean
                      : response.data[j].mean.toExponential(1)
                    : response.data[j].mean == 0
                      ? response.data[j].mean
                      : response.data[j].mean.toFixed(3);
              }
            } else {
              if (k == 1) {
                for (var j = 0; j < response.data.length; j++) {
                  arr_linear_results[index][
                    `accessor_${response.data[j].band}`
                  ] = normalizeByGDPc
                        ? response.data[j].median == 0
                          ? response.data[j].median
                          : response.data[j].median.toExponential(1)
                        : response.data[j].median == 0
                          ? response.data[j].median
                          : response.data[j].median.toFixed(3);
                }
              } else {
                for (var j = 0; j < response.data.length; j++) {
                  arr_linear_results[index][
                    `accessor_${response.data[j].band}`
                  ] = response.data[j].numberOfAwards;
                }
              }
            }
            k += 1;
          });
          setValuationValues(arr_linear_results);
        }
      })
      .catch((e) => {
        console.log(e);
        LoadingAlert("hide");
      });
  };

  const search = (AwardFilter, res) => {
    if (res) {
      AwardFilter.EnforeBPositive = "1";
    } else {
      AwardFilter.EnforeBPositive = "0";
    }
    
    console.log(AwardFilter);

    var list = [];
    list.push(
      {
        id: 0,
        pageUrl: "Benchmark",
        field: "FromYear",
        value: fromDate.toString(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Benchmark",
        field: "ToYear",
        value: toDate.toString(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Benchmark",
        field: "IssueDate",
        value: $("#issueDate").val(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Benchmark",
        field: "awardTypeSelectedValue",
        value: $("#showResults").val(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Benchmark",
        field: "discountRate",
        value: discountRateValue.toString(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Benchmark",
        field: "term",
        value: termValue.toString(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Benchmark",
        field: "AdjustByInflationFactor",
        value: adjustByInflation.toString(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Benchmark",
        field: "AdjustByGDPFactor",
        value: normalizeByGDPc.toString(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Benchmark",
        field: "AdjustByPPPFactor",
        value: adjustByPPPFactor.toString(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Benchmark",
        field: "AnnualizePrice",
        value: annualizePrices.toString(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Benchmark",
        field: "IsIncludeAnnual",
        value: addAnnualPayment.toString(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Benchmark",
        field: "regression",
        value: regressionValue.toString(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Benchmark",
        field: "UpperPercentile",
        value: upperPercentileValueSelected.toString(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Benchmark",
        field: "LowerPercentile",
        value: lowerPercentileValueSelected.toString(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Benchmark",
        field: "KValue",
        value: quartileValue.toString(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Benchmark",
        field: "StandardDeviationValue",
        value: standardDeviationValueAdded.toString(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Benchmark",
        field: "ddlOutliers",
        value: $("#ddlOutliers").val(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Benchmark",
        field: "sumBand",
        value: $("#sumBands").val(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Benchmark",
        field: "MinGDP",
        value: minGDP.toString(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Benchmark",
        field: "MaxGDP",
        value: maxGDP.toString(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Benchmark",
        field: "RegionalLicense",
        value: includeRegional.toString(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Benchmark",
        field: "Paired",
        value: AwardFilter.IsPaired.toString(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Benchmark",
        field: "IsUnPaired",
        value: AwardFilter.IsUnPaired.toString(),
        UserId: 0,
      },
      {
        id: 0,
        pageUrl: "Benchmark",
        field: "IsPairedAndUnPaired",
        value: AwardFilter.IsPairedAndUnPaired.toString(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Benchmark",
        field: "IsMultiple",
        value: AwardFilter.IsMultiple.toString(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Benchmark",
        field: "IsSingle",
        value: AwardFilter.IsSingle.toString(),
        userId: 0,
      },
      {
        id: 0,
        pageUrl: "Benchmark",
        field: "Country",
        value: JSON.stringify(options),
        userId: 0,
      }
    );

    saveUserFilters(list);

    LoadingAlert("Show");
    APIFunctions.getBenchmarkResult(AwardFilter)
      .then((response) => {
        LoadingAlert("hide");
        if (
          response.data == 0 ||
          response.data.length < 0 ||
          !Array.isArray(response.data)
        ) {
          Alert(getValue("NoDataToDisplay", getLang()));
          setAwards([]);
          return;
        } else {
          // Price Benchmarks
          setNumberOfAwards(response.data.length);

          var min = Number.MAX_VALUE;
          for (var i = 0, l = response.data.length; i < l; i++) {
            if (response.data[i].avalue != 0)
              min = Math.min(min, response.data[i].avalue);
          }

          var count = 0;
          if ( Math.abs(min) != 0) {
            while (Math.abs(min) < 0.001) {
              min *= 10;
              count++;
             // console.log(min);
              console.log(Math.abs(min));
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

          var response_bands = [];
          for (var i = 0; i < response.data.length; i++) {
            response_bands.push(response.data[i].band);
          }

          response_bands.sort(function (a, b) {
            return a - b;
          });

          clmns.push({
            id: 0,
            Header: "GDPc, US$",
            accessor: "gdp",
          });
          for (var i = 0; i < response_bands.length; i++) {
            clmns.push({
              id: response_bands[i],
              Header: response_bands[i],
              accessor: `value_${response_bands[i]}`,
            });
          }
          setColumns(clmns);
          var arr_awards = [];
          for (var x = 0; x <= 150000; x = x + 2000) {
            var obj = new Object();
            for (var j = 0; j < response.data.length; j++) {
              var a = parseFloat(response.data[j].avalue);
              var b = parseFloat(response.data[j].bvalue);
              var y = a * x + b;
              if (normalizeByGDPc) {
                console.log(count);
                y = y * Math.pow(10, count);
              }
              obj[`value_${response.data[j].band}`] =
                y == 0 ? y : y.toFixed(3);
            }
            obj["gdp"] = x;
            arr_awards.push(obj);
          }
          setAwards(arr_awards);
          console.log(arr_awards);

          // Linear Regression Results

          var clmns_valuation = [];
          clmns_valuation.push({
            id: "firstCol",
            Header: "",
            accessor: "firstCol",
          });
          for (i = 0; i < response_bands.length; i++) {
            clmns_valuation.push({
              id: `id_${response_bands[i]}`,
              Header: response_bands[i],
              accessor: `accessor_${response_bands[i]}`,
              className: "int",
            });
          }
          setColumnsValuation(clmns_valuation);

          var arr_first_col = [
            {
              id: 0,
              firstCol: getValue("Mean", getLang()),
            },
            {
              id: 1,
              firstCol: getValue("Median", getLang()),
            },
            {
              id: 2,
              firstCol: getValue("NumberOfAwards", getLang()),
            },
            {
              id: 3,
              firstCol: "a1",
            },
            {
              id: 4,
              firstCol: "b",
            },
            // {
            //   id: 5,
            //   firstCol: "rsq"
            // }
          ];

          var arr_linear_results = [];
          for (i = 0; i < arr_first_col.length; i++) {
            arr_linear_results.push({
              id: i,
              firstCol: arr_first_col[i].firstCol,
            });
          }

          var k = 0;
          arr_linear_results.forEach(function (element, index) {
            if (k == 0) {
              for (var j = 0; j < response.data.length; j++) {
                let temp_mean = response.data[j].mean;
                // if(normalizeByGDPc) {
                //   if(temp_mean > 0) {
                //     var counter_mean = 0;
                //     for(counter_mean = 0; temp_mean < 0.1; counter_mean++) {
                //       temp_mean *= 10;
                //     }
                //   }
                // }
                // arr_linear_results[index][`accessor_${response.data[j].band}`] = normalizeByGDPc ? (response.data[j].mean === 0 ? response.data[j].mean : temp_mean.toFixed(3) + ' x10^-' + counter_mean + ' ') : (response.data[j].mean === 0 ? response.data[j].mean : response.data[j].mean.toFixed(3)) ;
                arr_linear_results[index][
                  `accessor_${response.data[j].band}`
                ] = normalizeByGDPc
                  ? response.data[j].mean === 0
                    ? response.data[j].mean
                    : temp_mean.toExponential(1)
                  : response.data[j].mean === 0
                  ? response.data[j].mean
                  : response.data[j].mean.toFixed(3);
              }
            } else {
              if (k == 1) {
                for (var j = 0; j < response.data.length; j++) {
                  let temp_median = response.data[j].median;
                  // if(normalizeByGDPc) {
                  //   if(temp_median > 0) {
                  //     var counter_median = 0;
                  //     for(counter_median = 0; temp_median < 0.1; counter_median++) {
                  //       temp_median *= 10;
                  //     }
                  //   }
                  // }
                  arr_linear_results[index][
                    `accessor_${response.data[j].band}`
                  ] = normalizeByGDPc
                    ? response.data[j].median === 0
                      ? response.data[j].median
                      : temp_median.toExponential(1)
                    : response.data[j].median === 0
                    ? response.data[j].median
                    : response.data[j].median.toFixed(3);
                }
              } else {
                if (k == 2) {
                  for (var j = 0; j < response.data.length; j++) {
                    arr_linear_results[index][
                      `accessor_${response.data[j].band}`
                    ] = response.data[j].numberOfAwards;
                  }
                } else {
                  if (k == 3) {
                    for (var j = 0; j < response.data.length; j++) {
                      var temp_a = response.data[j].avalue;
                      // if(response.data[j].avalue != 0) {
                      //   var temp_a = response.data[j].avalue;
                      //   var counter_a = 0;
                      //   for(counter_a = 0; temp_a < 0.1; counter_a++) {
                      //     temp_a *= 10;
                      //   }
                      // }
                      arr_linear_results[index][
                        `accessor_${response.data[j].band}`
                      ] =
                        response.data[j].avalue == 0
                          ? response.data[j].avalue
                          : temp_a.toExponential(1);
                    }
                  } else {
                    if (k == 4) {
                      for (var j = 0; j < response.data.length; j++) {
                        let temp_b = response.data[j].bvalue;
                        if (normalizeByGDPc) {
                          // if(temp_b > 0) {
                          //   var counter_b = 0;
                          //   for(counter_b = 0; temp_b < 0.1; counter_b++) {
                          //     temp_b *= 10;
                          //   }
                          // }
                        }
                        arr_linear_results[index][
                          `accessor_${response.data[j].band}`
                        ] = normalizeByGDPc
                          ? response.data[j].bvalue == 0
                            ? response.data[j].bvalue
                            : temp_b.toExponential(1)
                          : response.data[j].bvalue == 0
                          ? response.data[j].bvalue
                          : response.data[j].bvalue.toFixed(3);
                      }
                    } /*else {
                      for(var j = 0; j < response.data.length; j++) {
                        arr_linear_results[index][`accessor_${response.data[j].band}`] = response.data[j].rsq.toFixed(3);
                      }
                    }*/
                  }
                }
              }
            }
            k += 1;
          });
          setValuationValues(arr_linear_results);
        }
      })
      .catch((e) => {
        console.log(e);
        LoadingAlert("hide");
      });
  }

  const filterAwards = () => {
    var element = document.getElementById("table-content");
    element.scrollIntoView(true, { block: "start", inline: "nearest" });
    //SaveFilterResult();

    var selectedCountries = [];
    var selectedBands = [];

    for (var i = 0; i < bandOptionsList.length; i++) {
      bandOptionsList[i].isChecked = true;
    }

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
        if (regressionValue.trim() == '') {
            AlertError(getValue("RegressionValueEmpty", getLang()));
            return;
        }
        if (regressionValue < 0) {
            AlertError(getValue("Min%", getLang()));
            return;
        }
        if (regressionValue >= 100) {
            AlertError(getValue("StrictMax%", getLang()));
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
    AwardFilter.discountRate = parseFloat(discountRateValue);
    AwardFilter.term = parseInt(termValue);
    AwardFilter.AdjustByInflationFactor = adjustByInflation;
    AwardFilter.AdjustByGDPFactor = normalizeByGDPc;
    AwardFilter.AdjustByPPPFactor = adjustByPPPFactor;
    AwardFilter.AnnualizePrice = annualizePrices;
    AwardFilter.IsIncludeAnnual = addAnnualPayment;
    AwardFilter.hasRegression = hasRegressionValue;
    AwardFilter.regression = regressionValue.trim() === '' ? 0 : regressionValue;;
    AwardFilter.HasPercentile = hasPercentileValue;
    AwardFilter.UpperPercentile = upperPercentileValueSelected;
    AwardFilter.LowerPercentile = lowerPercentileValueSelected;
    AwardFilter.HasQuartile = hasQuartileValue;
    AwardFilter.KValue = quartileValue;
    AwardFilter.HasStandardDeviation = hasStandardDeviation;
    AwardFilter.StandardDeviationValue = standardDeviationValueAdded;
    AwardFilter.AutoFiltering = hasAutoFiltering;
    AwardFilter.sumBand = $("#sumBands").val();
    //console.log("Spectre_AllowClientToChooseBePositive",localStorage.getItem("Spectre_AllowClientToChooseBePositive"));
    var AllowClientToChooseBePositive = localStorage.getItem("Spectre_AllowClientToChooseBePositive") == "true";
    if(AllowClientToChooseBePositive) {
         search(AwardFilter, true);
    }
    else{
      search(AwardFilter, false);
    }
    
  };

  useEffect(() => {
    APIFunctions.getUserCountries("Benchmark")
      .then((resp) => resp)
      .then((resp) => bindOptions(resp.data));
  }, []);

  const bindOptions = (data) => {
    var arr = [];

    for (var i = 0, l = data.length; i < l; i++) {
      var ob = new Object();
      ob.label = data[i].nameEn;
      ob.labelAr = data[i].nameAr;
      //   ob.label = getLang() == "ar" ? data[i].nameAr : data[i].nameEn;
      ob.value = data[i].countryId;
      ob.regionId = data[i].regionId;
      arr.push(ob);
    }

    console.log(arr);
    setoptions(arr);
  };

  const [columns, setColumns] = useState([]);
  const clmns = [];
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

  const secondTable = useTable(
    {
      columns: columnsValuation,
      data: valuationValues,
      initialState: {
        hiddenColumns: columnsValuation.map((column) => {
          if (column.show === false) return column.accessor || column.id;
        }),
      },
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

  const { pageIndex, pageSize } = firstState;

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

  const setCheckBand = (id, isChecked) => {
    var data = bandOptionsList;
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

  const handleCheckAll = (isChecked) => {
    setCheckAll(isChecked);
    var updatedSelectedCountries = options;
    updatedSelectedCountries.map((row, i) => {
      row.isChecked = isChecked;
    });
    setoptions(updatedSelectedCountries);
  };

  const renderBands = () => {
    var bands = bandOptionsList;
    if (bands != null && bands.length > 0) {
      {
        return bands.map((val, idx) => (
          <div className="form-group">
            <label>
              {val.value}
              <input
                type="checkbox"
                checked={true}
                disabled
                value={true}
                onChange={(e) => setCheckBand(val.value, e.target.checked)}
              />
            </label>
          </div>
        ));
      }
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
              {getLang() == "ar" ? val.labelAr : val.label}
            </label>
          </div>
        ));
      }
    }
  };

  const getUserFilters = () => {
    // LoadingAlert("Show");
    APIFunctions.getUserFilters("Benchmark")
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
          var countries = data.filter((item) => item.field == "Country");
          setMinGDP(minGDP[0].value);
          setMaxGDP(maxValue[0].value);
          setPaired(paired[0].value == "true" ? true : false);
          setUnPaired(unPaired[0].value == "true" ? true : false);
          setPairedUnPaired(pairedUnpaired[0].value == "true" ? true : false);
          setIncludeRegional(regionalLicense[0].value == "true" ? true : false);
          setMultiBand(multiple[0].value == "true" ? true : false);
          setSingleBand(single[0].value == "true" ? true : false);
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
    for (var i = now + 3; i >= 1900; i--) {
      arr_years.push(i);
    }
    return arr_years.map((val, idx) => <option value={val}>{val}</option>);
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

  function inputNumberCheck(e) {
    if (e.which == 69 || e.which == 187 || e.which == 189 || e.which == 109) {
      e.preventDefault();
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
          <div data-title={getValue("LicenseConditions", getLang())}>
            {/* Term */}
            <div className="form-group">
              <label class="lbl-icon-left">
                <span style={{ width: 100 }}>
                  <i class="spectre-filters-license-year"></i>{" "}
                  {getValue("Term", getLang())}
                </span>
                <input
                  type="number"
                  value={termValue}
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
            data-title={getValue("BandSelection", getLang())}
            style={{ cursor: "pointer" }}
          >
            <div className="scrollable" style={{ height: 125 }}>
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
            onClick={() => checkIfCanView("Benchmark")}
          >
            <i class="spectre-search"></i> {getValue("PriceVSGDPc", getLang())}
          </button>
          <button
            type="submit"
            onClick={() => checkIfCanView("Ratio")}
            className="btn btn-success mr-2"
          >
            <img
              width="13px"
              height="13px"
              src={"./public_pages/images/ratio-white.png"}
            />{" "}
            &nbsp;{getValue("RatioOfPrices", getLang())}
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
                            {PriceVsGDPc ? getValue("PriceVSGDPcTitle", getLang()) : getValue("BenchMarkTitle", getLang()) }
                          </h4>
                          <div className="tbl-actions">
                            <button disabled class="btn">
                              <i class="fa fa-refresh"></i>
                            </button>
                            <button disabled class="btn">
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
                              <i class="fa fa-download "></i>
                            </button>
                          </div>
                        </div>
                      </div>
                      <hr style={{ margin: "5px 0" }} />
                    </div>
                  </div>
                  <div
                    style={{ display: myHeader != "" ? "" : "none" }}
                    className="row mb-2"
                  >
                    <div className="col-12 fw-bold">Prise: {myHeader}</div>
                  </div>
                  <div
                    id="table-content"
                    className="col-md-12 list p-0 mb-3 custom-scrollbar"
                    style={{
                      overflowX: "scroll",
                      maxWidth: "100%",
                      height: numberOfAwards == 0 ? "" : "470px",
                    }}
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
                                data-bands={column.className}
                                {...column.getHeaderProps(
                                  column.getSortByToggleProps()
                                )}
                                className="widthGDPc"
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
                                    data-bands={cell.column.className}
                                    {...cell.getCellProps()}
                                    className="widthGDPc"
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

                {/* Linear Regression Results Table */}
                <div
                  style={{ borderRadius: "10px" }}
                  className="entry-content inner-entry-content px-4 py-3 mt-4 mb-4 valuation-case-results"
                >
                  <div className="row">
                    <div className="col-12">
                      <h4
                        className="text-blue-d text-bold"
                        style={{ margin: 0 }}
                      >
                        {getValue("LinearRegressionResult", getLang())}
                      </h4>
                      <div
                        id="table-content"
                        className="col-md-12 p-0 mb-3 list custom-scrollbar"
                        style={{ overflowX: "scroll", maxWidth: "100%" }}
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
                  {getValue("ExportToExcel", getLang())}
                </span>
              </li>
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
    </div>
  );
};

export default Benchmark;
