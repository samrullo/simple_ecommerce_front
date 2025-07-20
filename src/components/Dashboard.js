import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AppContext from "../AppContext";

const Dashboard = () => {
  const { userInfo, isAuthenticated } = useContext(AppContext);
  const isStaff = userInfo?.is_staff || userInfo?.is_superuser;

  return (
    <>
      <h1>Dashboard</h1>
      <div className="list-group">
        <Link to="/products" className="list-group-item">Products</Link>

        {isStaff && (
          <>
            <Link to="/purchases-by-date-summary" className="list-group-item">Purchases By Date Summary</Link>
            <Link to="/purchases" className="list-group-item">Purchases</Link>
            <Link to="/admin-customers" className="list-group-item">Customers Managed by Admin</Link>
            <Link to="/product-create-update-from-csv" className="list-group-item">Products from CSV File</Link>
          </>
        )}

        {isAuthenticated && (
          <Link to="/order-history" className="list-group-item">Order History</Link>
        )}

        <Link to="/contacts" className="list-group-item">Contacts</Link>
        <Link to="/about" className="list-group-item">About Us</Link>
      </div>
    </>
  );
};

export default Dashboard;