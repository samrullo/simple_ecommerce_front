// AppContextProvider.js
import React, { useState } from "react";
import AppContext from "./AppContext";
import { useNavigate } from "react-router-dom";

const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();

  const [flashMessages, setFlashMessages] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [userInfo, setUserInfo] = useState({});
  const [emailNotVerified, setEmailNotVerified] = useState(false);

  const [baseCurrency, setBaseCurrency] = useState("JPY"); // <-- Default base currency
  const [adminSelectedCustomer, setAdminSelectedCustomer] = useState(null);

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
    logoutUser,
    baseCurrency,
    setBaseCurrency,
    adminSelectedCustomer,
    setAdminSelectedCustomer
  };

  return (
    <AppContext.Provider value={contextValues}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;