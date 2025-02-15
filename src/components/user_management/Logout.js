import React from "react";
import axios from "axios";
import { LOGOUT_ENDPOINT } from "../ApiUtils/ApiEndpoints";
import { useContext } from "react";
import AppContext from "../../AppContext";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated, setFlashMessages, setUserInfo } =
    useContext(AppContext);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setIsAuthenticated(false);
    setUserInfo({});
    setFlashMessages([{ category: "success", message: "Logout successful" }]);
  };

  const onLogout = async () => {
    const response = await axios.post(LOGOUT_ENDPOINT);
    console.log(`Logout post result : ${JSON.stringify(response.data)}`);
    handleLogout();
    navigate("/");
  };

  return (
    <a className="nav-link" onClick={onLogout} href="#">
      Logout
    </a>
  );
};

export default Logout;
