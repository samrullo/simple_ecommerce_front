// App.js
import React, { useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./App.css";

import { BrowserRouter } from "react-router-dom";
import AppContextProvider from "./AppContextProvider";
import MainPage from "./components/MainPage";

function App() {
  useEffect(() => {
    document.title = process.env.REACT_APP_SITE_TITLE || "Default Title";
  }, []);

  return (
    <BrowserRouter>
      <AppContextProvider>
        <MainPage />
      </AppContextProvider>
    </BrowserRouter>
  );
}

export default App;
