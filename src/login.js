import React, { useState } from "react";
import axios from "axios";
import { setUserSession } from "./utils/common";
import Button from "./components/Button";
import logo from "./Resources/home_bg.png";
import APIFunctions from "./utils/APIFunctions";
function Login(props) {
  const [loading, setLoading] = useState(false);
  const username = useFormInput("");
  const password = useFormInput("");
  const [error, setError] = useState(null);

  var userIPaddress = GetIpAddress();
  console.log("my Ip" + userIPaddress);

  // handle button click of login form
  const headers = {
    "Access-Control-Allow-Origin": "https://localhost:44345",
    "Access-Control-Allow-Credentials": "true",
  };

  const handleLogin = () => {
    setError(null);
    setLoading(true);

    

    var data = {
      userName: username.value,
      password: btoa(password.value),
      lang: "en",
    };
    APIFunctions.login(data)
      .then((response) => {
        setLoading(false);

        var UserInfo = JSON.parse(response.data.messageEn);
        if (response.data.success) {
          setUserSession(
            UserInfo.Token,
            UserInfo.UserId,
            UserInfo.UserName,
            UserInfo.IsAdmin,
            UserInfo.AllowClientToChooseBePositive
          );

          window.open("MainPage", "_self");
        } else {
          setError(response.data.messageEn);
        }
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        if (error.response.status === 401)
          setError(error.response.data.message);
        else setError("Something went wrong. Please try again later.");
      });
  };

  return (
    <div className="container">
      {" "}
      <img style={{ width: "inherit" }} src={logo}></img>
      <div className="content-header">
        <div className="container-fluid">
          <div className=" mb-2 row">
            <div className="col-4"></div>
            <div className="login-box col-4">
              <div className="card card-outline card-primary">
                <div className="card-header text-center"></div>
                <div className="card-body">
                  <p className="login-box-msg">sign in </p>
                  <form>
                    <div className="mb-3">
                      <div className="input-group">
                        <input
                          type="email"
                          className="form-control"
                          placeholder="User Name"
                          {...username}
                        />
                        <div className="input-group-append">
                          <div className="input-group-text">
                            <span className="fas fa-envelope" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="input-group">
                        <input
                          type="password"
                          className="form-control"
                          placeholder="Password"
                          {...password}
                        />
                        <div className="input-group-append">
                          <div className="input-group-text">
                            <span className="fas fa-lock" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-8">
                        <div className="icheck-primary">
                          <input type="checkbox" id="remember" />
                          <label htmlFor="remember"></label>
                        </div>
                      </div>
                      <div className="col-4">
                        <Button
                          block
                          type="submit"
                          value={loading ? "Loading..." : "Login"}
                          onClick={handleLogin}
                          disabled={loading}
                        >
                          Login
                        </Button>
                      </div>
                    </div>
                  </form>

                  <p className="mb-1"></p>
                  <p className="mb-0"></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const useFormInput = (initialValue) => {
  const [value, setValue] = useState(initialValue);

  const handleChange = (e) => {
    setValue(e.target.value);
  };
  return {
    value,
    onChange: handleChange,
  };
};


function GetIpAddress() {
      var http = require('http');
      http.get({'host': 'api.ipify.org', 'port': 80, 'path': '/'}, function(resp) {
        resp.on('data', function(ip) {
          console.log("My public IP address is: " + ip);
          return ip;
        });
      });
     
    }


export default Login;
