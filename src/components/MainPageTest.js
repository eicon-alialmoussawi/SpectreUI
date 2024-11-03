import React, { useEffect, useState, useRef, useMemo } from "react";
import { Container } from "reactstrap";
import TableContainer from "./TableContainer";
import APIFunctions from "../utils/APIFunctions";
import $ from "jquery";
import Slider from "react-slick";
import { BindImageURL, validateEmail, getLang } from "../utils/common";
import dateFormat from "dateformat";
import Select from "react-select";
import { AlertError, AlertSuccess } from "./f_Alerts";
import { getValue } from "../Assets/Language/Entries";
import { Footer } from "rsuite";
import MainFooter from "../components/Footer";

function SampleNextArrow(props) {
    const { className, onClick } = props;
    return (
        <button onClick={onClick} type="button" className={className}>
            <i className="icon-right-open-big"></i>
        </button>
    );
}

function SamplePrevArrow(props) {
    const { className, onClick } = props;
    return (
        <button onClick={onClick} type="button" className={className}>
            <i className="icon-left-open-big"></i>
        </button>
    );
}

const MainPageTest = () => {
    var mycontactUs = {
        id: 0,
        name: "",
        email: "",
        companyName: "",
        countryId: "",
        message: "",
        phoneNumber: "",
        isDeleted: false,
    };

    const [contactUs, setContactUs] = useState(mycontactUs);
    const [arrServices, setArrServices] = useState([]);
    const [arrVisualize, setArrVisualize] = useState([]);
    const [arrAbout, setArrAbout] = useState([]);
    const [arrSnaps, setArrSnaps] = useState([]);
    const [arrPackages, setArrPackages] = useState([]);
    const [_arrLatestNews, _setLatestNews] = useState([]);
    const [resultCountry, emplistCountry] = useState([]);
    const [footer, setFooter] = useState([]);
    const [arrFeatures, setArrFeatures] = useState([]);

    const settings = {
        centerMode: true,
        centerPadding: "60px",
        arrows: true,
        slidesToShow: 5,
        infinite: true,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
        responsive: [
            {
                breakpoint: 4000,
                settings: {
                    arrows: false,
                    centerMode: true,
                    centerPadding: "40px",
                    slidesToShow: 5,
                },
            },
            {
                breakpoint: 2000,
                settings: {
                    arrows: false,
                    centerMode: true,
                    centerPadding: "70px",
                    slidesToShow: 3,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    arrows: false,
                    centerMode: true,
                    centerPadding: "40px",
                    slidesToShow: 3,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    arrows: false,
                    centerMode: true,
                    centerPadding: "40px",
                    slidesToShow: 1,
                },
            },
        ],
    };

    useEffect(() => {
        getHomePageContent();
    }, []);

    const getHomePageContent = () => {
        APIFunctions.getHomePageContent()
            .then((response) => {
                _setLatestNews(response.data.latestNews);
                console.log(response.data.aboutUs[0]);
                setArrAbout(response.data.aboutUs[0]);
                setArrServices(response.data.services);
                setArrVisualize(response.data.visualizing[0]);
                setArrSnaps(response.data.reportSnaps);
                setArrPackages(response.data.packages);
                setFooter(response.data.spectreFooter);
                emplistCountry(response.data.countries);
                setArrFeatures(response.data.features);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const renderFeatures = () => {
        var _features = arrFeatures;
        if (_features != null && _features.length > 0) {
            return _features.map((val, idx) => (
                <div className="w-100 slide px-packages">
                    {/* <div className="packages-img">
                        <img src={BindImageURL(val.imageUrl)} alt="package" />
                    </div> */}
                    <div className="packages-img">
                        <i className={val.imageUrl}></i>
                    </div>
                    <span className="text-white packages-title">
                        {" "}
                        {getLang() === "en"
                            ? val.titleEn
                            : getLang() === "fr"
                                ? val.titleFr
                                : val.titleAr}
                    </span>
                    <div class="packages-list">{renderDescription2(val)}</div>
                </div>
            ));
        }
    };

    const handleChangeCountry = (selectedOptions) => {
        setContactUs({ ...contactUs, countryId: selectedOptions.countryId });
    };

    const getReportSnaps = () => {
        var _snaps = arrSnaps;
        if (_snaps != null && _snaps.length > 0) {
            return _snaps.map((val, idx) => (
                <div>
                    <img
                        className="slide"
                        src={BindImageURL(val.imageUrl)}
                        alt={val.referenceText}
                    />
                </div>
            ));
        }
    };

    const renderFooter = () => {
        var _footer = footer;
        if (_footer != null && _footer.length > 0) {
            return _footer.map((val, idx) => (
                <div className="col-lg-3 col-md-6 col-sm-12">
                    <aside className="widget_text widget widget_custom_html">
                        <div className="textwidget custom-html-widget">
                            <h5>{val.titleEn}</h5>
                            <p>{val.buildingEn}</p>
                            <p>{val.streetEn}</p>
                            <p>{val.cityEn}</p>
                            <p>{val.addressEn}</p>
                            <p>
                                <a style={{ color: "#9eaccf" }} href="#">
                                    {val.email}
                                </a>
                                <br /> {val.phoneNumber}
                            </p>
                        </div>
                    </aside>
                </div>
            ));
        }
    };

    const renderDescription = (val) => {
        var desc =
            getLang() === "en"
                ? val.descriptionEn.split("\n")
                : getLang() === "ar"
                    ? val.descriptionSpa.split("\n")
                    : val.descriptionFr.split("\n");
        return desc.map((val, idx) => {
            if (val.length > 0) {
                return (
                    <p
                        style={{
                            display: "flex",
                            gap: "5px",
                            color: "var(--copy-text) !important",
                        }}
                    >
                        <span>🗸</span> {val}
                    </p>
                );
            }
        });
    };

    const renderDescription2 = (val) => {
        var desc =
            getLang() === "en"
                ? val.descriptionEn.split("\n")
                : getLang() === "ar"
                    ? val.descriptionAr.split("\n")
                    : val.descriptionFr.split("\n");
        return desc.map((val, idx) => {
            if (val.length > 0) {
                return (
                    <p
                        style={{
                            display: "flex",
                            gap: "5px",
                            color: "var(--copy-text) !important",
                        }}
                    >
                        <span>🗸</span> {val}
                    </p>
                );
            }
        });
    };

    const renderAboutDesc = (val) => {
        if (val != null && val.length > 0) {
            var desc = val.split("\n");
            return desc.map((val, idx) => {
                if (val.length > 0) {
                    return <h5 style={{ color: "var(--copy-text)" }}> {val} </h5>;
                }
            });
        }
    };

    const renderUrl = (url) => {
        if (url !== "" && url != null) {
            return (
                <a
                    href={url}
                    className="button button_left button_js"
                    target="_blank"
                    rel="noreferrer noopener"
                >
                    <span className="button_icon">
                        <i className="icon-layout" />
                    </span>
                    <span className="button_label">
                        { }
                        Read more
                    </span>
                </a>
            );
        }
    };

    const _renderLatestNews = () => {
        var _news = _arrLatestNews;
        if (_news != null && _news.length > 0) {
            return _news.map((val, idx) => {
                return (
                    <li className="post-175 post format-standard has-post-thumbnail  category-motion category-photography category-uncategorized tag-eclipse tag-grid tag-mysql">
                        <div className="item_wrapper">
                            <div className="image_frame scale-with-grid">
                                <div className="image_wrapper">
                                    <img
                                        width={576}
                                        height={450}
                                        style={{
                                            objectFit: "cover",
                                        }}
                                        src={BindImageURL(val.imageUrl)}
                                        className="scale-with-grid wp-post-image"
                                        alt="beauty_portfolio_2"
                                    />
                                </div>
                            </div>
                            <div className="date_label">
                                {dateFormat(val.creationDate, "mmm d, yyyy")}
                            </div>
                            <div className="desc">
                                <h5>
                                    <a>
                                        {getLang() == "en"
                                            ? val.descriptionEn
                                            : getLang() == "fr"
                                                ? val.descriptionFr
                                                : val.descriptionAr}
                                    </a>
                                </h5>
                                <hr className="hr_color" />
                                {renderUrl(val.url)}
                            </div>
                        </div>
                    </li>
                );
            });
        }
    };

    function getText(nameEn, nameAr, nameFr) {
        if (getLang() === "en") {
            return { nameEn };
        } else if (getLang() === "ar") {
            return { nameAr };
        } else {
            return { nameFr };
        }
    }

    const renderPackages = () => {
        var _packages = arrPackages;
        if (_packages.length > 0 && _packages != null) {
            return _packages.map((val, idx) => (
                <div className="w-100 slide px-packages">
                    <div className="packages-img">
                        <i className={val.imageUrl}></i>
                    </div>
                    <span className="text-white packages-title">
                        {getLang() === "en"
                            ? val.nameEn
                            : getLang() === "ar"
                                ? val.nameSpa
                                : val.nameFr}
                    </span>
                    <div class="packages-list">{renderDescription(val)}</div>
                </div>
            ));
        }
    };

    const submitForm = () => {
        var valid = true;
        var message = "Please enter ";
        if (contactUs.name == "" || contactUs.name == null) {
            valid = false;
            message = message + "name ";
        }
        if (contactUs.email == "" || contactUs.email == null) {
            if (valid == false) message = message + " and email";
            else message = message + " email";
        }

        if (!valid) {
            AlertError(message);
            return;
        }

        if (!validateEmail(contactUs.email)) {
            AlertError("Please enter a valid email");
            return;
        }

        APIFunctions.saveContactUs(contactUs)
            .then((response) => {
                if (response.data != null) {
                    AlertSuccess("Successfully sent");
                } else {
                    AlertError("Something went wrong, please try again later");
                }
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const settings_packages = {
        centerMode: true,
        centerPadding: "30px",
        arrows: true,
        slidesToShow: 3,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
        responsive: [
            {
                breakpoint: 1120,
                settings: {
                    arrows: false,
                    centerMode: true,
                    centerPadding: "0px",
                    slidesToShow: 1,
                    adaptiveHeight: true,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    arrows: false,
                    centerMode: true,
                    centerPadding: "0px",
                    slidesToShow: 1,
                },
            },
        ],
    };

    const renderServices = () => {
        var _services = arrServices;
        if (_services.length > 0) {
            return _services.map((val, idx) => (
                <div>
                    <div className="feature-item">
                        <img src={BindImageURL(val.icon)} />
                        <h4 className="title">
                            {getLang() === "en"
                                ? val.titleEn
                                : getLang() === "fr"
                                    ? val.titleFr
                                    : val.titleAr}
                        </h4>
                        <div className="desc">
                            {getLang() === "en"
                                ? val.descriptionEn
                                : getLang() === "fr"
                                    ? val.descriptionFr
                                    : val.descriptionAr}
                        </div>
                    </div>
                </div>
            ));
        }
    };

    $(document).ready(function () {
        let observerOptions = {
            root: null,
            rootMargin: "-50% 0px -50% 0px",
            threshold: 0,
        };
        let observerCallback = (entries, observer) => {
            entries.forEach((entry) => {
                $(`#menu a[href="#${$(entry.target).attr("id")}"]`)
                    .closest("li")
                    .toggleClass("current-menu-item", entry.isIntersecting);
            });
        };

        let observer = new IntersectionObserver(observerCallback, observerOptions);
        //observe all sections
        $(
            "#home-about,#home-features,#home-screenshots,#home-packages,#home-news-slider,#home-contact"
        ).each(function () {
            observer.observe($(this)[0]);
        });

        $(document).on("scroll", function () {
            $(".mouse").css({ opacity: +!$(this).scrollTop() });
        });

        $(".slide").on("mousedown touchstart", function (e) {
            $(this).addClass("grabbing");
        });

        $(".slide").on("mouseup touchend", function (e) {
            $(this).removeClass("grabbing");
        });
    });
    useEffect(() => {
        CheckUserIsAdmin();
    }, []);
    const [isAdmin, setAdmin] = React.useState(false);
    const CheckUserIsAdmin = () => {
        APIFunctions.CheckIfUserIsAdmin()
            .then((response) => {
                setAdmin(response.data);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    return (
        <div>
            <div id="Wrapper" className="no-margin-h public-page">
                <div id="Content">
                    <div className="content_wrapper clearfix">
                        <div className="sections_group">
                            <div className="entry-content">
                                {/* about  */}
                                <div id="home-about" className="section mcb-section container">
                                    <div className="section_wrapper mcb-section-inner">
                                        <div className="wrap mcb-wrap one valign-top clearfix">
                                            <div className="mcb-wrap-inner column one">
                                                <div className="column_column">
                                                    <div className="column_attr clearfix">
                                                        <h2 className="text-white">
                                                            {getLang() == "en"
                                                                ? arrAbout.titleEn
                                                                : getLang() == "fr"
                                                                    ? arrAbout.titleFr
                                                                    : arrAbout.titleAr}
                                                        </h2>
                                                        <hr className="no_line" />

                                                        {getLang() == "en"
                                                            ? renderAboutDesc(arrAbout.descriptionEn)
                                                            : getLang() == "fr"
                                                                ? renderAboutDesc(arrAbout.descriptionFr)
                                                                : renderAboutDesc(arrAbout.descriptionAr)}
                                                        <p>{/* {arrAbout.descriptionEn} */}</p>
                                                        <hr className="no_line" />
                                                    </div>
                                                </div>
                                                <div className="column_image">
                                                    <div className="image_frame image_item no_link scale-with-grid aligncenter no_border">
                                                        <div className="image_wrapper">
                                                            {/* <img class="scale-with-grid" src="images/home_internet2_pic4.png"> */}
                                                            <img
                                                                className="scale-with-grid"
                                                                id="home-about-img"
                                                                src={"./public_pages/images/img-1.png"}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="column mcb-column one column_divider ">
                                            <hr
                                                className="no_line"
                                                style={{ margin: "0 auto 30px" }}
                                            />
                                        </div>
                                        <div className="column mcb-column one column_column">
                                            <div className="column_attr clearfix">
                                                <div
                                                    style={{
                                                        width: "100%",
                                                        height: 1,
                                                        background: "#243459",
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* features  */}
                                <div id="home-features" className="section mcb-section">
                                    <div className="section_wrapper mcb-section-inner">
                                        <div className="wrap mcb-wrap one valign-top clearfix">
                                            <div className="mcb-wrap-inner">
                                                <div
                                                    className="clearfix align_center"
                                                    style={{ textAlign: "center", marginBottom: 40 }}
                                                >
                                                    <h2 className="text-white">
                                                        {getValue("ExploreTools", getLang())}
                                                    </h2>
                                                </div>
                                                <div className="feature-items-list">
                                                    {renderServices()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* screenshots  */}
                                <div id="home-screenshots" className="section mcb-section">
                                    <div className="mcb-section-inner">
                                        <div className="column mcb-column one column_column">
                                            <div className="column_attr clearfix align_center">
                                                <h2 className="text-white">
                                                    {getLang() === "en"
                                                        ? arrVisualize.titleEn
                                                        : getLang() === "fr"
                                                            ? arrVisualize.titleFr
                                                            : arrVisualize.titleAr}
                                                </h2>
                                            </div>
                                        </div>
                                        <div className="wrap mcb-wrap one valign-top clearfix slider-wrap">
                                            <Slider className="slider mcb-wrap-inner" {...settings}>
                                                {getReportSnaps()}
                                            </Slider>
                                        </div>
                                    </div>
                                    <div className="container clearfix">
                                        <div className="column mcb-column one column_column">
                                            <div className="column_attr clearfix align_center home-screenshots-p px-lg-5">
                                                <p>
                                                    {getLang() == "en"
                                                        ? arrVisualize.descriptionEn
                                                        : getLang() == "fr"
                                                            ? arrVisualize.descriptionFr
                                                            : arrVisualize.descriptionAr}
                                                </p>
                                                {/* <p>
                          You may request a specific analysis scenario: pricing
                          of a band or calculation of a license price. Data is
                          displayed in different formats including tabularized
                          results, bar-charts, and scatter plots. In addition,
                          you can download a detailed analysis report of the
                          studied scenario.
                        </p>
                        <p>
                          You may also select to show prices as: unit spectrum
                          price, in $/MHz/pop, or in $/MHz for a defined
                          country, or as a license price for the whole duration
                          you choose, or as annualised payments.
                        </p> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* packages  */}
                                <div id="home-packages" className="section mcb-section pb-5">
                                    <div className="mcb-section-inner text-center container">
                                        <div className="row">
                                            <div className="col-lg-12 col-md-12 col-sm-12">
                                                <h2 className="mb-5 text-white">
                                                    {getValue("ExplorePackages", getLang())}
                                                </h2>
                                            </div>
                                        </div>

                                        {/* Packges */}
                                        <div className="wrap mcb-wrap one valign-top clearfix slider-wrap mb-5">
                                            <Slider
                                                className="slider mcb-wrap-inner"
                                                {...settings_packages}
                                            >
                                                {renderPackages()}
                                            </Slider>
                                        </div>

                                        {/* Services */}
                                        <div className="wrap mcb-wrap one valign-top clearfix slider-wrap">
                                            <Slider
                                                className="slider mcb-wrap-inner"
                                                {...settings_packages}
                                                slidesToShow={arrFeatures.length === 1 ? 1 : arrFeatures.length === 2 ? 2 : 3}
                                            >
                                                {renderFeatures()}
                                            </Slider>
                                        </div>
                                    </div>
                                </div>
                                {/* news  */}
                                <div id="home-news-slider" className="section mcb-section">
                                    <div className="mcb-section-inner container">
                                        <div className="wrap mcb-wrap one valign-top clearfix">
                                            <div className="mcb-wrap-inner">
                                                <div className="column mcb-column one column_column">
                                                    <div className="column_attr clearfix align_center">
                                                        <h2 className="text-white">
                                                            {getValue("RecentNews", getLang())}
                                                        </h2>
                                                    </div>
                                                </div>
                                                <div className="column mcb-column one column_testimonials dark">
                                                    <div className="blog_slider clearfix ">
                                                        <div className="blog_slider_header column one">
                                                            {/* <h4 class="title">Recent post</h4> */}
                                                            <a
                                                                className="button button_js slider_prev"
                                                                href="#"
                                                            >
                                                                <span className="button_icon">
                                                                    <i className="icon-left-open-big" />
                                                                </span>
                                                            </a>
                                                            <a
                                                                className="button button_js slider_next"
                                                                href="#"
                                                            >
                                                                <span className="button_icon">
                                                                    <i className="icon-right-open-big" />
                                                                </span>
                                                            </a>
                                                        </div>
                                                        <ul className="blog_slider_ul">
                                                            {_renderLatestNews()}
                                                            {/* <li className="post-175 post format-standard has-post-thumbnail  category-motion category-photography category-uncategorized tag-eclipse tag-grid tag-mysql">
                                <div className="item_wrapper">
                                  <div className="image_frame scale-with-grid">
                                    <div className="image_wrapper">
                                      <img
                                        width={576}
                                        height={450}
                                        src={
                                          "./public_pages/images/close-up-keyboard-glasses-with-executives-background.jpg"
                                        }
                                        className="scale-with-grid wp-post-image"
                                        alt="beauty_portfolio_2"
                                      />
                                    </div>
                                  </div>
                                  <div className="date_label">May 13, 2014</div>
                                  <div className="desc">
                                    <h5>
                                      <a href="blog-single-content-builder.html">
                                        Lorem ipsum dolor sit amet consectetur
                                        adipisicing elit. Ipsum voluptatum
                                        aliquid accusamus illo minus quisquam
                                        necessitatibus unde quod numquam
                                        explicabo, molestias modi debitis nisi
                                        illum.
                                      </a>
                                    </h5>
                                    <hr className="hr_color" />
                                    <a
                                      href="blog-single-content-builder.html"
                                      className="button button_left button_js"
                                    >
                                      <span className="button_icon">
                                        <i className="icon-layout" />
                                      </span>
                                      <span className="button_label">
                                        Read more
                                      </span>
                                    </a>
                                  </div>
                                </div>
                              </li> */}
                                                            {/* <li className="post-186 post  format-image has-post-thumbnail  category-mobile category-photography category-uncategorized tag-design tag-html5 ">
                                <div className="item_wrapper">
                                  <div className="image_frame scale-with-grid">
                                    <div className="image_wrapper">
                                      <img
                                        width={500}
                                        height={450}
                                        src={
                                          "./public_pages/images/side-view-cropped-unrecognizable-business-people-working-common-desk.jpg"
                                        }
                                        className="scale-with-grid wp-post-image"
                                        alt="blog_vertical"
                                      />
                                    </div>
                                  </div>
                                  <div className="date_label">May 13, 2014</div>
                                  <div className="desc">
                                    <h5>
                                      <a href="blog-single-vertical-photo.html">
                                        Lorem ipsum dolor sit amet consectetur
                                        adipisicing elit. Amet provident
                                        dignissimos, quam, iure necessitatibus
                                        harum soluta atque doloribus enim
                                        tempora odit repudiandae error
                                        aspernatur et.
                                      </a>
                                    </h5>
                                    <hr className="hr_color" />
                                    <a
                                      href="blog-single-vertical-photo.html"
                                      className="button button_left button_js"
                                    >
                                      <span className="button_icon">
                                        <i className="icon-layout" />
                                      </span>
                                      <span className="button_label">
                                        Read more
                                      </span>
                                    </a>
                                  </div>
                                </div>
                              </li>
                              <li className="post-193 post  format-standard has-post-thumbnail  category-photography category-uncategorized  tag-mysql tag-zend">
                                <div className="item_wrapper">
                                  <div className="image_frame scale-with-grid">
                                    <div className="image_wrapper">
                                      <img
                                        width={576}
                                        height={450}
                                        src={
                                          "./public_pages/images/corporate-business-handshake-partners.jpg"
                                        }
                                        className="scale-with-grid wp-post-image"
                                        alt="mechanic_blog_2"
                                      />
                                    </div>
                                  </div>
                                  <div className="date_label">May 13, 2014</div>
                                  <div className="desc">
                                    <h5>
                                      <a href="portfolio-single-1.html">
                                        Lorem ipsum dolor sit amet, consectetur
                                        adipisicing elit. Quidem saepe
                                        necessitatibus eveniet vitae, autem
                                        cupiditate deleniti, nemo dicta eligendi
                                        dolores aperiam soluta, animi a nobis?
                                      </a>
                                    </h5>
                                    <hr className="hr_color" />
                                    <a
                                      href="portfolio-single-1.html"
                                      className="button button_left button_js"
                                    >
                                      <span className="button_icon">
                                        <i className="icon-layout" />
                                      </span>
                                      <span className="button_label">
                                        Read more
                                      </span>
                                    </a>
                                  </div>
                                </div>
                              </li>
                              <li className="post-183 post  format-video has-post-thumbnail  category-mobile category-photography category-uncategorized tag-css3  tag-zend">
                                <div className="item_wrapper">
                                  <div className="image_frame scale-with-grid">
                                    <div className="image_wrapper">
                                      <img
                                        width={576}
                                        height={399}
                                        src={
                                          "./public_pages/images/corporate-business-handshake-partners.jpg"
                                        }
                                        className="scale-with-grid wp-post-image"
                                        alt="blog_html5"
                                      />
                                    </div>
                                  </div>
                                  <div className="date_label">May 13, 2014</div>
                                  <div className="desc">
                                    <h5>
                                      <a href="portfolio-single-content_builder.html">
                                        Lorem ipsum dolor sit amet, consectetur
                                        adipisicing elit. Quidem saepe
                                        necessitatibus eveniet vitae, autem
                                        cupiditate deleniti, nemo dicta eligendi
                                        dolores aperiam soluta, animi a nobis?
                                      </a>
                                    </h5>
                                    <hr className="hr_color" />
                                    <a
                                      href="portfolio-single-content_builder.html"
                                      className="button button_left button_js"
                                    >
                                      <span className="button_icon">
                                        <i className="icon-layout" />
                                      </span>
                                      <span className="button_label">
                                        Read more
                                      </span>
                                    </a>
                                  </div>
                                </div>
                              </li>
                              <li className="post-181 post  format-video has-post-thumbnail  category-motion category-photography category-uncategorized tag-eclipse  ">
                                <div className="item_wrapper">
                                  <div className="image_frame scale-with-grid">
                                    <div className="image_wrapper">
                                      <img
                                        width={576}
                                        height={400}
                                        src={
                                          "./public_pages/images/side-view-cropped-unrecognizable-business-people-working-common-desk.jpg"
                                        }
                                        className="scale-with-grid wp-post-image"
                                        alt="blog_video"
                                      />
                                    </div>
                                  </div>
                                  <div className="date_label">May 13, 2014</div>
                                  <div className="desc">
                                    <h5>
                                      <a href="portfolio-single-video.html">
                                        Video post with youtube / vimeo
                                      </a>
                                    </h5>
                                    <hr className="hr_color" />
                                    <a
                                      href="portfolio-single-video.html"
                                      className="button button_left button_js"
                                    >
                                      <span className="button_icon">
                                        <i className="icon-layout" />
                                      </span>
                                      <span className="button_label">
                                        Read more
                                      </span>
                                    </a>
                                  </div>
                                </div>
                              </li> */}
                                                        </ul>
                                                        <div className="slider_pagination" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* contact  */}
                                <div id="home-contact" className="section mcb-section">
                                    <div className="section_wrapper mcb-section-inner">
                                        <div className="column mcb-column one column_column">
                                            <div className="column_attr clearfix">
                                                <h2 className="mb-3 text-white">
                                                    {getValue("ContactForm", getLang())}
                                                </h2>
                                                <h5>{getValue("ContactFormMessage", getLang())}</h5>
                                                <hr
                                                    className="no_line"
                                                    style={{ margin: "0 auto 15px" }}
                                                />
                                                <div id="contactWrapper">
                                                    <form id="contactform">
                                                        <input
                                                            placeholder={getValue("Name", getLang())}
                                                            type="text"
                                                            name="name"
                                                            id="name"
                                                            size={40}
                                                            value={contactUs.name}
                                                            onChange={(e) => {
                                                                setContactUs({
                                                                    ...contactUs,
                                                                    name: e.target.value,
                                                                });
                                                            }}
                                                            aria-required="true"
                                                            aria-invalid="false"
                                                        />
                                                        <input
                                                            placeholder={getValue("Email", getLang())}
                                                            type="email"
                                                            name="email"
                                                            id="email"
                                                            size={40}
                                                            value={contactUs.email}
                                                            onChange={(e) => {
                                                                setContactUs({
                                                                    ...contactUs,
                                                                    email: e.target.value,
                                                                });
                                                            }}
                                                            aria-required="true"
                                                            aria-invalid="false"
                                                        />
                                                        <input
                                                            placeholder={getValue("CompanyName", getLang())}
                                                            type="text"
                                                            name="company"
                                                            id="company"
                                                            value={contactUs.companyName}
                                                            onChange={(e) => {
                                                                setContactUs({
                                                                    ...contactUs,
                                                                    companyName: e.target.value,
                                                                });
                                                            }}
                                                            size={40}
                                                            aria-invalid="false"
                                                        />
                                                        <input
                                                            placeholder={getValue("PhoneNumber", getLang())}
                                                            type="number"
                                                            name="phone"
                                                            id="phone"
                                                            value={contactUs.phoneNumber}
                                                            onChange={(e) => {
                                                                setContactUs({
                                                                    ...contactUs,
                                                                    phoneNumber: e.target.value,
                                                                });
                                                            }}
                                                            size={40}
                                                            aria-invalid="false"
                                                        />
                                                        <textarea
                                                            placeholder={getValue("Message", getLang())}
                                                            // defaultValue={""}
                                                            value={contactUs.message}
                                                            onChange={(e) => {
                                                                setContactUs({
                                                                    ...contactUs,
                                                                    message: e.target.value,
                                                                });
                                                            }}
                                                        />
                                                        <Select
                                                            id="ddlCountries"
                                                            name="countryId"
                                                            value={resultCountry.find((obj) => {
                                                                return obj.countryId === contactUs.countryId;
                                                            })}
                                                            getOptionLabel={(option) =>
                                                                getLang() == "ar"
                                                                    ? option.nameAr
                                                                    : option.nameEn
                                                            }
                                                            getOptionValue={(option) => option.countryId}
                                                            options={resultCountry}
                                                            onChange={handleChangeCountry}
                                                        ></Select>
                                                        <input
                                                            type="button"
                                                            defaultValue={getValue("SendRequest", getLang())}
                                                            id="submit"
                                                            // onclick="return check_values();"
                                                            onClick={submitForm}
                                                        />
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <footer id="Footer" className="clearfix">
                    <div className="widgets_wrapper">
                        <div className="container">
                            <div className="row">{renderFooter()}</div>
                        </div>
                    </div>
                    <div className="pt-4 pb-4 footer_copy">
                        <div className="container">
                            <div className="row">
                                <div className="col-12">
                                    <a id="back_to_top" className="button button_js" href="#">
                                        <i className="icon-up-open-big" />
                                    </a>
                                    <div className="copyright">
                                        {getValue("CopyRight", getLang())}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
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

export default MainPageTest;
