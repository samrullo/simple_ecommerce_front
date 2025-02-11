import React from "react";
import { useContext } from "react";
import AppContext from "../AppContext";
import { Link, useNavigate } from "react-router-dom";
import { LOGOUT_ENDPOINT } from "./ApiUtils/ApiEndpoints";
import axios from "axios";

const NavBar = ({ title }) => {
  const navigate = useNavigate();
  const {
    dummyAppVariable,
    setDummyAppVariable,
    anotherDummyAppVariable,
    setAnotherDummyAppVariable,
    isAuthenticated,
    handleLogout,
  } = useContext(AppContext);

  console.log(`dummyAppVariable value is ${dummyAppVariable}`);
  console.log(`anotherDummyAppVariable value is ${anotherDummyAppVariable}`);

  const onLogout = async () => {
    const response = await axios.post(LOGOUT_ENDPOINT)
    console.log(`Logout post result : ${JSON.stringify(response.data)}`) 
    handleLogout();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg bg-light navbar-light">
      <Link className="navbar-brand" to="/">
        {title}
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#mynavigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="mynavigation">
        <div className="navbar-nav ml-auto">
          <Link to="/products" className="nav-link">
            Products
          </Link>
          <Link to="/contacts" className="nav-link">
            Contacts
          </Link>
          <Link to="/about" className="nav-link">
            About Us
          </Link>
          {isAuthenticated ? (
            <a className="nav-link" onClick={onLogout} href="#">
              Logout
            </a>
          ) : (
            <Link to="/login" className="nav-link">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
