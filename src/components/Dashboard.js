import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AppContext from "../AppContext";

const Dashboard = () => {
  const { userInfo, isAuthenticated } = useContext(AppContext);
  const isStaff = userInfo?.is_staff || userInfo?.is_superuser;

  return (
    <div className="container mb-5">
      <h1>Dashboard</h1>
      <div className="list-group">

        {/* General Section */}
        <h5 className="mt-3">General</h5>
        <Link to="/products" className="list-group-item">Products</Link>
        {isAuthenticated && (
          <Link to="/order-history" className="list-group-item">Order History</Link>
        )}

        {/* Staff Section */}
        {isStaff && (
          <>
            <h5 className="mt-4">Purchases</h5>
            <Link to="/purchases-by-date-summary" className="list-group-item">Purchases By Date Summary</Link>
            <Link to="/create-purchase-order-from-csv" className="list-group-item">Purchase Order from CSV</Link>

            <h5 className="mt-4">Customer Management</h5>
            <Link to="/admin-customers" className="list-group-item">Customers Managed by Admin</Link>

            <h5 className="mt-4">Product Management</h5>
            <Link to="/product-create-update-from-csv" className="list-group-item">Products from CSV File</Link>

            <h5 className="mt-4">Admin Orders</h5>
            <Link to="/admin-orders" className="list-group-item">Orders Across Customers</Link>
            <Link to="/admin-products-for-customer" className="list-group-item">Products for Customer</Link>
            <Link to="/admin-shopping-cart" className="list-group-item">Admin Shopping Cart</Link>
            <Link to="/admin-order-submit" className="list-group-item">Submit Order (Admin)</Link>

            <h5 className="mt-4">Other Admin Operations</h5>
            <Link to="/fxrates" className="list-group-item">FX Rates Admin</Link>            
            <Link to="/weight-costs" className="list-group-item">Weight Cost Admin</Link>
            <Link to="/profit-rates" className="list-group-item">Profit Rate Admin</Link>
            <Link to="/totals-accounting-date-range-filter" className="list-group-item">Totals Accounting Date Range</Link>

            <h5 className="mt-4">Spendings</h5>
            <Link to="/spendings" className="list-group-item">Spendings</Link>
            <Link to="/spending-names" className="list-group-item">Spending Names</Link>

          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
