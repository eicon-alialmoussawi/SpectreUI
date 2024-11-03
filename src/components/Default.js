import React, { useState, useEffect, useMemo, useRef, Component } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { getValue } from "../Assets/Language/Entries";
import { getLang, setLanguage, setIMF, setPPP } from "../utils/common";
import APIFunctions from "../utils/APIFunctions";

const Default = () => {

    //  const [defaultLang, setDefaultLang] = useState("en");

    const myNotifications =
    {
        messageEn: '',
        messageAr: '',
        messageFr: '',
    }

    const [notificationMessage, setNotificationMessage] = useState(myNotifications);

    useEffect(() => {
        getUserSavedFilters();
        getNotifications();
    }, []);

    const getUserSavedFilters = () => {
        APIFunctions.getDefault()
            .then((response) => {
                var obj = response.data;
                console.log(obj);
                if (obj.length > 0) {
                    var imf = obj.filter((item) => item.field == "IMF");
                    var ppp = obj.filter((item) => item.field == "PPP");

                    setIMF(imf[0].value);
                    setPPP(ppp[0].value);
                }
            })
            .catch((e) => {
                console.log(e);
            });
    }

    const getNotifications = () => {
        APIFunctions.getUnSeenNotifications()
            .then((response) => {
                var obj = response.data;
                setNotificationMessage(obj);
            })
            .catch((e) => {
                console.log(e);
            });
    }

    const ChangeLang = (val) => {
        // setDefaultLang(val);
        setLanguage(val);
        window.location.reload(false);
    }
    return (

        <div id="Wrapper">
            <div id="Content" class="inner-content">
                <div className="content_wrapper clearfix" id="welcome">
                    <h1>
                        <b>{getValue("Welcome", getLang())},</b>
                        {localStorage.getItem("userName")}
                    </h1>
                    <h1 style=
                        {{
                            top: "40vh",
                            fontSize: "23px",
                            fontWeight: "100",
                            fontStyle: "italic"
                        }}
                    >{getLang() == "en" ? notificationMessage.messageEn :
                        getLang() == "ar" ? notificationMessage.messageAr : notificationMessage.messageFr}</h1>
                </div>
            </div>
        </div>
    );
};

export default Default;
