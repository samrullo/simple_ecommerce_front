import React from "react";
import { useContext } from "react";
import AppContext from "../AppContext";
import { Link } from "react-router-dom";
import Logout from "./user_management/Logout";

const NavBar = ({ title }) => {
  const {
    isAuthenticated,userInfo
  } = useContext(AppContext);

  const isStaff = userInfo?.is_staff || userInfo?.is_superuser;



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
          {isStaff && (<Link to="/purchases" className="nav-link">Purchases</Link>)}
          <Link to="/contacts" className="nav-link">
            Contacts
          </Link>
          <Link to="/about" className="nav-link">
            About Us
          </Link>
          {isAuthenticated ? (
            <>
              <Logout />
              <Link to="/profile" className="nav-link">
                Profile
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/register" className="nav-link">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
