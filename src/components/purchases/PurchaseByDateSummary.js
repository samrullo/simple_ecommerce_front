// src/components/Purchase/PurchaseByDateSummary.js
import React, { useEffect, useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import DataTable from "../GenericDataComponents/DataTable";
import AppContext from "../../AppContext";
import { useApi } from "../hooks/useApi";
import { PURCHASES_BY_DATE_SUMMARY_ENDPOINT } from "../ApiUtils/ApiEndpoints";

const PurchaseByDateSummary = () => {
  const { get } = useApi();
  const navigate = useNavigate();
  const { userInfo } = useContext(AppContext);
  const [summaryData, setSummaryData] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");

  const isStaff = userInfo?.is_staff || userInfo?.is_superuser;

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const data = await get(PURCHASES_BY_DATE_SUMMARY_ENDPOINT, true);
        setSummaryData(
          data.map((entry) => ({
            ...entry,
            purchase_date: entry.purchase_date,
            item_count: entry.num_purchases,
          }))
        );
      } catch (error) {
        console.error("Failed to fetch purchase summary:", error);
      }
    };
    if (isStaff) fetchSummary();
  }, [isStaff]);

  if (!isStaff) return <p>You are not authorized to view purchases.</p>;

  const columns = [
    { field: "purchase_date", headerName: "Purchase Date", fieldType: "text" },
    { field: "item_count", headerName: "Purchased Items", fieldType: "numeric" },
    {
      field: "view_details",
      headerName: "Details",
      fieldType: "link",
      cellRendererParams: {
        label: "View",
        className: "btn btn-outline-primary btn-sm",
        linkTo: (row) => `/purchases/by-date/${row.purchase_date}`,
      },
    },
  ];

  return (
    <div className="container mt-4">
      <h1>Purchase Summary by Date</h1>
      <div className="mb-4 d-flex align-items-center gap-3">
        <label htmlFor="purchaseDateInput" className="form-label mb-0">
          Select a date to create new purchase:
        </label>
        <input
          id="purchaseDateInput"
          type="date"
          className="form-control"
          style={{ maxWidth: "200px" }}
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
        <Link
          to={`/purchases-by-date-detail/${selectedDate}/new`}
          className={`btn btn-success ${!selectedDate ? "disabled" : ""}`}
        >
          New Purchase on This Date
        </Link>
      </div>

      {summaryData.length === 0 ? (
        <p>No purchase summary available.</p>
      ) : (
        <DataTable
          data={summaryData}
          columns={columns}
          hiddenColumns={[]}
          width_pct={100}
          onRowClick={(event) => navigate(`/purchases-by-date-detail/${event.data.purchase_date}`,{ state: { timestamp: Date.now() } })}
        />
      )}
    </div>
  );
};

export default PurchaseByDateSummary;
