import React, { useContext, useEffect, useState } from "react";
import AppContext from "../../AppContext";
import { useApi } from "../hooks/useApi";
import { CREATE_ORDER_BY_ADMIN_ENDPOINT, FXRATES_ENDPOINT } from "../ApiUtils/ApiEndpoints";
import { useNavigate } from "react-router-dom";
import DataTable from "../GenericDataComponents/DataTable";

const AdminOrderSubmit = () => {
  const { baseCurrency, flashMessages, setFlashMessages, userInfo } = useContext(AppContext);
  const [cartItems, setCartItems] = useState([]);
  const [fxRates, setFxRates] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("cash_on_delivery");
  const [submitting, setSubmitting] = useState(false);
  const { get, post } = useApi();
  const navigate = useNavigate();

  const customerId = userInfo?.id; // assuming acting on behalf of this customer

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("admin_cart")) || [];
    setCartItems(cart);

    const fetchFxRates = async () => {
      const rates = await get(FXRATES_ENDPOINT, false);
      const simplified = rates.map((rate) => ({
        currency_from: rate.currency_from.code,
        currency_to: rate.currency_to.code,
        rate: parseFloat(rate.rate),
      }));
      setFxRates(simplified);
    };
    fetchFxRates();
  }, []);

  const convertPrice = (price, from, to) => {
    if (from === to) return price;
    const fx = fxRates.find((r) => r.currency_from === from && r.currency_to === to);
    return fx ? price * fx.rate : price;
  };

  const subtotalInBaseCurrency = (item) =>
    convertPrice(item.price, item.currency, baseCurrency) * item.quantity;

  const total = cartItems.reduce(
    (sum, item) => sum + subtotalInBaseCurrency(item),
    0
  );

  const handleQuantityChange = (id, newQty) => {
    const updated = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: newQty } : item
    );
    setCartItems(updated);
    localStorage.setItem("admin_cart", JSON.stringify(updated));
  };

  const handleBuy = async () => {
    if (cartItems.length === 0 || !customerId) return;

    const payload = {
      customer_id: customerId,
      payment_method: paymentMethod,
      base_currency: baseCurrency,
      items: cartItems.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
      })),
    };

    try {
      setSubmitting(true);
      const response = await post(CREATE_ORDER_BY_ADMIN_ENDPOINT, payload, true);
      localStorage.removeItem("admin_cart");
      setCartItems([]);
      setFlashMessages([{ category: "success", message: "Order submitted successfully." }]);
      navigate(`/order-summary/${response.order_id}`);
    } catch (err) {
      console.error("Order submit failed", err);
      setFlashMessages([{ category: "danger", message: "Order failed to submit." }]);
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      field: "image",
      headerName: "Image",
      fieldType: "image",
    },
    {
      field: "name",
      headerName: "Product Name",
    },
    {
      field: "price",
      headerName: "Unit Price",
    },
    {
      field: "currency",
      headerName: "Currency",
    },
    {
      field: "quantity",
      headerName: "Quantity",
      fieldType: "custom",
      cellRenderer: ({ value, row }) => (
        <input
          type="number"
          value={value}
          min={1}
          className="form-control"
          style={{ maxWidth: "80px" }}
          onChange={(e) => handleQuantityChange(row.id, parseInt(e.target.value, 10) || 1)}
        />
      ),
    },
    {
      field: "subtotal",
      headerName: `Subtotal (${baseCurrency})`,
      fieldType: "custom",
      cellRenderer: ({ row }) => subtotalInBaseCurrency(row).toLocaleString(),
    },
  ];

  const tableData = cartItems.map((item) => ({
    ...item,
    subtotal: subtotalInBaseCurrency(item),
  }));

  return (
    <div className="container mt-4">
      <h2>Submit Order on Behalf of Customer</h2>

      {cartItems.length === 0 ? (
        <p>No items in cart.</p>
      ) : (
        <DataTable
          data={tableData}
          columns={columns}
          hiddenColumns={["id"]}
          width_pct={100}
        />
      )}

      <div className="mt-4 d-flex align-items-center gap-3">
        <label className="fw-bold">Payment Method:</label>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="form-select"
          style={{ maxWidth: "300px" }}
        >
          <option value="cash_on_delivery">Cash on Delivery</option>
          <option value="credit_card">Credit Card</option>
        </select>

        <button className="btn btn-success" onClick={handleBuy} disabled={submitting}>
          {submitting ? "Processing..." : "Submit Order"}
        </button>

        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate("/admin-add-product-to-cart")}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default AdminOrderSubmit;
