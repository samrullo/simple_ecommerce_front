import React, { useEffect, useState } from "react";
import { useParams,Link } from "react-router-dom";
import moment from "moment-timezone";
import { useApi } from "../hooks/useApi";
import { ORDERS_ENDPOINT } from "../ApiUtils/ApiEndpoints";

const OrderSummary = () => {
  const { orderId } = useParams();
  const { get } = useApi();
  const [order, setOrder] = useState(null);


  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await get(`${ORDERS_ENDPOINT}${orderId}/with-items/`, true);
        setOrder(data);
      } catch (error) {
        console.error("Failed to fetch order:", error);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (!order) return <p>Loading order...</p>;

  const formatNumber = (value) =>
    parseFloat(value).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const formattedDate = moment
    .utc(order.created_at)
    .tz("Asia/Tokyo")
    .format("YYYY-MM-DD HH:mm:ss");

  return (
    <div className="container mt-4">
      <h2>Order Summary</h2>
      <p><strong>Order ID:</strong> {order.id}</p>
      <p><strong>Status:</strong> {order.status}</p>
      <p><strong>Created At:</strong> {formattedDate}</p>
      <p>
        <strong>Total Amount:</strong>{" "}
        {formatNumber(order.total_amount)}{" "}
        {order.currency?.code || "Base Currency"}
      </p>

      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>Image</th>
            <th>Product</th>
            <th>Qty</th>
            <th>Unit Price</th>
            <th>Currency</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item) => {
            const imageUrl = item.product_image ? item.product_image : null;
            const price = parseFloat(item.price);
            const subtotal = price * item.quantity;
            const currencyCode = item.currency?.code || "";

            return (
              <tr key={item.id}>
                <td>
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt={item.product_name}
                      style={{ width: "60px", height: "60px", objectFit: "cover" }}
                    />
                  )}
                </td>
                <td>{item.product_name}</td>
                <td>{item.quantity}</td>
                <td>{formatNumber(price)}</td>
                <td>{currencyCode}</td>
                <td>{formatNumber(subtotal)} {currencyCode}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="mt-4 d-flex align-items-center gap-3">
        <Link to="/order-history" className="btn btn-secondary mt-4">
          Back to Order history
        </Link>
      </div>
    </div>
  );
};

export default OrderSummary;