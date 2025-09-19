import React, { useEffect, useState } from "react";
import { useApi } from "../hooks/useApi";
import DataTable from "../GenericDataComponents/DataTable";
import { ADMIN_ORDERS_ENDPOINT } from "../ApiUtils/ApiEndpoints";
import { Link } from "react-router-dom";

const AdminOrderList = () => {
  const { get } = useApi();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await get(ADMIN_ORDERS_ENDPOINT, true);
        const formatted = data.map((order) => ({
          ...order,
          customer_name: `${order.customer?.user?.first_name || ""} ${order.customer?.user?.last_name || ""}`.trim(),
          customer_email: order.customer?.user?.email || "",
          customer_phone: order.customer?.phone || "",
          currency_code: order.currency?.code || "Base Currency",
          view_order: ""
        }));
        setOrders(formatted);
      } catch (error) {
        console.error("Error fetching admin orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const columns = [
    { field: "id", headerName: "Order ID" },
    { field: "customer_name", headerName: "Customer Name" },
    { field: "customer_email", headerName: "Email" },
    { field: "customer_phone", headerName: "Phone", fieldType:"text" },
    { field: "total_amount", headerName: "Total", fieldType: "numeric" },
    { field: "currency_code", headerName: "Currency" },
    { field: "created_at", headerName: "Created At", fieldType: "datetime" },
    {
      field: "view_order",
      headerName: "",
      fieldType: "link",
      cellRendererParams: {
        label: "View",
        linkTo: (row) => `/admin-order-summary/${row.id}`,
        className: "btn btn-sm btn-success"
      }
    }
  ];

  return (
    <div className="container mt-4">
      <h2>All Orders (Admin View)</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <DataTable
          data={orders}
          columns={columns}
          hiddenColumns={["view"]}
          width_pct={100}
        />
      )}
    </div>
  );
};

export default AdminOrderList;