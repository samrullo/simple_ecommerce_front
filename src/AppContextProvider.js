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

  const [email, setEmail] = useState("");
  const [userInfo, setUserInfo] = useState({});
  const [emailNotVerified, setEmailNotVerified] = useState(false);

  const contextValues = {
    dummyAppVariable,
    setDummyAppVariable,
    anotherDummyAppVariable,
    setAnotherDummyAppVariable,
    flashMessages,
    setFlashMessages,
    isAuthenticated,
    setIsAuthenticated,
    emailNotVerified,
    setEmailNotVerified,
    userInfo,
    setUserInfo,
  };

  return (
    <AppContext.Provider value={contextValues}>{children}</AppContext.Provider>
  );
};

export default AppContextProvider;
