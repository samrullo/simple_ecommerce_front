import React, { useEffect, useState, useContext } from "react";
import { CUSTOMERS_BY_ADMIN_ENDPOINT } from "../ApiUtils/ApiEndpoints";
import { useApi } from "../hooks/useApi";
import AppContext from "../../AppContext";

const AdminSelectCustomer = () => {
  const { get } = useApi();
  const { adminSelectedCustomer, setAdminSelectedCustomer } = useContext(AppContext);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await get(CUSTOMERS_BY_ADMIN_ENDPOINT, true);
        setCustomers(data);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };
    fetchCustomers();
  }, []);

  return (
    <div className="mb-3">
      <label htmlFor="customerSelect" className="form-label fw-bold">Select Customer:</label>
      <select
        id="customerSelect"
        className="form-select"
        value={adminSelectedCustomer?.id || ""}
        onChange={(e) => {
          const selected = customers.find((c) => c.id.toString() === e.target.value);
          setAdminSelectedCustomer(selected || null);
        }}
      >
        <option value="">-- Select a customer --</option>
        {customers.map((customer) => (
          <option key={customer.id} value={customer.id}>
            {customer?.first_name} {customer?.last_name} ({customer?.email})
          </option>
        ))}
      </select>
    </div>
  );
};

export default AdminSelectCustomer;