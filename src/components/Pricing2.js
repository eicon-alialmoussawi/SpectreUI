import React, { useState, useEffect, useMemo, useRef, Component } from "react";
import APIFunctions from "../utils/APIFunctions";
import "react-datepicker/dist/react-datepicker.css";
import "../css/CustomStyle.css";
import { Alert, LoadingAlert, AlertError } from "../components/f_Alerts";
import jsPDF from "jspdf";
import {
  getIMF,
  displayPricingPop,
  getLang,
  ArialBold,
  ArialRegular,
  BindImageURL,
} from "../utils/common";
import "jspdf-autotable";
import lastPage from "../Assets/Images/lastPage.png";
import rightBg2 from "../Assets/Images/rightBg.png";
import left from "../Assets/Images/left.png";
import { getValue } from "../Assets/Language/Entries";

// Benchmark Backup
class Pricing2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: {
        name: "",
        email: "",
        companyName: "",
        packageId: 0,
        startDate: null,
        endDate: null,
        logo: "",
      },
      imfType: "",
      svgToInsert: "",
      imageData: "",
      imgSource: "",
      wbType: "",
      result: [],
    };
    this.bindData = this.bindData.bind(this);
  }

  componentDidMount() {
    var svg = this.props.svg;
    var _svg = svg;

    var encodedData = btoa(unescape(encodeURIComponent(_svg)));
    var source = "data:image/svg+xml;base64," + encodedData;
    this.setState({ imgSource: source });
    let image = new Image();
    image.src = source;
    var canvas = document.querySelector("canvas");
    var context = canvas.getContext("2d", { preserveDrawingBuffer: true });
    context.imageSmoothingEnabled = false;
    context.mozImageSmoothingEnabled = false;
    context.webkitImageSmoothingEnabled = false;
    context.msImageSmoothingEnabled = false;
    //context.fillStyle = "white";
    context.canvas.width = 1250;
    context.canvas.height = 500;
    image.onload = function () {
      context.drawImage(image, 0, 0);
    };

    // change non-opaque pixels to white
    var imgData = context.getImageData(0, 0, canvas.width, canvas.height);
    var data = imgData.data;
    for (var i = 0; i < data.length; i += 4) {
      if (data[i + 3] < 255) {
        data[i] = 255;
        data[i + 1] = 255;
        data[i + 2] = 255;
        data[i + 3] = 255;
      }
    }

    context.putImageData(imgData, 0, 0);

    var dataURL = "";
    setTimeout(
      function () {
        var canvas = document.querySelector("canvas");
        dataURL = canvas.toDataURL("image/jpeg");
        this.setState({ imageData: dataURL });
      }.bind(this),
      300
    );

    var obj = [];
    var _awards = this.props.awards;
    var imF = getIMF() == "true" ? true : false;
    var txtIMF = this.props.filters.IsIMF == true ? "IMF" : "WB";
    var txtPPP = this.props.filters.IsPPP == true ? "PPP" : "nominal";

    this.setState({ imfType: txtIMF, wbType: txtPPP });

    console.log(this.props.awards);
    if (this.props.filters.uniqueAwards == true) {
      _awards.map((val, idx) =>
        obj.push([
          val.countryName,
          displayPricingPop(val.pop),
          val.gdp == null
            ? ""
            : val.gdp
                .toFixed(0)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ","),
          val.operatorName,
          val.year,
          val.upFrontFees,
          val.terms,
          val.band,
          val.price.toFixed(3),
        ])
      );
    } else {
      _awards.map((val, idx) =>
        obj.push([
          val.countryName,
          displayPricingPop(val.pop),
          val.gdp == null
            ? ""
            : val.gdp
                .toFixed(0)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ","),
          val.year,
          val.terms,
          val.band,
          val.price.toFixed(3),
        ])
      );
    }

    // var svgData = new XMLSerializer().serializeToString(this.props.svg)
    // this.setState({svgToInsert: svgData});

    this.state.result = obj;
    // this.setState({result: obj})
    this.getUserInfo();
    // this.downloadData();
  }

  getUserInfo() {
    APIFunctions.getUserInfo()
      .then((resp) => resp)
      .then((resp) => this.bindData(resp.data));
  }

  bindData(obj) {
    this.state.userInfo = obj;

    setTimeout(() => {
      this.downloadData();
      LoadingAlert("Hide");
    }, 5000);
  }

  downloadData() {
    if (getLang() == "ar") {
      var callAddFont = function () {
        this.addFileToVFS("arial-normal.ttf", ArialRegular);
        this.addFont("arial-normal.ttf", "arial", "normal");

        this.addFileToVFS("arialbd-bold.ttf", ArialBold);
        this.addFont("arialbd-bold.ttf", "arial", "bold");
      };

      jsPDF.API.events.push(["addFonts", callAddFont]);
    }

    window.jsPDF = jsPDF;
    const leftBg = left;
    const rightBg = rightBg2;
    const chart = "";

    const lastPageBgFull = lastPage;
    const textAlign = getLang() === "ar" ? "right" : "left";

    var doc = new jsPDF("p", "mm", [297, 210]);
    if (getLang() == "ar") {
      doc.setLanguage("ar");
      doc.setFont("arial", "bold");
    }

    let dateOptions = { year: "numeric", month: "long", day: "numeric" };
    const dateStr = new Date().toLocaleString("en-LB", dateOptions);

    /*==================================================
      PAGE 1
      ================================================*/

    //top left background
    doc.addImage(leftBg, "png", 0, 0, 145, 300);
    //top right background
    doc.addImage(rightBg, "png", 195, 0, 14, 300);

    if (
      this.state.userInfo.logo != null &&
      this.state.userInfo.logo.trim() !== ""
    ) {
      var logo = this.state.userInfo.logo;
      var fileExtension = logo.split(".").pop();
      const imageLogo = BindImageURL(this.state.userInfo.logo);
      async function checkImageExistence(imageUrl) {
        try {
          const response = await fetch(imageUrl, { method: 'HEAD' });
          return response.ok;
        } catch (error) {
          return false;
        }
      }
      const exists = checkImageExistence(imageLogo);
      if (exists) {
        doc.addImage(imageLogo, fileExtension, 158, 10, (10 * 853) / 210, 20, "logo");
      } 
    }

    // SPECTRUM PRICING
    doc.setFontSize(35);
    doc.setTextColor(89, 89, 89);
    doc.text(
      getLang() === "ar" ? 195 : 40,
      100,
      getValue("PDFTitle", getLang()),
      { align: textAlign }
    );

    //PARAGRAPH under SPECTRUM PRICING
    doc.setFontSize(13);
    doc.text(
      getLang() === "ar" ? 195 : 40,
      115,
      getValue("Abstract", getLang()),
      { maxWidth: 132, lineHeightFactor: 1.3, align: textAlign }
    );
    if (getLang() != "ar") doc.line(40, 116, 58, 116);
    doc.text(
      getLang() === "ar" ? 195 : 40,
      140,
      getValue("AwardDate", getLang()) + ": " + dateStr,
      { maxWidth: 132, lineHeightFactor: 1.3, align: textAlign }
    );

    if (getLang() != "ar") doc.line(40, 141, 51, 141);

    //footer email

    /*==================================================
      PAGE 2
      ================================================*/

    doc.addPage();
    //doc.addImage(logo, "png", 171, 10, 6 * 853 / 210, 6, "logo");

    //user information
    doc.setFontSize(10);
    doc.setFont(undefined, "bold");
    doc.text(
      getLang() === "ar" ? 195 : 20,
      20,
      getValue("UserInformation", getLang()),
      { align: textAlign }
    );
    if (getLang() === "ar") {
      let arHead = [
        [
          {
            content: getValue("UserRunInformation", getLang()),
            colSpan: 2,
            styles: { halign: "center" },
          },
        ],
      ];

      arHead = arHead.map((r) => r.reverse());

      let arBody = [
        [getValue("User", getLang()), this.state.userInfo.name],
        [getValue("Organisation", getLang()), this.state.userInfo.companyName],
        [getValue("AwardDate", getLang()), dateStr],
        ["S/W Version", "Release 2.01"],
      ];

      arBody = arBody.map((r) => r.reverse());

      doc.autoTable({
        margin: { left: 20 },
        styles: { fontSize: 9, cellPadding: 1, font: "arial" },
        columnStyles: {
          0: { cellWidth: 120 },
        },
        startY: 25,
        headerStyles: {
          font: "arial",
        },
        bodyStyles: {
          font: "arial",
          halign: "right",
        },
        head: arHead,
        body: arBody,
      });
    } else {
      doc.autoTable({
        margin: { left: 20 },
        styles: { fontSize: 9, cellPadding: 1 },
        columnStyles: {
          0: { cellWidth: 120 },
        },
        startY: 25,
        head: [
          [
            {
              content: getValue("UserRunInformation", getLang()),
              colSpan: 2,
              styles: { halign: "center" },
            },
          ],
        ],
        body: [
          [getValue("User", getLang()), this.state.userInfo.name],
          [
            getValue("Organisation", getLang()),
            this.state.userInfo.companyName,
          ],
          [getValue("AwardDate", getLang()), dateStr],
          ["S/W Version", "Release 2.01"],
        ],
      });
    }

    //SELECTED PARAMETERS OF AWARDS
    doc.text(
      getLang() === "ar" ? 195 : 20,
      63,
      getValue("SelectedParameteres", getLang()),
      { align: textAlign }
    );
    if (getLang() == "ar") {
      let arHead2 = [
        [
          getValue("Parameter", getLang()),
          getValue("UserSelection", getLang()),
        ],
      ];
      arHead2 = arHead2.map((r) => r.reverse());

      let arBody2 = [
        [
          getValue("SingleBand", getLang()),
          this.props.filters.IsSingle == true
            ? getValue("Included", getLang())
            : getValue("NotIncluded", getLang()),
        ],
        [
          getValue("MultiBand", getLang()),
          this.props.filters.IsMultiple == true
            ? getValue("Included", getLang())
            : getValue("NotIncluded", getLang()),
        ],
        [
          getValue("AwardsWithPaired", getLang()),
          this.props.filters.IsPaired == true
            ? getValue("Included", getLang())
            : getValue("NotIncluded", getLang()),
        ],
        [
          getValue("AwardsWithUnPaired", getLang()),
          this.props.filters.IsUnPaired == true
            ? getValue("Included", getLang())
            : getValue("NotIncluded", getLang()),
        ],
        [
          getValue("AwardsWithBoth", getLang()),
          this.props.filters.IsPairedAndUnPaired == true
            ? getValue("Included", getLang())
            : getValue("NotIncluded", getLang()),
        ],
        [
          getValue("RegionalLicenses", getLang()),
          this.props.filters.RegionalLicense == true
            ? getValue("Included", getLang())
            : getValue("NotIncluded", getLang()),
        ],
        [getValue("MinGDPUS$", getLang()), this.props.filters.MinGDP],
        [getValue("MaxGDPUS$", getLang()), this.props.filters.MaxGDP],
        [getValue("AwardsFrom", getLang()), this.props.filters.FromYear],
        [getValue("AwardsTo", getLang()), this.props.filters.ToYear],
      ];
      arBody2 = arBody2.map((r) => r.reverse());

      doc.autoTable({
        margin: { left: 20 },
        styles: { fontSize: 9, cellPadding: 1, font: "arial" },
        columnStyles: {
          0: { cellWidth: 120 },
        },
        headerStyles: {
          font: "arial",
          halign: "right",
        },
        bodyStyles: {
          font: "arial",
          halign: "right",
        },
        startY: 67,
        head: arHead2,
        body: arBody2,
      });
    } else {
      doc.autoTable({
        margin: { left: 20 },
        styles: { fontSize: 9, cellPadding: 1 },
        startY: 67,
        columnStyles: {
          0: { cellWidth: 120 },
        },
        head: [
          [
            getValue("Parameter", getLang()),
            getValue("UserSelection", getLang()),
          ],
        ],
        body: [
          [
            getValue("SingleBand", getLang()),
            this.props.filters.IsSingle == true
              ? getValue("Included", getLang())
              : getValue("NotIncluded", getLang()),
          ],
          [
            getValue("MultiBand", getLang()),
            this.props.filters.IsMultiple == true
              ? getValue("Included", getLang())
              : getValue("NotIncluded", getLang()),
          ],
          [
            getValue("AwardsWithPaired", getLang()),
            this.props.filters.IsPaired == true
              ? getValue("Included", getLang())
              : getValue("NotIncluded", getLang()),
          ],
          [
            getValue("AwardsWithUnPaired", getLang()),
            this.props.filters.IsUnPaired == true
              ? getValue("Included", getLang())
              : getValue("NotIncluded", getLang()),
          ],
          [
            getValue("AwardsWithBoth", getLang()),
            this.props.filters.IsPairedAndUnPaired == true
              ? getValue("Included", getLang())
              : getValue("NotIncluded", getLang()),
          ],
          [
            getValue("RegionalLicenses", getLang()),
            this.props.filters.RegionalLicense == true
              ? getValue("Included", getLang())
              : getValue("NotIncluded", getLang()),
          ],
          [getValue("MinGDPUS$", getLang()), this.props.filters.MinGDP],
          [getValue("MaxGDPUS$", getLang()), this.props.filters.MaxGDP],
          [getValue("AwardsFrom", getLang()), this.props.filters.FromYear],
          [getValue("AwardsTo", getLang()), this.props.filters.ToYear],
        ],
      });
    }

    //SELECTED PARAMETERS FOR ANALYSIS
    doc.text(
      getLang() === "ar" ? 195 : 20,
      140,
      getValue("SelParametersForAna", getLang()),
      { align: textAlign }
    );
    if (getLang() == "ar") {
      //table head
      let arHead3 = [
        [
          getValue("AnalysisOptions", getLang()),
          getValue("UserSelection", getLang()),
        ],
      ];
      arHead3 = arHead3.map((r) => r.reverse());

      let arBody3 = [
        [getValue("Term", getLang()), this.props.filters.term],
        [getValue("DiscountRate", getLang()), this.props.filters.discountRate],
        [getValue("IssueDate", getLang()), this.props.filters.issueDate],
        [
          getValue("AwardsTypsPa", getLang()),
          this.props.filters.uniqueAwards == true
            ? getValue("UniqueAwards", getLang())
            : this.props.filters.averageAwards == true
            ? getValue("AvgUnitPrice", getLang())
            : getValue("AvgBySum", getLang()),
        ],

        [
          getValue("BlockMHzParam", getLang()),
          this.props.filters.sumBand == "p"
            ? getValue("Paired", getLang())
            : this.props.filters.sumBand == "u"
            ? getValue("Unpaired", getLang())
            : getValue("PairedUnpaired", getLang()),
        ],
        [
          getValue("ExcludeOutliers", getLang()),
          this.props.filters.outliers == "-1"
            ? getValue("NotIncluded", getLang())
            : this.props.filters.outliers == "0"
            ? getValue("Percentile", getLang())
            : this.props.filters.outliers == "1"
            ? getValue("IterativeRegression", getLang())
            : this.props.filters.outliers == "2"
            ? getValue("Interquartile", getLang())
            : this.props.filters.outliers == "3"
            ? getValue("StandardDeviation", getLang())
            : getValue("AutoFiltering", getLang()),
        ],
        // this.props.filters.outliers != "-1" ?
        this.props.filters.outliers == "0"
          ? [getValue("Upper%", getLang()), this.props.filters.UpperPercentile]
          : this.props.filters.outliers == "1"
          ? ["%", this.props.filters.regression]
          : this.props.filters.outliers == "2"
          ? [getValue("kValue", getLang()), this.props.filters.KValue]
          : this.props.filters.outliers == "3"
          ? [
              getValue("StandardDeviation", getLang()),
              this.props.filters.StandardDeviationValue,
            ]
          : [,],

        this.props.filters.outliers == "0"
          ? [getValue("Lower%", getLang()), this.props.filters.LowerPercentile]
          : [,],
      ];
      arBody3 = arBody3.map((r) => r.reverse());

      doc.autoTable({
        margin: { left: 20 },
        styles: { fontSize: 9, cellPadding: 1, font: "arial" },

        columnStyles: {
          0: { cellWidth: 120 },
        },
        headerStyles: {
          font: "arial",
          halign: "right",
        },
        bodyStyles: {
          font: "arial",
          halign: "right",
        },
        startY: 144,
        head: arHead3,
        body: arBody3,
      });
    } else {
      doc.autoTable({
        margin: { left: 20 },
        styles: { fontSize: 9, cellPadding: 1 },
        startY: 144,
        columnStyles: {
          0: { cellWidth: 120 },
        },
        head: [
          [
            getValue("AnalysisOptions", getLang()),
            getValue("UserSelection", getLang()),
          ],
        ],
        body: [
          [getValue("Term", getLang()), this.props.filters.term],
          [
            getValue("DiscountRate", getLang()),
            this.props.filters.discountRate,
          ],
          [getValue("IssueDate", getLang()), this.props.filters.issueDate],
          [
            "Awards within same auction are",
            this.props.filters.uniqueAwards == true
              ? getValue("UniqueAwards", getLang())
              : this.props.filters.averageAwards == true
              ? getValue("AvgUnitPrice", getLang())
              : getValue("AvgBySum", getLang()),
          ],

          [
            "Block MHz considered in paired + unpaired Awards",
            this.props.filters.sumBand == "p"
              ? getValue("Paired", getLang())
              : this.props.filters.sumBand == "u"
              ? getValue("Unpaired", getLang())
              : getValue("PairedUnpaired", getLang()),
          ],
          [
            "Exclude Outliers",
            this.props.filters.outliers == "-1"
              ? getValue("NotIncluded", getLang())
              : this.props.filters.outliers == "0"
              ? getValue("Percentile", getLang())
              : this.props.filters.outliers == "1"
              ? getValue("IterativeRegression", getLang())
              : this.props.filters.outliers == "2"
              ? getValue("Interquartile", getLang())
              : this.props.filters.outliers == "3"
              ? getValue("StandardDeviation", getLang())
              : getValue("AutoFiltering", getLang()),
          ],
          // this.props.filters.outliers != "-1" ?
          this.props.filters.outliers == "0"
            ? [
                getValue("Upper%", getLang()),
                this.props.filters.UpperPercentile,
              ]
            : this.props.filters.outliers == "1"
            ? ["%", this.props.filters.regression]
            : this.props.filters.outliers == "2"
            ? [getValue("kValue", getLang()), this.props.filters.KValue]
            : this.props.filters.outliers == "3"
            ? [
                getValue("StandardDeviation", getLang()),
                this.props.filters.StandardDeviationValue,
              ]
            : [,],

          this.props.filters.outliers == "0"
            ? [
                getValue("Lower%", getLang()),
                this.props.filters.LowerPercentile,
              ]
            : [,],
        ],
      });
    }

    //SSELECTED ADJUSTMENTS
    doc.text(
      getLang() === "ar" ? 195 : 20,
      205,
      getValue("SelectedAdjustments", getLang()),
      { align: textAlign }
    );

    if (getLang() == "ar") {
      //table head
      let arHead4 = [
        [
          getValue("Adjustment", getLang()),
          getValue("UserSelection", getLang()),
        ],
      ];
      arHead4 = arHead4.map((r) => r.reverse());

      let arBody4 = [
        [
          getValue("AdjustInflation", getLang()),
          this.props.filters.AdjustByInflationFactor == true
            ? getValue("Yes", getLang())
            : getValue("No", getLang()),
        ],
        [
          getValue("AdjustPPPFactor", getLang()),
          this.props.filters.AdjustByPPPFactor == true
            ? getValue("Yes", getLang())
            : getValue("No", getLang()),
        ],
        [
          getValue("AddAnualPmt", getLang()),
          this.props.filters.IsIncludeAnnual == true
            ? getValue("Yes", getLang())
            : getValue("No", getLang()),
        ],
        [
          getValue("NormalizeByGDPc", getLang()),
          this.props.filters.AdjustByGDPFactor == true
            ? getValue("Yes", getLang())
            : getValue("No", getLang()),
        ],
        [
          getValue("AnnualizePrices", getLang()),
          this.props.filters.AnnualizePrice == true
            ? getValue("Yes", getLang())
            : getValue("No", getLang()),
        ],
      ];
      arBody4 = arBody4.map((r) => r.reverse());

      doc.autoTable({
        margin: { left: 20 },
        styles: { fontSize: 9, cellPadding: 1, font: "arial" },
        startY: 209,
        columnStyles: {
          0: { cellWidth: 120 },
        },
        headerStyles: {
          font: "arial",
          halign: "right",
        },
        bodyStyles: {
          font: "arial",
          halign: "right",
        },
        head: arHead4,
        body: arBody4,
      });
    } else {
      doc.autoTable({
        margin: { left: 20 },
        styles: { fontSize: 9, cellPadding: 1 },
        startY: 209,
        columnStyles: {
          0: { cellWidth: 120 },
        },
        head: [
          [
            getValue("Adjustment", getLang()),
            getValue("UserSelection", getLang()),
          ],
        ],
        body: [
          [
            getValue("AdjustInflation", getLang()),
            this.props.filters.AdjustByInflationFactor == true
              ? getValue("Yes", getLang())
              : getValue("No", getLang()),
          ],
          [
            getValue("AdjustPPPFactor", getLang()),
            this.props.filters.AdjustByPPPFactor == true
              ? getValue("Yes", getLang())
              : getValue("No", getLang()),
          ],
          [
            getValue("AddAnualPmt", getLang()),
            this.props.filters.IsIncludeAnnual == true
              ? getValue("Yes", getLang())
              : getValue("No", getLang()),
          ],
          [
            getValue("NormalizeByGDPc", getLang()),
            this.props.filters.AdjustByGDPFactor == true
              ? getValue("Yes", getLang())
              : getValue("No", getLang()),
          ],
          [
            getValue("AnnualizePrices", getLang()),
            this.props.filters.AnnualizePrice == true
              ? getValue("Yes", getLang())
              : getValue("No", getLang()),
          ],
        ],
      });
    }

    /*==================================================
      PAGE 3
      ================================================*/
    doc.addPage();
    // doc.addImage(logo, "png", 171, 10, 6 * 853 / 210, 6, "logo");

    //SPECTRE ANALYSIS RESULTS
    doc.setFontSize(10);
    doc.setFont(undefined, "bold");
    //doc.text(20, 20, getValue("SpectreAnalysisResult", getLang()));
    doc.text(
      getLang() === "ar" ? 195 : 20,
      20,
      getValue("SpectreAnalysisResult", getLang()),
      { align: textAlign }
    );
    doc.setFont(undefined, "normal");
    doc.text(
      getLang() === "ar" ? 195 : 20,
      28,
      getValue("PricingResultDescP1", getLang()) + this.props.filters.term,
      getLang() === "ar" ? "right" : "left",
      { maxWidth: 170, lineHeightFactor: 1.3, align: textAlign }
    );
    doc.text(
      getLang() === "ar" ? 195 : 20,
      getLang() === "fr" ? 40 : 36,
      getValue("PricingResultDescP2", getLang()) +
        this.props.filters.discountRate +
        getValue("PricingResultDescP3", getLang()),
      getLang() === "ar" ? "right" : "left",
      { maxWidth: 170, lineHeightFactor: 1.3, align: textAlign }
    );

    if (getLang() == "ar") {
      let arHead5 = [
        this.props.filters.uniqueAwards == true
          ? [
              getValue("Countries", getLang()),
              getValue("Pop", getLang()),
              "GDPc, US$",
              getValue("Operator", getLang()),
              getValue("AwardDate", getLang()),
              getValue("Price$M", getLang()),
              getValue("Term", getLang()),
              getValue("Band", getLang()),
              this.props.filters.Header,
            ]
          : [
              getValue("Countries", getLang()),
              getValue("Pop", getLang()),
              getValue("Price$M", getLang()),
              getValue("AwardDate", getLang()),
              getValue("Term", getLang()),
              getValue("Band", getLang()),
              this.props.filters.Header,
            ],
      ];
      arHead5 = arHead5.map((r) => r.reverse());

      let arBody5 = this.state.result;
      arBody5 = arBody5.map((r) => r.reverse());

      doc.autoTable({
        margin: { left: 20 },
        styles: { fontSize: 8, cellPadding: 1, font: "arial" },
        startY: 43,
        headerStyles: {
          font: "arial",
          halign: "right",
        },
        bodyStyles: {
          font: "arial",
          halign: "right",
        },
        head: arHead5,
        body: arBody5,
      });
    } else {
      doc.autoTable({
        margin: { left: 20 },
        styles: { fontSize: 8, cellPadding: 1 },
        startY: 43,
        head: [
          this.props.filters.uniqueAwards == true
            ? [
                getValue("Countries", getLang()),
                getValue("Pop", getLang()),
                "GDPc, US$",
                getValue("Operator", getLang()),
                getValue("AwardDate", getLang()),
                getValue("Price$M", getLang()),
                getValue("Term", getLang()),
                getValue("Band", getLang()),
                this.props.filters.Header,
              ]
            : [
                getValue("Countries", getLang()),
                getValue("Pop", getLang()),
                getValue("Price$M", getLang()),
                getValue("AwardDate", getLang()),
                getValue("Term", getLang()),
                getValue("Band", getLang()),
                this.props.filters.Header,
              ],
        ],
        body: this.state.result,
      });
    }

    let finalY = doc.lastAutoTable.finalY; // The y position on the page

    if (finalY > 210 - 50) {
      doc.addPage();
      finalY = 20;
    }

    doc
      .text(
        getLang() === "ar" ? 195 : 20,
        finalY + 5,
        getValue("Notes", getLang()),
        getLang() === "ar" ? "right" : "left"
      )
      .setFontSize(8);
    // doc.text(getValue("Notes", getLang()), 20, finalY + 5).setFontSize(8);
    doc.setFont(undefined, "normal");
    doc
      .text(
        getLang() === "ar"
          ? getValue("NormalizeNote1", getLang())
          : "1. " + getValue("NormalizeNote1", getLang()),
        getLang() === "ar" ? 195 : 20,
        finalY + 10,
        { maxWidth: 170, lineHeightFactor: 1.3, align: textAlign }
      )
      .setFontSize(8);
    doc
      .text(
        getLang() === "ar"
          ? getValue("NormalizeNote2", getLang())
          : getValue("NormalizeNote2", getLang()),
        getLang() === "ar" ? 195 : 20,
        finalY + 14,
        { maxWidth: 170, lineHeightFactor: 1.3, align: textAlign }
      )
      .setFontSize(8);
    doc
      .text(
        getLang() === "ar"
          ? getValue("AnnualizeNote1", getLang())
          : "2. " + getValue("AnnualizeNote1", getLang()),
        getLang() === "ar" ? 195 : 20,
        getLang() === "ar" || getLang() === "fr" ? finalY + 22 : finalY + 19,
        { maxWidth: 170, lineHeightFactor: 1.3, align: textAlign }
      )
      .setFontSize(8);
    doc
      .text(
        getLang() === "ar"
          ? getValue("AnnualizeNote2", getLang())
          : getValue("AnnualizeNote2", getLang()),
        getLang() === "ar" ? 195 : 20,
        getLang() === "ar" || getLang() === "fr" ? finalY + 26 : finalY + 23,
        { maxWidth: 170, lineHeightFactor: 1.3, align: textAlign }
      )
      .setFontSize(8);
    doc.text(
      getLang() === "ar"
        ? getValue("GDPNoteP2", getLang()) +
            " " +
            this.state.wbType +
            " " +
            getValue("GDPPricingNoteP1", getLang())
        : "3. " +
            getValue("GDPNoteP1", getLang()) +
            " " +
            this.state.wbType +
            " " +
            getValue("GDPNoteP2", getLang()),
      getLang() === "ar" ? 195 : 20,
      getLang() === "ar"
        ? finalY + 31
        : getLang() === "fr"
        ? finalY + 34
        : finalY + 28,
      { maxWidth: 170, lineHeightFactor: 1.3, align: textAlign }
    );
    doc
      .text(
        getLang() === "ar"
          ? "." +
              this.state.imfType +
              " " +
              "٤. " +
              getValue("SocialNote", getLang())
          : "4. " +
              getValue("SocialNote", getLang()) +
              " " +
              this.state.imfType +
              ".",
        getLang() === "ar" ? 195 : 20,
        getLang() === "ar"
          ? finalY + 36
          : getLang() === "fr"
          ? finalY + 39
          : finalY + 33,
        { maxWidth: 170, lineHeightFactor: 1.3, align: textAlign }
      )
      .setFontSize(8);
    /*==================================================
      PAGE 4
      ================================================*/

    doc.addPage();
    //doc.addImage(logo, "png", 171, 10, 6 * 853 / 210, 6, "logo");

    //notes
    doc.setFont(undefined, "bold");
    doc.text(
      getLang() === "ar" ? 195 : 20,
      20,
      getValue("GraphicalPresentation", getLang()),
      { align: textAlign }
    );
    //doc.text(getValue("GraphicalPresentation", getLang()), 20, 20);
    doc.setFont(undefined, "normal");
    doc.text(
      getLang() === "ar" ? 195 : 20,
      30,
      getValue("PricingGraphPresDesc1", getLang()),
      { maxWidth: 170, lineHeightFactor: 1.3, align: textAlign }
    );
    doc.text(
      getLang() === "ar" ? 195 : 20,
      34,
      getValue("PricingGraphPresDesc2", getLang()),
      { maxWidth: 170, lineHeightFactor: 1.3, align: textAlign }
    );
    doc.text(
      getLang() === "ar" ? 195 : 20,
      38,
      getValue("PricingGraphPresDesc3", getLang()),
      { maxWidth: 170, lineHeightFactor: 1.3, align: textAlign }
    );

    doc.addImage(this.state.imageData, "jpeg", 20, 60, (111 * 1400) / 834, 111);
    // doc.addImage(this.state.imageData, "png", 20, 80, 111 * 1314 / 834, 111);

    //footer

    /*==================================================
      LAST PAGE
      ================================================*/

    doc.addPage();
    doc.addImage(lastPageBgFull, "png", 0, 0, 297, 300);
    //doc.addImage(logo, "png", 18, 80, 10 * 853 / 210, 10, "logo");

    //notes
    doc.setFont(undefined, "normal");
    doc.setFontSize(11);
    doc.text(
      getValue("LastPageNote", getLang()),
      getLang() == "ar" ? 195 : 20,
      100,
      { maxWidth: 170, lineHeightFactor: 1.3, align: textAlign }
    );
    doc.textWithLink("www.spectre-me.com", 20, 115, {
      url: "http://www.spectre-me.com",
    });
    //download pdf

    const pageCount = doc.internal.getNumberOfPages();
    for (var i = 1; i < pageCount; i++) {
      doc.setFont(undefined, "normal");
      doc.setPage(i);
      doc.text("SPECTRE Report", 20, 290);
      doc.text(`Page | ` + i, 100, 290);
      doc.text(dateStr, 167, 290);
    }

    doc.save("report.pdf");
  }

  render() {
    return (
      <div className="displayinline col-md-12 " style={{ display: "none" }}>
        <canvas style={{ display: "none" }}></canvas>
      </div>
    );
  }
}

export default Pricing2;