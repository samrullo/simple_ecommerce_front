// src/components/spendings/SpendingName.js
import React, { useContext, useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useApi } from "../hooks/useApi";
import DataTable from "../GenericDataComponents/DataTable";
import { SPENDING_NAMES_ENDPOINT } from "../ApiUtils/ApiEndpoints";
import AppContext from "../../AppContext";
import ToggleSwitch from "../util_components/ToggleSwitch";

const SpendingName = () => {
    const { get } = useApi();
    const [data, setData] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [selectedRowData, setSelectedRowData] = useState(null);
    const navigate = useNavigate();
    const { state = {} } = useLocation();
    const { timestamp } = state ?? {};
    const { userInfo } = useContext(AppContext);
    const isStaff = userInfo?.is_staff || userInfo?.is_superuser;

    useEffect(() => {
        const fetch = async () => {
            const result = await get(SPENDING_NAMES_ENDPOINT, true);
            setData(result);
        };
        if (isStaff) fetch();
    }, [isStaff, timestamp]);

    useEffect(() => {
        if (editMode && selectedRowData && isStaff) {
            navigate(`/spending-names/edit/${selectedRowData.id}`);
            setSelectedRowData(null);
        }
    }, [editMode, selectedRowData, isStaff, navigate]);

    if (!isStaff) {
        return <p>You are not authorized to view spending names.</p>;
    }

    const columns = [
        { field: "id", headerName: "ID" },
        { field: "name", headerName: "Name" },
        { field: "description", headerName: "Description" },
    ];

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center">
                <h1>Spending Names</h1>
                <ToggleSwitch
                    id="editModeSwitch"
                    label="Edit Mode"
                    checked={editMode}
                    onChange={() => setEditMode(!editMode)} />
            </div>

            <div className="mb-3">
                <Link className="btn btn-primary" to="/spending-names/new">
                    New Spending Name
                </Link>
            </div>

            <Outlet />

            {data.length === 0 ? (
                <p>No spending names recorded.</p>
            ) : (
                <DataTable
                    data={data}
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

export default SpendingName;
