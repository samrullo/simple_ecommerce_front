// src/components/Purchase/PurchaseByDateDetail.js
import React, { useEffect, useState, useContext } from "react";
import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import DataTable from "../GenericDataComponents/DataTable";
import AppContext from "../../AppContext";
import { useApi } from "../hooks/useApi";
import { PURCHASES_BY_DATE_DETAIL_ENDPOINT } from "../ApiUtils/ApiEndpoints";

const PurchaseByDateDetail = () => {
  const { get } = useApi();
  const navigate = useNavigate();
  const { purchaseDate } = useParams();
  const [purchases, setPurchases] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const { userInfo } = useContext(AppContext);
  const isStaff = userInfo?.is_staff || userInfo?.is_superuser;

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const data = await get(`${PURCHASES_BY_DATE_DETAIL_ENDPOINT}${purchaseDate}`, true);
        setPurchases(
          data.map((purchase) => ({
            ...purchase,
            currency: purchase.currency?.code,
            image: purchase.product_image,
          }))
        );
      } catch (error) {
        console.error("Failed to fetch purchases:", error);
      }
    };
    if (isStaff && purchaseDate) fetchPurchases();
  }, [isStaff, purchaseDate]);

  useEffect(() => {
    if (editMode && selectedRowData && isStaff) {
      navigate(`/purchases/edit/${selectedRowData.id}`);
      setSelectedRowData(null);
    }
  }, [editMode, selectedRowData, isStaff, navigate]);

  if (!isStaff) return <p>You are not authorized to view purchases.</p>;

  const columns = [
    { field: "image", headerName: "Image", fieldType: "image" },
    { field: "product_name", headerName: "Product", fieldType: "text", tooltipField: "product_name" },
    { field: "quantity", headerName: "Quantity", fieldType: "numeric" },
    { field: "price_per_unit", headerName: "Unit Price", fieldType: "numeric" },
    { field: "currency", headerName: "Currency", fieldType: "text" },
    { field: "purchase_datetime", headerName: "Purchase Date", fieldType: "datetime" },
    { field: "created_at", headerName: "Created At", fieldType: "datetime" },
    { field: "updated_at", headerName: "Updated At", fieldType: "datetime" },
  ];

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center">
        <h1>Purchases on {purchaseDate}</h1>
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

      <Outlet />

      {purchases.length === 0 ? (
        <p>No purchases found on this date.</p>
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

export default PurchaseByDateDetail;