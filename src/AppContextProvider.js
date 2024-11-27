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

  const contextValues = {
    dummyAppVariable,
    setDummyAppVariable,
    anotherDummyAppVariable,
    setAnotherDummyAppVariable,
  };

  return (
    <AppContext.Provider value={contextValues}>{children}</AppContext.Provider>
  );
};

export default AppContextProvider;
