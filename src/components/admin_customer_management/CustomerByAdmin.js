import React, { useEffect, useState, useContext } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import DataTable from "../GenericDataComponents/DataTable";
import AppContext from "../../AppContext";
import { useApi } from "../hooks/useApi";
import { CUSTOMERS_BY_ADMIN_ENDPOINT } from "../ApiUtils/ApiEndpoints";

const CustomerByAdmin = () => {
  const { get } = useApi();
  const navigate = useNavigate();
  const { state = {} } = useLocation();
  const { timestamp } = state ?? {};
  const { userInfo } = useContext(AppContext);
  const [customers, setCustomers] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const isStaff = userInfo?.is_staff || userInfo?.is_superuser;

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await get(CUSTOMERS_BY_ADMIN_ENDPOINT, true);
        setCustomers(data);
      } catch (error) {
        console.error("Failed to fetch customers:", error);
      }
    };
    if (isStaff) fetchCustomers();
  }, [isStaff, timestamp]);

  useEffect(() => {
    if (editMode && selectedRowData && isStaff) {
      navigate(`/admin-customers/edit/${selectedRowData.id}`);
      setSelectedRowData(null);
    }
  }, [editMode, selectedRowData, isStaff, navigate]);

  const handleRowClick = (event) => {
    if (editMode && isStaff) {
      setSelectedRowData(event.data);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", fieldType: "numeric" },
    { field: "first_name", headerName: "First Name", fieldType: "text" },
    { field: "last_name", headerName: "Last Name", fieldType: "text" },
    { field: "email", headerName: "Email", fieldType: "text" },
    { field: "phone", headerName: "Phone", fieldType: "text" },
  ];

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Manage Customers</h1>
        <div className="d-flex align-items-center gap-2">
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
          <button className="btn btn-primary ms-3" onClick={() => navigate("/admin-customers/new")}>Create New Customer</button>
        </div>
      </div>

      <Outlet />

      {customers.length === 0 ? (
        <p>No customers</p>
      ) : (
        <DataTable
          data={customers}
          columns={columns}
          hiddenColumns={[]}
          width_pct={100}
          onRowClick={handleRowClick}
        />
      )}
    </div>
  );
};

export default CustomerByAdmin;
