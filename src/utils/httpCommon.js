import axios from "axios";
import { AlertSuccess } from "../components/f_Alerts";
import { getUser, removeUserSession, getToken } from "./common";
import { ApiUrls } from "./Globals";

export default axios.create({
  baseURL: ApiUrls.BaseURL,
  mediaURL: ApiUrls.MediaURL,

  headers: {
    "Content-type": "application/json",
    authorization: "Bearer " + localStorage.getItem("Spectre_Token"),
    "Access-Control-Allow-Origin": "*",
  },
});
