import React, { useEffect, useState } from "react";
import moment from "moment-timezone";
import { useApi } from "../hooks/useApi";
import { ORDERS_ENDPOINT } from "../ApiUtils/ApiEndpoints";
import DataTable from "../GenericDataComponents/DataTable";
import { Link } from "react-router-dom";

const OrderHistory = () => {
    const { get } = useApi();
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await get(ORDERS_ENDPOINT, true);
                const formatted = data.map(order => ({
                    ...order,
                    currency_code: order.currency?.code || "Base Currency",
                    view_order: "" // placeholder for custom renderer
                }));
                setOrders(formatted);
            } catch (error) {
                console.error("Failed to fetch order history:", error);
            }
        };

        fetchOrders();
    }, [get]);

    const columns = [
        { field: "id", headerName: "Order ID" },
        { field: "total_amount", headerName: "Total Amount", fieldType: "numeric" },
        { field: "currency_code", headerName: "Currency" },
        { field: "created_at", headerName: "Created At", fieldType: "datetime" },
        {
            field: "view_order",
            headerName: "",
            fieldType: "link",
            cellRendererParams: {
                label: "View Order",
                linkTo: (row) => `/order-summary/${row.id}`,
                className: "btn btn-sm btn-success"
            }
        }
        ,

    ];

    return (
        <div className="container mt-4">
            <h2>Order History</h2>
            {orders.length === 0 ? (
                <p>You have no orders.</p>
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

export default OrderHistory;