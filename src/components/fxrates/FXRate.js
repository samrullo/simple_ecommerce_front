// src/components/FXRates/FXRate.js
import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate, useLocation, Outlet } from "react-router-dom";
import DataTable from "../GenericDataComponents/DataTable";
import AppContext from "../../AppContext";
import { useApi } from "../hooks/useApi";
import { FXRATES_ENDPOINT, FXRATES_AGAINST_PRIMARY_CURRENCY_ENDPOINT } from "../ApiUtils/ApiEndpoints";

const FXRate = () => {
    const { userInfo } = useContext(AppContext);
    const { get } = useApi();
    const navigate = useNavigate();
    const { state = {} } = useLocation();
    const { timestamp } = state ?? {};

    const [fxRates, setFxRates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [selectedRowData, setSelectedRowData] = useState(null);

    useEffect(() => {
        const fetchFxRates = async () => {
            setLoading(true);
            try {
                const data = await get(FXRATES_AGAINST_PRIMARY_CURRENCY_ENDPOINT, false);
                const filtered = data.map(rate => ({
                    id: rate.id,
                    currency_from: rate.currency_from.code,
                    currency_to: rate.currency_to.code,
                    rate: parseFloat(rate.rate),
                    start_date: rate.start_date,
                    end_date: rate.end_date || "",
                    source: rate.source,
                    is_active: rate.is_active
                }));
                setFxRates(filtered);
            } catch (err) {
                console.error("Failed to fetch FX rates", err);
                setFxRates([]);
            } finally {
                setLoading(false);
            }
        };
        fetchFxRates();
    }, [timestamp]);

    // Handle edit navigation
    useEffect(() => {
        if (editMode && selectedRowData && (userInfo?.is_staff || userInfo?.is_superuser)) {
            navigate(`/fxrates/edit/${selectedRowData.id}`);
            setSelectedRowData(null);
        }
    }, [selectedRowData, editMode, userInfo, navigate]);

    const handleRowClick = event => {
        if (editMode && (userInfo?.is_staff || userInfo?.is_superuser)) {
            setSelectedRowData(event.data);
        }
    };

    const columns = [
        { field: "currency_from", headerName: "From Currency" },
        { field: "currency_to", headerName: "To Currency" },
        { field: "rate", headerName: "Rate" },
        { field: "start_date", headerName: "Start Date", fieldType: "datetime" },
        { field: "end_date", headerName: "End Date", fieldType: "datetime" },
        { field: "source", headerName: "Source" },
        { field: "is_active", headerName: "Active" }
    ];

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center">
                <h1>FX Rates (USD Base)</h1>
            </div>
            {userInfo?.is_staff && (<>
                <div className="mb-3">
                    <Link className="btn btn-primary me-2" to="/fxrates/new">New FX Rate</Link>
                </div>

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
            </>
            )}

            <Outlet />
            {loading ? (
                <div className="text-center mt-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : fxRates.length === 0 ? (
                <p>No FX rates available</p>
            ) : (
                <DataTable
                    data={fxRates}
                    columns={columns}
                    hiddenColumns={["id"]}
                    width_pct={100}
                    onRowClick={handleRowClick}
                />
            )}
        </div>
    );
};

export default FXRate;