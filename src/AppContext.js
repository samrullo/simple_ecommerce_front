import React from "react";
import { createContext } from "react";

const AppContext = createContext({
    isAuthenticated: false,
    userInfo: null,
    setUserInfo: () => {},
    logoutUser: () => {}
  });
  

export default AppContext