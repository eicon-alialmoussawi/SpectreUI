import React, { useState, useEffect, useMemo, useRef, Component } from "react";
import APIFunctions from "../utils/APIFunctions";
import dateFormat from "dateformat";
import { useTable } from "react-table";
import Select from "react-select";
import { getLang, BindImageURL } from "../utils/common";
import { AlertError, AlertSuccess } from "./f_Alerts";

const EditLatestNews = (props) => {
  useEffect(() => {
    selectCSS();
  }, []);

  const selectCSS = () => {
    if (getLang() === "ar") {
      //  require("../assets/CustomStyleAr.css");
      //require("../assets/resources_ar.js");
    } else {
      //require("../assets/CustomStyleEn.css");
      //require("../assets/resources_en.js");
    }
  };

  const initialLatestNew = {
    id: 0,
    titleEn: "",
    titleAr: "",
    titleFr: "",
    descriptionAr: "",
    descriptionEn: "",
    descriptionFr: "",
    isPublished: false,
    isDeleted: false,
    imageUrl: "",
    url: "",
  };
  
  var myPermissions = {
    canView: false,
    canAdd: false,
    canEdit: false,
    canDelete: false,
  };

  const [permissions, setPermissions] = useState(myPermissions);
  const [result, emplist] = useState([]);
  const [currentLatestNews, setCurrentLatestNews] = useState(initialLatestNew);
  const [image, setImage] = useState('');
  const [displayImage, setDisplayImage] = useState(false);
  const [saveTxt, setSaveTxt] = useState("Save");


  useEffect(() => {
    APIFunctions.getAllRoles()
      .then((resp) => resp)
      .then((resp) => emplist(resp.data));
  }, []);

  useEffect(() => {
    getUserPermissions()
}, []);

const getUserPermissions = async () => {
    APIFunctions.getUserPermissions("LatestNews").then((response) => {
      var _permissions = [];
      var result = response.data;
      result.map((element) => {
        if (element.pageUrl == "LatestNews") {
          _permissions.push(element);
        }
      });

      var view =
        _permissions.find((element) => {
          return element.action == "View";
        }) === undefined
          ? false
          : true;
      var add =
        _permissions.find((element) => {
          return element.action == "Add";
        }) === undefined
          ? false
          : true;
      var edit =
        _permissions.find((element) => {
          return element.action == "Edit";
        }) === undefined
          ? false
          : true;
      var _delete =
        _permissions.find((element) => {
          return element.action == "Delete";
        }) === undefined
          ? false
          : true;

      var obj = permissions;
      obj.canView = view;
      obj.canAdd = add;
      obj.canEdit = edit;
      obj.canDelete = _delete;
      setPermissions(obj);
      if(props.match.params.id != 0) {
        if (edit) {
          getLatesNews(props.match.params.id);
          setDisplayImage(true);
        }
        else {
          AlertError(
            "You do not have the permission to edit the latest news!",
            function () {
              props.history.push("/Dashboard");
            }
          );
        }
      }

      if(props.match.params.id == 0) {
        if (!add) 
          AlertError(
            "You do not have the permission to add new latest news!",
            function () {
              props.history.push("/Dashboard");
            }
          );
      }
    });
  };

  const getLatesNews = (id) => {
    APIFunctions.getLatesNewsById(id)
      .then((response) => {
        console.log(response.data);
        setCurrentLatestNews(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const update = () => {
    var valid = true;


    if (currentLatestNews.titleEn == "" || currentLatestNews.titleEn == null) {
      valid = false;
    }
    if (currentLatestNews.titleAr == "" || currentLatestNews.titleAr == null) {
      valid = false;
    }
    if (currentLatestNews.titleFr == "" || currentLatestNews.titleFr == null) {
      valid = false;
    }
    if (currentLatestNews.descriptionEn == "" || currentLatestNews.descriptionEn == null) {
      valid = false;
    }
    if (currentLatestNews.descriptionAr == "" || currentLatestNews.descriptionAr == null) {
      valid = false;
    }
    if (currentLatestNews.descriptionFr == "" || currentLatestNews.descriptionFr == null) {
      valid = false;
    }
    if (currentLatestNews.imageUrl == "" || currentLatestNews.imageUrl == null) {
      valid = false;
    }

    if (!valid) {
      AlertError("Please fill required fields");
      return;
    }

    setSaveTxt("Saving...")

    if (currentLatestNews.id == 0) {
      currentLatestNews.isDeleted = false;
    }
    APIFunctions.saveLatestNews(currentLatestNews.id, currentLatestNews)
      .then((response) => {
        if (response.data != null) {
          AlertSuccess("Successfully saved");
          setTimeout(() => { props.history.push("/LatestNews"); }, 500);
          return;
        }
        else {
          AlertError("Something went wrong");
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };


  const cancel = () => {
    props.history.push("/LatestNews");
  };

  const viewResource = () => {
    var image = BindImageURL(currentLatestNews.imageUrl);
    window.open(image);
  }

  const onFileChange2 = (event) => {

    if (event.target.files.length == 0) {
      return;
    }
    const formData = new FormData();
    formData.append(
      "file",
      event.target.files[0]
    );

    APIFunctions.uploadMedia(formData)
      .then((response) => {
        var obj = currentLatestNews;
        obj.imageUrl = response.data;
        setImage(response.data);
        setCurrentLatestNews(obj);
        setDisplayImage(true);
      })
      .catch((e) => {
        console.log(e);
      });


  }


  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="card">
              <div className="container">
                <div className="row"></div>
              </div>
              <div className="edit-form">
                <div className="card-header">
                  <h4>Latest New Details</h4>
                </div>
                <form>
                  <div className="row">
                    <div className="col-6 bottommargin-sm" style={{ display: "flex!important" }}>
                      <div className="form-group">
                        <label>Title in English <small className="text-danger">*</small></label>
                        <input type="text"
                          className="form-control "
                          value={currentLatestNews.titleEn}
                          style={{ width: "100%" }}
                          onChange={(e) => setCurrentLatestNews({ ...currentLatestNews, titleEn: e.target.value, })} />
                      </div>
                    </div>
                    <div className="col-6 bottommargin-sm" style={{ display: "flex!important" }}>
                      <div className="form-group">
                        <label>Title in Arabic <small className="text-danger">*</small></label>
                        <input type="text"
                          className="form-control"
                          style={{ width: "100%" }}
                          value={currentLatestNews.titleAr}
                          onChange={(e) => setCurrentLatestNews({ ...currentLatestNews, titleAr: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-6 bottommargin-sm" style={{ display: "flex!important" }}>
                      <div className="form-group">
                        <label>Title in French <small className="text-danger">*</small></label>
                        <input type="text"
                          className="form-control"
                          style={{ width: "100%" }}
                          value={currentLatestNews.titleFr}
                          onChange={(e) => setCurrentLatestNews({ ...currentLatestNews, titleFr: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="col-6 bottommargin-sm" style={{ display: "flex!important" }}>
                      <div className="form-group">
                        <label>URL</label>
                        <input type="text"
                          className="form-control"
                          style={{ width: "100%" }}
                          value={currentLatestNews.url}
                          onChange={(e) => setCurrentLatestNews({ ...currentLatestNews, url: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-6 bottommargin-sm" style={{ display: "flex!important" }}>
                      <div className="form-group">
                        <label>Description in English<small className="text-danger">*</small></label>
                        <textarea type="text"
                          className="form-control"
                          style={{ width: "100%", resize: "none" }}
                          value={currentLatestNews.descriptionEn}
                          onChange={(e) => setCurrentLatestNews({ ...currentLatestNews, descriptionEn: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="col-6 bottommargin-sm" style={{ display: "flex!important" }}>
                      <div className="form-group">
                        <label>Description in Arabic<small className="text-danger">*</small></label>
                        <textarea type="text"
                          className="form-control"
                          style={{ width: "100%", resize: "none" }}
                          value={currentLatestNews.descriptionAr}
                          onChange={(e) => setCurrentLatestNews({ ...currentLatestNews, descriptionAr: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-6 bottommargin-sm" style={{ display: "flex!important" }}>
                      <div className="form-group">
                        <label>Description in French<small className="text-danger">*</small></label>
                        <textarea type="text"
                          className="form-control"
                          style={{ width: "100%", resize: "none" }}
                          value={currentLatestNews.descriptionFr}
                          onChange={(e) => setCurrentLatestNews({ ...currentLatestNews, descriptionFr: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="col-6 bottommargin-sm" style={{ display: "flex!important", margin: "auto", paddingLeft: "35px" }}>
                      <div className="form-group">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value={currentLatestNews.isPublished}
                          checked={currentLatestNews.isPublished}
                          onChange={(e) => setCurrentLatestNews({ ...currentLatestNews, isPublished: e.target.checked })}
                        ></input>
                        <label className="form-check-label">
                          Add to Public Page
                        </label>

                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-6 bottommargin-sm" >
                      <div className="uppy">
                        <div className="uppy-wrapper">
                          <div className="uppy-Root uppy-FileInput-container">
                            <input className="uppy-FileInput-input uppy-input-control"
                              style={{ display: "none" }}
                              type="file"
                              name="files[]"
                              id="template-contactform-upload2"
                              onChange={onFileChange2}
                              accept="image/*" />

                            <label class="uppy-input-label btn btn-light-primary btn-bold" style={{ border: "1px solid", marginTop: "15px" }} for="template-contactform-upload2">Upload Resource</label>
                            <i style={{
                              marginLeft: "10px ",
                              marginRight: "10px",
                              display: displayImage ? "" : "none"
                            }}
                              className="btn  fa fa-eye icon-green btn-view" aria-hidden="true" onClick={() => viewResource()}>

                            </i>
                          </div>

                        </div>
                      </div>
                      <label>{image}</label>
                    </div>
                  </div>

                </form>

                <button className="btn btn-secondary" onClick={cancel} style={{ margin: "5px" }}>
                  {" "}
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ margin: "5px" }}
                  onClick={update}>
                  {saveTxt}
                </button>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditLatestNews;
