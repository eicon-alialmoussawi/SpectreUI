import React, { useState, useEffect, useMemo, useRef, Component } from "react";
import APIFunctions from "../utils/APIFunctions";
import dateFormat from "dateformat";
import Select from "react-select";
import { ReactExcel, readFile, generateObjects } from "@ramonak/react-excel";
import { useTable } from "react-table";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MultiSelect } from "react-multi-select-component";
import "../css/CustomStyle.css";

import Modal from "react-bootstrap/Modal";
const Pricing = (props) => {
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
      labels: [
        "01 Jan 2001",
        "02 Jan 2001",
        "03 Jan 2001",
        "04 Jan 2001",
        "05 Jan 2001",
        "06 Jan 2001",
        "07 Jan 2001",
        "08 Jan 2001",
        "09 Jan 2001",
        "10 Jan 2001",
        "11 Jan 2001",
        "12 Jan 2001",
      ],
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

  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = React.useState("Transitioning...");
  const [selected, setSelected] = useState([]);
  const [SelectedBands, setSelectedBands] = useState([]);

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
  const [annualPaymentsValue, setAnnualPaymentsValue] = useState(false);
  const [annualPrizeValue, setAnnualPrizeValue] = useState(false);

  const [regionalLicenseForFilter, setRegionalLicenseForFilter] =
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
  const awardsRef = useRef();
  const [startDate, setStartDate] = useState(new Date());
  const [issueDate, setIssueDate] = useState(new Date());

  const [ToDate, setToDate] = useState(new Date());

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
    term: 0,
    IsIncludeAnnual: true,
    HasPercentile: false,
    UpperPercentile: 0,
    LowerPercentile: 0,
    HasQuartile: false,
    KValue: 0,
    HasStandardDeviation: false,
    StandardDeviationValue: 0,
    HasRegression: false,
    Regression: 0,
  };
  const awardsTypes = [
    { value: 1, label: "Average Awards" },
    { value: 0, label: "Unique" },
    { value: -1, label: "Average sum of prices/ sum of MHz " },
  ];
  const bandOptions = [
    { value: "m", label: "All" },
    { value: "s", label: "Single Band" },
    { value: "i", label: "Multi-Band" },
  ];
  const regionalLicenseOptions = [
    { value: true, label: "Yes" },
    { value: false, label: "No" },
  ];
  const annualPayments = [
    { value: 1, label: "Yes" },
    { value: 0, label: "No" },
  ];
  const addjustByPPP = [
    { value: 1, label: "Yes" },
    { value: 0, label: "No" },
  ];
  const normalizeByGDP = [
    { value: 1, label: "Yes" },
    { value: 0, label: "No" },
  ];
  const adjustInflation = [
    { value: 1, label: "Yes" },
    { value: 0, label: "No" },
  ];
  const excOutliers = [
    { value: 0, label: "Percentile" },
    { value: 1, label: " Iterative Regression" },
    { value: 2, label: "Interquartile" },
    { value: 3, label: "Standard Deviation" },
    { value: 4, label: "Autofiltering" },
  ];
  const annualizePrice = [
    { value: 1, label: "Yes" },
    { value: 0, label: "No" },
  ];
  const showMarkers = [
    { value: 1, label: "Yes" },
    { value: 0, label: "No" },
  ];
  const sumBands = [
    { value: "pu", label: "Paired + UnPaired" },
    { value: "p", label: "Paired " },
    { value: "u", label: "Un-Paired" },
  ];

  const pairOptions = [
    { value: -1, label: "Paired + UnPaired" },
    { value: 1, label: "Paired " },
    { value: 0, label: "Un-Paired" },
  ];

  awardsRef.current = awards;

  useEffect(() => {
    APIFunctions.getAllFilters("Pricing")
      .then((resp) => resp)
      .then((resp) => emplistFilter(resp.data));
  }, []);
  const retrieveAwards = () => {
    filterAwards();
  };
  const handleChangePPP = (event) => {
    setPPPValue(false);
  };
  const handleChangePPP2 = (event) => {
    setPPPValue(true);
  };
  const SaveFilterResult = () => {
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
      .then((response) => {
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const filterAwards = () => {
    //SaveFilterResult();
    if (discountRateValue == "") setDiscountRate(null);
    if (termValue == "") setTermValue(null);
    AwardFilter.ISPPP = isPPPValue;
    AwardFilter.ISIMF = false;

    console.log(pairedValueForFilter);
    if (pairedValueForFilter == -1) AwardFilter.IsPairedAndUnPaired = true;
    else AwardFilter.IsPairedAndUnPaired = false;
    if (pairedValueForFilter == 1) AwardFilter.IsPaired = true;
    else AwardFilter.IsPaired = false;
    if (pairedValueForFilter == 0) AwardFilter.IsUnPaired = true;
    else AwardFilter.IsUnPaired = false;

    if (awardTypeSelectedValue == -1) AwardFilter.AverageSumPricesAndMHZ = true;
    else AwardFilter.AverageSumPricesAndMHZ = false;
    if (awardTypeSelectedValue == 1) AwardFilter.averageAwards = true;
    else AwardFilter.averageAwards = false;
    if (awardTypeSelectedValue == 0) AwardFilter.uniqueAwards = true;
    else AwardFilter.uniqueAwards = false;

    AwardFilter.regionalLicense = regionalLicenseForFilter;
    AwardFilter.FromYear = startDate.getFullYear();
    AwardFilter.ToYear = ToDate.getFullYear();

    AwardFilter.minGDPValue = minGDPValue;
    AwardFilter.maxGDPValue = maxGDPValue;
    AwardFilter.issueDate = issueDate.getFullYear();
    AwardFilter.discountRate = discountRateValue;
    AwardFilter.term = termValue;
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
    AwardFilter.UpperPercentile = upperPercentileValueSelected;
    AwardFilter.LowerPercentile = lowerPercentilteValueSelected;
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



    APIFunctions.FilterPricing(AwardFilter)
      .then((response) => {
        console.log(response.data);
        //setArrayOfPrices
        var arr = response.data.map(function (val) {
          return val.gdp;
        });
        console.log(arr);
        setArrayOfPrices(arr);
        setAwards(response.data);
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

  const hideModal = () => {
    setIsOpen(false);
    setTitle("Transitioning...");
  };

  const modalLoaded = () => {
    setTitle("Pricing Plot");
  };

  const ShowPlot = () => {
    setIsOpen(true);
  };
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
    for (var i = 0, l = selectedOptions.length; i < l; i++) {
      value.push(selectedOptions[i].value);
    }
    //setBands(selectedOptions);
    setSelectedBands(selectedOptions);
    AwardFilter.Band = value.join(",");
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

  const handleChangeAnnualPayment = (selectedOptions) => {
    setannualPaymentForFilter(selectedOptions.value);
    setAnnualPaymentsValue(selectedOptions.id);
  };
  const handleChangeAnnualizePriceValue = (selectedOptions) => {
    setAnnualPrizeValueForFilter(selectedOptions.value);
    setAnnualPrizeValue(selectedOptions.id);
  };

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
  const columns = useMemo(
    () => [
      {
        Header: "Country",
        accessor: "countryName",
      },
      {
        Header: "Award Date",
        accessor: "year",
      },
      {
        Header: "Band",
        accessor: "band",
      },
      {
        Header: "Term (Y)",
        accessor: "terms",
      },

      {
        Header: "GDPc-Nominal, k$",
        accessor: "gdp",
        show: AwardFilter.ISPPP,
      },
      {
        Header: "GDPc-PPP, k$",
        accessor: "gdpp",
        show: !AwardFilter.ISPPP,
      },
      {
        Header: "POP .M",
        accessor: "pop",
      },

      {
        Header: "Country Band(Year)",
        accessor: "bandCountry",
      },
      {
        Header: "Price $M",
        accessor: "price",
      },

      {
        Header: "Total MHZ",
        accessor: "mhz",
      },
      {
        Header: "Creation Date",
        accessor: "creationDate",
        Cell: (props) => {
          return dateFormat(props.creationDate, "mmmm dS, yyyy");
        },
      },
    ],
    []
  );
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data: awards,
      initialState: {
        hiddenColumns: columns.map((column) => {
          if (column.show === false) return column.accessor || column.id;
        }),
      },
    });

  return (
    <div className="content-header">
      <div className="container-fluid">
        <div className="row">
          <div className="form-group col-4">
            <label htmlFor="description">Select Bands</label>
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
          <div className="form-group col-4">
            <label htmlFor="description">Choose Country</label>
            <MultiSelect
              getOptionValue={(option) => option.countryId}
              options={options}
              value={selected}
              onChange={setSelected}
              labelledBy="Select"
            />
          </div>
          {/* 
          <div className="form-group col-4">
            <label htmlFor="description">Choose Band Type</label>
            <Select
              id="ddlBands"
              name="bandId"
              options={bandOptions}
              value={bandTypeValue}
              onChange={handleChangeBandType}
            ></Select>
          </div> */}{" "}
          <div className="form-group col-4">
            <label htmlFor="description">Choose Filter </label>

            <Select
              options={resultFilter}
              isClearable={true}
              getOptionLabel={(option) => option.title}
              getOptionValue={(option) => option.id}
              onChange={handleChangeFilter}
            ></Select>
          </div>
        </div>
        <div className="row">
          <div className="form-group col-4">
            <label htmlFor="value">Min GDP</label>
            <input
              type="number"
              className="form-control"
              id="txtValue"
              name="value"
              value={minGDPValue}
              onChange={handleMinGdpChange}
            />
          </div>{" "}
          <div className="form-group col-4">
            <label htmlFor="value">Max GDP</label>
            <input
              type="number"
              className="form-control"
              id="txtValue"
              name="value"
              value={maxGDPValue}
              onChange={handleMaxGdpChange}
            />
          </div>
          <div className="form-group col-4">
            <div>
              <input
                type="radio"
                id="huey"
                name="drone"
                value="huey"
                isPPPValue
                onChange={handleChangePPP}
              />
              <label for="huey">Nominal</label>
            </div>
            <div>
              <input
                type="radio"
                id="dewey"
                name="drone"
                value="dewey"
                onChange={handleChangePPP2}
              />
              <label for="dewey">PPP</label>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="form-group col-4">
            <label htmlFor="description">Choose Paired </label>

            <Select
              options={pairOptions}
              onChange={handleChangePaired}
              value={pairedValue}
            ></Select>
          </div>

          <div className="form-group col-4">
            <label htmlFor="description">Regional License </label>

            <Select
              options={regionalLicenseOptions}
              value={regionalLicenseValue}
              onChange={handleChangeRegionalLicense}
            ></Select>
          </div>
          <div className="form-group col-2">
            <label htmlFor="dtDOB">From Date</label>{" "}
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              showYearPicker
              value={startDate}
              dateFormat="yyyy"
            />
          </div>
          <div className="form-group col-2">
            <label htmlFor="dtDOB">To Date</label>
            <DatePicker
              selected={ToDate}
              onChange={(date) => setToDate(date)}
              showYearPicker
              value={ToDate}
              dateFormat="yyyy"
            />
          </div>
        </div>
        <div className="row">
          <div className="form-group col-4">
            <label htmlFor="value">Term, years</label>
            <input
              type="number"
              className="form-control"
              id="txtValue"
              name="value"
              value={termValue}
              onChange={handleTermChange}
            />
          </div>
          <div className="form-group col-4">
            <label htmlFor="value">discount rate %</label>
            <input
              type="number"
              className="form-control"
              id="txtValue"
              name="value"
              value={discountRateValue}
              onChange={handleDiscountRateChange}
            />
          </div>
          <div className="form-group col-4">
            <label htmlFor="dtDOB">Issue Date</label>{" "}
            <DatePicker
              selected={issueDate}
              onChange={(date) => setIssueDate(date)}
              showYearPicker
              value={issueDate}
              dateFormat="yyyy"
            />
          </div>
        </div>
        <div className="row">
          {" "}
          <div className="form-group col-4">
            <label htmlFor="description">Add Annual Payments </label>

            <Select
              options={annualPayments}
              value={annualPaymentsValue}
              onChange={handleChangeAnnualPayment}
            ></Select>
          </div>
          <div className="form-group col-4">
            <label htmlFor="description">Adjust by PPP factor </label>

            <Select
              options={addjustByPPP}
              value={adjustByPPPValue}
              onChange={handleChangeaAjustByPPPValue}
            ></Select>
          </div>{" "}
          <div className="form-group col-4">
            <label htmlFor="description">Normalize by GDPc (nominal) </label>

            <Select
              options={normalizeByGDP}
              value={normalizeByGDPValue}
              onChange={handleChangeNormalizeGDP}
            ></Select>
          </div>
        </div>

        <div className="row">
          {" "}
          <div className="form-group col-4">
            <label htmlFor="description">Adjust inflation </label>

            <Select
              options={adjustInflation}
              value={inflationFactorValue}
              onChange={handleChangeInflationFactor}
            ></Select>
          </div>
          <div className="form-group col-4">
            <label htmlFor="description">Annualize pice</label>

            <Select
              options={annualizePrice}
              value={annualPrizeValue}
              onChange={handleChangeAnnualizePriceValue}
            ></Select>
          </div>
          <div className="form-group col-4">
            <label htmlFor="description">Sum Bands</label>

            <Select
              options={sumBands}
              value={sumBandsValue}
              onChange={handleChangeSumBands}
            ></Select>
          </div>
        </div>
        <div className="row">
          <div className="form-group col-4">
            <label htmlFor="description">Award Type</label>

            <Select
              options={awardsTypes}
              value={awardTypeValue}
              onChange={handleChangeAwardType}
            ></Select>
          </div>
          <div className="form-group col-4">
            <label htmlFor="description">Exl Outliers </label>

            <Select
              options={excOutliers}
              //value={regionalLicenseValue}
              onChange={handleChangeExcOutliers}
            ></Select>
          </div>{" "}
          <div
            className="form-group col-4"
            style={{ display: regressionVisibilityValue }}
          >
            <label htmlFor="description">Regression </label>

            <input
              type="number"
              value={regressionValue}
              onChange={handleRegressionValue}
              className="form-control"
            ></input>
          </div>{" "}
          <div
            className="form-group col-4"
            style={{ display: quartileVisibiltyValue }}
          >
            <label htmlFor="description">Interquantile k value </label>

            <input
              type="number"
              value={quartileValue}
              onChange={handleChangeQuartile}
              className="form-control"
            ></input>
          </div>
          <div
            className="form-group col-4"
            style={{ display: standardDeviationValue }}
          >
            <label htmlFor="description">Standard Deviation </label>

            <input
              value={standardDeviationValueAdded}
              onChange={handleStandardDeviationValue}
              type="number"
              className="form-control"
            ></input>
          </div>
          <div
            className="form-group col-2"
            style={{ display: upperPercentileValue }}
          >
            <label htmlFor="description">Upper Percentile </label>

            <input
              type="number"
              value={upperPercentileValueSelected}
              onChange={handleUpperPercentileValue}
              className="form-control"
            ></input>
          </div>{" "}
          <div
            className="form-group col-2"
            style={{ display: lowerPercentileValue }}
          >
            <label htmlFor="description">Lower Percentile </label>

            <input
              value={lowerPercentilteValueSelected}
              onChange={handleLowerPercentileValue}
              type="number"
              className="form-control"
            ></input>
          </div>
        </div>

        <div className="row col-12" style={{ gap: "10px" }}>
          {" "}
          <div className="col-7"></div>
          <button
            type="submit"
            className="btn btn-primary col-1"
            onClick={() => filterAwards()}
          >
            Search
          </button>{" "}
          <button className="btn btn-danger col-1" type="button">
            Clear
          </button>
          <button
            type="submit"
            className="btn btn-info col-1"
            onClick={() => filterAwards()}
          >
            Save
          </button>{" "}
          <button
            type="submit"
            className="btn btn-success col-1"
            onClick={() => ShowPlot()}
          >
            Plot
          </button>{" "}
        </div>

        <div className="col-md-12 list">
          <table
            className="table table-striped table-bordered"
            {...getTableProps()}
          >
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th {...column.getHeaderProps()}>
                      {column.render("Header")}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map((row, i) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => {
                      return (
                        <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>

          <Modal
            size="lg"
            show={isOpen}
            onHide={hideModal}
            onEntered={modalLoaded}
          >
            <Modal.Header closeButton>
              <Modal.Title>{title}</Modal.Title>
              {/* <button type="button" className="btn-close" aria-label="Close"></button> */}
            </Modal.Header>
            <Modal.Body>
             
            </Modal.Body>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
