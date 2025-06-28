import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { useApi } from "../hooks/useApi";
import AppContext from "../../AppContext";
import { CREATE_UPDATE_PRODUCTS_FROM_CSV_ENDPOINT } from "../ApiUtils/ApiEndpoints";

const ProductCreateUpdateFromCSV = () => {
    const navigate = useNavigate()
    const [file, setFile] = useState(null)
    const [uploading, setUploading] = useState(false)
    const { userInfo, setFlashMessages } = useContext(AppContext)
    const { post } = useApi()

    const handleUpload = async () => {
        try {
            const form = new FormData();
            form.append("file", file);
            setUploading(true);
            const response = await post(`${CREATE_UPDATE_PRODUCTS_FROM_CSV_ENDPOINT}`, form, true);
    
            const message = response?.data?.message || "Products uploaded successfully.";
            setFlashMessages([{ category: "success", message }]);
            navigate("/products", { state: { timestamp: Date.now() } });
        } catch (err) {
            console.log("Error while uploading products", err);
    
            const errorMsg = err?.response?.data?.message || err?.message || "Unknown error occurred.";
            setFlashMessages([{ category: "danger", message: `Upload failed: ${errorMsg}` }]);
        } finally {
            setUploading(false);
        }
    };

    return <>
        <div className="form-group">
            <label className="form-label mt-3">
                <p>Products csv file. </p>
                <p>Required columns : <code>product_name,category_name,price,stock</code></p>
                <p>Optional columns : <code>description,currency,brand_name,tag_names,sku</code></p>
            </label>
            <input type="file" className="form-control" accept=".csv" onChange={(e) => setFile(e.target.files[0])} />
            <button className="btn btn-primary mt-3" onClick={handleUpload} disabled={uploading}>{uploading ? "Uploading..." : "Upload"}</button>
        </div>
    </>

}

export default ProductCreateUpdateFromCSV;