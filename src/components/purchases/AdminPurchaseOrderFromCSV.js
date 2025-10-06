import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../hooks/useApi";
import AppContext from "../../AppContext";
import { CREATE_PURCHASE_ORDER_FROM_CSV_ENDPOINT } from "../ApiUtils/ApiEndpoints";

const AdminPurchaseOrderFromCSV = () => {
  const navigate = useNavigate();
  const { post } = useApi();
  const { setFlashMessages } = useContext(AppContext);

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      setFlashMessages([{ category: "danger", message: "Please select a CSV file." }]);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      const response = await post(CREATE_PURCHASE_ORDER_FROM_CSV_ENDPOINT, formData, true);
      const message =
        response?.data?.message ||
        "CSV processed successfully. Purchases and Orders created.";

      setFlashMessages([{ category: "success", message }]);
      navigate("/purchases-by-date-summary", { state: { timestamp: Date.now() } });
    } catch (err) {
      console.error("Error uploading CSV:", err);
      const errorMsg =
        err?.response?.data?.error ||
        err?.message ||
        "Unknown error occurred while uploading CSV.";
      setFlashMessages([{ category: "danger", message: `Upload failed: ${errorMsg}` }]);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Upload Purchases and Orders from CSV</h2>
      <div className="card p-4">
        <label className="form-label">
          <p>
            Upload a CSV file to create <strong>Purchases</strong> and{" "}
            <strong>Orders</strong> simultaneously.
          </p>
          <p>
            <strong>Required columns:</strong>{" "}
            <code>
              product_name, quantity, purchase_price,
              selling_price, and one of (customer_id, customer_username,customer_email,customer_name)
            </code>
          </p>
          <p>
            <strong>Optional columns:</strong>{" "}
            <code>
              purchase_date (YYYY-MM-DD), purchase_currency, selling_currency, selling_quantity, payment_method, base_currency
            </code>
          </p>
        </label>

        <input
          type="file"
          className="form-control mt-2"
          accept=".csv"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button
          className="btn btn-primary mt-3"
          onClick={handleUpload}
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Upload CSV"}
        </button>
      </div>
    </div>
  );
};

export default AdminPurchaseOrderFromCSV;
