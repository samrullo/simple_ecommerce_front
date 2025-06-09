import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min';
import "@fortawesome/fontawesome-free/css/all.min.css";
import AppContextProvider from "./AppContextProvider";
import MainPage from "./components/MainPage";
import "./App.css"; // Move your CSS here

function App() {
  useEffect(() => {
    document.title = process.env.REACT_APP_SITE_TITLE || "Default Title";
  }, []);

  return <AppContextProvider><MainPage /></AppContextProvider>
}

export default App;
