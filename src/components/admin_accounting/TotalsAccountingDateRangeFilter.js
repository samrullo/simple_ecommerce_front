// src/components/admin_accounting/TotalsAccountingDateRangeFilter.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const TotalsAccountingDateRangeFilter = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (startDate) query.set("start_date", startDate);
    if (endDate) query.set("end_date", endDate);
    navigate(`/purchase-order-income-spending-total?${query.toString()}`);
  };

  return (
    <div className="container mt-4">
      <h2>Choose Date Range</h2>
      <form className="row g-3 align-items-end" onSubmit={handleSubmit}>
        <div className="col-md-4">
          <label htmlFor="startDate" className="form-label">Start Date</label>
          <input
            type="date"
            className="form-control"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <label htmlFor="endDate" className="form-label">End Date</label>
          <input
            type="date"
            className="form-control"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <button type="submit" className="btn btn-primary">
            View Totals
          </button>
        </div>
      </form>
    </div>
  );
};

export default TotalsAccountingDateRangeFilter;