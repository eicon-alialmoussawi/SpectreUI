import React, { useState, useEffect, useMemo, useRef, Component } from "react";
import APIFunctions from "../utils/APIFunctions";
import dateFormat from "dateformat";
import Select from "react-select";
import { ReactExcel, readFile, generateObjects } from "@ramonak/react-excel";
import { useTable, useSortBy, usePagination } from "react-table";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MultiSelect } from "react-multi-select-component";
import "../css/CustomStyle.css";
import { Alert, LoadingAlert, AlertError } from "../components/f_Alerts";
import Modal from "react-bootstrap/Modal";
import { getValue } from "../Assets/Language/Entries";
import { BindImageURL, validateEmail, getLang } from "../utils/common";

// Valuation Backup
const Valuations2 = (props) => {
  // var newClassName = "current-menu-item";
  // var element_social_id = "social-active";
  // var element_awards_id = "awards-active";
  // var element_pricing_id = "pricing-active";
  // var element = document.getElementById(element_pricing_id);
  // document.getElementById("pricing-active").classList.remove("current-menu-item");
  // document.getElementById("social-active").classList.remove("current-menu-item");
  // element.className += " " + newClassName;

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

  const [columns, setColumns] = useState([]);
  const [columnsValuation, setColumnsValuation] = useState([]);
  const [selected, setSelected] = useState([]);
  const [SelectedBands, setSelectedBands] = useState([]);

  const [popCoveredValue, setPopCoveredValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = React.useState("Transitioning...");
  const [selectedBandRows, setSelectedBandRows] = useState([]);

  const [bands, setBands] = useState([]);
  const [bandId, setBandId] = useState("");
  const [regressionVisibilityValue, setRegressionVisibilityValue] =
    useState("none");
  const [isPPPValue, setPPPValue] = useState("");
  const [quartileVisibiltyValue, setquatileVisibiltyValue] = useState("none");
  const [standardDeviationValue, setstandardDeviationValue] = useState("none");
  const [upperPercentileValue, setUpperPercentileValue] = useState("none");
  const [lowerPercentileValue, setLowerPercentileValue] = useState("none");

  const [hasPercentileValue, setHasPercentileValue] = useState(false);

  const [regionalLicenseValue, setRegionalLicenseValue] = useState(false);
  const [methodTypeValue, setMethodTypeValue] = useState(false);
  const [annualPaymentsValue, setAnnualPaymentsValue] = useState(false);
  const [annualPrizeValue, setAnnualPrizeValue] = useState(false);

  const [selectedPaired, setSelectedPaired] = useState([]);
  const [regionalLicenseForFilter, setRegionalLicenseForFilter] =
    useState(false);
  const [methodTypeValueForFilter, setMethodTypeValueForFilter] =
    useState(false);

  const [adjustByPPPValueForFilter, setAdjustByPPPValueForFilter] = useState(0);
  const [normalizeByGDPValue, setNormalizeByGDPValue] = useState(0);
  const [inflationFactorValue, setInflationFactorValue] = useState(0);
  const [normalizeByGdp, setNormalizeByGdp] = useState(0);
  const [inflationFactor, setInflationFactor] = useState(0);

  const [adjustByPPPValue, setAdjustByPPPValue] = useState(false);

  const [annualPaymentForFilter, setannualPaymentForFilter] = useState(false);
  const [annualPrizeValueForFilter, setAnnualPrizeValueForFilter] =
    useState(false);

  const [bandTypeValue, setBandTypeValue] = useState("");

  const [pairedValue, setPairedValue] = useState("");
  const [pairedValueForFilter, setPairedValueForFilter] = useState("");

  const [awards, setAwards] = useState([]);
  const [valuationValues, setValuationValues] = useState([]);
  const awardsRef = useRef();
  const [startDate, setStartDate] = useState(new Date());
  const [issueDate, setIssueDate] = useState(new Date());

  const [ToDate, setToDate] = useState(new Date());

  const [selectedCountry, setSelectedCountry] = useState("");
  const [CountryValueFiltered, setCountryValueForFilter] = useState("");
  const [selectedCountryValue, setSelectedCountryValue] = useState("");
  const [resultFilter, emplistFilter] = useState([]);
  const [countryId, setCountryId] = useState("");
  const [minGDPValue, setMinGDP] = useState("");
  const [discountRateValue, setDiscountRate] = useState("");

  const [maxGDPValue, setMaxGDP] = useState("");
  const [termValue, setTermValue] = useState("");
  const [discountValue, setDiscountValue] = useState("");
  const [annualPayment, setAnnualPayments] = useState("");
  const [addjustPP, setAdjustPPP] = useState("");
  const [sumBandsValue, setSumBandsValue] = useState("");
  const [sumBandsValueFiltered, setSumBandsValueFiltered] = useState("");

  const [awardTypeValue, setAwardTypeValue] = useState("");
  const [awardTypeSelectedValue, setAwardTypeSelectedValue] = useState("");

  const [hasRegressionValue, setHasRegressionValue] = useState(false);
  const [regressionValue, setRegressionValue] = useState(0);

  const [upperPercentileValueSelected, setUpperPercentileValueSelected] =
    useState(0);
  const [lowerPercentilteValueSelected, setLowerPercentilteValueSelected] =
    useState(0);

  const [hasQuartileValue, setHasQuartileValue] = useState(false);
  const [quartileValue, setQuartileValue] = useState(0);
  const [standardDeviationValueInput, setStandardDeviationInput] = useState(0);

  const [hasStandardDeviation, sethasStandardDeviation] = useState(false);
  const [standardDeviationValueAdded, setstandardDeviationValueAdded] =
    useState(0);

  const [distancingData, setDistancingData]= useState([]);
  const [options, setoptions] = useState([]);

  const [arrayOfPrices, setArrayOfPrices] = useState([]);
  const OptionsChart = {
    series: [
      {
        name: "Website Blog",
        type: "column",
        data: arrayOfPrices == null ? [] : arrayOfPrices,
      },
      {
        name: "Social Media",
        type: "line",
        data: [42, 42, 42, 42, 42, 42, 42, 31, 22, 22, 12, 16],
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "line",
      },
      stroke: {
        width: [0, 4],
      },
      title: {
        text: "Traffic Sources",
      },
      dataLabels: {
        enabled: false,
        enabledOnSeries: [1],
      },

      xaxis: {
        type: "datetime",
      },
      yaxis: [
        {
          title: {
            text: "Website Blog",
          },
        },
        {
          opposite: true,
          title: {
            text: "Social Media",
          },
        },
      ],
    },
  };

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
  const awardsTypes = [
    { value: 1, label: "Average Awards" },
    { value: 0, label: "Unique" },
    { value: -1, label: "Average sum of prices/ sum of MHz " },
  ];
  const bandOptions = [
    { value: "m", label: getValue("All", getLang()) },
    { value: "s", label: getValue("SingleBand", getLang()) },
    { value: "i", label: getValue("MultiBand", getLang()) },
  ];
  const regionalLicenseOptions = [
    { value: true, label: getValue("Yes", getLang()) },
    { value: false, label: getValue("No", getLang()) },
  ];

  const methodTypesOptions = [
    { value: 0, label: getValue("Value/Regression", getLang()) },
    { value: 1, label: getValue("Value/Bencmark", getLang()) },
    { value: -1, label: getValue("Value/Distance", getLang()) },
  ];
  const annualPayments = [
    { value: 1, label: getValue("Yes", getLang()) },
    { value: 0, label: getValue("No", getLang()) },
  ];
  const addjustByPPP = [
    { value: 1, label: getValue("Yes", getLang()) },
    { value: 0, label: getValue("No", getLang()) },
  ];
  const normalizeByGDP = [
    { value: 1, label: getValue("Yes", getLang()) },
    { value: 0, label: getValue("No", getLang()) },
  ];
  const adjustInflation = [
    { value: 1, label: getValue("Yes", getLang()) },
    { value: 0, label: getValue("No", getLang()) },
  ];
  const excOutliers = [
    { value: 0, label: getValue("Percentile", getLang()) },
    { value: 1, label: getValue("IterativeRegression", getLang()) },
    { value: 2, label: getValue("Interquartile", getLang()) },
    { value: 3, label: getValue("StandardDeviation", getLang()) },
    { value: 4, label: getValue("AutoFiltering", getLang()) },
  ];
  const annualizePrice = [
    { value: 1, label: getValue("Yes", getLang()) },
    { value: 0, label: getValue("No", getLang()) },
  ];
  const showMarkers = [
    { value: 1, label: getValue("Yes", getLang()) },
    { value: 0, label: getValue("No", getLang()) },
  ];
  const sumBands = [
    { value: "pu", label: getValue("PairedUnpaired", getLang()) },
    { value: "p", label: getValue("Paired", getLang()) },
    { value: "u", label: getValue("Unpaired", getLang()) },
  ];

  const pairOptions = [
    { value: -1, label: getValue("PairedUnpaired", getLang()) },
    { value: 1, label: getValue("Paired", getLang()) },
    { value: 0, label: getValue("Unpaired", getLang()) },
  ];

  awardsRef.current = awards;
  const ShowPlot = () => {
    setIsOpen(true);
  };
  useEffect(() => {
    APIFunctions.getAllFilters("Pricing")
      .then((resp) => resp)
      .then((resp) => emplistFilter(resp.data));
  }, []);

  const handleChangeCountry = (selectedOptions) => {
    console.log(selectedOptions.value);
    setCountryValueForFilter(selectedOptions.value);
    console.log(CountryValueFiltered);
    setSelectedCountry(selectedOptions.value);
  };
  const handleChange = (idx) => (e) => {
    const { name, value } = e.target;
    var arr = selectedBandRows;
    arr[idx].term = value;

    // for (var i = 0, l = SelectedBands.length; i < l; i++) {
    //   SelectedBands[i].term = 0;
    //   if (SelectedBands[i].value == selectedBandRows[idx].band) {
    //   }
    // }
    setSelectedBandRows(arr);
    console.log(arr);
  };
  const handleChangePPP = (event) => {
    setPPPValue(false);
  };
  const handleChangePPP2 = (event) => {
    setPPPValue(true);
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

    APIFunctions.addFilterPricing(arr)
      .then((response) => {})
      .catch((e) => {
        console.log(e);
      });
  };
  const hideModal = () => {
    setIsOpen(false);
    setTitle("Transitioning...");
  };
  const handleChangePaired = (selectedOptions) => {
    AwardFilter.IsPairedAndUnPaired = selectedOptions.id;
    setPairedValue(selectedOptions.id);
    setPairedValueForFilter(selectedOptions.value);
  };
  const handleChangeRegionalLicense = (selectedOptions) => {
    setRegionalLicenseForFilter(selectedOptions.value);
    setRegionalLicenseValue(selectedOptions.id);
  };
  const handleChangeMethodType = (selectedOptions) => {
    setMethodTypeValueForFilter(selectedOptions.value);
    setMethodTypeValue(selectedOptions.id);
  };

  const handleChangeaAjustByPPPValue = (selectedOptions) => {
    setAdjustByPPPValueForFilter(selectedOptions.value);
    setAdjustByPPPValue(selectedOptions.id);
  };
  const handleChangeNormalizeGDP = (selectedOptions) => {
    setNormalizeByGdp(selectedOptions.value);
    setNormalizeByGDPValue(selectedOptions.id);
  };
  const handleChangeInflationFactor = (selectedOptions) => {
    setInflationFactor(selectedOptions.value);
    setInflationFactorValue(selectedOptions.id);
  };
  const handleChanegPopCovered = (event) => {
    const { name, value } = event.target;
    setPopCoveredValue(value);
  };

  const handleChangeAnnualPayment = (selectedOptions) => {
    setannualPaymentForFilter(selectedOptions.value);
    setAnnualPaymentsValue(selectedOptions.id);
  };
  const handleChangeAnnualizePriceValue = (selectedOptions) => {
    setAnnualPrizeValueForFilter(selectedOptions.value);
    setAnnualPrizeValue(selectedOptions.id);
  };
  const modalLoaded = () => {
    setTitle("Pricing Plot");
  };

  const checkIfCanView = () => {
    APIFunctions.checkIfCanView("Valuations")
      .then((response) => {
        if (response.data) {
          filterAwards();
        } else {
          AlertError("Feature not available, please upgrade your package");
          return;
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const doDistancing = () => {
    var obj = new Object();
    var bandsArray = [];
    for (var i = 0, l = SelectedBands.length; i < l; i++) {
      bandsArray.push(SelectedBands[i].value);
    }
    AwardFilter.Band = bandsArray.join(",");

    obj.ValutatedCountryId = parseInt(CountryValueFiltered);
    obj.TargetBand = bandsArray.join(",");
    obj.FilteredAwards = distancingData;

    console.log(obj);

    APIFunctions.getDistancingResult(obj)
    .then((resp) => resp)
    .then((resp) => console.log(resp.data));

  }

  const handleCheckbox = (name, country, band, arr) => {
    console.log(arr);
    var count = document.querySelectorAll("[name='"+name+"[]']").length;
    var checked = document.querySelectorAll("[name='"+name+"[]']:checked").length;
    var target_band = selectedBandRows[0].band;
    
    if(target_band == band && checked == 0) {
      var all = document.querySelectorAll("[data-country='"+country+"']");
      for(var i = 0; i < all.length; i++) {
        document.querySelectorAll("[data-country='"+country+"']")[i].checked = false;
      }
    } else {
      if(target_band < band && checked == 0) {
        var f = 0;
        for(var i = 0; i < arr.length; i++) {
          if(target_band < arr[i].Band) {
            var c = document.querySelectorAll(`[data-country="${country}"][data-band="${arr[i].Band}"]`);
            for(var j = 0; j < c.length; j++) {
              if(c[j].checked) {
                f = 1;
                break;
              }
            }
          }
        }
        if(f == 0) {
          var all = document.querySelectorAll("[data-country='"+country+"']");
          for(var i = 0; i < all.length; i++) {
            document.querySelectorAll("[data-country='"+country+"']")[i].checked = false;
          }
        }
      } 
      if(target_band > band && checked == 0) {
        var f = 0;
        for(var i = 0; i < arr.length; i++) {
          if(target_band > arr[i].Band) {
            var c = document.querySelectorAll(`[data-country="${country}"][data-band="${arr[i].Band}"]`);
            for(var j = 0; j < c.length; j++) {
              if(c[j].checked) {
                f = 1;
                break;
              }
            }
          }
        }
        if(f == 0) {
          var all = document.querySelectorAll("[data-country='"+country+"']");
          for(var i = 0; i < all.length; i++) {
            document.querySelectorAll("[data-country='"+country+"']")[i].checked = false;
          }
        }
      }
    }
  }

  const filterAwards = () => {
    var element = document.getElementById("table-content");
    element.scrollIntoView(true, { block: "start", inline: "nearest" });
    //SaveFilterResult();
    if (discountRateValue == "") setDiscountRate(null);
    if (termValue == "") setTermValue(null);
    AwardFilter.ISPPP = isPPPValue;
    AwardFilter.ISIMF = false;

    AwardFilter.IsPairedAndUnPaired = false;
    AwardFilter.IsPaired = false;

    AwardFilter.IsUnPaired = false;
    for (var i = 0, l = selectedPaired.length; i < l; i++) {
      if (selectedPaired[i].value == -1) {
        AwardFilter.IsPairedAndUnPaired = true;
      }
      if (selectedPaired[i].value == 0) {
        AwardFilter.IsUnPaired = true;
      }
      if (selectedPaired[i].value == 1) {
        AwardFilter.IsPaired = true;
      }
    }

    if (awardTypeSelectedValue == -1) AwardFilter.AverageSumPricesAndMHZ = true;
    else AwardFilter.AverageSumPricesAndMHZ = false;
    if (awardTypeSelectedValue == 1) AwardFilter.averageAwards = true;
    else AwardFilter.averageAwards = false;
    if (awardTypeSelectedValue == 0) AwardFilter.uniqueAwards = true;
    else AwardFilter.uniqueAwards = false;

    AwardFilter.regionalLicense = regionalLicenseForFilter;
    AwardFilter.FromYear = startDate.getFullYear();
    AwardFilter.ToYear = ToDate.getFullYear();

    AwardFilter.MinGDP = parseInt(minGDPValue);
    AwardFilter.MaxGDP = parseInt(maxGDPValue);
    AwardFilter.issueDate = issueDate.getFullYear();
    AwardFilter.discountRate = parseFloat(discountRateValue);
    AwardFilter.term = 0;
    
    console.log('aaaa');
    console.log(sumBandsValueFiltered);

    AwardFilter.sumBand = sumBandsValueFiltered;

    if (awardTypeSelectedValue == 1) AwardFilter.averageAwards = true;
    else AwardFilter.averageAwards = false;
    if (awardTypeSelectedValue == 0) AwardFilter.uniqueAwards = true;
    else AwardFilter.uniqueAwards = false;
    if (awardTypeSelectedValue == -1) AwardFilter.AverageSumPricesAndMHZ = true;
    else AwardFilter.AverageSumPricesAndMHZ = false;

    AwardFilter.hasRegression = hasRegressionValue;
    AwardFilter.regression = regressionValue;
    AwardFilter.HasPercentile = hasPercentileValue;
    AwardFilter.UpperPercentile = parseFloat(upperPercentileValueSelected);
    AwardFilter.LowerPercentile = parseFloat(lowerPercentilteValueSelected);
    AwardFilter.HasQuartile = hasQuartileValue;
    AwardFilter.KValue = quartileValue;
    AwardFilter.HasStandardDeviation = hasStandardDeviation;
    AwardFilter.StandardDeviationValue = standardDeviationValueAdded;

    AwardFilter.AdjustByInflationFactor = inflationFactor == 1 ? true : false;
    AwardFilter.AdjustByGDPFactor = normalizeByGdp == 1 ? true : false;
    AwardFilter.AdjustByPPPFactor =
      adjustByPPPValueForFilter == 1 ? true : false;
    AwardFilter.AnnualizePrice = annualPrizeValueForFilter == 1 ? true : false;
    AwardFilter.IsIncludeAnnual = annualPaymentForFilter == 1 ? true : false;
    AwardFilter.IsSingle = true;
    AwardFilter.IsMultiple = false;

    console.log(methodTypeValueForFilter);
    if (methodTypeValueForFilter == 0) AwardFilter.IsRegression = true;
    else AwardFilter.IsRegression = false;
    if (methodTypeValueForFilter == 1) AwardFilter.IsBenchMark = true;
    else AwardFilter.IsBenchMark = false;
    if (methodTypeValueForFilter == -1) AwardFilter.IsDistance = true;
    else AwardFilter.IsDistance = false;
    AwardFilter.EnforeBPositive = "0";
    // AwardFilter.IsRegression = false;
    // AwardFilter.IsBenchMark = false;
    // AwardFilter.IsDistance = false;
    AwardFilter.CountryId = CountryValueFiltered.toString();
    AwardFilter.PopCovered = popCoveredValue == "" ? 0 : parseFloat(popCoveredValue);



    if (methodTypeValueForFilter == -1 && selectedBandRows.length > 1) {
      alert(
        "You cannot choose more than one band for valuation by distance method"
      );
      setAwards([]);
      setArrayOfPrices([]);
      setColumns([]);
      setColumnsValuation([]);
      return;
    }
    
    console.log(selectedBandRows);
    var value2 = [];
    var bandCount = [];
    var bandSum = [];
    var bandMean = [];
    var bandMedian = [];
    var bandValues = [];
    for (var i = 0, l = selectedBandRows.length; i < l; i++) {
      value2.push(selectedBandRows[i].term);
      bandCount.push({
        "band": selectedBandRows[i].band,
        "count_value": 0
      });
      bandSum.push({
        "band": selectedBandRows[i].band,
        "sum_value": 0
      });
      bandMean.push({
        "band": selectedBandRows[i].band,
        "mean_value": 0
      });
      bandMedian.push({
        "band": selectedBandRows[i].band,
        "median_value": 0
      });
      bandValues.push({
        "band": selectedBandRows[i].band,
        "band_values": []
      });
    }
    // console.log(bandCount);
    AwardFilter.Terms = value2.join(",");
    var value = [];
    for (var i = 0, l = selected.length; i < l; i++) {
      value.push(selected[i].value);
    }
    AwardFilter.countryIds = value.join(",");

    var bandsArray = [];
    for (var i = 0, l = SelectedBands.length; i < l; i++) {
      bandsArray.push(SelectedBands[i].value);
    }
    AwardFilter.Band = bandsArray.join(",");
    AwardFilter.BandTerms = selectedBandRows;

    console.log(AwardFilter);
    LoadingAlert("Show");
    APIFunctions.FilterValuations(AwardFilter)
      .then((response) => {
        //   console.log(response.data);
        LoadingAlert("Hide");
        var arrFiltered = [];
        console.log(response.data);

        response.data.forEach(function (element, index) {
          var commonAwards = response.data.filter(
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
            });
          }
        });
        console.log(arrFiltered);
        if (methodTypeValueForFilter == -1) {

       
          var arr = response.data;
          setDistancingData(arr);
          var clmns = [];
          clmns.push({
            id: "checkBox",
            Header: "",
            Cell: (props) => {
              const band = props.row.cells[2].value;
              const country = props.row.cells[1].value;
              const chkName = country+"_band_"+band;
              var new_arr = arrFiltered.filter(function (el) {
                return el.CountryName == country;
              }); 
              return (
                <div>
                  <input 
                    type="checkbox" 
                    name={chkName+"[]"}
                    onChange={() => handleCheckbox(chkName, country, band, new_arr)}
                    data-country={country}
                    data-band={band}
                    defaultChecked
                  />
                </div>
              );
            },
          });
          clmns.push({
            id: "Country",
            Header: getValue("Country", getLang()),
            accessor: "CountryName",
          });
          clmns.push({
            id: "Band",
            Header: getValue("Bands", getLang()),
            accessor: "Band",
          });
          clmns.push({
            id: "awardDate",
            Header: getValue("AwardDate", getLang()),
            accessor: "Year",
          });

          clmns.push({
            id: "NumberOfAwards",
            Header: "Number Of Awards",
            accessor: "NumberOfAwards",
          });


          clmns.push({
            id: "Price",
            Header: "Price",
            accessor: "Price",
          });

          setColumns(clmns);

          console.log(arrFiltered);

          setAwards(arrFiltered);

          var arr2 = arr.map(function (val) {
            return val.gdp;
          });
          setArrayOfPrices(arr2);
        } 
        else {
          if(methodTypeValueForFilter == 0) {
            // value / regression
            var arr = response.data;
            var clmns = [];
            clmns.push({
              id: "Country",
              Header: getValue("Country", getLang()),
              accessor: "countryName",
            });
            clmns.push({
              id: "AwardDate",
              Header: getValue("AwardDate", getLang()),
              accessor: "year",
            });
            clmns.push({
              id: "Bands",
              Header: getValue("Bands", getLang()),
              accessor: "band",
            });
            clmns.push({
              id: "Operator",
              Header: getValue("Operator", getLang()),
              accessor: "operatorName",
            });
            clmns.push({
              id: "Terms",
              Header: getValue("Term", getLang()),
              accessor: "terms",
              Cell: (props) => {
                if (props.value != null)
                  return props.value;
                else return "";
              },
            });
            clmns.push({
              id: "GDP",
              Header: "GDPc",
              accessor: "gdp",
                show: true,
                Cell: (props) => {
                  if (props.value != null)
                    return props.value
                      .toFixed(3)
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                  else return "";
                },
            });
            clmns.push({
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
            });
            clmns.push({
              id: "Price",
              Header: "Price $M",
              accessor: "upFrontFees",
            });
            clmns.push({
              id: "Mhz",
              Header: "$/MHZ/pop x1",
              accessor: "price",
              Cell: (props) => {
                if (props.value != null)
                  return parseFloat(props.value).toFixed(3);
                else return "";
              },
            });

            setColumns(clmns);

            setAwards(response.data);
            var arr2 = arr.map(function (val) {
              return val.gdp;
            });
            setArrayOfPrices(arr2);
          }
          else {
            // value / benchmark
            var arr = response.data;
            console.log(arr);
            var clmns = [];
            clmns.push({
              id: "Country",
              Header: getValue("Country", getLang()),
              accessor: "countryName",
            });
  
            clmns.push({
              id: "awardDate",
              Header: getValue("AwardDate", getLang()),
              accessor: "year",
            });
  
            clmns.push({
              id: "Band",
              Header: getValue("Bands", getLang()),
              accessor: "band",
            });
            clmns.push({
              id: "POP",
              Header: getValue("Pop", getLang()),
              accessor: "pop",
              Cell: (props) => {
                if (props.value == null) return "";
                if (Number.isInteger(props.value)) return props.value;
                else return props.value.toFixed(3);
              },
            });
            clmns.push({
              id: "GDPc",
              Header: "GDPc",
              accessor: "gdp",
              Cell: (props) => {
                if (props.value != null)
                  return props.value
                    .toFixed(3)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                else return "";
              },
            });
  
            for (var i = 0; i < selectedBandRows.length; i++) {
              clmns.push({
                id: i,
                Header: selectedBandRows[i].band,
                accessor: `value_${selectedBandRows[i].band}`,
              });
            }
  
            clmns.push({
              id: "AllBands",
              Header: getValue("AllBands", getLang()),
              accessor: "allBands",
            });
            setColumns(clmns);
  
            response.data.forEach(function (element, index) {
              if (element.price != null) {
                response.data[index][`value_${element.band}`] =
                  element.price.toFixed(3); 
                response.data[index]["allBands"] = element.price.toFixed(3);
  
                // band count
                for(var i = 0; i < bandCount.length; i++) {
                  if(element.band == bandCount[i].band) {
                    var nbr = bandCount[i].count_value;
                    nbr += 1;
                    bandCount[i].count_value = nbr;
                  }
                }
  
                // band sum
                for(var i = 0; i < bandSum.length; i++) {
                  if(element.band == bandSum[i].band) {
                    var sum = parseFloat(bandSum[i].sum_value);
                    sum += parseFloat(element.price);
                    bandSum[i].sum_value = sum.toFixed(3);
                  }
                }
  
                // band values
                for(var i = 0; i < bandValues.length; i++) {
                  if(element.band == bandValues[i].band) {
                    var val = element.price.toFixed(3);
                    bandValues[i].band_values[bandValues[i].band_values.length] = val;
                  }
                }
  
              } else {
                response.data[index][`value_${element.band}`] = "";
                response.data[index]["allBands"] = "";
              }
            });
            console.log(bandCount);
            console.log(bandSum);
            console.log(bandValues);
  
            // mean
            for(var i = 0; i < bandCount.length; i++) {
              var mean = bandSum[i].sum_value / bandCount[i].count_value;
              bandMean[i].mean_value = mean.toFixed(3);
            }
            console.log(bandMean);
  
            // median
            for(var i = 0; i < bandValues.length; i++) {
              var values = bandValues[i].band_values;
              var median = 0;
              values.sort(function(a,b){
                return a-b;
              });
            
              var half = Math.floor(values.length / 2);

              if(values.length % 2)
                median = parseFloat(values[half]);
              else {
                median = (parseFloat(values[half - 1]) + parseFloat(values[half])) / 2.0;
              }
                

            //  median = parseFloat(0.367+0.338) / 2.0
            //  console.log(median);
              
              bandMedian[i].median_value = median.toFixed(3);
            }
            console.log(bandMedian);
  
            var clmns_valuation = [];
            clmns_valuation.push({
              id: "firstCol",
              Header: "",
              accessor: "firstCol",
            });
            for(i = 0;i < bandMedian.length; i++) {
              clmns_valuation.push({
                id: `id_${bandMedian[i].band}`,
                Header: bandMedian[i].band,
                accessor: `accessor_${bandMedian[i].band}`
              });
            }
            clmns_valuation.push({
              id: "allBands",
              Header: "All Bands",
              accessor: "allBands"
            });
  
  
            setColumnsValuation(clmns_valuation);
  
            var arr_first_col = [];
            arr_first_col.push({
              id: 0,
              firstCol: "Number of Awards"
            });
            arr_first_col.push({
              id: 1,
              firstCol: "License Term"
            });
            arr_first_col.push({
              id: 2,
              firstCol: "Price Based on Mean ($/MHz/pop)"
            });
            arr_first_col.push({
              id: 3,
              firstCol: "Price Based on Median ($/MHz/pop)"
            });
            arr_first_col.push({
              id: 4,
              firstCol: "Population"
            });
  
            var arr_valuation_values = [];
            for(i = 0; i < arr_first_col.length; i++) {
              arr_valuation_values.push({
                id: i,
                firstCol: arr_first_col[i].firstCol
              });
            }

            console.log(arr_valuation_values);

            var k = 0;
            arr_valuation_values.forEach(function (element, index) {
              if(k == 0) {
                var s = 0;
                for(var j = 0;j < selectedBandRows.length; j++) {
                  arr_valuation_values[index][`accessor_${selectedBandRows[j].band}`] = bandCount[j].count_value;
                  s = s + parseInt(bandCount[j].count_value);
                }
                arr_valuation_values[index]["allBands"] = s;
              } else {
                if(k == 1) {
                  var uniqueBands = [];
                  for(var j = 0;j < selectedBandRows.length; j++) {
                    arr_valuation_values[index][`accessor_${selectedBandRows[j].band}`] = selectedBandRows[j].term;
                    uniqueBands[uniqueBands.length] = selectedBandRows[j].term; 
                  }
                  uniqueBands = uniqueBands.filter(function(item, pos) {
                    return uniqueBands.indexOf(item) == pos; 
                  });
                  console.log(uniqueBands);
                  var strBands = '';
                  for(j = 0; j < uniqueBands.length; j++) {
                    if(j == uniqueBands.length - 1)
                      strBands += uniqueBands[j];
                    else
                      strBands += uniqueBands[j] + ' / ';
                  }
                  arr_valuation_values[index]["allBands"] = strBands;
                } else {
                  if(k == 2) {
                    for(var j = 0;j < selectedBandRows.length; j++) {
                      arr_valuation_values[index][`accessor_${selectedBandRows[j].band}`] = bandMean[j].mean_value;
                    }
                    var s_sum = 0;
                    var s_count = 0;
                    for(var j = 0; j < bandCount.length; j++) {
                      s_sum += parseFloat(bandSum[j].sum_value);
                      s_count += parseFloat(bandCount[j].count_value);
                    }
                    arr_valuation_values[index]["allBands"] = (s_sum / s_count).toFixed(3);
                  } else {
                    if(k == 3) {
                      for(var j = 0;j < selectedBandRows.length; j++) {
                        arr_valuation_values[index][`accessor_${selectedBandRows[j].band}`] = bandMedian[j].median_value;
                      }
                      var arr_all_values = [];
                      for(var j = 0;j < bandValues.length; j++) {
                        var temp = bandValues[j].band_values;
                        var child = arr_all_values;
                        arr_all_values = child.concat(temp);
                      }
                      for(var j = 0;j < arr_all_values.length; j++) {
                        arr_all_values[j] = parseFloat(arr_all_values[j]);
                      }
                      // console.log(arr_all_values);
                      var median = 0;
                      arr_all_values.sort(function(a,b){
                        return a-b;
                      });
                    
                      var half = Math.floor(arr_all_values.length / 2);
                      
                      if(arr_all_values.length % 2)
                        median = parseFloat(arr_all_values[half]);
                      else
                        median = (parseFloat(arr_all_values[half - 1] + arr_all_values[half])) / 2.0;
                      arr_valuation_values[index]["allBands"] = median;
                    } else {
                      for(var j = 0;j < selectedBandRows.length; j++) {
                        arr_valuation_values[index][`accessor_${selectedBandRows[j].band}`] = popCoveredValue;
                      }
                      arr_valuation_values[index]["allBands"] = popCoveredValue;
                    }
                  }
                }
              }
              k += 1;
            });
  
            setValuationValues(arr_valuation_values);
  
            setAwards(response.data);
            var arr2 = arr.map(function (val) {
              return val.gdp;
            });
            setArrayOfPrices(arr2);
  
            console.log(arr2)
          }
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const getPOPValue = () => {
    console.log(selectedCountry);
    APIFunctions.GetByCountryAndYear(
      selectedCountry,
      issueDate.getFullYear(),
      AwardFilter.ISIMF
    )
      .then((response) => {
        setPopCoveredValue(response.data.value);
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  useEffect(() => {
    APIFunctions.getAllBands()
      .then((resp) => resp)
      .then((resp) => setBands(resp.data));
  }, []);

  useEffect(() => {
    APIFunctions.getUserCountries("Valuations")
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

  const handleDiscountRateChange = (event) => {
    const { name, value } = event.target;
    setDiscountRate(value);
    AwardFilter.discountRate = value;
  };

  const handleRegressionValue = (event) => {
    const { name, value } = event.target;
    setRegressionValue(value);
  };
  const handleChangeQuartile = (event) => {
    const { name, value } = event.target;
    setQuartileValue(value);
  };
  const handleStandardDeviationValue = (event) => {
    const { name, value } = event.target;
    setstandardDeviationValueAdded(value);
  };
  const handleUpperPercentileValue = (event) => {
    const { name, value } = event.target;
    setUpperPercentileValueSelected(value);
  };
  const handleLowerPercentileValue = (event) => {
    const { name, value } = event.target;
    setLowerPercentilteValueSelected(value);
  };
  const handleMaxGdpChange = (event) => {
    const { name, value } = event.target;
    setMaxGDP(value);
    AwardFilter.MaxGDP = value;
  };

  const handleTermChange = (event) => {
    const { name, value } = event.target;
    setTermValue(value);

    AwardFilter.term = value;
  };

  const handleChangeSumBands = (selectedOptions) => {
    AwardFilter.sumBands = selectedOptions.id;
    setSumBandsValue(selectedOptions.id);
    setSumBandsValueFiltered(selectedOptions.value);
  };
  const handleChangeAwardType = (selectedOptions) => {
    //  AwardFilter.sumBands = selectedOptions.id;
    setAwardTypeValue(selectedOptions.id);
    setAwardTypeSelectedValue(selectedOptions.value);
  };
  const handleChangeExcOutliers = (selectedOptions) => {
    if (selectedOptions.value == 0) {
      setLowerPercentileValue("block");
      setUpperPercentileValue("block");
      setHasPercentileValue(true);
    } else {
      setUpperPercentileValue("none");
      setLowerPercentileValue("none");
      setHasPercentileValue(false);
    }

    if (selectedOptions.value == 1) {
      setRegressionVisibilityValue("block");
      setHasRegressionValue(true);
    } else {
      setRegressionVisibilityValue("none");
      setHasRegressionValue(false);
    }
    if (selectedOptions.value == 2) setquatileVisibiltyValue("block");
    else setquatileVisibiltyValue("none");
    if (selectedOptions.value == 3) {
      setstandardDeviationValue("block");
      sethasStandardDeviation(true);
    } else {
      setstandardDeviationValue("none");
      sethasStandardDeviation(false);
    }

    //if(selectedOptions.value==3)
    //sethasStandardDeviation("")
  };
  const handleChangeBands = (selectedOptions) => {
    var value = [];
    var arr = [];

    for (var i = 0, l = selectedOptions.length; i < l; i++) {
      value.push(selectedOptions[i].value);
      const item = {};

      item.band = selectedOptions[i].value;

      for (var i2 = 0, l2 = selectedBandRows.length; i2 < l2; i2++) {
        if (selectedBandRows[i2].band == selectedOptions[i].value) {
          console.log(selectedBandRows[i2]);
          item.term = selectedBandRows[i2].term;
        }
      }
      arr.push(item);
    }
    //setBands(selectedOptions);
    setSelectedBands(selectedOptions);
    AwardFilter.Band = value.join(",");

    setSelectedBandRows(arr);
  };

  const handleNewField = (value) => ({
    label: value,
    value: value.toUpperCase(),
  });
  const handleChangeFilter = (selectedOptions) => {
    APIFunctions.GetDetailsByFilterId(selectedOptions.id)
      .then((response) => {
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
    setBandTypeValue(selectedOptions.id);
  };
  const handleAwardType = (selectedOptions) => {
    AwardFilter.IsPaired = selectedOptions.value;
  };
  // const columns = useMemo(
  //   () => [
  //     {
  //       Header: "Country",
  //       accessor: "countryName",
  //     },
  //     {
  //       Header: "Award Date",
  //       accessor: "year",
  //     },
  //     {
  //       Header: "Band",
  //       accessor: "band",
  //     },

  //     {
  //       Header: "POP",
  //       accessor: "pop",
  //       Cell: (props) => {
  //         if (props.value == null) return "";
  //         if (Number.isInteger(props.value)) return props.value;
  //         else return props.value.toFixed(3);
  //       },
  //     },
  //     {
  //       Header: "GDPc",
  //       accessor: "gdp",
  //       show: true,
  //       Cell: (props) => {
  //         if (props.value != null)
  //           return props.value
  //             .toFixed(3)
  //             .toString()
  //             .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  //         else return "";
  //       },
  //     },

  //     {
  //       Header: "Creation Date",
  //       accessor: "creationDate",
  //       Cell: (props) => {
  //         return dateFormat(props.creationDate, "mmmm dS, yyyy");
  //       },
  //     },
  //   ],
  //   []
  // );

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
                  style={{ borderRadius: "10px" }}
                  className="entry-content inner-entry-content mt-5 px-5 py-4"
                >
                  <div className="row mb-4">
                    <div className="col-12 text-center">
                      <div className="row">
                        <div className="col-12 text-left">
                          <h3 className="text-black text-bold">Valuations</h3>
                        </div>
                      </div>
                      <div className="row mt-4 mb-4">
                        <div className="form-group col-2 text-left">
                          <label className="text-black" htmlFor="description">
                            {getValue("Bands", getLang())}
                          </label>
                          <Select
                            id="ddlBands"
                            name="bandId"
                            getOptionLabel={(option) => option.value}
                            getOptionValue={(option) => option.id}
                            options={bands}
                            isMulti
                            value={SelectedBands}
                            allowSelectAll={true}
                            onChange={handleChangeBands}
                          ></Select>
                        </div>
                        <div className="form-group col-2 text-left">
                          <label className="text-black" htmlFor="description">
                            {getValue("Countries", getLang())}
                          </label>
                          <MultiSelect
                            getOptionValue={(option) => option.countryId}
                            options={options}
                            value={selected}
                            onChange={setSelected}
                            labelledBy="Select"
                          />
                        </div>
                        <div className="form-group col-2 text-left">
                          <label className="text-black" htmlFor="description">
                            Choose Paired{" "}
                          </label>
                          <MultiSelect
                            getOptionValue={(option) => option.id}
                            options={pairOptions}
                            value={selectedPaired}
                            onChange={setSelectedPaired}
                            labelledBy="Select"
                          />
                        </div>
                        <div className="form-group col-2 text-left">
                          <label className="text-black" htmlFor="description">
                            {getValue("RegionalLicenses", getLang())}{" "}
                          </label>
                          <Select
                            options={regionalLicenseOptions}
                            value={regionalLicenseValue}
                            onChange={handleChangeRegionalLicense}
                          ></Select>
                        </div>
                        <div className="form-group col-1 text-left">
                          <label className="text-black" htmlFor="value">
                            {getValue("MinGDPc", getLang())}{" "}
                          </label>
                          <input
                            type="number"
                            className="form-control w-100 cstm-input"
                            id="txtValue"
                            name="value"
                            placeholder="Min GDP"
                            value={minGDPValue}
                            onChange={handleMinGdpChange}
                          />
                        </div>
                        <div className="form-group col-1 text-left">
                          <label className="text-black" htmlFor="value">
                            {getValue("MaxGDPc", getLang())}{" "}
                          </label>
                          <input
                            type="number"
                            className="form-control w-100 cstm-input"
                            id="txtValue"
                            name="value"
                            placeholder="Max GDP"
                            value={maxGDPValue}
                            onChange={handleMaxGdpChange}
                          />
                        </div>
                      </div>
                      <div className="row col-12">
                        <div className="form-group col-1 text-left">
                          <label className="text-black" htmlFor="dtDOB">
                            {getValue("From", getLang())}
                          </label>
                          <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            showYearPicker
                            value={startDate}
                            dateFormat="yyyy"
                            className="w-100 height-40 cstm-input"
                          />
                        </div>
                        <div className="form-group col-1 text-left">
                          <label className="text-black" htmlFor="dtDOB">
                            {getValue("To", getLang())}
                          </label>
                          <DatePicker
                            selected={ToDate}
                            onChange={(date) => setToDate(date)}
                            showYearPicker
                            value={ToDate}
                            dateFormat="yyyy"
                            className="w-100 height-40 cstm-input"
                          />
                        </div>
                        <div className="form-group col-2 text-left">
                          <label className="text-black" htmlFor="value">
                            {getValue("Term", getLang())}
                          </label>
                          <input
                            type="number"
                            className="form-control w-100 cstm-input"
                            id="txtValue"
                            name="value"
                            placeholder={getValue("Term", getLang())}
                            value={termValue}
                            onChange={handleTermChange}
                          />
                        </div>
                        <div className="form-group col-2 text-left">
                          <label className="text-black" htmlFor="value">
                            {getValue("DiscountRate", getLang())}
                          </label>
                          <input
                            type="number"
                            className="form-control w-100 cstm-input"
                            id="txtValue"
                            name="value"
                            placeholder="Discount rate %"
                            value={discountRateValue}
                            onChange={handleDiscountRateChange}
                          />
                        </div>
                        <div className="form-group col-2 text-left">
                          <label className="text-black" htmlFor="description">
                            {getValue("AddAnualPmt", getLang())}{" "}
                          </label>
                          <Select
                            options={annualPayments}
                            //value={regionalLicenseValue}
                            //  onChange={handleChangeRegionalLicense}
                          ></Select>
                        </div>
                        <div className="form-group col-2 text-left">
                          <label className="text-black" htmlFor="description">
                            {getValue("AdjustPPPFactor", getLang())}{" "}
                          </label>
                          <Select
                            options={addjustByPPP}
                            //value={regionalLicenseValue}
                            //  onChange={handleChangeRegionalLicense}
                          ></Select>
                        </div>
                      </div>
                      <div className="row col-12">
                        <div className="form-group col-2 text-left">
                          <label className="text-black" htmlFor="description">
                            {getValue("NormalizeByGDPc", getLang())}
                          </label>
                          <Select
                            options={normalizeByGDP}
                            //value={regionalLicenseValue}
                            //  onChange={handleChangeRegionalLicense}
                          ></Select>
                        </div>
                        <div className="form-group col-1 text-left">
                          <div>
                            <label className="text-black" for="huey">
                              <input
                                type="radio"
                                id="huey"
                                name="drone"
                                value="huey"
                                isPPPValue
                                onChange={handleChangePPP}
                              />{" "}
                              Nominal
                            </label>
                          </div>
                          <div>
                            <label className="text-black" for="dewey">
                              <input
                                type="radio"
                                id="dewey"
                                name="drone"
                                value="dewey"
                                onChange={handleChangePPP2}
                              />{" "}
                              PPP
                            </label>
                          </div>
                        </div>
                        <div className="form-group col-2 text-left">
                          <label className="text-black" htmlFor="description">
                            {getValue("AdjustInflation", getLang())}{" "}
                          </label>
                          <Select
                            options={adjustInflation}
                            //value={regionalLicenseValue}
                            //  onChange={handleChangeRegionalLicense}
                          ></Select>
                        </div>
                        <div className="form-group col-2 text-left">
                          <label className="text-black" htmlFor="description">
                            {getValue("AnnualizePrices", getLang())}
                          </label>
                          <Select
                            options={annualizePrice}
                            //value={regionalLicenseValue}
                            //  onChange={handleChangeRegionalLicense}
                          ></Select>
                        </div>
                        <div className="form-group col-2 text-left">
                          <label className="text-black" htmlFor="description">
                            Sum Bands
                          </label>
                          <Select
                            options={sumBands}
                            value={sumBandsValue}
                            onChange={handleChangeSumBands}
                          ></Select>
                        </div>
                        <div className="form-group col-2 text-left">
                          <label className="text-black" htmlFor="description">
                            Award Type
                          </label>
                          <Select
                            options={awardsTypes}
                            value={awardTypeValue}
                            onChange={handleChangeAwardType}
                          ></Select>
                        </div>
                        <div className="form-group col-2 text-left">
                          <label className="text-black" htmlFor="description">
                            {getValue("ExcludeOutliers", getLang())}{" "}
                          </label>
                          <Select
                            options={excOutliers}
                            //value={regionalLicenseValue}
                            onChange={handleChangeExcOutliers}
                          ></Select>
                        </div>
                        <div
                          className="form-group col-2 text-left"
                          style={{ display: regressionVisibilityValue }}
                        >
                          <label className="text-black" htmlFor="description">
                            Regression{" "}
                          </label>
                          <input
                            type="number"
                            value={regressionValue}
                            onChange={handleRegressionValue}
                            className="form-control cstm-input"
                            placeholder="Regression"
                          ></input>
                        </div>
                        <div
                          className="form-group col-2 text-left"
                          style={{ display: quartileVisibiltyValue }}
                        >
                          <label className="text-black" htmlFor="description">
                            Interquantile k value{" "}
                          </label>
                          <input
                            type="number"
                            value={quartileValue}
                            onChange={handleChangeQuartile}
                            className="form-control cstm-input"
                            placeholder="Interquantile k value"
                          ></input>
                        </div>
                        <div
                          className="form-group col-2 text-left"
                          style={{ display: standardDeviationValue }}
                        >
                          <label className="text-black" htmlFor="description">
                            Standard Deviation{" "}
                          </label>
                          <input
                            type="number"
                            value={standardDeviationValueAdded}
                            onChange={handleStandardDeviationValue}
                            className="form-control cstm-input"
                            placeholder="Standard Deviation"
                          ></input>
                        </div>
                        <div
                          className="form-group col-1"
                          style={{ display: upperPercentileValue }}
                        >
                          <label className="text-black" htmlFor="description">
                            Upper %
                          </label>

                          <input
                            type="number"
                            value={upperPercentileValueSelected}
                            onChange={handleUpperPercentileValue}
                            className="form-control cstm-input"
                          ></input>
                        </div>{" "}
                        <div
                          className="form-group col-1"
                          style={{ display: lowerPercentileValue }}
                        >
                          <label className="text-black" htmlFor="description">
                            Lower %
                          </label>

                          <input
                            value={lowerPercentilteValueSelected}
                            onChange={handleLowerPercentileValue}
                            type="number"
                            className="form-control cstm-input"
                          ></input>
                        </div>
                      </div>
                      <div className="row mt-4 mb-4">
                        <div className="form-group col-5 text-left">
                          <table
                            class="styled-table col-12"
                            style={{
                              "overflow-y": "scroll",
                              height: "150px",
                              display: "block",
                            }}
                          >
                            <thead>
                              <tr>
                                <th className="col-2">
                                  <label className="text-black">
                                    {getValue("Bands", getLang())}{" "}
                                  </label>
                                </th>
                                <th className="col-2">
                                  <label className="text-black">
                                    {getValue("Term", getLang())}{" "}
                                  </label>
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {selectedBandRows.map((item, idx) => (
                                <tr id="addr0" key={idx}>
                                  <td className="text-black">
                                    {" "}
                                    {selectedBandRows[idx].band}
                                  </td>
                                  <td>
                                    <input
                                      type="number"
                                      name="name"
                                      value={selectedBandRows[idx].term}
                                      onChange={handleChange(idx)}
                                      className="form-control w-100 cstm-input"
                                    />
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        <div className="form-group col-3 text-left">
                          <label className="text-black" htmlFor="description">
                            Method Type{" "}
                          </label>
                          <Select
                            options={methodTypesOptions}
                            value={methodTypeValue}
                            onChange={handleChangeMethodType}
                          ></Select>
                        </div>
                      </div>
                      <div className="row mt-4 mb-4">
                        <div className="form-group col-3 text-left">
                          <label className="text-black" htmlFor="dtDOB">
                            License Start Yr
                          </label>{" "}
                          <DatePicker
                            selected={issueDate}
                            onChange={(date) => {
                              setIssueDate(date);
                              getPOPValue();
                            }}
                            showYearPicker
                            value={issueDate}
                            dateFormat="yyyy"
                            className="cstm-input"
                          />
                        </div>
                        <div className="form-group col-4 text-left">
                          <label className="text-black" htmlFor="description">
                            {getValue("Countries", getLang())}
                          </label>
                          <Select
                            options={options}
                            value={options.find((obj) => {
                              return obj.value === selectedCountry;
                            })}
                            onChange={handleChangeCountry}
                          />
                        </div>
                        <div className="form-group col-2 text-left">
                          <label className="text-black" htmlFor="value">
                            Pop. covered (M)
                          </label>
                          <input
                            type="number"
                            className="form-control w-100 cstm-input"
                            id="txtValue"
                            name="value"
                            value={popCoveredValue}
                            onChange={handleChanegPopCovered}
                          />
                        </div>
                        <div className="form-group col-3 text-left">
                          <label className="text-black" htmlFor="description">
                            Enfore B Positive License{" "}
                          </label>
                          <Select
                            options={regionalLicenseOptions}
                            value={regionalLicenseValue}
                            onChange={handleChangeRegionalLicense}
                          ></Select>
                        </div>
                      </div>
                      <div className="row mb-4 text-left justify-content-left">
                        <div className="col-12">
                        <button
                            type="submit"
                            className="btn btn-primary background-color-2 mr-2"
                            // onClick={() => filterAwards()}
                            onClick={() => doDistancing()}
                          >
                            <i className="fas fa-search mr-2" />
                            Do Distancing
                          </button>
                          <button
                            type="submit"
                            className="btn btn-primary background-color-2 mr-2"
                            // onClick={() => filterAwards()}
                            onClick={() => checkIfCanView()}
                          >
                            <i className="fas fa-search mr-2" />
                            {getValue("Search", getLang())}
                          </button>
                          <button
                            className="btn btn-danger inner-btn-secondary mr-2"
                            type="button"
                          >
                            <i className="fas fa-times mr-2" />
                            {getValue("Clear", getLang())}
                          </button>
                          {/* <button
                            type="submit"
                            className="btn btn-success mr-2"
                            onClick={() => ShowPlot()}
                          >
                            <i className="far fa-chart-bar mr-2" />
                            Plot
                          </button> */}
                          {getValue("Plot", getLang())}
                          {/* </button> */}
                          <button
                            type="submit"
                            className="btn btn-info"
                            // onClick={() => filterAwards()}
                          >
                            <i className="far fa-save mr-2" />
                            {getValue("Save", getLang())}
                          </button>
                        </div>
                      </div>
                      {/* <div>
                            <a href="#" className="btn btn-primary background-color-2" data-drawer-trigger aria-controls="drawer-name-left" aria-expanded="false">Search Filters</a>
                        </div> */}
                    </div>
                    
                  </div>

                  <div
                    id="table-content"
                    className="col-md-12 p-0 mb-3 list custom-scrollbar"
                  >
                    <table className="table table-striped" {...getFirstTableProps()}>
                      <thead>
                        {firstHeaderGroups.map((headerGroup) => (
                          <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                              <th
                                className="text-black vertical-align-middle text-left table-border-1"
                                {...column.getHeaderProps(
                                  column.getSortByToggleProps()
                                )}
                              >
                                {column.render("Header")}
                                <span>
                                  {" "}
                                  {column.isSorted
                                    ? column.isSortedDesc
                                      ? " 🔽"
                                      : " 🔼"
                                    : ""}{" "}
                                </span>
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
                            {pageIndex + 1} of {firstPageOptions.length}
                          </strong>{" "}
                        </span>
                        <span className="text-black d-flex ml-1 mr-1 align-items-start">
                          | Go to page:
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
                      <div className="col-md-6 text-align-right">
                        <button
                          className="btn inner-btn-secondary mr-1"
                          onClick={() => firstGotoPage(0)}
                          disabled={!firstCanPreviousPage}
                        >
                          {"<<"}
                        </button>
                        <button
                          className="btn inner-btn-secondary mr-1"
                          onClick={() => firstPreviousPage()}
                          disabled={!firstCanPreviousPage}
                        >
                          {getValue("Previous", getLang())}
                        </button>
                        <button
                          className="btn inner-btn-secondary mr-1"
                          onClick={() => firstNextPage()}
                          disabled={!firstCanNextPage}
                        >
                          {getValue("Next", getLang())}
                        </button>
                        <button
                          className="btn inner-btn-secondary"
                          onClick={() => firstGotoPage(firstPageCount - 1)}
                          disabled={!firstCanNextPage}
                        >
                          {">>"}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="valuation-case-results">
                    <div className="row">
                      <div className="col-12">
                        <h3 className="text-black text-bold">Valuation Case Results</h3>
                        <div
                          id="table-content"
                          className="col-md-12 p-0 mb-3 list custom-scrollbar"
                        >
                          <table className="table table-striped" {...getSecondTableProps()}>
                            <thead>
                              {secondHeaderGroups.map((headerGroup) => (
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                  {headerGroup.headers.map((column) => (
                                    <th
                                      className="text-black vertical-align-middle text-left table-border-1"
                                      {...column.getHeaderProps(
                                        column.getSortByToggleProps()
                                      )}
                                    >
                                      {column.render("Header")}
                                      <span>
                                        {" "}
                                        {column.isSorted
                                          ? column.isSortedDesc
                                            ? " 🔽"
                                            : " 🔼"
                                          : ""}{" "}
                                      </span>
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
        </div>
      </div>
      <a
        href="#"
        className="btn btn-primary background-color-2 btn-back-to-filters"
      >
        {getValue("BackToFilters", getLang())}
      </a>
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
      <Modal size="lg" show={isOpen} onHide={hideModal} onEntered={modalLoaded}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
          {/* <button type="button" className="btn-close" aria-label="Close"></button> */}
        </Modal.Header>
        <Modal.Body>
         
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Valuations2;
