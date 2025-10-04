import React from "react";
import { useContext } from "react";
import AppContext from "../AppContext";
import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import Logout from "./user_management/Logout";

const NavBar = ({ title }) => {
  const {
    isAuthenticated, userInfo
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
          {isAuthenticated ? (
            <>
              <Logout />
              <Link to="/profile" className="nav-link">
                Profile
              </Link>
              <Link to="/shopping-cart" className="nav-link flex items-center gap-2">
                <FaShoppingCart />
                Shopping Cart
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
