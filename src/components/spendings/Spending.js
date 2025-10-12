// src/components/spendings/Spending.js
import React, { useContext, useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useApi } from "../hooks/useApi";
import DataTable from "../GenericDataComponents/DataTable";
import { SPENDINGS_ENDPOINT, SPENDING_NAMES_ENDPOINT } from "../ApiUtils/ApiEndpoints";
import AppContext from "../../AppContext";
import ToggleSwitch from "../util_components/ToggleSwitch";

const Spending = () => {
  const { get } = useApi();
  const [spendings, setSpendings] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();
  const { state = {} } = useLocation();
  const { timestamp } = state ?? {};
  const { userInfo } = useContext(AppContext);
  const isStaff = userInfo?.is_staff || userInfo?.is_superuser;

  useEffect(() => {
    const fetch = async () => {
      try {
        const [spendingsResult, spendingNamesResult] = await Promise.all([
          get(SPENDINGS_ENDPOINT, true),
          get(SPENDING_NAMES_ENDPOINT, true),
        ]);

        const spendingNamesById = spendingNamesResult.reduce((acc, spendingName) => {
          acc[spendingName.id] = spendingName;
          return acc;
        }, {});

        const enrichedSpendings = spendingsResult.map((spending) => ({
          ...spending,          
          spending_name_detail: spendingNamesById[spending.spending_name]?.name || null,
          currency_code: spending.currency?.code || "",
        }));

        setSpendings(enrichedSpendings);
      } catch (error) {
        console.error("Failed to fetch spendings:", error);
        setSpendings([]);
      }
    };

    if (isStaff) fetch();
  }, [isStaff, timestamp]);

  useEffect(() => {
    if (editMode && selectedRowData && isStaff) {
      navigate(`/spendings/edit/${selectedRowData.id}`);
      setSelectedRowData(null);
    }
  }, [editMode, selectedRowData, isStaff, navigate]);

  if (!isStaff) {
    return <p>You are not authorized to view spendings.</p>;
  }

  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "spending_name_detail",
      headerName: "Spending Name",
      fieldType: "text",
      
    },
    { field: "adate", headerName: "Date", fieldType: "date" },
    { field: "amount", headerName: "Amount", fieldType: "numeric" },
    {
      field: "currency_code",
      headerName: "Currency",
      fieldType: "text",
    },
    { field: "created_at", headerName: "Created At", fieldType: "datetime" },
    { field: "modified_at", headerName: "Updated At", fieldType: "datetime" },
  ];

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center">
        <h1>Spendings</h1>
        <ToggleSwitch
          id="spendingEditModeSwitch"
          label="Edit Mode"
          checked={editMode}
          onChange={() => setEditMode(!editMode)}
        />
      </div>

      <div className="mb-3">
        <Link className="btn btn-primary" to="/spendings/new">
          New Spending
        </Link>
      </div>

      <Outlet />

      {spendings.length === 0 ? (
        <p>No spendings recorded.</p>
      ) : (
        <DataTable
          data={spendings}
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

export default Spending;
