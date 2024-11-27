import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min';
import AppContextProvider from "./AppContextProvider";
import MainPage from "./components/MainPage";
import "./App.css"; // Move your CSS here

function App() {
  return <AppContextProvider><MainPage /></AppContextProvider>
}

export default App;
