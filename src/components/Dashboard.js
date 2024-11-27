import React from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <>
      <h1>Dashboard</h1>
      <div className="list-group">
        <Link to="/products" className="list-group-item">Products</Link>
        <Link to="/contacts" className="list-group-item">Contacts</Link>
        <Link to="/about" className="list-group-item">About Us</Link>
      </div>
    </>
  );
};

export default Dashboard;
