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
            const form = new FormData()
            form.append("file", file)
            setUploading(true)
            const response = await post(`${CREATE_UPDATE_PRODUCTS_FROM_CSV_ENDPOINT}`, form, true)
            setFlashMessages([{ category: "success", message: `Successfully uploaded products ${response.data.message}` }])
            navigate("/products", { state: { timestamp: Date.now() } })
        } catch (err) {
            console.log(`Error while uploading products ${err}`)
        } finally {
            setUploading(false)
        }

    }

    return <>
        <div className="form-group">
            <label className="form-label">Products csv file. Required columns <code>product_name,category_name,price,stock</code></label>
            <input type="file" className="form-control" accept=".csv" onChange={(e) => setFile(e.target.files[0])} />
            <button className="btn btn-primary" onClick={handleUpload} disabled={uploading}>{uploading ? "Uploading..." : "Upload"}</button>
        </div>
    </>

}

export default ProductCreateUpdateFromCSV;