import Default from "../Assets/Images/Default.jpg";
import { ApiUrls } from "./Globals";

import APIFunctions from "../utils/APIFunctions";

// return the user data from the session storage
export const getUser = () => {
    return localStorage.getItem("userName");
};

// return the token from the session storage
export const getToken = () => {
    // check token validity
    return localStorage.getItem("Spectre_Token") || null;
};
export const checkIsAdminToken = () => {


    // check token validity
    if (
        localStorage.getItem("Spectre_IsAdmin") == null ||
        localStorage.getItem("Spectre_IsAdmin") == "false"
    )
        return false;
    return true;
};
export const checkToken = () => {
    // check token validity
    if (localStorage.getItem("Spectre_Token") == null) return null;
    APIFunctions.checkTokenValditiy(localStorage.getItem("Spectre_Token"))
        .then((response) => {
            if (response.data == "Valid")
                return localStorage.getItem("Spectre_Token");
            else return null;
        })
        .catch((e) => {
            console.log(e);
        });
    return localStorage.getItem("Spectre_Token") || null;
};

//check if user is admin
export const CheckIfUserIsAdmin = () => {
    if (localStorage.getItem("Spectre_Token") == null) return false;
    APIFunctions.CheckIfUserIsAdmin(localStorage.getItem("Spectre_Token"))
        .then((response) => {
            console.log(response.data);
            return response.data;
        })
        .catch((e) => {
            console.log(e);
        });
};

// remove the token and user from the session storage
export const removeUserSession = () => {
    localStorage.removeItem("Spectre_Token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("Spectre_IsAdmin");
    localStorage.removeItem("Spectre_AllowClientToChooseBePositive");
};

// set the token and user from the session storage
export const setUserSession = (token, userId, userName, isAdmin, AllowClientToChooseBePositive) => {
    localStorage.setItem("Spectre_Token", token);
    localStorage.setItem("userId", userId);
    localStorage.setItem("userName", userName);
    localStorage.setItem("Spectre_IsAdmin", isAdmin);
    localStorage.setItem("Spectre_AllowClientToChooseBePositive", AllowClientToChooseBePositive)
};
//set Language
export const setLanguage = (lang) => {
    localStorage.setItem("lang", lang);
};

export const setIMF = (value) => {
    localStorage.setItem("IMF", value);
};

export const setPPP = (value) => {
    localStorage.setItem("PPP", value);
};

export const getIMF = () => {
    return localStorage.getItem("IMF") || "false";
};

export const getPPP = () => {
    return localStorage.getItem("PPP") || "false";
};


// get Lang
export const getLang = () => {
    return localStorage.getItem("lang") || "en";
};
function Encrypt(PlainText) {
    return btoa(unescape(encodeURIComponent(PlainText)));
}

export function BindImageURL(ImageURL) {
    if (ImageURL == null || ImageURL == "") return { Default };
    else return ApiUrls.MediaURL + ImageURL;
}


export const generateNewID = () => {
    var ID = Math.floor(100000000 + Math.random() * 900000000);
    return ID * (-1)
}

export const validateEmail = (email) => {
    var isValid = true;
    let regEmail =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!regEmail.test(email)) {
        isValid = false;
    }

    return isValid;
};

export const validatePhone = (phone) => {
    var isValid = true;
    var regex = /^\+[0-9]{1,3}\.[0-9]{4,14}(?:x.+)?$/;
    if (!regex.test(phone)) {
        isValid = false;
    }

    return isValid;
};

export const checkCanView = (pageUrl) => {

    if (!checkToken())
        return false;
    else {
        APIFunctions.checkIfCanView(pageUrl)
            .then((response) => {
                return response.data;
            })
            .catch((e) => {
                console.log(e);
            });
    }

    return false;
}


export const monthTranslator = (month) => {
    if (month == 1 || month == "1")
        return "January";
    if (month == 2 || month == "2")
        return "February";
    if (month == 3 || month == "3")
        return "March";
    if (month == 4 || month == "4")
        return "April";
    if (month == 5 || month == "5")
        return "May";
    if (month == 6 || month == "6")
        return "June";
    if (month == 7 || month == "7")
        return "July";
    if (month == 8 || month == "8")
        return "August";
    if (month == 9 || month == "9")
        return "September";
    if (month == 10 || month == "10")
        return "October";
    if (month == 11 || month == "11")
        return "November";
    if (month == 12 || month == "12")
        return "December";
}


export const displayPop = (Pop, isIMF) => {
    var _Pop = Pop;
      if (_Pop == null || _Pop == 0) {
        _Pop = "";
      }
      else if (Number.isInteger(_Pop)) {
        if (isIMF) {
          _Pop =  _Pop.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
        else {
          _Pop = parseFloat(_Pop) / 1000000;
          _Pop = _Pop.toFixed(3).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
      }
      else {
        if (isIMF) {
          _Pop =  _Pop.toFixed(3).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          console.log('here we are');
        }
        else {

          _Pop = parseFloat(_Pop) / 1000000;
          _Pop =_Pop.toFixed(3).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          console.log('here we are 2');
        }
      }

      return _Pop;
}


export const displayPricingPop = (Pop) => {
    if (Pop == null) 
        return "";
    if (Number.isInteger(Pop))
          return Pop.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    else
        return Pop.toFixed(3).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


// Fonts for reports//




//