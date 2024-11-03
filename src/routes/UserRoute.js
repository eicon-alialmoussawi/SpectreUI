import React, { useState, useEffect, useMemo, useRef } from "react";
import { Route, Redirect } from "react-router-dom";
import { getToken, checkToken, checkCanView } from "../utils/common";
import APIFunctions from "../utils/APIFunctions";
import WebHeader from "../WebHeader";
// handle the public routes
function UserRoute({ component: Component, ...rest }) {

    const [canEdit, setCanEdit] = useState(true);
    const [pageURL, setPageURL] = useState(rest.path);


    if (pageURL !== "/Default") {
        APIFunctions.checkIfCanView(pageURL.replace("/", ""))
            .then((response) => {
                if (pageURL !== "/Default" && pageURL !== "/Account"){
                    console.log(response.data);
                    setCanEdit(response.data);
                }
              
            })
            .catch((e) => {
                setCanEdit(false);    
                localStorage.removeItem("Spectre_Token");
                localStorage.removeItem("userId");
                localStorage.removeItem("userName");
                localStorage.removeItem("Spectre_IsAdmin");
                localStorage.removeItem("Spectre_AllowClientToChooseBePositive");
                console.log(e);
            });
    }


    return (
        <div>
            <WebHeader />
            <Route
                {...rest}
                render={(props) =>
                    canEdit && checkToken() ? (
                        <Component {...props} />
                    ) : (
                        <Redirect
                            to={{
                                pathname: "/",
                                state: { from: props.location },
                            }}
                        />
                    )
                }
            />
        </div>
    );
}

export default UserRoute;
