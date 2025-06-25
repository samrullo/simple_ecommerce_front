import React from "react";
import { useState } from "react";
import AppContext from "./AppContext";
import { useNavigate } from "react-router-dom";

const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();

  // flash messages are a list of objects. each object has category and message keys. category can take values like success, danger, warning
  const [flashMessages, setFlashMessages] = useState([]);

  // isAuthenticated or not
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [email, setEmail] = useState("");
  const [userInfo, setUserInfo] = useState({});
  const [emailNotVerified, setEmailNotVerified] = useState(false);

  const logoutUser = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setIsAuthenticated(false);
    setUserInfo(null);
    navigate("/login");
  };

  const contextValues = {    
    flashMessages,
    setFlashMessages,
    isAuthenticated,
    setIsAuthenticated,
    emailNotVerified,
    setEmailNotVerified,
    userInfo,
    setUserInfo,
    logoutUser
  };

  return (
    <AppContext.Provider value={contextValues}>{children}</AppContext.Provider>
  );
};

export default AppContextProvider;
