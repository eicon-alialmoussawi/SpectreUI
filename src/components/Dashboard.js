import React from "react";
import { getUser, removeUserSession } from "../Utils/common";

function Dashboard(props) {
  const userName = getUser();

  // handle click event of logout button
  const handleLogout = () => {
    removeUserSession();
    props.history.push("/MainPageTest");
  };

  return (
    <div>
      Welcome {userName}!<br />
      <br />
      <input type="button" onClick={handleLogout} value="Logout" />
    </div>
  );
}

export default Dashboard;
