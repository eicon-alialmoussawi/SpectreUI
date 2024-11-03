import React, { useState, useEffect, useMemo, useRef, Component } from "react";
import APIFunctions from "../utils/APIFunctions";
import "react-datepicker/dist/react-datepicker.css";
import "../css/CustomStyle.css";
import { Alert, LoadingAlert, AlertError } from "../components/f_Alerts";
import jsPDF from "jspdf";
import "jspdf-autotable";
import {
  getIMF,
  displayPop,
  getLang,
  ArialBold,
  ArialRegular,
  BindImageURL,
} from "../utils/common";
import lastPage from "../Assets/Images/lastPage.png";
import rightBg2 from "../Assets/Images/rightBg.png";
import left from "../Assets/Images/left.png";
import { getValue } from "../Assets/Language/Entries";
import { get } from "jquery";
// Benchmark Backup
class Awards2 extends React.Component {
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
      wbType: "",
      space: ":",
      direction: "left",
      result: [],
    };
    this.bindData = this.bindData.bind(this);
  }

  componentDidMount() {
    var obj = [];
    var _awards = this.props.awards;
    var imF = getIMF() == "true" ? true : false;
    var txtIMF = this.props.filters.IsIMF == true ? "IMF" : "WB";
    var txtPPP = this.props.filters.IsPPP == true ? "PPP" : "nominal";

    if (getLang() == "ar") {
      this.setState({ direction: "right" });
    }
    this.setState({ imfType: txtIMF, wbType: txtPPP });
    console.log(this.props.awards);
    _awards.map((val, idx) =>
      obj.push([
        val.countryName,
        displayPop(val.pop, imF),
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
        val.pairing,
        val.mhz,
        val.coverage,
      ])
    );

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
    if (getLang() === "ar") {
      var callAddFont = function () {
        this.addFileToVFS("arial-normal.ttf", ArialRegular);
        this.addFont("arial-normal.ttf", "arial", "normal");

        this.addFileToVFS("arialbd-bold.ttf", ArialBold);
        this.addFont("arialbd-bold.ttf", "arial", "bold");
      };

      jsPDF.API.events.push(["addFonts", callAddFont]);
    }

    const textAlign = getLang() === "ar" ? "right" : "left";

    window.jsPDF = jsPDF;

    const leftBg = left;
    const rightBg = rightBg2;
    const chart = "";
    const lastPageBgFull = lastPage;

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
    //top right logo

    if (this.state.userInfo.logo != null && this.state.userInfo.logo.trim() != "") {
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
    // doc.addImage(logo, "png", 171, 10, 6 * 853 / 210, 6, "logo");

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
      //table head
      let arHead = [
        [
          {
            content: getValue("UserRunInformation", getLang()),
            colSpan: 2,
            styles: { halign: "center" },
          },
        ],
      ];
      if (getLang() === "ar") arHead = arHead.map((r) => r.reverse());

      let arBody = [
        [getValue("User", getLang()), this.state.userInfo.name],
        [getValue("Organisation", getLang()), this.state.userInfo.companyName],
        [getValue("AwardDate", getLang()), dateStr],
        ["S/W Version", "Release 2.01"],
      ];
      if (getLang() === "ar") arBody = arBody.map((r) => r.reverse());

      doc.autoTable({
        margin: { left: 20 },
        styles: { fontSize: 9, cellPadding: 1, font: "arial" },
        columnStyles: {
          0: { cellWidth: 120 },
        },
        startY: 25,
        headerStyles: {
          font: "arial",
          halign: "right",
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
    if (getLang() === "ar") {
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
        columnStyles: {
          0: { cellWidth: 120 },
        },
        startY: 67,
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

    /*==================================================
          PAGE 3
          ================================================*/
    doc.addPage();

    doc.setFontSize(10);
    doc.setFont(undefined, "bold");
    doc.text(
      getLang() === "ar" ? 195 : 20,
      20,
      getValue("ListOfAwards", getLang()),
      { align: textAlign }
    );
    //  doc.text(20, 20, getValue("ListOfAwards", getLang()));
    doc.setFont(undefined, "normal");

    doc.text(
      getLang() === "ar" ? 195 : 20,
      28,
      getValue("ListOfAwardsDescription", getLang()),
      { align: textAlign }
    );
    //  doc.text(20, 28, getValue("ListOfAwardsDescription", getLang()), { maxWidth: 170, lineHeightFactor: 1.3 });

    if (getLang() === "ar") {
      //table head
      let arHead3 = [
        [
          getValue("Countries", getLang()),
          getValue("Pop", getLang()),
          "GDPC, $",
          getValue("Operator", getLang()),
          getValue("AwardDate", getLang()),
          getValue("Price$M", getLang()),
          getValue("Term", getLang()),
          getValue("Bands", getLang()),
          getValue("Pairing", getLang()),
          getValue("TotalMHz", getLang()),
          getValue("Coverage", getLang()),
        ],
      ];
      arHead3 = arHead3.map((r) => r.reverse());

      let arBody3 = this.state.result;
      arBody3 = arBody3.map((r) => r.reverse());

      doc.autoTable({
        margin: { left: 20 },
        styles: { fontSize: 8, cellPadding: 1, font: "arial" },
        columnStyles: {
          0: { cellWidth: 18 },
          1: { cellWidth: 13 },
          2: { cellWidth: 13 },
          3: { cellWidth: 20 },
          4: { cellWidth: 13 },
          5: { cellWidth: 13 },
          6: { cellWidth: 13 },
          7: { cellWidth: 13 },
          8: { cellWidth: 10 },
          9: { cellWidth: 13 },
          10: { cellWidth: 20 },
          11: { cellWidth: 20 },
        },
        startY: 43,
        headerStyles: {
          font: "arial",
          halign: "right",
        },
        bodyStyles: {
          font: "arial",
          halign: "right",
        },
        head: arHead3,
        body: arBody3,
      });
    } else {
      doc.autoTable({
        margin: { left: 20 },
        styles: { fontSize: 8, cellPadding: 1 },
        columnStyles: {
          0: { cellWidth: 18 },
          1: { cellWidth: 13 },
          2: { cellWidth: 13 },
          3: { cellWidth: 20 },
          4: { cellWidth: 13 },
          5: { cellWidth: 13 },
          6: { cellWidth: 13 },
          7: { cellWidth: 13 },
          8: { cellWidth: 10 },
          9: { cellWidth: 13 },
          10: { cellWidth: 20 },
          11: { cellWidth: 20 },
        },
        startY: 43,
        head: [
          [
            getValue("Countries", getLang()),
            getValue("Pop", getLang()),
            "GDPC, $",
            getValue("Operator", getLang()),
            getValue("AwardDate", getLang()),
            getValue("Price$M", getLang()),
            getValue("Term", getLang()),
            getValue("Bands", getLang()),
            getValue("Pairing", getLang()),
            getValue("TotalMHz", getLang()),
            getValue("Coverage", getLang()),
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
        finalY + 10,
        getValue("Notes", getLang()),
        { align: textAlign }
      )
      .setFontSize(8);
    doc.setFont(undefined, "normal");

    doc
      .text(
        getLang() === "ar" ? 
          getValue("GDPNoteP2", getLang()) +
          " " +
          this.state.wbType +
          " " +
          getValue("GDPNoteP1", getLang()) : 
          "1. " +
            getValue("GDPNoteP1", getLang()) +
            " " +
            this.state.wbType +
            " " +
            getValue("GDPNoteP2", getLang()),
        getLang() === "ar" ? 195 : 20,
        finalY + 15,
        { maxWidth: 170, lineHeightFactor: 1.3, align: textAlign }
      )
      .setFontSize(8);
    doc
      .text(
        getLang() === "ar" ? getValue("BandPairingNote", getLang()) : "2. " + getValue("BandPairingNote", getLang()),
        getLang() === "ar" ? 195 : 20,
        finalY + 20,
        { maxWidth: 170, lineHeightFactor: 1.3, align: textAlign }
      )
      .setFontSize(8);
    doc
      .text(
        getLang() === "ar" ? "٣. " + getValue("CoverageNote", getLang()) : "3. " + getValue("CoverageNote", getLang()),
        getLang() === "ar" ? 195 : 20,
        finalY + 25,
        { maxWidth: 170, lineHeightFactor: 1.3, align: textAlign }
      )
      .setFontSize(8);
    doc
      .text(
        getLang() === "ar" ? "٤. " + getValue("PopulationNote", getLang()) : "4. " + getValue("PopulationNote", getLang()),
        getLang() === "ar" ? 195 : 20,
        finalY + 30,
        { maxWidth: 170, lineHeightFactor: 1.3, align: textAlign }
      )
      .setFontSize(8);
    doc
      .text(
        getLang() === "ar" 
        ? "." + this.state.imfType + " " + "٥. " + getValue("SocialNote", getLang()) 
        : "5. " + getValue("SocialNote", getLang()) + " " + this.state.imfType + ".",
        getLang() === "ar" ? 195 : 20,
        finalY + 39,
        { maxWidth: 170, lineHeightFactor: 1.3, align: textAlign }
      )
      .setFontSize(8);

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
      getLang() === "ar" ? 195 : 20,
      100,
      getValue("LastPageNote", getLang()),
      { maxWidth: 170, lineHeightFactor: 1.3, align: textAlign }
    );
    // doc.text(getValue("LastPageNote", getLang()), 20, 100, { maxWidth: 170, lineHeightFactor: 1.3 });
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
    // //or open it in a new tab instead
    // var string = doc.output('datauristring');
    // var embed = "<embed width='100%' height='100%' src='" + string + "'/>"
    // var x = window.open();
    // x.document.open();
    // x.document.write(embed);
    // x.document.close();
  }
  render() {
    return (
      <div
        className="displayinline col-md-12 "
        style={{ display: "none" }}
      ></div>
    );
  }
}

export default Awards2;
