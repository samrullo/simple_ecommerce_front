import React from "react";
import { useState } from "react";
import AppContext from "./AppContext";

const AppContextProvider = ({ children }) => {
  const [dummyAppVariable, setDummyAppVariable] = useState(
    "DummyAppVariableValue"
  );
  const [anotherDummyAppVariable, setAnotherDummyAppVariable] = useState(
    "AnotherDummyAppVariableValue"
  );

  // flash messages are a list of objects. each object has category and message keys. category can take values like success, danger, warning
  const [flashMessages, setFlashMessages] = useState([]);

  // isAuthenticated or not
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setIsAuthenticated(false);
    setFlashMessages([{ category: "success", message: "Logout successful" }]);
  };

  const contextValues = {
    dummyAppVariable,
    setDummyAppVariable,
    anotherDummyAppVariable,
    setAnotherDummyAppVariable,
    flashMessages,
    setFlashMessages,
    isAuthenticated,
    setIsAuthenticated,
    handleLogout,
  };

  return (
    <AppContext.Provider value={contextValues}>{children}</AppContext.Provider>
  );
};

export default AppContextProvider;
