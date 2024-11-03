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

function SampleNextArrow(props) {
    const { className, onClick } = props;
    return (
        <button onClick={onClick} type="button" className={className}><i className="icon-right-open-big"></i></button>
    );
}

function SamplePrevArrow(props) {
    const { className, onClick } = props;
    return (
        <button onClick={onClick} type="button" className={className}><i className="icon-left-open-big"></i></button>

    );
}

const MainFooter = (props) => {


    const [footer, setFooter] = useState([]);

    useEffect(() => {
        setFooter(props.footer);

        console.log(footer);
    }, [])

    const settings = {
        centerMode: true,
        centerPadding: "60px",
        arrows: true,
        slidesToShow: 3,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    arrows: false,
                    centerMode: true,
                    centerPadding: '40px',
                    slidesToShow: 3
                }
            },
            {
                breakpoint: 480,
                settings: {
                    arrows: false,
                    centerMode: true,
                    centerPadding: '40px',
                    slidesToShow: 1
                }
            }
        ]
    }



    $(function () {
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
            $(this).addClass('grabbing');
        });

        $(".slide").on("mouseup touchend", function (e) {
            $(this).removeClass('grabbing');
        });


    });

    return (
        <div>

        </div >
    );
};

export default MainFooter;
