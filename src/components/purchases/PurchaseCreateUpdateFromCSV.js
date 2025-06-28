import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../hooks/useApi";
import AppContext from "../../AppContext";
import { CREATE_UPDATE_PURCHASES_FROM_CSV_ENDPOINT } from "../ApiUtils/ApiEndpoints";

const PurchaseCreateUpdateFromCSV = () => {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const { setFlashMessages } = useContext(AppContext);
    const { post } = useApi();

    const handleUpload = async () => {
        try {
            const form = new FormData();
            form.append("file", file);
            setUploading(true);

            const response = await post(CREATE_UPDATE_PURCHASES_FROM_CSV_ENDPOINT, form, true);
            const message = response?.data?.message || "Purchases uploaded successfully.";
            setFlashMessages([{ category: "success", message }]);
            navigate("/purchases", { state: { timestamp: Date.now() } });

        } catch (err) {
            console.error("Error while uploading purchases:", err);
            const errorMsg = err?.response?.data?.error || err?.message || "Unknown error occurred.";
            setFlashMessages([{ category: "danger", message: `Upload failed: ${errorMsg}` }]);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="form-group">
            <label className="form-label mt-3">
                <p>Purchases CSV file.</p>
                <p><strong>Required columns</strong>: <code>product_name, quantity, price_per_unit</code></p>
                <p><strong>Optional column</strong>: <code>currency,purchase_date</code> (format: YYYY-MM-DD)</p>
            </label>
            <input
                type="file"
                className="form-control"
                accept=".csv"
                onChange={(e) => setFile(e.target.files[0])}
            />
            <button
                className="btn btn-primary mt-3"
                onClick={handleUpload}
                disabled={uploading}
            >
                {uploading ? "Uploading..." : "Upload"}
            </button>
        </div>
    );
};

export default PurchaseCreateUpdateFromCSV;