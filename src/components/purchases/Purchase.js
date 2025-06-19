// src/components/Purchase/Purchase.js
import React, { useEffect, useState, useContext } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import DataTable from "../GenericDataComponents/DataTable";
import AppContext from "../../AppContext";
import { useApi } from "../hooks/useApi";
import { PURCHASES_ENDPOINT } from "../ApiUtils/ApiEndpoints";

const Purchase = () => {
  const { get } = useApi();
  const navigate = useNavigate();
  const [purchases, setPurchases] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const { userInfo } = useContext(AppContext);
  const isStaff = userInfo?.is_staff || userInfo?.is_superuser;

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const data = await get(PURCHASES_ENDPOINT, true);
        setPurchases(
          data.map((purchase) => ({
            ...purchase,            
          }))
        );
      } catch (error) {
        console.error("Failed to fetch purchases:", error);
      }
    };
    if (isStaff) fetchPurchases();
  }, [isStaff]);

  useEffect(() => {
    if (editMode && selectedRowData && isStaff) {
      navigate(`/purchases/edit/${selectedRowData.id}`);
      setSelectedRowData(null);
    }
  }, [editMode, selectedRowData, isStaff, navigate]);

  if (!isStaff) return <p>You are not authorized to view purchases.</p>;

  const columns = [
    { field: "product_name", headerName: "Product" },
    { field: "quantity", headerName: "Quantity" },
    { field: "price_per_unit", headerName: "Unit Price" },
    { field: "purchase_datetime", headerName: "Purchase Date" },
    { field: "created_at", headerName: "Created At" },
    { field: "updated_at", headerName: "Updated At" },
  ];

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center">
        <h1>Purchases</h1>
        <div className="form-check form-switch">
          <input
            type="checkbox"
            className="form-check-input"
            id="editModeSwitch"
            checked={editMode}
            onChange={() => setEditMode(!editMode)}
          />
          <label className="form-check-label" htmlFor="editModeSwitch">
            Edit Mode
          </label>
        </div>
      </div>

      <Link className="btn btn-primary my-3" to="/purchases/new">
        New Purchase
      </Link>

      <Outlet />

      {purchases.length === 0 ? (
        <p>No purchases recorded.</p>
      ) : (
        <DataTable
          data={purchases}
          columns={columns}
          hiddenColumns={["id"]}
          width_pct={100}
          onRowClick={(event) => {
            if (editMode && isStaff) {
              setSelectedRowData(event.data);
            }
          }}
        />
      )}
    </div>
  );
};

export default Purchase;
