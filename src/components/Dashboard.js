import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AppContext from "../AppContext";

const Dashboard = () => {
  const { userInfo } = useContext(AppContext);
  const isStaff = userInfo?.is_staff || userInfo?.is_superuser;

  return (
    <>
      <h1>Dashboard</h1>
      <div className="list-group">
        <Link to="/products" className="list-group-item">Products</Link>
        <Link to="/contacts" className="list-group-item">Contacts</Link>
        {isStaff && (
          <Link to="/purchases" className="list-group-item">Purchases</Link>
        )}
        <Link to="/about" className="list-group-item">About Us</Link>
      </div>
    </>
  );
};

export default Dashboard;