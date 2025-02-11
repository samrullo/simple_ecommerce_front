import React from "react";
import { BrowserRouter } from "react-router-dom";
import NavBar from "./NavBar";
import FlashMessage from "./FlashMessage";
import AppRoutes from "./AppRoutes";

const MainPage = () => {
  return (
    <BrowserRouter>
      <div className="container mt-5">
        <header>
          <NavBar title="Simple Ecommerce" />
          <FlashMessage />
        </header>
        <AppRoutes />
      </div>
    </BrowserRouter>
  );
};

export default MainPage;
